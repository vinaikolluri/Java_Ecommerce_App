import React from 'react';
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 relative overflow-hidden mt-5 ">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-bold mb-4">About Us</h4>
            <p className="text-gray-400 text-sm">
  We are a premier destination for luxury tiles and premium marbles, offering an exquisite collection sourced from around the world. From classic Italian marbles to modern designer tiles, we help transform your spaces with elegance and durability. With our expert guidance and superior quality materials, your dream interior is just a selection away.
</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Shop
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Customer Service</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-xl font-bold mb-4">Contact Us</h5>
            <ul className="text-gray-400 text-sm space-y-2">
            <li>
  Email:{' '}
  <a href="mailto:connectingbussinessb2b@gmail.com" className="text-blue-600 underline text-md">
    bussinessDK@gmail.com
  </a>
</li>
              <li>Address: sgsdkgskgbsd <br/> <span className='px-14'> 3rd floor, 500081</span></li>
            </ul>
            <h4 className="text-lg font-bold mt-2 ">Follow Us</h4>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 opacity-100 transition-colors duration-300"
                aria-label="Follow us on Twitter"
              >
                <FaTwitter className="h-6 w-6 " />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Follow us on Facebook"
              >
                <FaFacebookF className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Follow us on YouTube"
              >
                <FaYoutube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-400 text-sm">
          &copy; 2025 FreshMart . All rights reserved.
        </div>
      </div>
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-full h-full bg-gradient-to-r from-gray-900 to-transparent animate-fade-in"></div>
      </div>
    </footer>
  );
};

export default Footer;
