const axios = require('axios');

class APIHelper {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
    });
  }

  async get(endpoint, params = {}) {
    const response = await this.client.get(endpoint, { params });
    return response;
  }

  async post(endpoint, data = {}) {
    const response = await this.client.post(endpoint, data);
    return response;
  }

  async put(endpoint, data = {}) {
    const response = await this.client.put(endpoint, data);
    return response;
  }

  async delete(endpoint) {
    const response = await this.client.delete(endpoint);
    return response;
  }

  setAuthToken(token) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

module.exports = APIHelper;