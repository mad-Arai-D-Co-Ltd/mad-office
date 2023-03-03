const ip = {
    localhost: 'http://localhost:3001',
    production: 'https://hr-project.madtypes.com',
  };
  const apiIp = process.env.NODE_ENV === 'production' ? ip.production : ip.localhost;
  
  const api = {
    apiUrl: `${apiIp}`,
    // login
    login: `${apiIp}/api/v1/auth/login`,
    logout: `${apiIp}/api/v1/auth/logout`,

    // user
    userList: `${apiIp}/api/v1/user/user-list`,
    createUser: `${apiIp}/api/v1/user/create-user`,
    roleList : `${apiIp}/api/v1/user/role-list`,
    updateVacation : `${apiIp}/api/v1/vacation/update-vacation`,
    
    // user
    applicantList: `${apiIp}/api/v1/applicant/applicants`,
    applicantFilter: `${apiIp}/api/v1/applicant/filter-applicant`,
    positionList: `${apiIp}/api/v1/applicant/position-applicant`,
    reviewApplicant: `${apiIp}/api/v1/review/create-review`,

    getUserReview : `${apiIp}/api/v1/review/review-applicants`,

    // repair
    requestRepairList : `${apiIp}/api/v1/repair/find`,
    updateRepairStatus : `${apiIp}/api/v1/repair/update`,

    // order
    requestOrderList : `${apiIp}/api/v1/order/find`,
    updateOrderStatus : `${apiIp}/api/v1/order/update`,
    
  
  };
  
  export default api;
  