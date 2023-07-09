import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Auth0Provider } from "@auth0/auth0-react";

const queryClient = new QueryClient();

const theme = createTheme({
  typography: {
    fontFamily: ["Inter", "Roboto", "sans-serif"].join(","),
    h1: {
      fontFamily: "Syne, Roboto, sans-serif",
    },
    h2: {
      fontFamily: "Syne, Roboto, sans-serif",
    },
    h3: {
      fontFamily: "Syne, Roboto, sans-serif",
    },
    h4: {
      fontFamily: "Syne, Roboto, sans-serif",
    },
    h5: {
      fontFamily: "Syne, Roboto, sans-serif",
    },
    h6: {
      fontFamily: "Syne, Roboto, sans-serif",
    },
  },
  palette: {
    background: {
      default: "#F5F5F5",
    },
    text: {
      primary: "#272727",
    },
    primary: {
      main: "#FF9454",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: "100px",
          boxShadow: "none",
          padding: "10px 24px 10px 24px",
          textTransform: "none",
          fontSize: "0.875rem",
          lineHeight: "1.25",
          fontWeight: "500",
        },
        outlined: {
          borderColor: "#272727",
          color: "#272727",
          "&:hover": {
            color: "#FF9454",
          },
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-g5n3tnxrdvcl0v0m.eu.auth0.com"
      clientId="l0sQ5OkiGcKbOzCiRvAbU5q7kJurOv7h"
      authorizationParams={{
        audience: "https://dev-g5n3tnxrdvcl0v0m.eu.auth0.com/api/v2/",
        scope: "openid profile email",
        redirect_uri: window.location.origin,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <ReactQueryDevtools initialIsOpen={false} />
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
