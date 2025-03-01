import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/JWT_Token';
import { FaStar } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config';

const ProductReview = ({ selectedProduct }) => {
  const [reviews, setReviews] = useState([]);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [star, setStar] = useState(0);
  const [review, setReview] = useState('');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const token = getToken();
  const userData = JSON.parse(localStorage.getItem('buyer'));
  const buyerId = userData?.id;
  const productId = selectedProduct.id;

  useEffect(() => {
    fetchProductReviews();
  }, [productId, token]);

  const fetchProductReviews = async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}/B2B/review/fetchProductReviews?productId=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const reviewsData = response.data.reviews;

        if (reviewsData.length === 0) {
          setReviews([]);
          setDisplayedReviews([]);
          setAverageRating(0);
          setRatingCounts({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
        } else {
          const sortedReviews = reviewsData.sort((a, b) => b.star - a.star);
          setReviews(sortedReviews);
          setDisplayedReviews(sortedReviews.slice(0, 2));
          setAverageRating(response.data.averageRating);
          calculateRatingCounts(reviewsData);
        }
      }
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      toast.error('Failed to fetch product reviews.');
    }
  };

  const calculateRatingCounts = reviews => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      counts[review.star] += 1;
    });
    setRatingCounts(counts);
  };

  const handleReviewSubmit = async e => {
    e.preventDefault();

    // Check if rating is not given
    if (star === 0) {
      toast.error('Please provide a rating before submitting your review.');
      return;
    }

    const newReview = {
      buyerId,
      productId,
      star,
      review,
    };

    try {
      const response = await axios.post(
        `${config.apiUrl}/B2B/review/addReview`,
        newReview,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.success) {
        toast.success('Review added successfully!');
        fetchProductReviews();
        setStar(0);
        setReview('');
      } else {
        toast.error('Failed to add review.');
      }
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review.');
    }
  };

  const handleViewAllClick = () => {
    setShowAllReviews(true);
    setDisplayedReviews(reviews);
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Customer Reviews
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/4">
          {reviews.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <p className="text-gray-700 text-lg">No reviews yet.</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        size={24}
                        className={
                          index < averageRating
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                  <span className="ml-3 text-xl font-semibold text-gray-700">
                    {averageRating.toFixed(1)} / 5
                  </span>
                </div>
                <div className="space-y-2">
                  {Object.entries(ratingCounts)
                    .sort(([a], [b]) => b - a)
                    .map(([rating, count]) => (
                      <div key={rating} className="flex items-center">
                        <span
                          className={`text-gray-600 mr-2 w-16 ${
                            rating === '1' ? 'text-red-600' : ''
                          }`}
                        >
                          {rating} star
                        </span>
                        <div className="flex-1 bg-gray-200 h-4 rounded">
                          <div
                            className={`h-4 rounded ${
                              rating === '5'
                                ? 'bg-green-500'
                                : rating === '4'
                                ? 'bg-blue-500'
                                : rating === '3'
                                ? 'bg-yellow-500'
                                : rating === '2'
                                ? 'bg-orange-500'
                                : 'bg-red-500'
                            }`}
                            style={{
                              width: `${(count / reviews.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-gray-600 w-16 text-right">
                          ({count})
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                {displayedReviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-6"
                  >
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={20}
                            className={
                              i < review.star
                                ? 'text-yellow-500'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="ml-3 font-semibold text-gray-700">
                        {review.userName || 'Anonymous'}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">{review.review}</p>
                  </div>
                ))}

                {!showAllReviews && reviews.length > 2 && (
                  <button
                    onClick={handleViewAllClick}
                    className="text-blue-600 underline mt-4"
                  >
                    See all reviews
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="md:w-2/4">
          {userData && (
            <form
              onSubmit={handleReviewSubmit}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg shadow-lg sticky top-4 border border-blue-200"
            >
              <h3 className="text-2xl font-bold mb-6 text-indigo-800 text-center">
                Share your thoughts with other customers
              </h3>
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-2">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      size={36}
                      className={`transition-colors duration-200 ${
                        index < star
                          ? 'text-yellow-400 hover:text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-400'
                      } cursor-pointer`}
                      onClick={() => setStar(index + 1)}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-indigo-700 mb-2 font-semibold">
                  Review this Product:
                </label>
                <textarea
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  className="w-full p-4 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200 resize-none"
                  rows="5"
                  placeholder="Share your experience with this product..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 rounded-lg font-bold hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 focus:outline-none"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProductReview;
