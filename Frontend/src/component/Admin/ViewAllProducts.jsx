import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';

const ViewAllProducts = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/Order/all`);
        if (response.data && Array.isArray(response.data)) {
          console.log('API Response:', response.data); // Debugging log
          setOrders(response.data);
        } else {
          console.error('Invalid API response:', response.data);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center my-4">All Orders</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-green-900">
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-white uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-white uppercase tracking-wider">Buyer Name</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-white uppercase tracking-wider">Buyer Mobile</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-white uppercase tracking-wider">Product ID</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-white uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-white uppercase tracking-wider">Payment Method</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-white uppercase tracking-wider">Order Status</th>
              <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-white uppercase tracking-wider">Delivery Address</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders && orders.map((order, index) => (
              <tr key={order.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-base text-gray-900">{order.buyerName}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-base text-gray-700">{order.buyerMobileNo}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-base text-gray-900">{order.productId}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-base text-gray-900">₹{order.totalAmount?.toFixed(2) || '0.00'}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-base text-gray-700">{order.paymentMethod}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-base text-gray-900">{order.orderStatus}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-base text-gray-700">{order.deliveryAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllProducts;