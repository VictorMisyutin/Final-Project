const config = {
    development: {
      backendUrl: "http://localhost:4000"
    },
    production: {
      backendUrl: "https://figure-out-later.com" 
    }
  };

  
  const currentEnv = "development"; // if deving
//   const currentEnv = "production"; // if pushing to prod
  
  module.exports = config[currentEnv];
  