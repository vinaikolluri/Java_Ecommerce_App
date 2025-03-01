import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { getToken } from '../../utils/JWT_Token';

const AddProduct = () => {
  const token = getToken();

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    totalQuantity: '',
    minQuantity: '',
    colorId: '',
    sizeId: '',
    thicknessId: '',
    partialQuantity: '20',
    availability: '',
    originOfCountry: '',
    deliveryFrom: '',
    inspection: 'no',
    listedOn: '',
    emi: 'no',
    payLater: 'no',
    categoryId: '',
    subCategoryId: '',
    surfaceId: '',
  });

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [thicknesses, setThicknesses] = useState([]);
  const [surfaces, setSurfaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all necessary data on component mount
  useEffect(() => {
    fetchCategories();
    fetchColors();
    fetchSizes();
    fetchThicknesses();
    fetchSurfaceFinish();
  }, []);

  const fetchSurfaceFinish = async () => {
    try {
      const response = await fetch(
        'http://localhost:2003/api/surface-finish/all',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch colors');
      const data = await response.json();
      setSurfaces(data || []);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await fetch(
        'http://localhost:2003/api/colourSizeThickness/colours',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch colors');
      const data = await response.json();
      setColors(data || []);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch(
        'http://localhost:2003/api/colourSizeThickness/sizes',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch sizes');
      const data = await response.json();
      setSizes(data || []);
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const fetchThicknesses = async () => {
    try {
      const response = await fetch(
        'http://localhost:2003/api/colourSizeThickness/thicknesses',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch thicknesses');
      const data = await response.json();
      setThicknesses(data || []);
    } catch (error) {
      console.error('Error fetching thicknesses:', error);
    }
  };
  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.categoryId) {
      fetchSubCategories(formData.categoryId);
    }
  }, [formData.categoryId]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        'http://localhost:2003/category/findAllCategories',
      );
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again.');
      setCategories([]);
    }
  };

  const fetchSubCategories = async categoryId => {
    try {
      setSubCategories([]); // Reset subcategories before fetching new ones
      const response = await fetch(
        `http://localhost:2003/category/category/${categoryId}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch subcategories');
      }

      const text = await response.text(); // First get response as text

      // Check if response is empty
      if (!text) {
        setSubCategories([]);
        return;
      }

      // Try to parse JSON only if we have content
      try {
        const data = JSON.parse(text);
        setSubCategories(Array.isArray(data) ? data : []);
      } catch (parseError) {
        console.error('Error parsing subcategories JSON:', parseError);
        setSubCategories([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubCategories([]);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      setImages(prev => ({
        ...prev,
        [imageKey]: file,
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append images
      Object.entries(images).forEach(([key, file]) => {
        if (file) {
          formDataToSend.append(key, file);
        }
      });
      const response = await fetch('http://localhost:2003/api/products/add', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product');
      }

      setSuccess('Product added successfully!');
      // Reset form
      setFormData({
        productName: '',
        description: '',
        price: '',
        totalQuantity: '',
        minQuantity: '',
        colorId: '',
        sizeId: '',
        thickness: '',
        surfaceFinish: '',
        // availableQuantity: '',
        partialQuantity: '',
        availability: '',
        originOfCountry: '',
        deliveryFrom: '',
        inspection: 'no',
        listedOn: '',
        emi: 'no',
        payLater: 'no',
        categoryId: '',
        subCategoryId: '',
      });
      setImages({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
      });
    } catch (error) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>
          </div>

          {/* Quantities */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Quantity
              </label>
              <input
                type="number"
                name="totalQuantity"
                value={formData.totalQuantity}
                onChange={handleInputChange}
                className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Quantity
              </label>
              <input
                type="number"
                name="minQuantity"
                value={formData.minQuantity}
                onChange={handleInputChange}
                className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Available Status
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="">Select Availability</option>
                <option
                  value="available"
                  className="bg-green-100 text-green-800"
                >
                  ✓ Product Is Available
                </option>
                <option value="unavailable" className="bg-red-100 text-red-800">
                  ✕ Not Available
                </option>
                <option
                  value="coming_soon"
                  className="bg-blue-100 text-blue-800"
                >
                  ⟳ Coming Soon
                </option>
              </select>

              {/* Status Indicator */}
              {formData.availability && (
                <div className="mt-2">
                  {formData.availability === 'available' && (
                    <div className="flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm w-fit">
                      <span className="mr-1">●</span> Available
                    </div>
                  )}
                  {formData.availability === 'unavailable' && (
                    <div className="flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm w-fit">
                      <span className="mr-1">●</span> Not Available
                    </div>
                  )}
                  {formData.availability === 'coming_soon' && (
                    <div className="flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm w-fit">
                      <span className="mr-1">●</span> Coming Soon
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        {/* Product Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <select
              name="colorId"
              value={formData.colorId}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">Select Color</option>
              {colors.map(color => (
                <option key={color.id} value={color.id}>
                  {color.colour}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Surface Finish
            </label>
            <select
              name="surfaceId"
              value={formData.surfaceId}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">Select your SurfaceType</option>
              {surfaces.map(surface => (
                <option key={surface.id} value={surface.id}>
                  {surface.surfaceFinish}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Size
            </label>
            <select
              name="sizeId"
              value={formData.sizeId}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">Select Size</option>
              {sizes.map(size => (
                <option key={size.id} value={size.id}>
                  {size.size}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Thickness
            </label>
            <select
              name="thicknessId"
              value={formData.thicknessId}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">Select Thickness</option>
              {thicknesses.map(thickness => (
                <option key={thickness.id} value={thickness.id}>
                  {thickness.thickness}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subcategory
            </label>
            <select
              name="subCategoryId"
              value={formData.subCategoryId}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
              disabled={!formData.categoryId}
            >
              <option value="">Select Subcategory</option>
              {subCategories.length > 0 ? (
                subCategories.map(subCategory => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.subCategoryName}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  {formData.categoryId
                    ? 'No subcategories available'
                    : 'Please select a category first'}
                </option>
              )}
            </select>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Origin Country
            </label>
            <input
              type="text"
              name="originOfCountry"
              value={formData.originOfCountry}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery From
            </label>
            <input
              type="text"
              name="deliveryFrom"
              value={formData.deliveryFrom}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
              required
            />
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Inspection
            </label>
            <select
              name="inspection"
              value={formData.inspection}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              EMI Available
            </label>
            <select
              name="emi"
              value={formData.emi}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pay Later
            </label>
            <select
              name="payLater"
              value={formData.payLater}
              onChange={handleInputChange}
              className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        {/* Image Uploads */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image {num}
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        name={`image${num}`}
                        onChange={e => handleImageChange(e, `image${num}`)}
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  {images[`image${num}`] && (
                    <p className="text-xs text-green-500 mt-2">
                      {images[`image${num}`].name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Listed Date */}
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700">
            Listed On
          </label>
          <input
            type="date"
            name="listedOn"
            value={formData.listedOn}
            onChange={handleInputChange}
            className="w-full px-3 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
