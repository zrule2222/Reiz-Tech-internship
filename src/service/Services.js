import axios from 'axios';
import router from '../router/index.js'

export const api = {}


api.http = axios.create({ baseURL: "https://restcountries.com/v2" })

api.getCountryData = async function () {
   let response = await this.http.get(`/all?fields=name,region,area`)
  return response.data
}
export default {
    install(App) {
        App.config.globalProperties.$api = api
    }
  }