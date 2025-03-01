import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductList = () => {
  const { subCategoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Filter states
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedThickness, setSelectedThickness] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedFinishes, setSelectedFinishes] = useState([]);

  // Get unique filter values from products
  const colors = [...new Set(products.map(product => product.color).filter(Boolean))];
  const thicknesses = [...new Set(products.map(product => product.thickness).filter(Boolean))];
  const sizes = [...new Set(products.map(product => product.size).filter(Boolean))];
  const finishes = [...new Set(products.map(product => product.surfaceFinish).filter(Boolean))];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/api/category/subcategory/${subCategoryId}`
        );
        if (response.data.success) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products. Please try again later.');
      }
    };

    fetchProducts();
  }, [subCategoryId]);

  // Apply filters
  useEffect(() => {
    let filtered = products;
    
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => selectedColors.includes(product.color));
    }
    if (selectedThickness.length > 0) {
      filtered = filtered.filter(product => selectedThickness.includes(product.thickness));
    }
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => selectedSizes.includes(product.size));
    }
    if (selectedFinishes.length > 0) {
      filtered = filtered.filter(product => selectedFinishes.includes(product.surfaceFinish));
    }
    
    setFilteredProducts(filtered);
  }, [selectedColors, selectedThickness, selectedSizes, selectedFinishes, products]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const FilterSection = ({ title, items, selected, setSelected }) => (
    <div className="mb-6">
      <h3 className="font-semibold text-lg mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item} className="flex items-center">
            <input
              type="checkbox"
              id={item}
              checked={selected.includes(item)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelected([...selected, item]);
                } else {
                  setSelected(selected.filter(i => i !== item));
                }
              }}
              className="mr-2"
            />
            <label htmlFor={item} className="text-sm cursor-pointer">
              {item}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-[#e3e6e6] min-h-screen">
      <div className="flex gap-6 p-6">
        {/* Filter Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6">Filters</h2>
            
            <FilterSection 
              title="Colors"
              items={colors}
              selected={selectedColors}
              setSelected={setSelectedColors}
            />
            
            <FilterSection 
              title="Thickness"
              items={thicknesses}
              selected={selectedThickness}
              setSelected={setSelectedThickness}
            />
            
            <FilterSection 
              title="Sizes"
              items={sizes}
              selected={selectedSizes}
              setSelected={setSelectedSizes}
            />
            
            <FilterSection 
              title="Surface Finish"
              items={finishes}
              selected={selectedFinishes}
              setSelected={setSelectedFinishes}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-center underline pb-6">
            {products[0]?.subCategory?.subCategoryName || 'Products'} 
            ({filteredProducts.length} Products)
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative">
                  <img
                    src={`${config.apiUrl}/api/products/media/${product.image1}`}
                    alt={product.productName}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.productName}</h2>
                  <p className="text-lg font-bold text-green-600 mb-1">
                    ₹{product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;