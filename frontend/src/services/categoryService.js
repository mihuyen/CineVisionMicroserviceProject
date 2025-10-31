import axios from "axios"

// Allow overriding API base URL via env; default to current host on port 8080
const API_BASE = process.env.REACT_APP_API_BASE || `http://${window.location.hostname}:8080`;

export class CategoryService{
    apiUrl = `${API_BASE}/api/movie/categories/`

    getall() {
        return axios.get(this.apiUrl + "getall")
    }
}