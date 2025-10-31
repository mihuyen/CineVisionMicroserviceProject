import axios from "axios";

// Use configurable API base; default to current host on port 8080
const API_BASE = process.env.REACT_APP_API_BASE || `http://${window.location.hostname}:8080`;

export class UserService {

    baseUrl = `${API_BASE}/api/user`;

    addCustomer(customer) {
        return axios.post(`${this.baseUrl}/users/add`, customer);
    }

    login(loginDto) {
        return axios.post(`${this.baseUrl}/auth/login`, loginDto);
    }
}