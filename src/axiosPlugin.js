import axios from 'axios'

const API_BASE = process.env.API_BASE_URL || '/api'
const novaApiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
})

export default novaApiClient
