import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<string | null>(null);

  const instance = axios.create({
    baseURL: "http://localhost:8080",
  });

  useEffect(() => {
    getAccessTokenSilently()
      .then(setToken)
      .catch((error) => console.log(error));
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (token) {
      instance.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        },
        (error) => Promise.reject(error)
      );
    }
  }, [token, instance]);

  return instance;
};
