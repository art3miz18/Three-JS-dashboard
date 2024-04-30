const os = require('os');

const getServerIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName].find((alias) => alias.family === 'IPv4' && !alias.internal);
    if (iface) {
      return iface.address;
    }
  }
  return '0.0.0.0';
};

module.exports = getServerIPAddress;
