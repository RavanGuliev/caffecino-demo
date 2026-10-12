import { i18n } from "../services/i18next";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const TOKEN_KEY = "admin_token";

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (t) => {
  try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
};

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

// body FormData olarsa multipart, obyekt olarsa JSON göndərilir
async function request(method, path, body) {
  const headers = {
    Accept: "application/json",
    "Accept-Language": (i18n.resolvedLanguage || "az").slice(0, 2),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (body instanceof FormData) payload = body;
  else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API_URL}/admin${path}`, { method, headers, body: payload });
  } catch {
    throw new ApiError(i18n.t("admin:errors.network"), 0);
  }

  if (res.status === 401 && token) {
    setToken(null);
    window.dispatchEvent(new Event("admin:unauthorized"));
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || i18n.t("admin:errors.generic"), res.status, data.errors || {});
  return data;
}

// Laravel PUT + fayl üçün POST + _method=PUT
const toFormData = (obj, method) => {
  const fd = new FormData();
  if (method) fd.append("_method", method);
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined) return;
    if (v === null) fd.append(k, "");
    else if (v instanceof File) fd.append(k, v);
    else if (typeof v === "boolean") fd.append(k, v ? "1" : "0");
    else if (typeof v === "object") fd.append(k, JSON.stringify(v));
    else fd.append(k, v);
  });
  return fd;
};

const resource = (name) => ({
  list: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== "" && v != null)).toString();
    return request("GET", `/${name}${qs ? `?${qs}` : ""}`).then((r) => r.data ?? r);
  },
  create: (data) => request("POST", `/${name}`, toFormData(data)).then((r) => r.data ?? r),
  update: (id, data) => request("POST", `/${name}/${id}`, toFormData(data, "PUT")).then((r) => r.data ?? r),
  remove: (id) => request("DELETE", `/${name}/${id}`),
  toggle: (id) => request("PATCH", `/${name}/${id}/toggle`),
  reorder: (ids) => request("POST", `/reorder/${name}`, { ids }),
});

export const adminApi = {
  login: (email, password) => request("POST", "/login", { email, password }),
  me: () => request("GET", "/me"),
  logout: () => request("POST", "/logout"),
  dashboard: () => request("GET", "/dashboard"),
  categories: resource("categories"),
  sections: resource("sections"),
  products: resource("products"),
  lucky: resource("lucky-offers"),
  users: {
    list: () => request("GET", "/users"),
    create: (d) => request("POST", "/users", d),
    update: (id, d) => request("PUT", `/users/${id}`, d),
    remove: (id) => request("DELETE", `/users/${id}`),
  },
  settings: {
    get: () => request("GET", "/settings"),
    save: (data) => request("POST", "/settings", toFormData(data)),
  },
};
