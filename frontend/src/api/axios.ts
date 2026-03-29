// Instância central do Axios usada para consumir os endpoints da Web API.
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5255/api",
});

