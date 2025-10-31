import axios from "axios";

// Allow overriding API base URL via env; default to current host on port 8080
const API_BASE = process.env.REACT_APP_API_BASE || `http://${window.location.hostname}:8080`;

export class ActorService {

    apiUrl = `${API_BASE}/api/movie/actors/`

    getActorsByMovieId(movieId) {
        return axios.get(this.apiUrl + "getActorsByMovieId/" + movieId);
    }

    getall() {
        return axios.get(this.apiUrl + "getall");
    }
    
    addActor(actorDto) {
        return axios.post(this.apiUrl + "add", actorDto);
    }
}