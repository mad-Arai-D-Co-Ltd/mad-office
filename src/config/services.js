const ip = {
    localhost: 'http://localhost:3001',
    production: 'https://immtrip-dev-api.kaspythailand.com',
  };
  const apiIp = process.env.NODE_ENV === 'production' ? ip.production : ip.localhost;
  
  const api = {
    apiUrl: `${apiIp}`,
    // login
    login: `${apiIp}/api/v1/auth/login`,
    logout: `${apiIp}/api/v1/auth/logout`,

    // user
    applicantList: `${apiIp}/api/v1/applicant/applicants`,
    reviewApplicant: `${apiIp}/api/v1/review/create-review`,

    getUserReview : `${apiIp}/api/v1/review/review-applicants`,
    
  
  };
  
  export default api;
  