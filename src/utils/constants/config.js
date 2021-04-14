const config = () => {
  const env = process.env.BUILD_MODE || 'local';
  let BASE_URL = 'https://toa-oms-dev.legato.co';
  // ENV DEV
  if (env === 'dev') {
    BASE_URL = 'https://toa-oms-dev.legato.co';
  } else if (env === 'stg') {
    // STG
    BASE_URL = 'https://toa-oms-dev.legato.co';
  } else if (env === 'prod') {
    // PROD
    BASE_URL = 'https://toa-oms-dev.legato.co';
  }
  return { BASE_URL };
};
const serverConfig = config();

export default serverConfig;
