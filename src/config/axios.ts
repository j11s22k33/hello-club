import env from "@/config/env";
import clubHome from "@/dummy/clubHome";
import clubs from "@/dummy/clubs";
import contents from "@/dummy/contents";
import contentsCateList from "@/dummy/contentsCateList";
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

function random(min:number,max:number) {
  return Math.floor(Math.random()*(max-min+1)+min);
}
// https://www.npmjs.com/package/axios-mock-adapter
const mock = new MockAdapter(API, { delayResponse: 300 });
mock.onGet("/v1/club/list/all").reply(200, {
  RESULT_CODE: 200,
  RESULT_MESSAGE: "",
  TOTAL: clubs.length,
  LIST: clubs,
});

mock.onGet("/v1/club/content/list").reply(config => {  
  const list = contents.createContents(random(0, 30), config.params.CATE_ID)
  return [200, {
    RESULT_CODE: 200,
    RESULT_MESSAGE: "",
    TOTAL: list.length,
    LIST: list,
  }]
});

mock.onGet("/v1/club/category/list").reply(200, {
  RESULT_CODE: 200,
  RESULT_MESSAGE: "",
  TOTAL: contentsCateList.length,
  LIST: contentsCateList,
});

mock.onGet("/clubpf/svc/club/info").reply(200, clubHome);

export default API;

export const fetcher = <T>(url: string): Promise<T> =>
  API.get<T>(url).then(({ data }) => data);
