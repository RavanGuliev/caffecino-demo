import { categories, productsByCategory, allProducts } from "../data/mockData";

const BASE_URL = "https://api.caffecino.az";

// Demo rejimi: real API əvəzinə src/data/mockData.js istifadə olunur.
// Real API-yə keçmək üçün .env faylında VITE_USE_MOCK=false yazın.
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

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
  if (USE_MOCK) return delay(productsByCategory[categoryId] || []);
  const res = await fetch(`${BASE_URL}/products/category/${categoryId}`);
  if (!res.ok) throw new Error(`Ошибка загрузки продуктов категории ${categoryId}: ${res.status}`);
  return res.json();
}

export async function getPopularProducts() {
  if (USE_MOCK) return delay(allProducts.filter((p) => p.badges?.includes("popular")));
  return [];
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
  searchProduct,
};
