import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadProducts } from '../features/productsSlice';
import ProductCard from './ProductCard';
import { Grid } from '@mui/material';

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error loading products.</div>;

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {items.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;