import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import config from '../config';
import { getToken } from '../utils/JWT_Token';
import { Link } from 'react-router-dom';

const ProductsByCategory = ({ id }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          `${config.apiUrl}/B2B/products/getProductByCategoryById/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProducts(response.data);
        console.log(response)
        setLoading(false);
      } catch (err) {
        setError('Failed to load products for this category');
        setLoading(false);
      }
    };

    if (id) {
      fetchProductsByCategory();
    }
  }, [id]);

  // Loading Skeleton
  const Skeleton = () => (
    <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  // Error Message Component
  const ErrorMessage = () => (
    <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg">
      <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
      <p className="text-red-600">{error}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No products found in this category.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden group"
        >
          <div className="relative">
            <Link to={`product/${product.id}`}>
            <img 
          src={`${config.apiUrl}/B2B/products/${product.image1}`}
          alt={product.name} 
              className="w-full h-48 object-cover"
            />
          
    
            </Link>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-lg font-bold text-green-600 mb-1">{product.price.toFixed(2)}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductsByCategory;