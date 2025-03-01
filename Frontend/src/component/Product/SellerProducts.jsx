import React, { useState, useEffect } from 'react';
import { getToken } from '../../utils/JWT_Token';
import { PencilIcon, XIcon, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import config from '../../config';
import UpdateSellerProducts from './UpdateSellerProducts';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [productToUpdate, setProductToUpdate] = useState(null);
  const [error, setError] = useState(null);
  const token = getToken();
  const seller = JSON.parse(localStorage.getItem('seller'));
  const sellerId = seller?.id;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${config.apiUrl}/B2B/products/fetchProductsBySellerId/${sellerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError('Error fetching products: ' + err.message);
      setLoading(false);
    }
  };

  const handleViewDetails = product => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleEdit = (e, product) => {
    e.stopPropagation(); // Prevent triggering the view details
    setProductToUpdate(product);
    setShowUpdateForm(true);
  };

  const handleDelete = async (e, productId) => {
    e.stopPropagation(); // Prevent triggering the view details
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(
          `${config.apiUrl}/B2B/products/deleteProductByProductId/${productId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        // Refresh the products list
        fetchProducts();
      } catch (err) {
        setError('Error deleting product: ' + err.message);
      }
    }
  };

  const handleUpdateSuccess = () => {
    setShowUpdateForm(false);
    setProductToUpdate(null);
    fetchProducts(); // Refresh the products list
  };

  if (loading) {
    return <div className="text-center p-4">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-4">
      {/* Table Header */}
      <div className="grid grid-cols-6 gap-4 bg-gray-100 p-4 rounded-t-lg font-bold mt-16">
        <div>Image</div>
        <div>Product Name</div>
        <div>Category</div>
        <div>Stock</div>
        <div>Price</div>
        <div>Actions</div>
      </div>

      {/* Products List */}
      <div className="space-y-4 relative">
        {products.map(product => (
          <div
            key={product.id}
            className="grid grid-cols-6 gap-4 p-4 border-b hover:bg-gray-50 items-center "
          >
            <div className="w-24 h-24">
              <img
                src={`${config.apiUrl}/B2B/products/${product.image1}`}
                // `http://localhost:8788/B2B/products/6980e903bff0441aab4397c12ea1987c-photo-1486312338219-ce68d2c6f44d.avif`}

                alt={product.name}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600 truncate">
                {product.description}
              </p>
            </div>
            <div>{product.category.categoryName}</div>
            <div>{product.totalQuantity}</div>
            <div>₹{product.price.toLocaleString()}</div>
            {/* <div>
              <button onClick={e => handleEdit(e, product)}>Edit</button>
              <button
                onClick={e => handleDelete(e, product.id)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                X
              </button>
            </div>

            */}

            <div className="flex items-center justify-start space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={e => handleEdit(e, product)}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <PencilIcon className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={e => handleDelete(e, product.id)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <XIcon className="w-5 h-5" />
              </motion.button>
            </div>
            <div
              className="absolute right-5 underline text-right text-blue-800 hover:text-blue-700 cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                handleViewDetails(product);
              }}
            >
              View More
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-500 text-xl hover:text-red-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <img
                src={`${config.apiUrl}/B2B/products/${selectedProduct.image1}`}
                alt={selectedProduct.name}
                className="w-full h-48 object-cover rounded"
              />
              <img
                src={`${config.apiUrl}/B2B/products/${selectedProduct.image2}`}
                alt={selectedProduct.name}
                className="w-full h-48 object-cover rounded"
              />
            </div>

            <div className="space-y-2">
              <p>
                <strong>Description:</strong> {selectedProduct.description}
              </p>
              <p>
                <strong>Category:</strong>{' '}
                {selectedProduct.category.categoryName}
              </p>
              <p>
                <strong>Price:</strong> ₹
                {selectedProduct.price.toLocaleString()}
              </p>
              <p>
                <strong>Quantity Available:</strong>{' '}
                {selectedProduct.totalQuantity}
              </p>
              <p>
                <strong>Status:</strong> {selectedProduct.status}
              </p>

              <div className="mt-4">
                <h3 className="font-bold mb-2">Bulk Pricing:</h3>
                <ul className="list-disc pl-5">
                  <li>
                    Min Quantity ({selectedProduct.bulkPricing.minQuantity}{' '}
                    units): ₹
                    {selectedProduct.bulkPricing.minQuantityPricePerUnit.toLocaleString()}{' '}
                    per unit
                  </li>
                  <li>
                    Medium Quantity (
                    {selectedProduct.bulkPricing.mediumQuantity} units): ₹
                    {selectedProduct.bulkPricing.midQuantityPricePerUnit.toLocaleString()}{' '}
                    per unit
                  </li>
                  <li>
                    Max Quantity ({selectedProduct.bulkPricing.maxQuantity}{' '}
                    units): ₹
                    {selectedProduct.bulkPricing.maxQuantityPricePerUnit.toLocaleString()}{' '}
                    per unit
                  </li>
                </ul>
              </div>

              <div className="mt-4">
                <h3 className="font-bold mb-2">Seller Information:</h3>
                <p>
                  Name: {selectedProduct.seller.firstName}{' '}
                  {selectedProduct.seller.lastName}
                </p>
                <p>Company: {selectedProduct.seller.companyName}</p>
                <p>
                  Location: {selectedProduct.seller.address.city},{' '}
                  {selectedProduct.seller.address.state}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showUpdateForm && productToUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end mb-4 ">
              <button
                onClick={() => {
                  setShowUpdateForm(false);
                  setProductToUpdate(null);
                }}
                className="text-red-600 text-xl font-extrabold hover:text-red-800  "
              >
                ✕
              </button>
            </div>
            <UpdateSellerProducts
              productData={productToUpdate}
              onUpdateSuccess={handleUpdateSuccess}
              token={token}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
