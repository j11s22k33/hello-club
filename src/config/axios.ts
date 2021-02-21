import env from "@/config/env";
import clubs from "@/dummy/clubs";
import contents from "@/dummy/contents";
import axios, { AxiosError } from "axios";
import MockAdapter from "axios-mock-adapter";

const API = axios.create({
  baseURL: env.API,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

API.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    SID: "SID",
    LOCAL: "LOCAL",
    SOID: "SOID",
    MODEL: "MODEL",
    MAC: "MAC",
  };
  return config;
});

API.interceptors.response.use(undefined, (error: AxiosError) => {
  // 공통 오류 처리
  if (error.response) {
    console.log(error.response?.data);
  }
  return Promise.reject(error);
});

const mock = new MockAdapter(API);
mock.onGet("/v1/club/list/all").reply(200, {
  RESULT_CODE: 200,
  RESULT_MESSAGE: "",
  TOTAL: clubs.length,
  LIST: clubs,
});

mock.onGet("/v1/club/content/list").reply(200, {
  RESULT_CODE: 200,
  RESULT_MESSAGE: "",
  TOTAL: contents.length,
  LIST: contents,
});

export default API;

export const fetcher = <T>(url: string): Promise<T> =>
  API.get<T>(url).then(({ data }) => data);
