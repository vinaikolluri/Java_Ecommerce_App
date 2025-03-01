import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import config from '../../config';
import { toast } from 'react-toastify';

const UpdateSellerProducts = ({ productData, onUpdateSuccess, token }) => {
  const initialState = {
    id: '',
    name: '',
    description: '',
    price: '',
    totalQuantity: '',
    categoryId: '',
    sellerId: '',
    minQuantity: '',
    mediumQuantity: '',
    maxQuantity: '',
    minQuantityPricePerUnit: '',
    midQuantityPricePerUnit: '',
    maxQuantityPricePerUnit: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (productData) {
      setFormData({
        id: productData.id,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        totalQuantity: productData.totalQuantity,
        categoryId: productData.category.id,
        sellerId: productData.seller.id,
        minQuantity: productData.bulkPricing.minQuantity,
        mediumQuantity: productData.bulkPricing.mediumQuantity,
        maxQuantity: productData.bulkPricing.maxQuantity,
        minQuantityPricePerUnit:
          productData.bulkPricing.minQuantityPricePerUnit,
        midQuantityPricePerUnit:
          productData.bulkPricing.midQuantityPricePerUnit,
        maxQuantityPricePerUnit:
          productData.bulkPricing.maxQuantityPricePerUnit,
      });
    }
  }, [productData]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get(
        `${config.apiUrl}/B2B/categories/fetchAllCategories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCategories(response.data);
      
    } catch (err) {
      setError('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.categoryId
    ) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `${config.apiUrl}/B2B/products/updateProductDetails`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
    
      setSuccess('Product updated successfully!');

      setTimeout(() => {
        onUpdateSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = 'text', required = false }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        required={required}
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Update Product Details
      </h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 mb-4 bg-green-100 border-l-4 border-green-500 text-green-700"
        >
          
          {success}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InputField label="Product Name" name="name" required />
            <InputField label="Price" name="price" type="number" required />
            <InputField
              label="Total Quantity"
              name="totalQuantity"
              type="number"
            />
          </div>

          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                required
              >
                <option value="">Select a category</option>
                {loadingCategories ? (
                  <option disabled>Loading categories...</option>
                ) : (
                  categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 h-32"
                required
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quantity Tiers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Minimum Quantity"
              name="minQuantity"
              type="number"
            />
            <InputField
              label="Medium Quantity"
              name="mediumQuantity"
              type="number"
            />
            <InputField
              label="Maximum Quantity"
              name="maxQuantity"
              type="number"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Price Per Unit
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Min Quantity Price"
              name="minQuantityPricePerUnit"
              type="number"
            />
            <InputField
              label="Med Quantity Price"
              name="midQuantityPricePerUnit"
              type="number"
            />
            <InputField
              label="Max Quantity Price"
              name="maxQuantityPricePerUnit"
              type="number"
            />
          </div>
        </div>
         <div className="flex justify-end">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={loading}
      className={`px-6 py-2 rounded-md text-white font-medium transition-all duration-200 
        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}
      `}
    >
      {loading ? (
        <span className="flex items-center">
          <ClipLoader color="white" loading={loading} size={20} />
          <span className="ml-2">Updating...</span>
        </span>
      ) : (
        'Update Product'
      )}
    </motion.button>
  </div>
      </form>
    </motion.div>
  );
};

export default UpdateSellerProducts;
