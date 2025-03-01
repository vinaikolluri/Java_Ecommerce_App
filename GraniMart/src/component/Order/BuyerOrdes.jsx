import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Box,
  Calendar,
  Check,
  Clock,
  DollarSign,
  Image as ImageIcon,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import config from '../../config';
import { getToken } from '../../utils/JWT_Token';

// Status color and icon mapping
const STATUS_CONFIG = {
  PENDING: {
    color: 'text-yellow-600 bg-yellow-100',
    icon: Clock,
    description: 'Your order is being processed',
  },
  ORDERED: {
    color: 'text-blue-600 bg-blue-100',
    icon: Check,
    description: 'Order has been confirmed',
  },
  SHIPPED: {
    color: 'text-green-600 bg-green-100',
    icon: Truck,
    description: 'Order is on its way',
  },
  DELIVERED: {
    color: 'text-emerald-600 bg-emerald-100',
    icon: Package,
    description: 'Order has been delivered',
  },
  CANCELLED: {
    color: 'text-red-600 bg-red-100',
    icon: X,
    description: 'Order was cancelled',
  },
};

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const buyerId = JSON.parse(localStorage.getItem('buyer'))?.id;
  const token = getToken();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        toast.error('Authentication token not found. Please login again.', {
          position: 'top-center',
          autoClose: 2000,
        });
        setLoading(false);
        return;
      }

      try {
        // Fetch orders for the buyer
        const response = await axios.get(`${config.apiUrl}/Order/findByBuyerid`, {
          params: { buyerid: buyerId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch product details for each order
        const ordersWithProducts = await Promise.all(
          response.data.map(async (order) => {
            try {
              // Fetch product details using productId
              const productResponse = await axios.get(
                `${config.apiUrl}/api/products/${order.productId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              // Check if the product was fetched successfully
              if (productResponse.data.success) {
                return {
                  ...order,
                  product: {
                    name: productResponse.data.product.productName,
                    image: productResponse.data.product.image1
                      ? `${config.apiUrl}/api/products/media/${productResponse.data.product.image1}`
                      : '/api/placeholder/200/200',
                    price: productResponse.data.product.price,
                  },
                };
              } else {
                // If product fetch fails, use default values
                console.error(`Product not found for productId ${order.productId}`);
                return {
                  ...order,
                  product: {
                    name: 'Product Name Unavailable',
                    image: '/api/placeholder/200/200',
                    price: 0,
                  },
                };
              }
            } catch (error) {
              // Handle errors while fetching product details
              console.error(`Error fetching product details for productId ${order.productId}:`, error);
              return {
                ...order,
                product: {
                  name: 'Product Name Unavailable',
                  image: '/api/placeholder/200/200',
                  price: 0,
                },
              };
            }
          })
        );

        // Sort orders by date
        const sortedOrders = ordersWithProducts.sort(
          (a, b) => new Date(b.orderTime) - new Date(a.orderTime)
        );

        // Update state
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } catch (error) {
        // Handle errors while fetching orders
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders. Please try again later.', {
          position: 'top-center',
          autoClose: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [buyerId, token]);

  // Filter and search logic
  useEffect(() => {
    let result = orders;

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((order) => order.orderStatus === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTermLower) ||
          order.product.name.toLowerCase().includes(searchTermLower)
      );
    }

    setFilteredOrders(result);
  }, [statusFilter, searchTerm, orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <ShoppingBag className="w-12 h-12 text-sky-500" />
        </motion.div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl font-extrabold text-gray-900 mb-4"
          >
            My Orders
          </motion.h2>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            {['All', ...Object.keys(STATUS_CONFIG)].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 
                  ${
                    statusFilter === status
                      ? 'bg-sky-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="flex-grow md:flex md:justify-end">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID or product name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-12 bg-white rounded-lg shadow"
          >
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900">No Orders Found</h3>
            <p className="mt-2 text-gray-500">
              {statusFilter !== 'All'
                ? `No orders with ${statusFilter} status`
                : 'Start shopping to see your orders here!'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {filteredOrders.map((order) => {
              const StatusIcon = STATUS_CONFIG[order.orderStatus]?.icon || RefreshCw;
              const statusColor =
                STATUS_CONFIG[order.orderStatus]?.color || 'text-gray-600 bg-gray-100';
              const statusDescription =
                STATUS_CONFIG[order.orderStatus]?.description || 'Unknown Status';

              return (
                <motion.div
                  key={order.id}
                  variants={item}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  onClick={() =>
                    setSelectedOrder(selectedOrder === order.id ? null : order.id)
                  }
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="md:flex md:items-center md:justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 text-blue-600 font-bold rounded-full w-12 h-12 flex items-center justify-center">
                          {order.index}
                        </div>
                        <div className="flex-shrink-0">
                          {order.product?.image ? (
                            <img
                              src={order.product.image}
                              alt={order.product.name}
                              className="w-16 h-16 object-cover rounded-md"
                              onError={(e) => {
                                e.target.src = '/api/placeholder/200/200'; // Fallback image
                                e.target.onerror = null;
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.orderId}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {order.product.name}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-4 md:mt-0 flex items-center">
                        <div
                          className={`flex items-center px-3 py-1 rounded-full ${statusColor}`}
                        >
                          <StatusIcon className="w-4 h-4 mr-2" />
                          <span className="text-sm font-semibold">
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Order Details */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: selectedOrder === order.id ? 'auto' : 0,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 border-t pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Order Details Columns */}
                        <div className="flex items-center">
                          <Box className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Quantity
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {order.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Total Amount
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              ₹{order.totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Order Date
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {new Date(order.orderTime).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Product Details */}
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">
                          Product Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Price per unit</p>
                            <p className="font-semibold">
                              ₹{order.product.price?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status Description</p>
                            <p
                              className={`font-semibold ${
                                statusColor.split(' ')[0]
                              }`}
                            >
                              {statusDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BuyerOrders;