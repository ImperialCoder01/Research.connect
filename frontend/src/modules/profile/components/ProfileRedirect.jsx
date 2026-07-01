import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProfileRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    if (user.profileSlug) {
      return <Navigate to={`/profile/${user.profileSlug}`} replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default ProfileRedirect;
