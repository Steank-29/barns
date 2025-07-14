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
      element:(
        <>
          <AdminBar>
            <ThreeBox />
            </AdminBar>
        </>
      ) 
    },
    {
      path: '/admin-threebox-edit',
      element:(
        <>
          <AdminBar>
            <EditThreeBox  />
            </AdminBar>
        </>
      ) 
    },
    {
      path: '/admin-twobox',
      element:(
        <>
          <AdminBar>
            <TwoBox />
            </AdminBar>
        </>
      ) 
    },
        {
      path: '/admin-twobox',
      element:(
        <>
          <AdminBar>
            <TwoBox />
            </AdminBar>
        </>
      ) 
    },
    {
      path: '/admin-twobox-edit',
      element: (
        <>
          <AdminBar>
            <EditTwoBox />
            </AdminBar>
        </>
      ) 
    },
        {
      path: '/admin-twoboxresin',
      element:(
        <>
          <AdminBar>
            <TwoBoxResin />
            </AdminBar>
        </>
      ) 
    },
    {
      path: '/admin-twoboxresin-edit',
      element: (
        <>
          <AdminBar>
            <EditTwoBoxResin />
            </AdminBar>
        </>
      ) 
    },
    {
      path: '/admin-fivebox',
      element:(
        <>
          <AdminBar>
            <FiveBox />
            </AdminBar>
        </>
      ) 
    },
    {
      path: '/admin-fivebox',
      element:(
        <>
          <AdminBar>
            <FiveBox />
            </AdminBar>
        </>
      ) 
    },
    {
      path: '/admin-fivebox-edit',
      element: (
        <>
          <AdminBar>
            <EditFiveBox  />
            </AdminBar>
        </>
      ) 
    },
    {
      path: '/admin-fivebox-edit',
      element: (
        <>
          <AdminBar>
            <EditFiveBox  />
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