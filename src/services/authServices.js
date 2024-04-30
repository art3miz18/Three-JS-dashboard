import axios from 'axios';

let API_URL = 'https://three-js-dashboard.onrender.com/api/users/';

//setting baseURL for localTesting should be ommitted when working on production
const setBaseUrl = (url) => {
   API_URL = url+"/users/";
};

const register = (username, password) => {
  return axios.post(API_URL + 'register', {
    username,
    password
  });
};

const login = (username, password) => {
  return axios.post(API_URL + 'login', {
    username,
    password
  }).then((response) => {
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem('user');
};

export default {
  register,
  login,
  logout,
  setBaseUrl
};
