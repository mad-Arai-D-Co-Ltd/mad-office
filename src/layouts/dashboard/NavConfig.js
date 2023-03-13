// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'user request vacation',
    path: '/dashboard/vacations',
    icon: getIcon('icon-park-twotone:vacation'),
  },
  {
    title: 'applicant',
    path: '/dashboard/applicants',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'repair',
    path: '/dashboard/repairs',
    icon: getIcon('fluent-mdl2:repair'),
  },
  {
    title: 'order',
    path: '/dashboard/orders',
    icon: getIcon('material-symbols:order-approve-rounded'),
  },
 
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
