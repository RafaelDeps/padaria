import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const produceProduct = (id, qty) => api.post(`/produtos/${id}/produce`, { quantity: qty });
export const addRecipeIngredient = (id, ing_id, qty) => api.post(`/produtos/${id}/ingredients`, { ingredient_id: ing_id, quantity: qty });
export const syncRecipe = (productId, recipeList) => api.put(`/produtos/${productId}/receita`, { recipe: recipeList });

export default api;
