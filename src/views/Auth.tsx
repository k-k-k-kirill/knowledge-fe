import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useLocation } from "react-router-dom";

export const Auth = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    } else if (location.state?.from) {
      navigate(location.state.from);
    }
  }, [isAuthenticated, loginWithRedirect, navigate, location.state]);

  if (isLoading) {
    return <>Loading...</>;
  }

  return null;
};
