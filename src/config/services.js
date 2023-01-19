const ip = {
    localhost: 'http://localhost:3001',
    production: 'https://immtrip-dev-api.kaspythailand.com',
  };
  const apiIp = process.env.NODE_ENV === 'production' ? ip.production : ip.localhost;
  
  const api = {
    apiUrl: `${apiIp}`,
    // login
    login: `${apiIp}/api/v1/auth/login`,
    loout: `${apiIp}/api/v1/auth/loout`,

    // user
    applicantList: `${apiIp}/api/v1/applicant/applicants`,
  
  };
  
  export default api;
  