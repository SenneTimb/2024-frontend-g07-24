import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from './Header/header';
import Footer from './Footer/footer';
import './Layout.css';
import 'react-toastify/dist/ReactToastify.css'

import { ToastContainer } from 'react-toastify'

export default function Layout() {
  return (
    <>
    <div className="layout-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
      />
      <Header />
      <div className="layout-content">
      
        <Outlet />
      </div>
      <Footer />
      <ScrollRestoration />
    </div>
    </>
  );
}