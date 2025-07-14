import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import HorseSpinner from './tools/HorseSpinner';
import Home from './components/Home';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop'; 
import ErrorPage from './components/ErrorPage';
import About from './components/About';
import Signin from './components/Signin';
import Cards from './admin/Cards';
import EditCards from './admin/EditCards';
import AdminBar from './admin/AdminBar';
import AdminDash from './admin/AdminDash';
import Barriere from './admin/Barriere';
import ThreeBox from './admin/ThreeBox';
import EditBarriere from './admin/EditBarriere';
import EditThreeBox from './admin/EditThreeBox';
import TwoBox from './admin/TwoBox';
import EditTwoBox from './admin/EditTwoBox';
import TwoBoxResin from './admin/TwoBoxResin';
import EditTwoBoxResin from './admin/EditTwoBoxResin';
import FiveBox from './admin/FiveBox';
import EditFiveBox from './admin/EditFiveBox';


import { isAuthenticated } from './tools/auth';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const isAuth = isAuthenticated();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
      path: '/admin-cards',
      element: isAuth ? (
        <>
          <AdminBar>
            <Cards />
            </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
    {
      path: '/admin-cards-edit',
      element: isAuth ? (
        <>
          <AdminBar >
          <EditCards />
          </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
    {
      path: '/admin-dashboard',
      element: isAuth ? (
        <>
          <AdminBar >
          <AdminDash />
          </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
    {
      path: '/admin-barriere',
      element: isAuth ? (
        <>
          <AdminBar>
            <Barriere />
            </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
    {
      path: '/admin-barriere-edit',
      element: isAuth ? (
        <>
          <AdminBar>
            <EditBarriere />
            </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
    {
      path: '/admin-threebox',
      element:isAuth ? (
        <>
          <AdminBar>
            <ThreeBox />
            </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
    {
      path: '/admin-threebox-edit',
      element:isAuth ? (
        <>
          <AdminBar>
            <EditThreeBox  />
            </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
    {
      path: '/admin-twobox',
      element:isAuth ? (
        <>
          <AdminBar>
            <TwoBox />
            </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
        {
      path: '/admin-twobox',
      element:isAuth ? (
        <>
          <AdminBar>
            <TwoBox />
            </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
    {
      path: '/admin-twobox-edit',
      element: isAuth ? (
        <>
          <AdminBar>
            <EditTwoBox />
            </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
        {
      path: '/admin-twoboxresin',
      element:isAuth ? (
        <>
          <AdminBar>
            <TwoBoxResin />
            </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
    {
      path: '/admin-twoboxresin-edit',
      element: isAuth ? (
        <>
          <AdminBar>
            <EditTwoBoxResin />
            </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
    {
      path: '/admin-fivebox',
      element:isAuth ? (
        <>
          <AdminBar>
            <FiveBox />
            </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
    {
      path: '/admin-fivebox',
      element:isAuth ? (
        <>
          <AdminBar>
            <FiveBox />
            </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
    {
      path: '/admin-fivebox-edit',
      element: isAuth ? (
        <>
          <AdminBar>
            <EditFiveBox  />
            </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
      )
    },
    {
      path: '/admin-fivebox-edit',
      element: isAuth ? (
        <>
          <AdminBar>
            <EditFiveBox  />
            </AdminBar>
        </>
      ) : (
        <Navigate to="/" />
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