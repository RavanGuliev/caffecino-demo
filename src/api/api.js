import { categories, productsByCategory, allProducts, cafeInfo, HERO_IMAGE } from "../data/mockData";

// Laravel backend (caffecino-backend). .env-də VITE_API_URL ilə dəyişdirilir.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Demo rejimi: backend olmadan src/data/mockData.js istifadə olunur (.env: VITE_USE_MOCK=true)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const delay = (data, ms = 350) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));

export async function getFullCategory() {
  if (USE_MOCK) return delay(categories);
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error(`Ошибка загрузки категорий: ${res.status}`);
  return res.json();
}

export async function getFullSubcategory() {
  if (USE_MOCK) return delay(Object.values(productsByCategory).flat());
  const res = await fetch(`${BASE_URL}/categories/subcategories`);
  if (!res.ok) throw new Error(`Ошибка загрузки субкатегорий: ${res.status}`);
  return res.json();
}

export async function getCategoryById(id) {
  if (USE_MOCK) return delay(categories.find((c) => String(c.id) === String(id)) || null, 100);
  const res = await fetch(`${BASE_URL}/categories/${id}`);
  if (!res.ok) throw new Error(`Ошибка загрузки категории ${id}: ${res.status}`);
  return res.json();
}

export async function getProductsByCategory(categoryId) {
  if (USE_MOCK) {
    if (!productsByCategory[categoryId]) return Promise.reject(Object.assign(new Error("Not found"), { status: 404 }));
    return delay(productsByCategory[categoryId]);
  }
  const res = await fetch(`${BASE_URL}/products/category/${categoryId}`);
  if (!res.ok) {
    // status: 404 = kateqoriya yoxdur/gizlədilib, digərləri = server xətası
    throw Object.assign(new Error(`Ошибка загрузки продуктов категории ${categoryId}: ${res.status}`), { status: res.status });
  }
  return res.json();
}

export async function getPopularProducts() {
  if (USE_MOCK) return delay(allProducts.filter((p) => p.badges?.includes("popular")));
  const res = await fetch(`${BASE_URL}/products/popular`);
  if (!res.ok) throw new Error(`Popular products error: ${res.status}`);
  return res.json();
}

export async function getSettings() {
  if (USE_MOCK) return delay({ ...cafeInfo, hero_image: HERO_IMAGE }, 0);
  const res = await fetch(`${BASE_URL}/settings`);
  if (!res.ok) throw new Error(`Settings error: ${res.status}`);
  return res.json();
}

// Bəyənilən məhsulların təzə datası (qiymət/ad admin paneldə dəyişə bilər)
export async function getProductsByIds(ids) {
  if (!ids.length) return [];
  if (USE_MOCK) return delay(allProducts.filter((p) => ids.includes(p.id)), 150);
  const res = await fetch(`${BASE_URL}/products/by-ids?ids=${ids.join(",")}`);
  if (!res.ok) throw new Error(`Favorites error: ${res.status}`);
  return res.json();
}

// Bugünkü "şans kofesi": { offer, category_id, reel } və ya null
export async function getLucky() {
  if (USE_MOCK) {
    const pool = allProducts.filter((p) => p.badges?.includes("popular"));
    const product = pool[Math.floor(Math.random() * pool.length)];
    const category = Object.entries(productsByCategory).find(([, secs]) => secs.some((s) => s.products.includes(product)));
    return delay({
      offer: { id: 0, product, discount_percent: 15, new_price: +(product.price * 0.85).toFixed(2), code: "LUCKY15" },
      category_id: Number(category?.[0]),
      reel: allProducts.filter((p) => p !== product).sort(() => Math.random() - 0.5).slice(0, 10).map((p) => p.img[0]),
    }, 200);
  }
  const res = await fetch(`${BASE_URL}/lucky`);
  if (!res.ok) throw new Error(`Lucky offer error: ${res.status}`);
  return res.json();
}

export async function searchProduct(name) {
  if (name.length < 2) {
    return { products: [], totalProducts: 0, totalPages: null, currentPage: null };
  }
  if (USE_MOCK) {
    const q = name.toLocaleLowerCase();
    const products = allProducts.filter((p) =>
      ["az", "en", "ru"].some((l) => p[`name_${l}`]?.toLocaleLowerCase().includes(q))
    );
    return delay({ products, totalProducts: products.length, totalPages: 1, currentPage: 1 }, 150);
  }
  const url = new URL(`${BASE_URL}/products/search`);
  url.searchParams.set("name", name);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Ошибка поиска продуктов: ${res.status}`);
  }
  return res.json();
}

export default {
  getFullCategory,
  getFullSubcategory,
  getCategoryById,
  getProductsByCategory,
  getPopularProducts,
  getSettings,
  getLucky,
  getProductsByIds,
  searchProduct,
};
