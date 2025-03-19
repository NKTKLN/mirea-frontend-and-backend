import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadProducts } from '../features/productsSlice';
import ProductCard from './ProductCard';
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error loading products.</div>;

  const filteredProducts = items.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts =
    selectedCategory === 'all'
      ? filteredProducts
      : filteredProducts.filter((product) => product.category === selectedCategory);

  const categories = ['all', ...new Set(items.map((product) => product.category))];

  return (
    <div>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Поиск по названию"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Категория</InputLabel>
            <Select
              value={selectedCategory}
              label="Категория"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ padding: 2 }}>
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))
        ) : (
          <Typography variant="h6" align="center" sx={{ width: '100%' }}>
            Нет продуктов, соответствующих вашему запросу.
          </Typography>
        )}
      </Grid>
    </div>
  );
};

export default ProductList;
