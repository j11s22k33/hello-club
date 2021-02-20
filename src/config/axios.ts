import env from "@/config/env";
import axios, { AxiosError } from "axios";

const API = axios.create({
  baseURL: env.API,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

API.interceptors.request.use((config) => {
  // 인증이 필요한 경우 설정
  return config;
});

API.interceptors.response.use(undefined, (error: AxiosError) => {
  // 공통 오류 처리
  if (error.response) {
    console.log(error.response?.data);
  }
  return Promise.reject(error);
});

export default API;

export const fetcher = <T>(url: string): Promise<T> =>
  API.get<T>(url).then(({ data }) => data);
