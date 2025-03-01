import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import ActiveBuyers from './component/Admin/ActiveBuyers';
import ActiveSellers from './component/Admin/ActiveSellers';
import GetAllBuyers from './component/Admin/GetallBuyers';
import GetAllSeller from './component/Admin/GetAllSeller';
import AdminNavbar from './component/Navigation/AdminNavbar';
import BuyerNavbar from './component/Navigation/BuyerNavabar';
import Navbar from './component/Navigation/Navbar';
import SellerNavbar from './component/Navigation/SellerNavbar';
import AddProduct from './component/Product/AddProduct';
import ChangePassword from './component/Register/ChangePassword';
import Forgotpassword from './component/Register/Forgotpassword';
import Profile from './component/Register/Profile';
import Signin from './component/Register/Signin';
import { useAuth } from './Context/AuthContext';
import Home from './Pages/Home';
import ViewAllProducts from './component/Admin/ViewAllProducts';
import ViewMyCart from './component/cart/ViewMyCart';
import GetCategory from './component/Category/GetCategory';
import BuyerCheckout from './component/Order/BuyerCheckout';
import BuyerOrdes from './component/Order/BuyerOrdes';
import OrderProduct from './component/Order/OrderProduct';
import Payment from './component/Order/Payment';
import MobileLogin from './component/Register/MobileLogin';
import ProductDetail from './component/Product/ProductDetails';
import AddCategory from './component/Category/AddCategory';
import AddParentCategory from './component/Category/AddParentCategory';
import AddSubCategory from './component/Category/AddSubCategory';
import CategoryManagement from './component/Category/CategoryManagement';
import SubNavbar from './component/Navigation/SubNavbar';
import ProductList from './component/Product/ProductList';
import SellerProducts from './component/Product/SellerProducts';
import ViewWishlist from './component/Product/ViewWishlist';
import SignUp from './component/Register/SignUp';
import AllProducts from './component/Product/AllProducts'; // Import AllProducts

const App = () => {
  const { admin, isAuthenticated } = useAuth();
  return (
    <Router>
      {isAuthenticated && admin?.role === 'Admin' ? (
        <AdminNavbar />
      ) : (
        <Navbar />
      )}
      <SubNavbar />
      <Routes>
        <Route path="/search" element={<AllProducts />} />
        <Route path="/" element={<Home />} />

        <Route path="/" element={<AllProducts />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/user/forgot" element={<Forgotpassword />} />
        <Route path="/user/change-password" element={<ChangePassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-navbar" element={<AdminNavbar />} />
        <Route path="/seller-navbar" element={<SellerNavbar />} />
        <Route path="/buyer-navbar" element={<BuyerNavbar />} />
        <Route path="/admin/users/customers" element={<GetAllBuyers />} />
        <Route path="/admin/all/sellers" element={<GetAllSeller />} />
        <Route path="/admin/active/buyers" element={<ActiveBuyers />} />
        <Route path="/admin/active/sellers" element={<ActiveSellers />} />
        <Route path="/admin/orders" element={<ViewAllProducts />} />
        {/* category */}
        <Route
          path="/admin/parent-categories/add"
          element={<AddParentCategory />}
        />
        <Route path="/admin/categories/add" element={<AddCategory />} />
        <Route path="/admin/sub-categories/add" element={<AddSubCategory />} />
        <Route path="/sellers/all/category" element={<GetCategory />} />
        {/* Product */}
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/products/:subCategoryId" element={<ProductList />} />
        <Route path="/buyers/view/cart" element={<ViewMyCart />} />
        <Route path="/buyer/order/buynow" element={<OrderProduct />} />
        <Route path="/order/payment" element={<Payment />} />
        <Route path="/admin/view/products" element={<ViewAllProducts />} />
        <Route path="/cart/checkout" element={<BuyerCheckout />} />
        <Route path="/buyers/orders" element={<BuyerOrdes />} />
        <Route path="/orders" element={<BuyerOrdes />} />
        <Route path="/users/login/mobile" element={<MobileLogin />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/seller/category/all" element={<CategoryManagement />} />
        <Route path="/seller/all/products" element={<SellerProducts />} />
        <Route path="/buyers/wishlist" element={<ViewWishlist />} />
      </Routes>
      {/* {isAuthenticated && <Footer />} */}
    </Router>
  );
};

export default App;