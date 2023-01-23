const ip = {
    localhost: 'http://localhost:3001',
    production: 'http://52.76.248.13',
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
    
    // user
    applicantList: `${apiIp}/api/v1/applicant/applicants`,
    reviewApplicant: `${apiIp}/api/v1/review/create-review`,

    getUserReview : `${apiIp}/api/v1/review/review-applicants`,
    
  
  };
  
  export default api;
  