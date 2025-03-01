import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  X,
  ShoppingBag,
  Search,
  Menu,
  ArrowRight,
  ShoppingBasket,
  Apple,
  Carrot,
  Milk,
  Heading as Bread,
  Beef,
  Sparkles,
  Clock,
  Truck,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import ImageCarousel from '../component/Navigation/ImageCaraousel';
import AllProducts from '../component/Product/AllProducts';
import Footer from '../component/Navigation/Footer';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import Config from '../component/chatbot/Config';
import ActionProvider from '../component/chatbot/ActionProvider';
import MessageParser from '../component/chatbot/MessageParser';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Loading animation with grocery-themed elements
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-green-900 to-green-700 flex items-center justify-center z-50">
        <div className="w-full max-w-sm mx-auto text-center space-y-6">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ShoppingBasket className="w-16 h-16 text-white mx-auto" />
          </motion.div>
          <motion.div
            className="h-1 bg-green-800 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <div className="w-full h-full bg-gradient-to-r from-green-300 via-white to-green-300" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white font-medium"
          >
            Loading fresh groceries...
          </motion.p>
        </div>
      </div>
    );
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const gridAnimation = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Featured categories for grocery store
  const featuredCategories = [
    { 
      name: "Fresh Fruits", 
      icon: <Apple className="w-8 h-8 text-green-500" />,
      color: "bg-green-100",
      textColor: "text-green-700",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    { 
      name: "Vegetables", 
      icon: <Carrot className="w-8 h-8 text-orange-500" />,
      color: "bg-orange-100",
      textColor: "text-orange-700",
      image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
    },
    { 
      name: "Dairy Products", 
      icon: <Milk className="w-8 h-8 text-blue-500" />,
      color: "bg-blue-100",
      textColor: "text-blue-700",
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    { 
      name: "Bakery", 
      icon: <Bread className="w-8 h-8 text-yellow-700" />,
      color: "bg-yellow-100",
      textColor: "text-yellow-700",
      image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
    },
    { 
      name: "Meat & Poultry", 
      icon: <Beef className="w-8 h-8 text-red-500" />,
      color: "bg-red-100",
      textColor: "text-red-700",
      image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
  ];

  // Grocery banner images for carousel
  const groceryBanners = [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    "https://images.unsplash.com/photo-1506617564039-2f3b650b7010?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
  ];

  // Special offers for promotional section
  const specialOffers = [
    {
      title: "Weekend Special",
      discount: "20% OFF",
      description: "Fresh fruits and vegetables",
      color: "from-green-500 to-green-700",
      icon: <Apple className="w-10 h-10" />,
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      title: "Dairy Delights",
      discount: "Buy 1 Get 1",
      description: "On selected dairy products",
      color: "from-blue-500 to-blue-700",
      icon: <Milk className="w-10 h-10" />,
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80"
    },
    {
      title: "Fresh Bakery",
      discount: "30% OFF",
      description: "Freshly baked goods",
      color: "from-yellow-500 to-yellow-700",
      icon: <Bread className="w-10 h-10" />,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80"
    }
  ];

  // Service features
  const serviceFeatures = [
    {
      icon: <Truck className="w-10 h-10 text-green-500" />,
      title: "Free Delivery",
      description: "On orders over ₹500"
    },
    {
      icon: <Clock className="w-10 h-10 text-green-500" />,
      title: "Same Day Delivery",
      description: "Order before 10 AM"
    },
    {
      icon: <Sparkles className="w-10 h-10 text-green-500" />,
      title: "100% Fresh",
      description: "Farm to table quality"
    },
    {
      icon: <CreditCard className="w-10 h-10 text-green-500" />,
      title: "Secure Payment",
      description: "Multiple payment options"
    }
  ];

  // Custom carousel component for grocery banners
  const CustomCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % groceryBanners.length);
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="relative h-full w-full">
        {groceryBanners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={banner}
              alt={`Grocery banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {groceryBanners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    );
  };

  // Search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for: ${searchTerm} in category: ${selectedCategory}`);
    // Here you would typically filter products or redirect to search results
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="relative"
      >
        <div className="relative h-[85vh] overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <CustomCarousel />

          <motion.div
            variants={fadeInUp}
            className="absolute inset-0 flex items-center z-20"
          >
            <div className="w-full max-w-7xl mx-auto px-4">
              <motion.div
                className="max-w-3xl space-y-8"
                variants={staggerChildren}
              >
                <motion.span
                  className="text-xl font-light tracking-wider text-white mb-20"
                  animate={{ opacity: [0, 1], y: [20, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  Fresh & Organic Groceries
                </motion.span>

                <motion.h2
                  className="text-7xl font-light text-white leading-tight"
                  variants={fadeInUp}
                >
                  Farm Fresh
                  <br />
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="font-medium bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent"
                  >
                    Groceries
                  </motion.span>
                </motion.h2>

                <motion.p
                  variants={fadeInUp}
                  className="text-white text-xl max-w-2xl leading-relaxed"
                >
                  Shop from our wide selection of fresh produce, pantry essentials, and household items. 
                  Delivered right to your doorstep with care and convenience.
                </motion.p>

                 

                <motion.div className="flex gap-6 pt-4" variants={staggerChildren}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-500 text-white px-8 py-4 text-sm font-medium tracking-wider hover:bg-green-600 transition-all duration-300 flex items-center gap-3 rounded-md"
                  >
                    <span>SHOP NOW</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </motion.button>

                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-white/20 backdrop-blur-sm px-8 py-4 text-sm text-white tracking-wide hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 rounded-md"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>WEEKLY DEALS</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Service Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="py-10 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex items-center p-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mr-4">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Special Offers Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="py-12 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold text-gray-800 mb-2 text-center"
          >
            Special Offers
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-gray-600 text-center mb-10 max-w-2xl mx-auto"
          >
            Take advantage of these limited-time deals on fresh, high-quality products
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specialOffers.map((offer, index) => (
              <motion.div
                key={index}
                variants={gridAnimation}
                whileHover={{ y: -10 }}
                className="rounded-xl overflow-hidden shadow-lg relative group"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={offer.image} 
                    alt={offer.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-b ${offer.color} opacity-70`}></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center">
                  <div className="mb-2">{offer.icon}</div>
                  <h3 className="text-2xl font-bold mb-1">{offer.title}</h3>
                  <p className="text-3xl font-extrabold mb-2">{offer.discount}</p>
                  <p className="text-sm">{offer.description}</p>
                  <button className="mt-4 bg-white text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors">
                    Shop Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Categories Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={staggerChildren}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold text-gray-800 mb-2 text-center"
          >
            Shop by Category
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-gray-600 text-center mb-10 max-w-2xl mx-auto"
          >
            Browse our wide selection of fresh, high-quality products
          </motion.p>
          
          <motion.div 
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {featuredCategories.map((category, index) => (
              <motion.div
                key={index}
                variants={gridAnimation}
                whileHover={{ y: -10, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300"
              >
                <div className="h-40 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className={`p-4 ${category.color}`}>
                  <div className="flex items-center mb-2">
                    {category.icon}
                    <h3 className={`ml-2 font-semibold ${category.textColor}`}>{category.name}</h3>
                  </div>
                  <button className="text-sm text-gray-600 hover:text-green-600 flex items-center">
                    Browse Products
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Organic Promise Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
        className="py-16 bg-green-50 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
            alt="Background pattern"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              variants={fadeInUp}
              className="md:w-1/2 mb-10 md:mb-0"
            >
              <img 
                src="https://images.unsplash.com/photo-1611735341450-74d61e660ad2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                alt="Organic farming"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="md:w-1/2 md:pl-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Organic Promise</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We believe in providing the freshest, most nutritious food possible. That's why we partner with local farmers who share our commitment to sustainable, organic farming practices.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <Sparkles className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">100% Organic Certified</h3>
                    <p className="text-sm text-gray-600">All our produce meets strict organic certification standards</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <Sparkles className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Locally Sourced</h3>
                    <p className="text-sm text-gray-600">We partner with local farmers to reduce our carbon footprint</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                    <Sparkles className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">No Harmful Pesticides</h3>
                    <p className="text-sm text-gray-600">We never use harmful chemicals or pesticides on our produce</p>
                  </div>
                </li>
              </ul>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center">
                Learn More About Our Practices
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={staggerChildren}
        className="bg-gray-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
          >
            
           </motion.h2>
          <AllProducts />
        </div>
      </motion.section>

      {/* Chat functionality remains the same */}
      <motion.button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-8 right-8 z-50 bg-green-600 text-white p-4 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: showChatbot ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {showChatbot ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </motion.div>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: showChatbot ? 1 : 0,
          scale: showChatbot ? 1 : 0.8,
          y: showChatbot ? 0 : 20,
        }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-24 right-8 z-50 ${
          !showChatbot && 'pointer-events-none'
        }`}
      >
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg px-9 overflow-hidden shadow-2xl"
          >
            <Chatbot
              config={Config}
              actionProvider={ActionProvider}
              messageParser={MessageParser}
            />
          </motion.div>
        )}
      </motion.div>

      <Footer />
    </div>
  );
};

export default Home;