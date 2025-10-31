import axios from "axios";

// Allow overriding API base URL via env; default to current host on port 8080 (works with LAN access)
const API_BASE = process.env.REACT_APP_API_BASE || `http://${window.location.hostname}:8080`;

export class MovieService {

    apiUrl = `${API_BASE}/api/movie/movies/`;

    getAllDisplayingMovies() {
        // Normalize payload: some backends return an array, others wrap as { value: [...], Count: n }
        return axios.get(this.apiUrl + "displayingMovies").then(res => {
            const payload = res?.data;
            const items = Array.isArray(payload) ? payload : (Array.isArray(payload?.value) ? payload.value : []);
            return { ...res, data: items };
        });
    }

    getAllComingSoonMovies() {
        // Normalize payload similar to displayingMovies
        return axios.get(this.apiUrl + "comingSoonMovies").then(res => {
            const payload = res?.data;
            const items = Array.isArray(payload) ? payload : (Array.isArray(payload?.value) ? payload.value : []);
            return { ...res, data: items };
        });
    }

    getMovieById(movieId) {
        return axios.get(this.apiUrl + movieId);
    }

    addMovie(movieDto) {
        return axios.post(this.apiUrl + "add", movieDto);
    }
}