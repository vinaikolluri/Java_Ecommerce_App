

import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";
import { getToken } from "../../utils/JWT_Token";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; 

const GetCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editCategory, setEditCategory] = useState({
    id: "",
    categoryName: "",
    description: "",
    status: "",
  });
  const token = getToken();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = `${config.apiUrl}/B2B/categories/fetchAllCategories`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const handleEditClick = (category) => {
    setEditMode(true);
    setEditCategory({
      id: category.id,
      categoryName: category.categoryName,
      description: category.description,
      status: category.status,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditCategory((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditCategory({
      id: "",
      categoryName: "",
      description: "",
      status: "",
    });
  };

  const handleUpdateCategory = async (event) => {
    event.preventDefault();
    try {
      const apiUrl = `${config.apiUrl}/B2B/categories/updateCategoryById/${editCategory.id}`;
      const response = await axios.put(apiUrl, editCategory, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Update response:", response.data);

      const updatedCategories = categories.map((cat) => {
        if (cat.id === editCategory.id) {
          return { ...cat, ...editCategory };
        }
        return cat;
      });

      setCategories(updatedCategories);
      setEditMode(false);
      setEditCategory({
        id: "",
        categoryName: "",
        description: "",
        status: "",
      });
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const apiUrl = `${config.apiUrl}/B2B/categories/deleteCategoryById/${id}`;
      await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-5">
      <h2 className="text-3xl font-bold text-center my-4">All Categories</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-semibold uppercase">
                No
              </th>
              <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-semibold uppercase">
                Category Name
              </th>
              <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-semibold uppercase">
                Description
              </th>
              <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 font-semibold uppercase">
                Status
              </th>
              <th className="py-3 border-b-2 border-gray-300 text-center text-sm leading-4 font-semibold uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300">
                      <Skeleton width={20} />
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300">
                      <Skeleton width={120} />
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300">
                      <Skeleton width={200} />
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300">
                      <Skeleton width={80} />
                    </td>
                    <td className="py-4 whitespace-no-wrap border-b border-gray-300 text-center">
                      <Skeleton width={60} />
                    </td>
                  </tr>
                ))
              : categories.map((category, index) => (
                  <tr key={category.id} className="hover:bg-gray-100">
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300">
                      {category.categoryName}
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300">
                      {category.description}
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300">
                      {category.status}
                    </td>
                    <td className="py-4 whitespace-no-wrap border-b border-gray-300 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          onClick={() => handleEditClick(category)}
                        >
                          Update
                        </button>
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                          onClick={() => handleDeleteClick(category.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {editMode && (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-4">
          <h2 className="text-2xl font-bold text-center mb-6">Edit Category</h2>
          <form onSubmit={handleUpdateCategory} className="space-y-4">
            <div>
              <label
                htmlFor="editCategoryName"
                className="block text-gray-700 font-bold mb-2"
              >
                Category Name
              </label>
              <input
                type="text"
                id="editCategoryName"
                name="categoryName"
                value={editCategory.categoryName}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="editDescription"
                className="block text-gray-700 font-bold mb-2"
              >
                Description
              </label>
              <textarea
                id="editDescription"
                name="description"
                value={editCategory.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="editStatus"
                className="block text-gray-700 font-bold mb-2"
              >
                Status
              </label>
              <input
                type="text"
                id="editStatus"
                name="status"
                value={editCategory.status}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-500 focus:outline-none"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Update Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GetCategory;
