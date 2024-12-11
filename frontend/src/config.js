const config = {
    development: {
      // backendUrl: "http://localhost:4000"
      backendUrl: "https://a7a3-66-253-130-240.ngrok-free.app"
    },
    production: {
      backendUrl: "https://figure-out-later.com" 
    }
  };

  
  const currentEnv = "development"; // if deving
//   const currentEnv = "production"; // if pushing to prod
  
  module.exports = config[currentEnv];
  