import env from "@/config/env";
import clubHome from "@/dummy/clubHome";
import clubs from "@/dummy/clubs";
import contents from "@/dummy/contents";
import contentsCateList from "@/dummy/contentsCateList";
import notices from "@/dummy/notices";
import { NoticeListRequest } from "@/modules/notices/requests";
import Navigation from "@/utils/Navigation";
import axios, { AxiosError } from "axios";
import MockAdapter from "axios-mock-adapter";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ADMIN,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    Navigation.prevent = true;

    config.params = {
      ...config.params,
      domain: "CJHV",
      stbType: "ocap",
      subscribeId: "123123123123"
    };
    console.log(`[axios.intercenptors.request]`, config);
    return config;
  },
  (error) => {
    Navigation.prevent = false;

    console.log(
      "[axios.intercenptors.request.error]",
      error.message,
      error.config
    );
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    Navigation.prevent = false;

    console.log(
      `[axios.intercenptors.response]`,
      response.config,
      response.data
    );
    return response;
  },
  (error: AxiosError) => {
    Navigation.prevent = false;

    console.log(`[axios.intercenptors.response.error]`, error);
    if (error.config) {
      //
    } else if (error.config && error.response) {
      //
    } else {
      //
    }
    return Promise.reject(error);
  }
);

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default API;

export const fetcher = <T>(url: string): Promise<T> =>
  API.get<T>(url).then(({ data }) => data);



if(false) {
  // https://www.npmjs.com/package/axios-mock-adapter
  const mock = new MockAdapter(API, { delayResponse: 300 });
  mock.onGet("/v1/club/list/all").reply((config) => {
    const list = clubs.createClubs(random(30, 30), config.params);
    // const list = clubs.createClubs(random(0, 30), config.params)
    return [
      200,
      {
        RESULT_CODE: 200,
        RESULT_MESSAGE: "",
        TOTAL: list.length,
        LIST: list,
      },
    ];
  });
  
  mock.onGet("/v1/club/content/list").reply((config) => {
    const list = contents.createContents(random(30, 80), config.params);
    // const list = contents.createContents(random(0, 30), config.params)
    return [
      200,
      {
        RESULT_CODE: 200,
        RESULT_MESSAGE: "",
        TOTAL: list.length,
        LIST: list,
      },
    ];
  });
  
  mock.onGet("/v1/club/category/list").reply((config) => {
    return [
      200,
      {
        RESULT_CODE: 200,
        RESULT_MESSAGE: "",
        TOTAL: contentsCateList.length,
        LIST: contentsCateList,
      },
    ];
  });
  
  mock.onGet("/clubpf/svc/club/info").reply((config) => {
    return [200, clubHome];
  });
  
  mock.onGet("/uipf/v1/club/account/withdraw").reply((config) => {
    return [200, { result: "0000" }];
  });
  
  mock.onGet("/v1/club/account/auth").reply((config) => {
    return [200, { result: "0000" }];
  });
  
  mock.onGet("/v1/club/account/join").reply((config) => {
    return [200, { result: "0000" }];
  });
  
  mock.onGet("/uipf/v1/club/agree/list").reply((config) => {
    return [200, { C0101: "약관1", C0102: "약관2" }];
  });
  
  mock.onGet("/clubpf/svc/notice/list").reply((config) => {
    const request = config.params as NoticeListRequest;
    return [
      200,
      {
        topNotice: {
          id: 9999,
          title: `최상단 고정 공지사항 (categoryId: ${request.cateId})`,
          text:
            "이번 주 예배 안내입니다<br /><br />우리교회 본당은 450석이므로 주일 예배를 45명씩 4부로 나누어예배를 드릴 예정입니다. 대면 예배에 참여하시기 원하시는 분은아래 예배 안내를 참고해주시기 바랍니다.<br /><br />기저질환을 가지고 계시거나, 평상시 사람을 많이 만나시는 분들은실시간으로 진행되는 영상을 통해 예배를 드려주시기 바라며,코로나가 속히 종식이 되기를 함께 기도해주시기 바랍니다.<br /><br />상암교회 김봉수 목사 * 예배 안내 (실시간 온라인 예배)<br />주일 1부 예배 : 오전 8시 (1~6구역)<br />주일 2부 예배 : 오전 9시 30분 (7~12구역)<br />주일 3부 예배 : 오전 11시 (13~18구역)<br />주일 4부 예배 : 오후 12시 30분 (19~27구역)<br /><br />* 헌금 계좌 안내<br />[십일조, 감사, 주정, 선교헌금]<br />국민 598601-04-137958 (대한예수교장로회 상암교회)<br />[건축헌금]<br />농협 351-0090-3647-43 (상암교회)<br />",
          date: "2021.01.01",
          type: "TXT",
        },
        total: notices.length,
        data: notices.slice(request.offset, request.offset + request.limit),
      },
    ];
  });
  
  mock.onGet("/clubpf/svc/notice/cateList").reply((config) => {
    return [
      200,
      {
        total: 2,
        data: [
          { cateId: "1", cateName: "공지사항1" },
          { cateId: "2", cateName: "공지사항2" },
        ],
      },
    ];
  });
}
