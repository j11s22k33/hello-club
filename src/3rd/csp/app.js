/**
 * Todo
 * 1. 팝업 플러그인 연동
 * 2. 다이얼로그 플러그인 연동
 * 3. Data를 Json으로 변경
 * 4. 일자 및 카테고리 정렬 기능 추가
 * 5. moment 이용해 D-day 기능 추가
 * 6. 냉장고 채우기 페이지 publishing
 *
 */

var App = {
    view: {},
    model: {},
    collection: {},
    event: {},
    fn: {},
    util: {},
    provider : {}, //사업자 별로 분기처리 로직
    vars:{
        posterType : 'ct0', //VOD 탐색에서 사용하는 포스터 보기 / 리스트 보기 형태
        channelType : 'timeline', //편성표에서 사용하는 타임라인 보기 / 채널별 보기 형태
        oskText : ''//검색 검색어 텍스트
    },
    router : {},
    config : {},
    data : {
        stbData : null //셋탑박스 데이터
    },
    testHistory : {
      prevMenuId : ''
    }, //임시 히스토리
    btnModel : {
        footerBtn : {
            closeBtn : {
                btnList : [
                    {btnName : "닫기"}
                ]
            }
        }
    },
    provider : {}
};

/**
 * provider 세팅 old
 */
// $.extend(true, App, AppProvider);


/**
 * provider 세팅 old
 */
// $.extend(true, App, AppProvider);

/*
/!**
 * provider_ver0.3
 * App.provider 세팅
 *!/
// 1. so
$.extend(true, App.provider, provider.so);
// 2. service
App.provider.service = provider.service;
// 3. ip
$.extend(true, App.provider, provider.ip);
// 7. category
$.extend(true, App.provider, provider.category);
// 8. text
$.extend(true, App.provider, provider.text);
// 9. image
$.extend(true, App.provider, provider.image.image);
$.extend(true, App.provider, provider.image.srcPath);
$.extend(true, App.provider, provider.image.defaultImage);

/!**
 * provider_ver0.3
 * App.vars 세팅
 *!/
// 4. stb
/!*for (var i in provider.stb) {
    if (provider.stb.hasOwnProperty(i)) {
        console.log(i, provider.stb[i]);
        provider.stb[i] = provider.stb[i].split(",");
    }
}*!/
$.extend(true, App.vars, provider.stb);

// 5. channel
/!*for (var j in provider.channel) {
    if (provider.channel.hasOwnProperty(j)) {
        console.log(j, provider.channel[j]);
        provider.channel[j] = provider.channel[j].split(",");
    }
}*!/
$.extend(true, App.vars, provider.channel);

// 6. product
/!*for (var k in provider.product) {
    if (provider.product.hasOwnProperty(k)) {
        console.log(k, provider.product[k]);
        provider.product[k] = provider.product[k].split(",");
    }
}*!/
$.extend(true, App.vars, provider.product);*/

/**
 * provider default cjh로 설정
 */
App.provider = providerSO.cjh;
//App.provider = providerSO.hcn_testbed; 

var directory = {};

var router = null;

/**
 * var xmlAsStr = x2js.json2xml_str( jsonObj );
 * var jsonObj = x2js.xml_str2json( xmlText );
 */
var X2JS = new X2JS();


$(function () {
    App.router = new directory.Router();

    Backbone.history.start();
});
