import React, { useState, useRef, useEffect } from 'react'; // Ensure useState is imported
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import {
  LayoutDashboard,
  Users,
  PackagePlus,
  Folders,
  Settings,
  LogOut,
  ChevronDown,
  UserCog,
  ShoppingBag,
  List,
  Apple, // Ensure Apple is imported for the logo
} from 'lucide-react';
import { toast } from 'react-toastify';
import { clearToken } from '../../utils/JWT_Token';

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const navbarRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearToken();
    setIsAuthenticated(false);
    toast.success('Logged out successfully!', {
      position: 'top-center',
      autoClose: 2000,
    });
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav ref={navbarRef} className="fixed top-0 w-full z-50">
      {/* Upper Navbar */}
      <div className="bg-green-700 text-white">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center px-4 py-2">
            {/* Logo */}
            <Link to="/" className="flex items-center mr-4 py-2">
              <Apple className="h-8 w-auto text-white mr-2" />
              <span className="font-bold text-xl">FreshMart</span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-4 flex-1">
              {/* Dashboard */}
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>

              {/* Products Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-600 transition-colors">
                  <PackagePlus className="w-5 h-5" />
                  <span>Products</span>
                  <ChevronDown className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute left-0 w-56 invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 ease-in-out">
                  <div className="p-2 bg-white rounded-md shadow-xl mt-2 border border-gray-200">
                    <Link
                      to="/admin/products/add"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                    >
                      Add Product
                    </Link>
                    <Link
                      to="/admin/products/add/color-sie-thickness"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                    >
                      Manage Color, Size, Thickness
                    </Link>
                    <Link
                      to="/admin/products/list"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                    >
                      Manage Products
                    </Link>
                  </div>
                </div>
              </div>

              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-600 transition-colors">
                  <Folders className="w-5 h-5" />
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute left-0 w-56 invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 ease-in-out">
                  <div className="p-2 bg-white rounded-md shadow-xl mt-2 border border-gray-200">
                    <Link
                      to="/admin/parent-categories/add"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                    >
                      Add Main Category
                    </Link>
                    <Link
                      to="/admin/categories/add"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                    >
                      Add Category
                    </Link>
                    <Link
                      to="/admin/sub-categories/add"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                    >
                      Add Subcategory
                    </Link>
                    <Link
                      to="/seller/category/all"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                    >
                      Manage Categories
                    </Link>
                  </div>
                </div>
              </div>

              {/* Users Management */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-600 transition-colors">
                  <Users className="w-5 h-5" />
                  <span>Users</span>
                  <ChevronDown className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute left-0 w-56 invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 ease-in-out">
                  <div className="p-2 bg-white rounded-md shadow-xl mt-2 border border-gray-200">
                    <Link
                      to="/admin/users/customers"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                    >
                      Manage Customers
                    </Link>
                    <Link
                      to="/admin/users/sellers"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                    >
                     </Link>
                  </div>
                </div>
              </div>

              {/* Orders */}
              <Link
                to="/admin/orders"
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Orders</span>
              </Link>
            </div>

            {/* Admin Profile */}
            <div ref={profileDropdownRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                <UserCog className="w-6 h-6" />
                <span>Admin</span>
                <ChevronDown
                  className={`w-4 h-4 ml-1 transform transition-transform ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-xl border border-gray-200">
                  <div className="p-2">
                    <Link
                      to="/admin/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 rounded hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-green-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <List className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-green-700 text-white border-t border-green-600">
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/admin/dashboard"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/products/add"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              <PackagePlus className="w-5 h-5" />
              <span>Add Product</span>
            </Link>
            <Link
              to="/admin/categories/add"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              <Folders className="w-5 h-5" />
              <span>Add Category</span>
            </Link>
            <Link
              to="/admin/users/customers"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>Manage Users</span>
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Orders</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;