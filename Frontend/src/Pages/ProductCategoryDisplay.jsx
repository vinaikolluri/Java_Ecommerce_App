
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import config from '../config';
import { getToken } from '../utils/JWT_Token';
import axios from 'axios';
import ProductsByCategory from './ProductsByCategory';

const ProductCategoryDisplay = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          `${config.apiUrl}/B2B/categories/fetchAllCategories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load categories');
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const Skeleton = () => (
    <div className="relative w-40 h-40">
      <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse">
        <div className="absolute inset-4 rounded-full bg-gray-300 animate-pulse"></div>
        <div className="absolute inset-8 rounded-full bg-gray-100 animate-pulse"></div>
      </div>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center p-8 bg-red-50 rounded-lg"
    >
      <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
      <p className="text-red-600 font-medium">{message}</p>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="  ">
      <motion.div
        ref={ref}
        className="max-w-7xl mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
            Explore Categories
          </h2>
          <div className="h-1 w-24 mx-auto mt-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 rounded-full" />
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 place-items-center py-12"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setSelectedCategory(category.id);
                setCategoryName(category.categoryName);
              }}
              className="relative group cursor-pointer"
            >
              {/* Outer Circle */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 p-1 transform transition-transform duration-300 group-hover:scale-105">
                {/* Middle Circle */}
                <div className="w-full h-full rounded-full bg-white p-1">
                  {/* Inner Circle */}
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
                    {/* First Letter */}
                    <span className="text-5xl font-bold bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                      {category.categoryName.charAt(0)}
                    </span>
                    
                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 via-fuchsia-600/0 to-pink-600/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
                </div>
              </div>

              {/* Category Name */}
              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium text-gray-800 group-hover:text-fuchsia-600 transition-colors duration-300">
                  {category.categoryName}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Selected Category Products */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 py-2 -mt-6"
        >
          <h2 className="text-3xl font-medium text-center mb-10">
            Products in {categoryName}
          </h2>
          <ProductsByCategory id={selectedCategory} />
        </motion.div>
      )}
    </div>
  );
};

export default ProductCategoryDisplay;