import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaCartPlus, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config';
import { getToken } from '../../utils/JWT_Token';
import ProductReview from './ProductReview';
import { useCart } from '../../Context/CartContext';
import Wishlist from './Wishlist';
const ProductDetailsSkeleton = () => {
  return (
    <div className="container mx-auto py-16">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <Skeleton height={500} />
        </div>
        <div className="w-full md:w-1/2 space-y-4">
          <Skeleton height={40} width={300} />
          <Skeleton height={20} width={400} />
          <Skeleton height={30} width={200} />
          <div className="flex space-x-2">
            <Skeleton height={40} width={150} />
            <Skeleton height={40} width={150} />
          </div>
          <div className="space-y-4">
            <Skeleton height={20} width="100%" />
            <Skeleton height={20} width="100%" />
            <Skeleton height={50} width="40%" />
            <Skeleton height={50} width="40%" />
          </div>
          <div className="space-y-6 ">
            <Skeleton height={40} width="60%" />
            <Skeleton height={40} width="60%" />
            <Skeleton height={40} width="60%" />
            <Skeleton height={40} width="60%" />
          </div>
        </div>
      </div>
    </div>
  );
};
const ProductDetails = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const { productId } = useParams();

  const navigate = useNavigate();
  const { fetchCart } = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl}/api/products/${productId}`,
        );
        if (response.data.success) {
          // Take the first item from the products array
          const productData = response.data.product;
          setProduct(productData);

          setLoading(false);
          scrollToTop();
        } else {
          toast.error('Product not found. Redirecting to products page...', {
            position: 'top-right',
            autoClose: 2000,
          });
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Failed to fetch product details. Redirecting...', {
          position: 'top-right',
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate('/');
        }, 2000);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, navigate]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const addToCart = async () => {
    const user = JSON.parse(localStorage.getItem('buyer'));

    if (!user) {
      toast.error('Please login to buy the products!', {
        position: 'top-right',
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate('/sign-in');
      }, 1200);
      return;
    }

    const quantity = parseInt(
      window.prompt(
        `Enter the quantity (minimum ${product.minQuantity}):`,
        product.minQuantity,
      ),
      10,
    );

    if (isNaN(quantity) || quantity < product.minQuantity) {
      toast.error(
        `Please enter a valid quantity of at least ${product.minQuantity}.`,
      );
      return;
    }

    if (quantity <= 0) {
      toast.error('Please enter a positive quantity!', {
        position: 'top-center',
        autoClose: 1000,
      });
      return;
    }

    if (product.totalQuantity < quantity) {
      toast.error('Product Out Of Stock!', {
        position: 'top-center',
        autoClose: 1000,
      });
      return;
    }
    try {
      const token = getToken();

      const response = await axios.post(
        `${config.apiUrl}/api/cart/addProductToCart?buyerId=${user.id}&productId=${product.id}&quantity=${quantity}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status===201) {
        toast.success('Product added to cart!', {
          position: 'top-center',
          autoClose: 1000,
        });
        await fetchCart(); // Update cart state after successful addition
      } else {
        toast.error('Failed to add product to cart. Please try again later.');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('Failed to add product to cart. Please try again later.');
    }
  };

  const buyNow = () => {
    navigate('/buyer/order/buynow', { state: { product } });
  };

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container max-w-full  px-2 relative ">
      {/* Animated background design */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[-1]">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-10 animate-gradient-x"></div>
        <div className="w-full h-full bg-gradient-to-b from-purple-500 to-pink-500 opacity-10 animate-gradient-y"></div>
        <div className="w-full h-full bg-gradient-to-r from-green-500 to-yellow-500 opacity-10 animate-gradient-x-reverse"></div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 py-4">
        <div className="w-full md:w-1/2">
          {/* <Wishlist product={product} /> */}
          <Carousel
            responsive={responsive}
            infinite={true}
            showDots={true}
            containerClass="carousel-container"
            itemClass="carousel-item-padding-40-px"
          >
            <div className="product-image-container">
              <img
                src={`${config.apiUrl}/api/products/media/${product.image1}`}
                alt={product.name}
                className="w-full h-[500px] object-contain"
              />
            </div>
            {product.image2 && (
              <div className="product-image-container">
                <img
                  src={`${config.apiUrl}/api/products/media/${product.image2}`}
                  alt={product.name}
                  className="w-full h-[500px] object-contain"
                />
              </div>
            )}
            {product.image3 && (
              <div className="product-image-container">
                <img
                  src={`${config.apiUrl}/api/products/media/${product.image3}`}
                  alt={product.name}
                  className="w-full h-[500px] object-contain"
                />
              </div>
            )}
          </Carousel>
        </div>
        <div className="w-full md:w-1/2 space-y-4 mt-7 py-7">
          <h1 className="text-3xl font-bold mb-6 text-left animate-fade-in">
            {product.productName}
          </h1>
          <p className="text-xl text-gray-700 animate-fade-in-delay-200">
            Description: {product.description}
          </p>
          <p className="text-3xl font-bold text-green-600 animate-fade-in-delay-400">
            {/* ₹{product.price.toFixed(2)} */}₹{product.price}
          </p>
          <div className="flex space-x-2 mt-4 animate-fade-in-delay-600">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded flex items-center space-x-2 hover:bg-blue-600 transition duration-200"
              onClick={addToCart}
            >
              <FaCartPlus className="text-lg" />
              <span>Add to Cart</span>
            </button>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded flex items-center space-x-2 hover:bg-green-600 transition duration-200"
              onClick={buyNow}
            >
              <FaMoneyBillWave className="text-lg" />
              <span>Buy Now</span>
            </button>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg animate-fade-in-delay-1000">
            <p className="text-lg font-semibold mb-2 underline">
              Product Details
            </p>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-orange-400 font-extrabold">
                Stock:{' '}
                <span className="font-medium text-black">
                  {product.totalQuantity}
                </span>
              </p>
              <p className="font-mono text-lg">
                <span className="text-black-500 font-semibold">
                  Min Quantity:-{product.minQuantity} pcs
                </span>
                <br />
              </p>
              <div className="text-black-400 font-semibold">
                Origin Of Country:-{' '}
                <span className="text-black-400 font-medium">
                  {' '}
                  {product.originOfCountry}
                </span>
              </div>
              <div className="text-black-400 font-semibold">
                Delivery From:-{' '}
                <span className="text-black-400 font-medium">
                  {' '}
                  {product.deliveryFrom}
                </span>
              </div>
              <div className="text-black-400 font-semibold">
                Inspection:-{' '}
                <span className="text-black-400 font-medium">
                  {' '}
                  {product.inspection}
                </span>
              </div>
              <div className="text-black-400 font-semibold">
                Listed On:-
                <span className="text-black-400 font-medium">
                  {new Date(product.listedOn).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="text-black-400 font-semibold">
                EMI:-
                <span className="text-black-400 font-medium">
                  {product.inspection}
                </span>
              </div>
              <div className="text-black-400 font-semibold">
                Pay Later:-
                <span className="text-black-400 font-medium">
                  {product.payLater}
                </span>
              </div>
              <div className="text-black-400 font-semibold">
                Colour:-
                <span className="text-black-400 font-medium">
                  {product.colour.colour}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="">
        <ProductReview selectedProduct={product} />
      </div> */}
      <ToastContainer />
    </div>
  );
};

export default ProductDetails;
