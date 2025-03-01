import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, X, ChevronRight, Apple, Carrot, Beef, Milk, Heading as Bread, Coffee } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [hoveredParent, setHoveredParent] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);
  const user = JSON.parse(localStorage.getItem('buyer'));
  const userName = user ? user.firstName : '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('${config.apiUrl}/api/products/all');
        const data = await response.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const categoriesMap = Array.isArray(products)
    ? products.reduce((acc, product) => {
        const parentId = product.category?.parent?.id;
        const categoryId = product.category?.id;
        const subCategoryId = product.subCategory?.id;

        if (!acc[parentId]) {
          acc[parentId] = {
            ...product.category.parent,
            categories: {}
          };
        }

        if (!acc[parentId].categories[categoryId]) {
          acc[parentId].categories[categoryId] = {
            ...product.category,
            subCategories: {}
          };
        }

        if (!acc[parentId].categories[categoryId].subCategories[subCategoryId]) {
          acc[parentId].categories[categoryId].subCategories[subCategoryId] = {
            ...product.subCategory,
            products: []
          };
        }

        acc[parentId].categories[categoryId].subCategories[subCategoryId].products.push(product);
        return acc;
      }, {})
    : {};

  // Icons for grocery categories
  const categoryIcons = {
    fruits: <Apple className="w-5 h-5 text-green-500" />,
    vegetables: <Carrot className="w-5 h-5 text-orange-500" />,
    meat: <Beef className="w-5 h-5 text-red-500" />,
    dairy: <Milk className="w-5 h-5 text-blue-500" />,
    bakery: <Bread className="w-5 h-5 text-yellow-700" />,
    default: <Coffee className="w-5 h-5 text-gray-500" />
  };

  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('fruit')) return categoryIcons.fruits;
    if (name.includes('veg')) return categoryIcons.vegetables;
    if (name.includes('meat') || name.includes('poultry')) return categoryIcons.meat;
    if (name.includes('dairy') || name.includes('milk')) return categoryIcons.dairy;
    if (name.includes('bakery') || name.includes('bread')) return categoryIcons.bakery;
    return categoryIcons.default;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleMouseLeave = () => {
    setHoveredParent(null);
    setHoveredCategory(null);
    setHoveredSubCategory(null);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full z-50 flex transition-transform duration-300 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onMouseLeave={handleMouseLeave}
      >
        {/* Parent Categories Column */}
        <div className="w-72 h-full bg-white border-r border-gray-200">
          <div className="bg-green-700 text-white p-4 flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <span className="pl-2">Hello, {userName}</span>
            <button
              onClick={onClose}
              className="ml-auto hover:bg-white/10 p-1 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="h-[calc(100%-4rem)] overflow-y-auto">
            {Object.values(categoriesMap).map((parent) => (
              <div
                key={parent.id}
                className={`p-4 cursor-pointer flex items-center justify-between transition-colors
                  ${hoveredParent?.id === parent.id ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50'}`}
                onMouseEnter={() => {
                  setHoveredParent(parent);
                  setHoveredCategory(null);
                  setHoveredSubCategory(null);
                }}
              >
                <div className="flex items-center">
                  {getCategoryIcon(parent.parentCategoryName)}
                  <span className="font-medium ml-2">{parent.parentCategoryName}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Categories Column */}
        {hoveredParent && (
          <div className="w-72 h-full bg-white border-r border-gray-200">
            <div className="p-4 bg-green-50 font-bold border-b text-green-700">
              {hoveredParent.parentCategoryName}
            </div>
            <div className="h-[calc(100%-4rem)] overflow-y-auto">
              {Object.values(hoveredParent.categories).map((category) => (
                <div
                  key={category.id}
                  className={`p-4 cursor-pointer flex items-center justify-between transition-colors
                    ${hoveredCategory?.id === category.id ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50'}`}
                  onMouseEnter={() => {
                    setHoveredCategory(category);
                    setHoveredSubCategory(null);
                  }}
                >
                  <span>{category.categoryName}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subcategories Column */}
        {hoveredCategory && (
          <div className="w-72 h-full bg-white border-r border-gray-200">
            <div className="p-4 bg-green-50 font-bold border-b text-green-700">
              {hoveredCategory.categoryName}
            </div>
            <div className="h-[calc(100%-4rem)] overflow-y-auto">
              {Object.values(hoveredCategory.subCategories).map((subCategory) => (
                <Link
                  to={`/products/${subCategory.id}`}
                  key={subCategory.id}
                  className={`p-4 cursor-pointer flex items-center justify-between transition-colors
                    ${hoveredSubCategory?.id === subCategory.id ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50'}`}
                  onMouseEnter={() => setHoveredSubCategory(subCategory)}
                  onClick={() => onClose()} // Add this line to close sidebar when clicked
                >
                  <span>{subCategory.subCategoryName}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;