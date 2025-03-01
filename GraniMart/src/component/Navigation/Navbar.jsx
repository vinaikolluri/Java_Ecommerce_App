import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';
import { clearToken } from '../../utils/JWT_Token';
import { toast } from 'react-toastify';
import {
  Search,
  ShoppingCart,
  Menu,
  User,
  MapPin,
  ChevronDown,
  X,
  Apple,
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { isAuthenticated, buyer, seller, setIsAuthenticated } = useAuth();
  const { cartItemCount } = useCart();
  const navbarRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigation = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearToken();
    setIsAuthenticated(false);
    toast.success('Logged out successfully!', {
      position: 'top-center',
      autoClose: 2000,
    });
    navigation('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigation(`/search?term=${searchTerm}&category=${selectedCategory}`);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
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
          <div className="flex items-center px-4">
            {/* Logo */}
            <Link to="/" className="flex items-center mr-4 py-2">
              <Apple className="h-8 w-auto text-white mr-2" />
              <span className="font-bold text-xl">FreshMart</span>
            </Link>

            {/* Delivery Location */}
            <div className="flex items-center space-x-1 text-white hover:text-white/90 cursor-pointer border border-transparent hover:border-white p-2">
              <MapPin className="w-6 h-6" />
              <div className="text-sm">
                <div className="text-gray-200 text-xs">Delivering to Hyderabad</div>
                <div className="font-bold">Update location</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 mx-4">
              <form onSubmit={handleSearch} className="flex">
                <select 
                  className="px-2 bg-gray-100 border-r border-gray-300 rounded-l text-black text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option>All</option>
                  <option>Fruits</option>
                  <option>Vegetables</option>
                  <option>Dairy</option>
                  <option>Bakery</option>
                </select>
                <input
                  type="text"
                  placeholder="Search groceries"
                  className="flex-1 px-4 py-2 text-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 px-4 rounded-r">
                  <Search className="w-5 h-5 text-gray-800" />
                </button>
              </form>
            </div>

            {/* Right Side Items */}
            <div className="flex items-center space-x-4">
              {/* Language Selection */}
              <div className="flex items-center space-x-1 hover:border-white border border-transparent p-2">
                <img src={`https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_India.png/1280px-Flag_of_India.png`} alt="IN" className="w-5 h-4" />
                <span className="font-bold">EN</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {/* Account & Lists */}
              <div 
                ref={profileDropdownRef}
                className="relative hover:border-white border border-transparent p-2"
              >
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="text-sm"
                >
                  <div className="text-gray-200">Hello, {isAuthenticated ? 'User' : 'sign in'}</div>
                  <div className="font-bold flex items-center">
                    Account & Lists
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg py-4 text-black">
                    {!isAuthenticated ? (
                      <div className="px-4">
                        <Link
                          to="/sign-in"
                          className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-1 px-4 rounded-md text-sm"
                        >
                          Sign In
                        </Link>
                        <div className="text-xs mt-2">
                          New customer?{" "}
                          <Link to="/register" className="text-green-600 hover:text-green-700 hover:underline">
                            Start here
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                          Your Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Returns & Orders */}
              <Link to="/orders" className="hover:border-white border border-transparent p-2">
                <div className="text-gray-200 text-sm">Returns</div>
                <div className="font-bold">& Orders</div>
              </Link>

              {/* Cart */}
              <Link to="/buyers/view/cart" className="flex items-center hover:border-white border border-transparent p-2">
                <div className="relative">
                  <ShoppingCart className="w-8 h-8" />
                  <span className="absolute -top-1 left-4 bg-yellow-400 text-gray-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                    {cartItemCount || 0}
                  </span>
                </div>
                <span className="font-bold">Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Navbar */}
   
    </nav>
  );
};

export default Navbar;