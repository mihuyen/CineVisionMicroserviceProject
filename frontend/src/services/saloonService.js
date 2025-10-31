import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || `http://${window.location.hostname}:8080`;

export class SaloonService {

    apiUrl = `${API_BASE}/api/movie/saloons/`

    getSaloonsByCityId(cityId) {
        return axios.get(this.apiUrl + "getSaloonsByCityId/" + cityId);
    }

    getall() {
        return axios.get(this.apiUrl + "getall");
    }
}