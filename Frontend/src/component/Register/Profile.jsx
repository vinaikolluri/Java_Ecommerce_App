
// ProfileComponent.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { getToken } from '../../utils/JWT_Token';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CheckCircle2,
  Edit,
  Building,
} from 'lucide-react';
import UpdateProfile from './UpdateProfile';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const user =
    JSON.parse(localStorage.getItem('buyer')) ||
    JSON.parse(localStorage.getItem('seller'));
  const emailId = user?.emailId;
  const token = getToken();

  useEffect(() => {
    fetchProfile();
  }, [emailId]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}/B2B/buyer&seller/getUserProfile/${emailId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setProfile(response.data);
      setLoading(false);
      setTimeout(() => setAnimate(true), 100);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-4 border-t-blue-500 border-blue-200/20 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-gray-500 min-h-screen flex items-center justify-center bg-white">
        No profile data available
      </div>
    );
  }

  const getStatusColor = status => {
    const colors = {
      active: 'text-green-500',
      pending: 'text-yellow-500',
      inactive: 'text-red-500',
    };
    return colors[status?.toLowerCase()] || 'text-gray-500';
  };

  const ProfileCard = ({ icon: Icon, title, value, delay }) => (
    <div
      className={`transform transition-all duration-500 
        ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        bg-white rounded-xl p-6 shadow-lg hover:shadow-xl
        border border-gray-100 hover:border-blue-100
        hover:translate-y-[-2px] transition-all duration-300`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-gray-800" />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-lg font-medium text-gray-900">
            {value || 'Not provided'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 mt-12">
      <div className="max-w-5xl mx-auto px-4 py-7">
        {/* Profile Header Card */}
        <div
          className={`mb-8 transform transition-all duration-700 
          ${
            animate ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-gray-600 to-gray-300 p-1">
                  <div className="w-full h-full rounded-full bg-white p-2">
                    <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-900" />
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div className="flex-1">
                    <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mt-4">
                      {profile.fullName} {profile.lastName}
                    </h1>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-green-600 text-xl font-medium">
                        {profile.role}
                      </span>
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          className={`w-5 h-5 ${getStatusColor(
                            profile.status,
                          )}`}
                        />
                        <span className="text-gray-600">
                          {profile.status?.charAt(0).toUpperCase() +
                            profile.status?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="group px-6 py-3 bg-red-500 text-white rounded-xl 
                             transition-all duration-300 hover:bg-gray-600 
                             hover:shadow-lg hover:shadow-blue-100 
                             focus:outline-none focus:ring-2 focus:ring-gray-500 
                             focus:ring-offset-2 whitespace-nowrap"
                  >
                    <div className="relative flex items-center space-x-2">
                      <div
                        className="absolute inset-0 w-0 bg-white transition-all 
                                   duration-300 ease-out group-hover:w-full opacity-10"
                      />
                      <Edit className="w-5 h-5" />
                      <span className="font-medium">Edit Profile</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form Modal */}
        {isEditing && (
          <UpdateProfile
            profile={profile}
            onClose={() => setIsEditing(false)}
            onUpdate={fetchProfile}
            emailId={emailId}
            token={token}
          />
        )}

        {/* Profile Information Grid */}
        {!isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ProfileCard
              icon={Mail}
              title="Email Address"
              value={profile.emailId}
              delay={200}
            />
            <ProfileCard
              icon={Phone}
              title="Phone Number"
              value={profile.mob}
              delay={300}
            />
            <ProfileCard
              icon={Building}
              title="City"
              value={profile.address?.city}
              delay={400}
            />
            <ProfileCard
              icon={Briefcase}
              title="Role"
              value={profile.role}
              delay={500}
            />

            {/* Full Width Address Card */}
            <div className="md:col-span-2">
              <ProfileCard
                icon={MapPin}
                title="Complete Address"
                value={
                  profile.address
                    ? `${profile.address.street}, ${profile.address.city}, ${profile.address.state}, ${profile.address.pincode}`
                    : 'Address not provided'
                }
                delay={600}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
