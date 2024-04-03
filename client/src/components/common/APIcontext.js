//Setting localIp for texting purpose
import { useState, useEffect } from 'react';
import { fetchServerDetails } from '../auth/validateServer'; // method to fetch the server details

export const useAPI = () => {
  const [apiUrl, setApiUrl] = useState('');
  
  useEffect(() => {
    
    const getApiUrl = async () => {
        const details = await fetchServerDetails();
        if (details) {
            setApiUrl(details.baseURL);
            console.log('api url', apiUrl);
            }
        };

    getApiUrl();
    }, []);

    return apiUrl;
  };
