import { Navigate, useRoutes,useLocation } from 'react-router-dom';
import jwtDecode from "jwt-decode";

import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

import Blog from './pages/Blog';
import User from './pages/User';
import Login from './pages/login';
import NotFound from './pages/Page404';
import Register from './pages/register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';

import Applicants from './pages/Applicants';

// ----------------------------------------------------------------------

export default function Router() {

  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('userInfo'));
  let decodeData;
  if(userData !== null){
    decodeData = jwtDecode(userData.token);
  }
  

  function RequireAuth({ children }: { children: JSX.Element }) {
    let userdata = localStorage.getItem('userInfo');
    userdata = userdata ? JSON.parse(userdata) : null;

    const pathnameList = location.pathname.split('/');
    const isNotAllowPages = pathnameList.includes('mad-users');

    if (userdata && userdata !== null) {

      if (location.pathname === '/login') {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
      }
      if (userdata && decodeData.payload.roles[0].name !== 'Mad') {
        if (isNotAllowPages) {
          return <Navigate to="/" state={{ from: location }} replace />;
        }
      }
    } else if (userdata === null && location.pathname !== '/login') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
  }

  return useRoutes([
    {
      path: '/dashboard',
      element: <RequireAuth><DashboardLayout /></RequireAuth>,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'mad-user',
        children: [
          { path: 'applicants', element: <Applicants /> },
        ]},
        
        { path: 'blog', element: <Blog /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
