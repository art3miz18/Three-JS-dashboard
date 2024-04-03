import axios from 'axios';

export const fetchServerDetails = async () => {
  try {
    const response = await axios.get('/api/server-info');
    return response.data; // This should include { ip, baseUrl }
  } catch (error) {
    console.error('Failed to fetch server details:', error);
    return null;
  }
};
