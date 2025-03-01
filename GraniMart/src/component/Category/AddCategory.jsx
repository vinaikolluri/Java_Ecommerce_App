import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config';
import { getToken } from '../../utils/JWT_Token';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const token = getToken();

  // Fetch parent categories on component mount
  useEffect(() => {
    fetchParentCategories();
  }, []);

  const fetchParentCategories = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/category/findAllParentCategories`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setParentCategories(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching parent categories:', error);
      toast.error('Failed to load parent categories');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const apiUrl = `${config.apiUrl}/category/addCategory`;
      const response = await axios.post(apiUrl, {
        categoryName,
        description,
        parentId: parseInt(selectedParentId)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        toast.success('Category added successfully!');
        // Reset form
        setCategoryName('');
        setDescription('');
        setSelectedParentId('');
      } else {
        toast.error('Failed to add category. Please try again.');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Error adding category. Please try again later.');
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading parent categories...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Add Category</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="parentCategory" className="block text-gray-700 font-bold mb-2">
            Parent Category
          </label>
          <select
            id="parentCategory"
            value={selectedParentId}
            onChange={(e) => setSelectedParentId(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Parent Category</option>
            {parentCategories.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.parentCategoryName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="categoryName" className="block text-gray-700 font-bold mb-2">
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Add Category
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddCategory;