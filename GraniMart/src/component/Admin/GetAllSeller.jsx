import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

const GetAllSeller = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${config.apiUrl}/B2B/buyer&seller/fetchAllSellers`)
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded-md">All Sellers</h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">SI</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Address</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller, index) => (
              <tr key={seller.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-3 text-center px-5 border-b">
                  {seller.firstName} {seller.lastName}
                </td>
                <td className="py-2 px-4 text-center border-b">{seller.emailId}</td>
                <td className="py-2 px-4 text-center border-b">{seller.role}</td>
                <td className="py-2 px-4 text-center border-b">{seller.status}</td>
                <td className="py-2 px-4 text-center border-b">
                  {seller.address.street}, {seller.address.city}, {seller.address.pincode}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAllSeller;
