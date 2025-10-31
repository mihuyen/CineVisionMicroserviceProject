import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || `http://${window.location.hostname}:8080`;

export class PaymentService {

    apiUrl = `${API_BASE}/api/movie/payments/`

    sendTicketDetail(ticketDetail) {
        return axios.post(this.apiUrl + "sendTicketDetail", ticketDetail);
    }
}