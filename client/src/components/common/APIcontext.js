//Setting localIp for texting purpose
import { useState } from 'react';
import { fetchServerDetails } from '../auth/validateServer'; // method to fetch the server details

export const useAPI = () => {
  const [apiUrl, setApiUrl] = useState('');
  
  const getApiUrl = async () => {
    if(apiUrl) return apiUrl;
      const details = await fetchServerDetails();
      if (details && !apiUrl) {
          setApiUrl(details.baseURL);
        }
      };

  getApiUrl();
    return apiUrl;
  };
