import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HorseSpinner from './tools/HorseSpinner';
import Home from './components/Home';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop'; 
import ErrorPage from './components/ErrorPage';
import About from './components/About';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Cards from './admin/Cards';
import EditCards from './admin/EditCards';
import AdminBar from './admin/AdminBar';
import AdminDash from './admin/AdminDash';
import Barriere from './admin/Barriere';
import ThreeBox from './admin/ThreeBox';
import EditBarriere from './admin/EditBarriere';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Define your routes
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Layout>
            <Home />
          </Layout>
        </>
      )
    },
    {
      path: '/about',
      element: (
        <>
          <Layout>
            <About />
          </Layout>
        </>
      )
    },
    {
      path: '/signin',
      element: (
        <>
          <Layout>
            <Signin />
          </Layout>
        </>
      )
    },
    {
      path: '/signup',
      element: (
        <>
          <Layout>
            <Signup />
          </Layout>
        </>
      )
    },
     {
      path: '/admin-cards',
      element: (
        <>
          <AdminBar>
            <Cards />
            </AdminBar>
        </>
      )
    },
    {
      path: '/admin-cards-edit',
      element: (
        <>
          <AdminBar >
          <EditCards />
          </AdminBar>
        </>
      )
    },
    {
      path: '/admin-dashboard',
      element: (
        <>
          <AdminBar >
          <AdminDash />
          </AdminBar>
        </>
      )
    },
    {
      path: '/admin-barriere',
      element: (
        <>
          <AdminBar>
            <Barriere />
            </AdminBar>
        </>
      )
    },
    {
      path: '/admin-barriere-edit',
      element: (
        <>
          <AdminBar>
            <EditBarriere />
            </AdminBar>
        </>
      )
    },
    {
      path: '/admin-threebox',
      element: (
        <>
          <AdminBar>
            <ThreeBox />
            </AdminBar>
        </>
      )
    },
    {
      path: '*',
      element: <ErrorPage />
    }
  ]);

  return (
    <React.Fragment>
      {isLoading ? (
        <HorseSpinner />
      ) : (
        <>
          <ScrollToTop />
          <RouterProvider router={router} />
        </>

      )}
    </React.Fragment>
  );
}

export default App;