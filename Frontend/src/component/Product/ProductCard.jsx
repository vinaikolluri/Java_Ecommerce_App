import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation(); // Prevent the card click event from firing
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 cursor-pointer relative"
      onClick={handleClick}
      whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
    >
      {/* Favorite Button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
      >
        <Heart
          className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
        />
      </button>

      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          {product.discount}% OFF
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={`http://localhost:2003/api/products/media/${product.image1}`}
          alt={product.productName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      {/* Product Details */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {product.productName}
        </h2>
        <p className="text-lg font-bold text-green-600 mb-4">
          ₹{product.price.toFixed(2)}
        </p>

        {/* View Details Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the card click event from firing
            handleClick();
          }}
        >
          <span>View Details</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;