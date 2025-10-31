import axios from "axios";

// Use env override if provided; otherwise, target the same host the app is served from (works on LAN devices)
const API_BASE = process.env.REACT_APP_API_BASE || `http://${window.location.hostname}:8080`;

export class CommentService {

    apiUrl = `${API_BASE}/api/movie/comments/`;

    getCommentsByMovieId(movieId, pageNo, pageSize=5) {
        return axios.get(this.apiUrl + "getCommentsByMovieId/" + movieId + "/" + pageNo + "/" + pageSize);
    }

    getCountOfComments(movieId) {
        return axios.get(this.apiUrl + "getCountOfComments/" + movieId);
    }

    addComment(commentDto) {
        return axios.post(this.apiUrl + "add" , commentDto);
    }
    
    deleteComment(deleteCommentDto) {
        return axios.post(this.apiUrl + "delete" , deleteCommentDto);
    }
}