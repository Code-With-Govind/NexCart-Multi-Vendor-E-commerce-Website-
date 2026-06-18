import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "./components/ui/toaster.jsx";
import axios from "axios";

// Intercept axios requests to dynamically route to production backend URL if configured
axios.interceptors.request.use(
  (config) => {
    if (config.url && config.url.startsWith("http://localhost:5000")) {
      const baseUrl = import.meta.env.VITE_API_URL !== undefined 
        ? import.meta.env.VITE_API_URL 
        : "";
      config.url = config.url.replace("http://localhost:5000", baseUrl);
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
