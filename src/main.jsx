import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Layout from './components/Layout';
import HomePage from './pages/Home/HomePage';
import Login from './pages/Login';
import Logout from './pages/Logout';
import UserProfile from './pages/User/UserProfile';
import NotFound from './components/NotFound';
import { AuthProvider } from './contexts/Auth.context';
import AccountHerstelPage from './pages/AccountHerstelPage'
import BestellingenPage from './pages/Bestelling/BestellingenPage';
import BestellingDetailPage from './pages/Bestelling/BestellingDetailPage';
import ProductenPage from './pages/producten/ProductenPage';
import NotificatiesPage from './pages/Notificaties/NotificatiesPage';
import { socket } from './utilities/socket';
import ProductDetailPage from './pages/producten/ProductDetailPage';
import BestellingBetalenPage from './pages/Bestelling/BestellingBetalenPage';
import BestellingBetalingVerwerkPagina from './pages/Bestelling/BestellingBetalingVerwerkPagina';
import ResetPassword from './pages/ResetPassword';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
      {
        path: "/herstel",
        element: <AccountHerstelPage/>,
      },
      {
        path: "/wijzig-wachtwoord/:resetCode",
        element: <ResetPassword />,
      },
      {
        path: "/user/:id",
        children: [
          {
            index: true,
            element: <UserProfile />
          },
        ]
      },
      {
        path: "/bestellingen",
        element: <BestellingenPage />
      },
      {
        path: "/bestelling",
        children: [
          {
            index: true,
            element: <BestellingDetailPage />
          }, 
          {
            path: "betalen/:id",
            element: <BestellingBetalenPage />
          },
          {
            path: "betalen/:id/verwerk/:userId",
            element: <BestellingBetalingVerwerkPagina />
          }
        ]
        
      },
      {
        path: "/producten",
        children: [
          {
            index: true,
            element: <ProductenPage/>
          },
          {
            path: "product/:id",
            element: <ProductDetailPage />
          }
        ]
      },
      {
        path: '/notificaties',
        element: <NotificatiesPage />
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
