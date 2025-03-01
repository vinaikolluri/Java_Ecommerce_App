import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar'; // Ensure Sidebar is imported
import axios from 'axios'; // Install axios if not already installed
import config from '../../config';
import { getToken } from '../../utils/JWT_Token';

// NavLink Component
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-sm text-white hover:border hover:border-white px-2 py-1 transition-all duration-200"
  >
    {children}
  </Link>
);

// Main SubNavbar Component
const SubNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
const token=getToken();
  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/category/findAllParentCategories`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        // console.log('Fetched categories:', response.data); // Log the full response
        setCategories(response.data || []); // Adjust this based on your API's structure
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategories();
  }, []);
  

  return (
    <>
      <div className="w-full bg-[#232f3e] mt-14 pt-1">
        <div className="max-w-7xl px-4">
          <div className="flex items-center h-10">
            {/* Button to open sidebar */}
            <button
              onClick={toggleSidebar}
              className="text-white flex items-center space-x-2 hover:border hover:border-white px-2 py-1 rounded transition-all duration-200 font-bold"
            >
              <Menu className="w-5 h-5" />
              <span>All</span>
            </button>

            {/* Navigation Links for Categories */}
            <div className="items-left space-x-4 px-auto">
              {loading ? (
                <span className="text-sm text-white">Loading...</span>
              ) : categories.length > 0 ? (
                categories.map(category => (
                  <NavLink
                    key={category.id}
                    to={`/${category.parentCategoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    {category.parentCategoryName}
                  </NavLink>
                ))
              ) : (
                <span className="text-sm text-white">No Categories Available</span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default SubNavbar;
