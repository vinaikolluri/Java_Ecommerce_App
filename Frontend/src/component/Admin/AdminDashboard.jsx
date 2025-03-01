import React from 'react';
import GetAllBuyers from './GetallBuyers';
import { useAuth } from '../../Context/AuthContext';


const AdminDashboard = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user && user.role === 'admin' ? (
        <div>
          <h2>Admin Navigation</h2>
          {/* Add admin-specific navigation and options here */}
          <GetAllBuyers />
        </div>
      ) : user.role === 'buyer' ? (
        <div>
          <h2>Buyer Navigation</h2>
          {/* Add buyer-specific navigation and options here */}
        </div>
      ) : user.role === 'seller' ? (
        <div>
          <h2>Seller Navigation</h2>
          {/* Add seller-specific navigation and options here */}
        </div>
      ) : (
        <div>
          <h2>Unknown Role</h2>
          {/* Handle unknown role */}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
