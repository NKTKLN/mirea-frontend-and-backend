import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{
        height: '410px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' 
      }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.title}
          sx={{
            objectFit: 'cover',
            width: '100%',
            borderRadius: '5px'
          }}
        />
        <CardContent sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '10px',
          '& > *': {
            marginBottom: '8px'
          }
        }}>
          <Typography variant="h6" sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {product.title}
          </Typography>
          <Typography variant="body2" sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {product.description}
          </Typography>
        </CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
            {product.price}₽
          </Typography>
          <Button
            variant="contained"
            onClick={() => dispatch(addToCart(product))}
            sx={{
              width: '100%',
              marginTop: '10px'
            }}
          >
            Добавить в корзину
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;