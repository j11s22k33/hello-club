directory.entryCode = Backbone.View.extend({
    getCode: function (b) {
        var self = this;
        if(App.historyApp.getHistoryArray()[0] != undefined && App.historyApp.getHistoryArray()[0].menuId != ""){
            return self.historyEntry();
        }else{
            return self.epgEntry(b);
        }
    },
    historyEntry: function () {
        var self = this;
        var historyData = App.historyApp.getHistoryArray()[0];

        switch(historyData.menuId){
            case "101": // homeMain
                if(App.vars.userEventCode == "02"){
                    return "02";
                } else{
                    if(historyData.envJson.channelMode){
                        return "23";
                    }else {
                        // "02" 배너_홈프로모션
                        // "04" 홈상단바로가기
                        // "23" 홈메뉴(카테고리)
                        return self.epgEntry();
                    }
                }
                break;

            case "900":
                return "07"; // 설정메뉴(카테고리)
                break;

            case "4041":
                // "12" 우방향_배너
                // "43" 우방향_카테고리
                return self.epgEntry();
                break;

            case "111":
                if(historyData.menuType == "MC0006"){
                    if(historyData.envJson.activeSection == "nav2Depth" && historyData.envJson.n1DepthIndex === 0){
                        return "44"; // 최근시청
                    } else if(historyData.envJson.activeSection == "myVodList0Preview" || historyData.envJson.activeSection == "myVodList1Preview") {
                        return "44"; // 최근시청
                    } else if (historyData.envJson.activeSection === "myVodList6Preview0"){
                        return "84"; // 받은 선물함
                    } else if (historyData.envJson.activeSection === "myVodList6Preview1"){
                        return "85"; // 보낸 선물함
                    } else{
                        return "14"; // 마이(카테고리)
                    }
                }else if(historyData.menuType == "MC0009"){
                    return "41"; // 앱&게임배너
                }else if(historyData.envJson.activeSection == "myVodList3") {
                    return "17" // 구매내역
                }else if ($('._chargeTrue').is(':visible')){
                    return "08" // 코인 바로가기
                }else if (historyData.menuType == "MC0001"||
                    historyData.menuType == "MC0011"||
                    historyData.menuType == "MC0013"){
                    return "27" // VOD 리스트
                }
                break;

            case "801":
                return "44"; // 최근시청채널
                break;

            case "802":
                return "44"; // 최근시청VOD
                break;

            case "806":
                return "71"; // 가입내역
                break;

            case "807":
                return "17"; // 구매내역
                break;

            case "703":
                return "19"; // 검색결과
                break;

            case "601":
            case "602":
            case "603":
            case "604":
                return "22"; // 편성표
                break;

            case "201":
            case "202":
            case "203":
            case "204":
                if(historyData.envJson.isBannerFocus == true){
                    return "01"; // 배너_리스트배너
                }
                return "27"; // VOD리스트
                break;

            case "401":
            case "402":
            case "403":
            case "404":
                if(historyData.envJson.activeSection.recommend == true){
                    return "54"; //연관콘텐츠(VOD상세)
                }else if(historyData.envJson.activeSection.button == true){
                    return "28"; // VOD상세
                }else if(historyData.envJson.activeSection.trailer == true){
                    return "68"; // VOD상세_예고편(썸네일)
                }else if(historyData.envJson.activeSection.staff == true){
                    return "69"; // VOD상세키워드
                }else if(historyData.envJson.activeSection.list == true){
                    return "67"; // VOD상세키워드
                }
                break;

            case "405":
                return "105"; // VOD상세 본편 미리보기
                break;

            case "4031":
            // case "4033":
                // "31" 좌방향_채널편성표
                return self.epgEntry();
                break;

            case "4041":
                // "36" 우방향(VOD시청중)
                return self.epgEntry();
                break;

            case "1601":
                return "41"; // 앱&게임배너
                break;

            case "4021":
            // case "4023":
                // "58" 연관콘텐츠(하방향키)
                return self.epgEntry();
                break;

            case "702":
                if(historyData.envJson.activeSection == "OSK"){
                    return "74";
                }else if(historyData.envJson.activeSection == "middleBar" && historyData.envJson.keyword.isRecntly == true){
                    return "99";
                }
                break;

            case "990":
                return "75";
                break;

            case "4011":
            // case "4012":
                // "101" 제안검색어_상방향키워드
                return self.epgEntry();
                break;

            case "704":
                return "110";
                break;

            case "11002":
                if(historyData.serviceType === "GIFT"){
                    return "107";
                }else if (historyData.serviceType === "NOTICE"){
                    return "106";
                }else if(historyData.serviceType === "EVENT"){
                    return "108";
                }else if (historyData.serviceType === "COUPON"){
                    return "111";
                }
            case "703": //검색 결과 화면
                return "19";
                break;
            case "705" : //영화 맞춤 검색
                return "110";
                break;
            case "814" : //보낸 선물함
                return "85";
                break;
            case "812" : //받은 선물함
                return "84";
                break;
            case "810" : //쿠폰 보관함
                return "21";
                break;
            case "805" : //스마트 추천
                return "51";
                break;
            case "5920" : // 모드변경 설정
                return "23";
                break;
            default:
                return null;
                break;
        }
    },
    epgEntry: function (b) {
        var self = this;
        var code = App.vars.userEventCode;
        if (b) {
            App.vars.userEventCode = null;
        }
        return code;
    }
});