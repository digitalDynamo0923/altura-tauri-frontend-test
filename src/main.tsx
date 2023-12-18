import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { WalletProvider } from "./providers/WalletProvider.tsx";
import { TokensProvider } from "./providers/TokensProvider.tsx";
import Home from "./Home.tsx";
import Dashboard from "./Dashboard.tsx";
import Login from "./Login.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletProvider>
      <TokensProvider>
        <RouterProvider router={router} />
      </TokensProvider>
    </WalletProvider>
  </React.StrictMode>
);
