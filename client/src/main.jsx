import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "./components/ui/toaster.jsx";
import axios from "axios";

// Enable credentials for all requests
axios.defaults.withCredentials = true;

// Intercept axios requests to dynamically route to production backend URL if configured
axios.interceptors.request.use(
  (config) => {
    let rawBaseUrl = import.meta.env.VITE_API_URL;
    if (rawBaseUrl && config.url && config.url.startsWith("http://localhost:5000")) {
      rawBaseUrl = rawBaseUrl.trim().replace(/\/+$/, "");
      if (rawBaseUrl.startsWith("mongodb://") || rawBaseUrl.startsWith("mongodb+srv://")) {
        console.error(
          "Config Error: VITE_API_URL cannot be a MongoDB URI. It must be your backend Web API URL (e.g., https://your-backend.onrender.com)"
        );
      } else {
        if (!rawBaseUrl.startsWith("http://") && !rawBaseUrl.startsWith("https://")) {
          rawBaseUrl = `https://${rawBaseUrl}`;
        }
        config.url = config.url.replace("http://localhost:5000", rawBaseUrl);
      }
    }

    try {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        const parsedToken = JSON.parse(storedToken);
        if (parsedToken) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${parsedToken}`;
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }

    return config;
  },
  (error) => Promise.reject(error)
);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </BrowserRouter>
);
