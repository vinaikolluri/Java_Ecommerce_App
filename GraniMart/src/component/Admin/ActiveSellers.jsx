import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

const ActiveSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${config.apiUrl}/api/admin/fetch-active-sellers`)
      .then(response => {
        setSellers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4">Error: {error}</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#55A4FF' }} className="flex items-center justify-center py-4">
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-lime-400 to-red-400 text-white py-2 rounded-md">
          Active Sellers
        </h2>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 border-b text-left">SI</th>
                <th className="py-3 px-6 border-b text-left">Name</th>
                <th className="py-3 px-6 border-b text-left">Email</th>
                <th className="py-3 px-6 border-b text-left">Role</th>
                <th className="py-3 px-6 border-b text-left">Status</th>
                <th className="py-3 px-6 border-b text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller, index) => (
                <tr key={seller.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                  <td className="py-3 px-6 border-b">{index + 1}</td>
                  <td className="py-3 px-6 border-b">
                    {seller.firstName} {seller.lastName}
                  </td>
                  <td className="py-3 px-6 border-b">{seller.emailId}</td>
                  <td className="py-3 px-6 border-b">{seller.role}</td>
                  <td className="py-3 px-6 border-b">{seller.status}</td>
                  <td className="py-3 px-6 border-b">
                    {seller.address.street}, {seller.address.city}, {seller.address.pincode}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveSellers;
