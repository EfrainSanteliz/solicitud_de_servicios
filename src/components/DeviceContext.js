import React, { createContext, useState, useEffect } from 'react';

// Create a Context
export const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [deviceType, setDeviceType] = useState('');

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      const mobileDevices = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

      if (mobileDevices.test(userAgent)) {
        setDeviceType('phone');
      } else {
        setDeviceType('computer');
      }
    };

    detectDevice();

    window.addEventListener('resize', detectDevice);
    return () => {
      window.removeEventListener('resize', detectDevice);
    };
  }, []);

  return (
    <DeviceContext.Provider value={deviceType}>
      {children}
    </DeviceContext.Provider>
  );
};