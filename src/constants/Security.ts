/**
 * Properties to headers
 */
export const CONTENT_SECURITY_POLICY = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' http://cdnjs.cloudflare.com https://connect.facebook.net https://www.google.com https://www.googletagmanager.com https://www.gstatic.com https://www.youtube.com;
  style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;
  font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com https://fonts.googleapis.com data:;
  img-src 'self' https://www.google.com.co/ads https://storageccxc1.s3.us-west-2.amazonaws.com data: blob:;
  connect-src 'self' ${process.env.REACT_APP_BASE_URL} https://www.datos.gov.co https://analytics.google.com https://storageccxc1.s3.us-west-2.amazonaws.com https://geolocation-db.com/json/ data: blob:;
  frame-src https://www.google.com https://www.youtube.com ${process.env.REACT_APP_CRM_URL};
  worker-src blob:;
`;
export const PERMISSIONS_POLICY =
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()';
export const REFERRER_POLICY = 'strict-origin-when-cross-origin';
