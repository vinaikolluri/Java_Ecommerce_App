import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../config';

const GetAllBuyers = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${config.apiUrl}/api/users/findall`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the JWT token if required
        },
    })
      .then(response => {
        setBuyers(response.data.users); // Use response.data.users
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex items-center justify-center py-4">
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-lime-400 to-red-400 text-white py-2 rounded-md">All users</h2>
        <div className="overflow-x-auto">
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
              {buyers.map((buyer, index) => (
                <tr key={buyer.id} className="hover:bg-gray-100">
                  <td className="py-3 px-6 border-b">{index + 1}</td>
                  <td className="py-3 px-6 border-b">
                    {buyer.firstName} {buyer.lastName}
                  </td>
                  <td className="py-3 px-6 border-b">{buyer.email}</td>
                  <td className="py-3 px-6 border-b">{buyer.role}</td>
                  <td className="py-3 px-6 border-b">{buyer.status}</td>
                  <td className="py-3 px-6 border-b">
                    {buyer.address?.street}, {buyer.address?.city}, {buyer.address?.pincode}
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

export default GetAllBuyers;