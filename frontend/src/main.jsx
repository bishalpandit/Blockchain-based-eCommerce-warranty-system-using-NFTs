import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { MetaMaskProvider } from "metamask-react";

import Dashboard from "./views/dashboard";
import NotFound from "./components/NotFound";
import HomeRoutes from "./views/home/HomeRoutes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <MetaMaskProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<HomeRoutes />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MetaMaskProvider>
    </ChakraProvider>
  </React.StrictMode>
);
