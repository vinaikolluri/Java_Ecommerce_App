import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';

const AllProducts = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('term') || '';
  const selectedCategory = queryParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:2003/api/products/all`);
        if (response.data.success) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products); // Initialize filtered products
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products. Please try again later.');
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm || selectedCategory !== 'All') {
      const filtered = products.filter(product => {
        // Ensure product.name exists before calling .toLowerCase()
        const productName = product.name || '';
        const matchesSearchTerm = productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearchTerm && matchesCategory;
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, selectedCategory, products]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const gridAnimation = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerChildren}
      className="py-16 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 
          variants={fadeInUp}
          className="text-4xl font-bold text-gray-800 mb-4 text-center"
        >
          All Products
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
        >
          Discover our wide range of fresh, high-quality products
        </motion.p>

        <motion.div 
          variants={staggerChildren}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={gridAnimation}
              whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AllProducts;