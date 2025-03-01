import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config';
import { getToken } from '../../utils/JWT_Token';

const AddSubCategory = () => {
  const navigate = useNavigate();
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [childCategories, setChildCategories] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    categoryName: '',
    description: ''
  });

  const token = getToken();

  useEffect(() => {
    fetchParentCategories();
  }, []);

  const fetchParentCategories = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/category/findAllParentCategories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParentCategories(Array.isArray(response.data) ? response.data : []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching parent categories:', error);
      toast.error('Failed to load categories');
      setParentCategories([]);
      setIsLoading(false);
    }
  };

  const fetchCategories = async (parentId) => {
    try {
      const response = await axios.get(`${config.apiUrl}/category/parent/${parentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChildCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching child categories:', error);
      toast.error('Failed to load subcategories');
      setChildCategories([]);
    }
  };

  const handleParentChange = (e) => {
    const parentId = e.target.value;
    setSelectedParentId(parentId);
    setSelectedChildId('');
    if (parentId) {
      fetchCategories(parentId);
    } else {
      setChildCategories([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const apiUrl = `${config.apiUrl}/category/addSubCategory`;
      const response = await axios.post(apiUrl, {
        subCategoryName: formData.categoryName,
        description: formData.description,
        categoryId: parseInt(selectedChildId)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        toast.success('Sub-category added successfully!');
        setFormData({ categoryName: '', description: '' });
        setSelectedChildId('');
        fetchCategories(selectedParentId);
      } else {
        toast.error('Failed to add sub-category');
      }
    } catch (error) {
      console.error('Error adding sub-category:', error);
      toast.error('Error adding sub-category');
    }
  };



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r p-6">
          <h2 className="text-2xl font-bold text-black text-center">Add Sub-Category</h2>
        </div>

        <div className="p-6">
          {parentCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No parent categories found.</p>
              <button
                onClick={navigateToParentCategory}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
              >
                Create Parent Category
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Parent Category
                  </label>
                  <select
  value={selectedParentId}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "createNew") {
      // Redirect to add new parent category page
      window.location.href = "/admin/parent-categories/add";
    } else {
      handleParentChange(e); // Handle regular category selection
    }
  }}
  required
  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
>
  <option value="">Select Parent Category</option>
  {parentCategories.map((parent) => (
    <option key={parent.id} value={parent.id}>
      {parent.parentCategoryName}
    </option>
  ))}
  <option value="createNew" className="text-blue-500 font-semibold">
    Create +
  </option>
</select>

                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Existing Categories
                  </label>
                  <select
                    value={selectedChildId}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    disabled={!selectedParentId}
                  >
                    <option value="">View Existing Categories</option>
                    {childCategories.length > 0 ? (
                      childCategories.map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.categoryName}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No sub-categories found</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="border-t pt-6">
      
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Sub-category Name
                    </label>
                    <input
                      type="text"
                      name="categoryName"
                      value={formData.categoryName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Enter sub-category name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Enter description"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={!selectedParentId}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Sub-category
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AddSubCategory;