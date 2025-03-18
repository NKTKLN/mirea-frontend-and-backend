import axios from 'axios';

const API_URL = 'http://localhost:3001/products';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    throw error;
  }
};
