var App = App || {};

App.api = App.api || {};

App.api.csApi = (function () {

    var isStopApp = false;

    // app 객체는 CS 환경에서만 존재하므로 방어코드가 필요함
    if (typeof app != 'undefined' && !window.parent.webc) {
        // 응답콜백은 App.에서 로드한 js파일에 선언되어 있어야 함
        app.setMessageCallback('ContainerToApp', function (name, args) {
            // 모든 응답이 이 함수로 들어오기 때문에 별도로 콜백 핸들러를 구현하여 처리하길 권장함
            console.log('backbone app.setMessageCallback ::');
            App.api.csApi.response(args[0]);
        });
    }

    String.prototype.bool = function () {
        return (/^true$/i).test(this);
    };


    /**
     * AppToContainer
     *
     *   CS로 커맨드를 요청할 때 사용함(app.sendMessage)
     *
     */
    function request(xmlString) {
        console.time('duration_getThumbnail');
        if (window.DOMParser) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlString, "text/xml");
            var $xmlDoc = $(xmlDoc);

            if ($xmlDoc.find("parsererror").text()) {
                console.warn("xml 파싱 에러" + $xmlDoc.find("parsererror").text());
                console.log('[CSC send error] xmlString :' + xmlString);
                return;
            }

        }

        var xmlArray = [];

        try {
            console.log('[CSC send] xmlString :' + xmlString);
            if (window.location.hash == "#pvrLogTest") {
                $('._request').text(xmlString);
            }
        } catch (e) {
            console.log('[CSC ERROR] xmlString :' + e.message);
        }

        xmlArray.push(xmlString);

        if(window.parent.webc){
            App.api.css.sendMessage(xmlArray)
        }else if(typeof app != 'undefined'){
            app.sendMessage('AppToContainer', xmlArray);
        }
    }


    // function SetSessionTimeoutStopApp(time) {
    //     var timer;
    //     if (time == undefined) {
    //         timer = 320000
    //     } else {
    //         timer = time
    //     }
    //     console.log("%c SetSessionTimeoutStopApp : " + time, "color: #ff00ff; background-color : #000; font-size: 14px");
    //     clearTimeout(App.vars.timer.SetSessionTimeout);
    //     App.vars.timer.SetSessionTimeout = setTimeout(function () {
    //         App.api.fn.stopApp();
    //     },timer);
    // }


    /**
     * ContainerToApp 응답 콜백 핸들러
     *
     *   sendMessage에 대한 응답 콜백 setMessageCallback 에서 호출하는 핸들러
     *
     */
    function response(data) {
        App.config.tempStartXml = data;
        var xmlDoc;
        console.timeEnd('duration_getThumbnail');
        if (window.DOMParser) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(data, "text/xml");
        }

        if ($(xmlDoc).find("parsererror").text()) {
            console.warn("xml 파싱 에러" + $(xmlDoc).find("parsererror").text());
            console.log('[CSC receive error] xmlString :' + data);
            return;
        }

        try {
            console.log('[CSC receive] data :' + data);
            if (window.location.hash == "#pvrLogTest") {
                $('._response').text(data);
            }
        } catch (e) {
            console.log('[CSC ERROR] data :' + e.message);
        }

        var $xmlDoc = $(xmlDoc);

        // 개선 #1458 [푸른방송] 이코노미 상품 가입자 키즈모드 전환 에러 현상
        // <TYPE>information</TYPE> 에 대한 방어코드 추가
        if($xmlDoc.find('TYPE').text() === 'information'){
            return;
        }

        //소문자처리
        var command = $xmlDoc.find("COMMAND").text().toLowerCase();
        var contents = $xmlDoc.find("CONTENTS").text().toLowerCase();
        console.log("command 1-1: " + command);
        console.log("contents 1-2: " + contents);

        switch (command) {
            case 'startapp' :

                // 개선 #1460 신규 EPG 대응 setKeyFilter 추가
                // MainApp UI에서 startApp 시 이전키에 대한 keyFilter 로직 추가
                if(channelMode === false){
                    App.api.csApi.setKeyFilter({
                        DATA: {
                            previousKeyUse: 'on',
                            preChannelKeyUse: 'off'
                        }
                    });
                }

                App.api.csApi.requestStartApp($xmlDoc, xmlDoc);

                /**
                 * 디바이스 정보 불러오기
                 */
                App.api.fn.getGuideDeviceInfo({
                    callback: function (data) {
                        for (var key in data) {
                            App.config.settopInfo[key] = data[key];
                        }
                    }
                });

                /**
                 * SetSessionTimeout 설정
                 */
                var widget = $xmlDoc.find('isWidgetMode').text();
                console.log("===== isWidgetMode 1===== : " + widget);

                if ($xmlDoc.find('isWidgetMode').text() == "true"){
                    //위젯 모드인 경우 세션타임아웃 설정을 하지 않도록 한다.
                    console.log("===== isWidgetMode 2===== ");
                    App.vars.SetSessionTimeout = "";
                    App.api.csApi.SetSessionTimeout("10800");
                } else {
                    if (
                        $xmlDoc.find("launchInfo historyList history menuId").text() == "11003" ||
                        $xmlDoc.find("launchInfo historyList history menuId").text() == "12001" ||
                        $xmlDoc.find("launchInfo historyList history menuId").text() == "12002" ||
                        $xmlDoc.find("launchInfo historyList history menuId").text() == "13000"
                    ) {
                        // 13000 cug 전용채널 추가
                        App.vars.SetSessionTimeout = "";
                        App.api.csApi.SetSessionTimeout("10800");
                    } else if (
                        $xmlDoc.find("launchInfo historyList history menuId").text() == "505" ||
                        $xmlDoc.find("launchInfo historyList history menuId").text() == "508" ||
                        $xmlDoc.find("launchInfo historyList history menuId").text() == "509" ||
                        $xmlDoc.find("launchInfo historyList history menuId").text() == "10001" ||
                        $xmlDoc.find("launchInfo historyList history menuId").text() == "10002" ||
                        $xmlDoc.find("launchInfo historyList history menuId").text() == "804" ||
                        $xmlDoc.find("launchInfo historyList history menuId").text() == "iFrameAdult"
                    ) {
                        /**
                         * Pause 상태
                         */
                        App.vars.SetSessionTimeout = "";
                        App.api.csApi.SetSessionTimeout("320");
                    } else if (
                        $xmlDoc.find("launchInfo historyList history menuId").text() == "6101" ||
                        $xmlDoc.find("launchInfo historyList history menuId").text() == "6102"
                    ) {
                        /**
                         * EPG iframe 상태
                         */
                        App.vars.SetSessionTimeout = "";
                        App.api.csApi.SetSessionTimeout("10");
                    } else if (
                        $xmlDoc.find("launchInfo historyList history menuId").text() == "6103"
                    ) {
                        /**
                         * EPG iframe 상태
                         */
                        App.vars.SetSessionTimeout = "";
                        App.api.csApi.SetSessionTimeout("320");
                    } else if ($xmlDoc.find('homeKey').text() == "true" || $xmlDoc.find('homeKey').text() == true) {
                        if (
                            $xmlDoc.find('channelReset').text() == "" ||
                            $xmlDoc.find('channelReset').text() == "false" ||
                            $xmlDoc.find('channelReset').text() == false) {
                            // 2.	Home : True  & Channel : False
                            // 기본 사용자가 홈키로 진입하는 형태
                            // 홈키로 진입시에는 무조건 320초

                            /**
                             * 시나리오변경 : 2018-10-30
                             * 10분 후 stopApp by 플기팀 김소희님
                             */
                            App.vars.SetSessionTimeout = "stopApp";
                            App.api.csApi.SetSessionTimeout(App.provider.policy.sessionTimeoutDefault);
                        } else {
                            // 1.	Home : True  & Channel : True
                            // 이런 경우는 없지만 방어로직으로 설정

                            /**
                             * 시나리오변경 : 2018-10-30
                             * 10분 후 stopApp by 플기팀 김소희님
                             */
                            App.vars.SetSessionTimeout = "stopApp";
                            App.api.csApi.SetSessionTimeout(App.provider.policy.sessionTimeoutDefault);
                        }
                    } else if ($xmlDoc.find('homeKey').text() == "") {
                        App.vars.SetSessionTimeout = "stopApp"
                        App.api.csApi.SetSessionTimeout(App.provider.policy.sessionTimeoutDefault);
                    } else if ($xmlDoc.find('homeKey').text() == "false" || $xmlDoc.find('homeKey').text() == false) {
                        if (
                            // 3.	Home : False  & Channel : True
                            $xmlDoc.find('channelReset').text() == "true" ||
                            $xmlDoc.find('channelReset').text() == true) {
                            //홈키 유무에 따라서 10초 아웃
                            App.api.csApi.SetSessionTimeout("10");
                            //todo : 통계 자동진입 코드 설정
                            // App.api.csApi.stopApp()

                        } else if (
                            //4.	Home : False  & Channel : False
                            $xmlDoc.find('channelReset').text() != "" && ($xmlDoc.find('channelReset').text() == "false" || $xmlDoc.find('channelReset').text() == false)) {
                            //인스턴트로 홈에게 접근하는 경우 10초 아웃
                            App.vars.SetSessionTimeout = "stopApp"
                            console.log("%c App.vars.SetSessionTimeout", "color: #ff00ff; background-color : #000; font-size: 14px");
                            //품질 평가 웜부팅 속도 개선 (대상 셋톱박스 : 545, 3300)
                            if (App.fn.globalUtil.is("ISCJH")) {
                                if(App.config.settopInfo.stbModel === "GXCJ545CL" || App.config.settopInfo.stbModel === "UC3300"){
                                    App.api.csApi.SetSessionTimeout("5");
                                } else {
                                    App.api.csApi.SetSessionTimeout("10");
                                }
                            } else {
                                App.api.csApi.SetSessionTimeout("10");
                            }
                        }
                    } else {
                        if (channelMode) {
                            App.vars.SetSessionTimeout = "";
                        } else {
                            App.vars.SetSessionTimeout = "stopApp";
                        }
                        console.log("%c App.vars.SetSessionTimeout", "color: #ff00ff; background-color : #000; font-size: 14px");
                        App.api.csApi.SetSessionTimeout(App.provider.policy.sessionTimeoutDefault);
                    }
                }

                if ($xmlDoc.find("launchInfo historyList history menuId").text() == "12002") {
                    App.api.csApi.homeShoppingKeyFilter();
                }
                break;
            case 'get' :
                switch (contents) {
                    case "deviceinfo" :
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        App.api.model.csc.getDeviceInfoCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.csc.getDeviceInfoCallback = function () {
                        };
                        break;
                    case "systeminfo" :
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        App.api.model.csc.getSystemInfoCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.csc.getSystemInfoCallback = function () {
                        };
                        break;

                    case "historyall" :
                        // 세션 타임아웃시 전체 히스토리 전달
                        if(channelMode === true){
                            //채널 모드시 3시간 세션 타임아웃일 경우, 아무동작 안하도록 함
                        }else {
                            if(App.fn.globalUtil.is("WIDGET")){
                                //위젯 모드에서 3시간 세션 타임아웃일 경우, 아무동작 안하도록 함
                            }else{
                                // 종료될시, 영상 리사이징 원상 복구 함
                                App.api.csApi.setAVResize(0, 0, 1280, 720);
                            }
                        }

                        if (App.vars.SetSessionTimeout == "stopApp") {
                            App.api.fn.stopApp();
                        } else {
                            App.api.csApi.setHistoryAll();
                        }
                        break;

                    case "filedata" :
                        // App.view.channelVodDirectVod.directVod = $xmlDoc.find("directVod").text().split(',');
                        console.log('filedata window.location.hash ', window.location.hash);

                        if (window.location.hash == "#cugChannelLtype") {
                            // cug Ltype
                            App.view.cugChannelLtype.cugVod = $xmlDoc.find("cugVod").text();
                            App.view.cugChannelLtype.startPip();
                        } else if (window.location.hash == "#cugChannelVod") {
                            // cug vod type
                            App.view.cugChannelVod.cugVod = $xmlDoc.find("cugVod").text();
                            App.view.cugChannelVod.startPip();
                        } else {
                            App.view.channelVodDirectVod.directVod = $xmlDoc.find("directVod").text();
                            // if($xmlDoc.find("isEOF").text() == 'false' && $xmlDoc.find("vodwatching").text() == 'true'){
                            //     App.view.channelVodDirectVod.setLaunchCsApp();
                            // }else{
                            App.view.channelVodDirectVod.setNextWatchId();
                            // }
                        }

                        break;

                    case "vodstatus" :
                        var hash = window.location.hash;
                        var splitHash = hash.split('#')[1];
                        var assetId = "";
                        if (splitHash == "channelVodNumVodPlaySeries" || splitHash == "channelVodNumVodBgSeries") {
                            assetId = $xmlDoc.find("assetId").text();
                        }
                        App.vars.numVodStatus = {
                            assetId: assetId,
                            isEOF: $xmlDoc.find("isEOF").text() == "true" ? true : false,
                            vodwatching: $xmlDoc.find("vodwatching").text() == "true" ? true : false,
                            nextWatchId: $xmlDoc.find("nextWatchId").text(),
                            totalDuration: parseInt($xmlDoc.find("totalDuration").text()),
                            currentDuration: parseInt($xmlDoc.find("currentDuration").text()),
                            sourceId: App.vars.sourceId
                        };
                        App.view[splitHash].render(App.vars.numVodStatus);
                        break;
                    case "bookinglist" :
                        App.vars.bookingList = $xmlDoc.find("booking").text();
                        if (window.location.hash == "#pageSearchResult") {
                            App.view.pageSearchResult.setBookingMark()
                        } else if (window.location.hash == "#channelAllProgram") {
                            App.view.channelAllProgram.setBookingMark();
                        }

                        break;

                    // case "pinlock" :
                    //     if ($xmlDoc.find("isLocked").text() == true || $xmlDoc.find("isLocked").text() == "true") {
                    //         App.vars.checkPinLock = true;
                    //         App.vars.pinLockValue = true;
                    //     } else {
                    //         App.vars.checkPinLock = true;
                    //         App.vars.pinLockValue = false;
                    //     }
                    //     App.router.callMenu({
                    //         menuId: "10001"
                    //     });
                    //     break;
                    case "scheduleitems" : // [PVR] 4. Schedule Item List 요청 (for 리스트 화면)
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        var jsonData = X2JS.xml_str2json(xmlText).INTERFACE.DATA;
                        jsonData.scheduleItem = [];
                        for (var i = 0; i < jsonData.count; i++) {
                            var splitJsonData = [];
                            var returnData = {};
                            splitJsonData = jsonData['scheduleItem_' + i].split("|");
                            // returnData.scheduleItemId = splitJsonData[0];
                            // returnData.scheduleItemType = splitJsonData[1];
                            // returnData.scheduleItemChSrcId = splitJsonData[2];
                            // returnData.scheduleItemChName = splitJsonData[3];
                            // returnData.scheduleItemChNumber = splitJsonData[4];
                            // returnData.scheduleItemStartSec = splitJsonData[5];
                            // returnData.scheduleItemEndSec = splitJsonData[6];
                            // returnData.scheduleItemRepeatWeek = splitJsonData[7];
                            // returnData.scheduleItemRating = App.fn.pvr.convertRatingInverse(splitJsonData[8]);
                            // returnData.scheduleItemReserveState = splitJsonData[9];
                            // returnData.scheduleItemExcludeProgramIds = splitJsonData[10];
                            // returnData.program = {};
                            // returnData.program.startTimeSec = splitJsonData[11];
                            // returnData.program.durationSec = splitJsonData[12];
                            // returnData.program.eventId = splitJsonData[13];
                            // returnData.program.srcId = splitJsonData[14];
                            // returnData.program.seriesKey = splitJsonData[15];
                            // returnData.program.rating = App.fn.pvr.convertRatingInverse(splitJsonData[16]);
                            // returnData.program.title = splitJsonData[17];

                            returnData.scheduleItemId = splitJsonData[0];
                            returnData.scheduleItemType = splitJsonData[1];
                            returnData.scheduleItemChSrcId = splitJsonData[2];
                            returnData.scheduleItemChName = splitJsonData[3];
                            returnData.scheduleItemChNumber = splitJsonData[4];
                            returnData.scheduleItemStartSec = splitJsonData[5];
                            returnData.scheduleItemEndSec = splitJsonData[6];
                            returnData.scheduleItemNextStartSec = splitJsonData[7];
                            returnData.scheduleItemNextEndSec = splitJsonData[8];

                            returnData.scheduleItemRepeatWeek = splitJsonData[12];
                            returnData.scheduleItemRating = App.fn.pvr.convertRatingInverse(splitJsonData[13]);
                            returnData.scheduleItemReserveState = splitJsonData[14];
                            returnData.scheduleItemExcludeProgramIds = splitJsonData[15];

                            returnData.program = {};
                            if (returnData.scheduleItemType == "16" || returnData.scheduleItemType == "32" || (returnData.scheduleItemType == "64" && returnData.scheduleItemRepeatWeek.indexOf("1") === -1)) {
                                returnData.program.startTimeSec = splitJsonData[7];
                                returnData.program.endTimeSec = splitJsonData[8];
                                returnData.program.durationSec = Math.abs((parseInt(splitJsonData[8]) - parseInt(splitJsonData[7]))).toString();
                            } else if (returnData.scheduleItemType == "128" || returnData.scheduleItemType == "64") {
                                returnData.program.startTimeSec = moment(splitJsonData[5], "HH:mm").format('X');
                                returnData.program.endTimeSec = moment(splitJsonData[6], "HH:mm").format('X');
                                returnData.program.durationSec = Math.abs((moment(splitJsonData[6], "HH:mm").format('X') - moment(splitJsonData[5], "HH:mm").format('X'))).toString();
                            }
                            returnData.program.title = splitJsonData[9];
                            returnData.program.eventId = splitJsonData[10];
                            returnData.program.seriesKey = splitJsonData[11];
                            returnData.program.srcId = splitJsonData[2];
                            returnData.program.rating = App.fn.pvr.convertRatingInverse(splitJsonData[13]);

                            jsonData.scheduleItem.push(returnData);
                            delete jsonData['scheduleItem_' + i];
                        }
                        console.log(jsonData);
                        App.api.model.pvr.getScheduleItemsCallback(jsonData);
                        App.api.model.pvr.getScheduleItemsCallback = function () {
                        };
                        break;
                    case "scheduleitem" : // [PVR] 5. Schedule Item 요청 (by 프로그램 정보)
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        App.api.model.pvr.getScheduleItemCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.pvr.getScheduleItemCallback = function () {
                        };
                        break;
                    case "isscheduled" : // [PVR] 6. 예약 녹화 여부 확인 (by Series Key)
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        App.api.model.pvr.getIsScheduledCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.pvr.getIsScheduledCallback = function () {
                        };
                        break;
                    case "recordings" : // [PVR] 7. 녹화물 정보 요청
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        var jsonData = X2JS.xml_str2json(xmlText).INTERFACE.DATA;
                        jsonData.recording = [];
                        for (var i = 0; i < jsonData.count; i++) {
                            var splitJsonData = [];
                            var returnData = {};
                            splitJsonData = jsonData['recording_' + i].split("|");
                            returnData.uri = splitJsonData[0];
                            returnData.scheduleItemId = splitJsonData[1];
                            returnData.recordingType = splitJsonData[2];
                            returnData.chSrcId = splitJsonData[3];
                            returnData.chName = splitJsonData[4];
                            returnData.chNumber = splitJsonData[5];
                            returnData.repeatWeek = splitJsonData[6];
                            returnData.rating = App.fn.pvr.convertRatingInverse(splitJsonData[7]);
                            returnData.state = splitJsonData[8];
                            returnData.size = splitJsonData[9];
                            returnData.lastViewTime = splitJsonData[10];
                            returnData.expirationTime = splitJsonData[11];
                            returnData.thumbNailUri = splitJsonData[12];
                            returnData.isLocked = splitJsonData[13];
                            returnData.isHide = splitJsonData[14];
                            returnData.title = splitJsonData[15];

                            // update ver
                            returnData.groupTitle = splitJsonData[16];
                            returnData.startTimeSec = splitJsonData[17];
                            returnData.durationSec = splitJsonData[18];
                            returnData.mediaDurationSec = splitJsonData[19];
                            returnData.endReason = splitJsonData[20];
                            returnData.childCount = splitJsonData[21];

                            /**
                             * 전체리스트 조회 이고 시리즈 녹화이면 title 대신 groupTitle
                             */
                            if (App.vars.reqType === "1" && returnData.recordingType === "128") {
                                returnData.title = returnData.groupTitle;
                            }
                            // update ver

                            // returnData.startTimeSec = splitJsonData[16];
                            // returnData.durationSec = splitJsonData[17];
                            // returnData.mediaDurationSec = splitJsonData[18];
                            // returnData.endReason = splitJsonData[19];
                            // returnData.childCount = splitJsonData[20];

                            jsonData.recording.push(returnData);
                            delete jsonData['recording_' + i];
                        }

                        // App.api.model.pvr['getRecordingsObj' + App.vars.reqType] = jsonData;
                        //
                        var callbackData = {};
                        // $.extend(callbackData, App.api.model.pvr['getRecordingsObj' + App.vars.reqType]);

                        callbackData = jsonData;
                        callbackData.count = jsonData.totalCount;

                        // if(App.vars.reqType !== "2" && App.vars.isPreview == false){
                        /**
                         * 999채널 복구 시 메인앱에서 삭제한 컨텐츠가 있는 경우
                         * 리스트 이동 시 무조건 첫번째 페이지의 첫번째 컨텐츠로 가도록 수정 (방어로직)
                         */
                        if (App.vars.historyBack === true) {
                            if (App.view.recordingListChannel.envJson.totalList * 1 !== jsonData.totalCount * 1) {
                                callbackData.toFirstPage = true;
                            }
                        }
                        //     callbackData.recording = callbackData.recording.slice(App.vars.offset, App.vars.offset + App.vars.limit);
                        // }

                        console.log(callbackData);
                        App.api.model.pvr.getRecordingsCallback(callbackData);
                        App.api.model.pvr.getRecordingsCallback = function () {
                        };
                        App.vars.offset = 0;
                        App.vars.limit = 0;
                        App.vars.historyBack = false;
                        break;
                    case "thumbnail" : // [PVR] 9. Thumbnail 요청
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        var jsonData = X2JS.xml_str2json(xmlText).INTERFACE.DATA;
                        var thumbnailObjLength = Object.keys(jsonData).length;
                        jsonData.thumbnail = [];

                        App.fn.globalUtil = new directory.globalUtil();
                        if (App.fn.globalUtil.is("PVROCAP")) {
                            // length에서 width, height 빼기
                            thumbnailObjLength -= 2;
                            // OCAP
                            for (var i = 0; i < thumbnailObjLength; i++) {
                                var splitJsonData = [];
                                var returnData = {};
                                splitJsonData = jsonData['Thumbnail_' + i].split("^");
                                returnData.thumbNailUri = splitJsonData[0];
                                // returnData.thumbnailRgbArray = [];
                                // if(splitJsonData[1]){
                                //     returnData.thumbnailRgbArray = splitJsonData[1].split(",");
                                // }
                                returnData.thumbnailRgbArray = splitJsonData[1];

                                jsonData.thumbnail.push(returnData);
                                delete jsonData['Thumbnail_' + i];
                            }
                            jsonData.size = {
                                width: jsonData['width'],
                                height: jsonData['height']
                            };
                        } else {
                            // RED
                            for (var i = 0; i < thumbnailObjLength; i++) {
                                var splitJsonData = [];
                                var returnData = {};
                                splitJsonData = jsonData['Thumbnail_' + i].split("^");
                                returnData.thumbNailUri = splitJsonData[0];
                                returnData.thumbnailBase64 = "data:image/png;base64," + splitJsonData[1];
                                jsonData.thumbnail.push(returnData);
                                delete jsonData['Thumbnail_' + i];
                            }
                        }

                        console.log(jsonData);
                        App.api.model.pvr.getThumbnailCallback(jsonData);
                        if (App.vars.resetCallback) {
                            App.api.model.pvr.getThumbnailCallback = function () {
                            };
                        }
                        break;
                    case "existrecordingprogram": // [PVR] 15. 현재 녹화중인 Program 유무 확인
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        App.api.model.pvr.getExistRecordingProgramCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.pvr.getExistRecordingProgramCallback = function () {
                        };
                        break;
                    case "isavailablehdd" : // [PVR] 20. HDD 사용 가능 여부 체크
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        App.api.model.pvr.getIsAvailableHddCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.pvr.getIsAvailableHddCallback = function () {
                        };
                        break;
                    case "storageinfo" : // [PVR] 21. HDD 정보 요청
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        clearTimeout(App.vars.timer.storageInfo);

                        App.api.model.pvr.getStorageInfoCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.pvr.getStorageInfoCallback = function () {
                        };
                        break;

                    case "tvapplist" : // tv앱 리스트 요청
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        var jsonData = X2JS.xml_str2json(xmlText).INTERFACE.DATA;


                        splitJsonData = jsonData.tvApp.split("|");

                        jsonData.tvAppList = [];

                        for (var i = 0; i < splitJsonData.length; i++) {
                            var oSplitJsonData = [];
                            var returnData = {};

                            oSplitJsonData = splitJsonData[i].split("^");

                            returnData.url = oSplitJsonData[0];
                            returnData.title = oSplitJsonData[1];
                            jsonData.tvAppList.push(returnData);

                        }
                        console.log(jsonData);
                        App.api.model.app.getTvAppListCallback(jsonData);
                        App.api.model.app.getTvAppListCallback = function () {
                        };
                        break;

                    case "tvappicon" : // tv앱 아이콘 요청
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        App.api.model.app.getTvAppIconCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.app.getTvAppIconCallback = function () {
                        };
                        break;

                    case "externalstoragelist": // 개인미디어 외장 디바이스 조회
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        var jsonData = X2JS.xml_str2json(xmlText).INTERFACE.DATA;
                        var ExternalStorage = [];
                        if (jsonData.externalStorage != undefined) {
                            var splitJsonData = [];
                            splitJsonData = jsonData.externalStorage.split("|");
                            for (var i = 0; i < splitJsonData.length; i++) {
                                var splitReturnJsonData = splitJsonData[i].split("^");
                                var returnData = {};
                                returnData.path = splitReturnJsonData[0];
                                returnData.displayName = splitReturnJsonData[1];
                                if (returnData.path.indexOf("media_rw") > -1) {
                                    ExternalStorage.push(returnData);
                                }
                            }
                        }
                        jsonData = {ExternalStorage: ExternalStorage};
                        console.log(jsonData);
                        App.api.model.app.externalStorageListCallback(jsonData);
                        App.api.model.app.externalStorageListCallback = function () {
                        };
                        break;

                    case "recommendlist": // Android Tv Recommend 리스트 조회
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);
                        var jsonData = X2JS.xml_str2json(xmlText).INTERFACE.DATA;
                        var totalCount = jsonData.totalCount;

                        jsonData.recommendList = [];

                        for (var i = 0; i < totalCount; i++) {
                            var oSplitJsonData = [];
                            var returnData = {};

                            oSplitJsonData = jsonData['recommend_' + i].split("^");

                            returnData.key = oSplitJsonData[0]; // ID
                            returnData.title = oSplitJsonData[1]; // 제목
                            returnData.subtitle = oSplitJsonData[2]; // 하위제목
                            returnData.width = oSplitJsonData[3]; // thumbnail width
                            returnData.height = oSplitJsonData[4]; // thumbnail height
                            returnData.progress_max = oSplitJsonData[5]; // 전체 시간
                            returnData.progress = oSplitJsonData[6]; // 진행시간
                            returnData.group = oSplitJsonData[7]; // grouping 정보

                            jsonData.recommendList.push(returnData);
                        }
                        console.log(jsonData);
                        App.api.model.app.getRecommendListCallback(jsonData);
                        App.api.model.app.getRecommendListCallback = function () {
                        };
                        break;

                    case "recommendthumbnail":    // Android Tv Recommend Thumbnail
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);
                        var jsonData = X2JS.xml_str2json(xmlText).INTERFACE.DATA;
                        var totalCount = Object.keys(jsonData).length;

                        jsonData.iconData = [];

                        for (var i = 0; i < totalCount; i++) {
                            var oSplitJsonData = [];
                            var returnData = {};

                            oSplitJsonData = jsonData['Thumbnail_' + i].split("^");
                            returnData.key = oSplitJsonData[0]; // key
                            returnData.image = oSplitJsonData[1]; // image
                            jsonData.iconData.push(returnData);
                        }

                        App.api.model.app.getRecommendThumbnailCallback(jsonData);
                        // App.api.model.app.getRecommendThumbnailCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.app.getRecommendThumbnailCallback = function () {
                        };
                        break;
                }
                break;

            case 'check' :
                var result = $xmlDoc.find("result").text();
                if (contents == "purchasepin") {
                    App.api.model.csc.purchasePin(result);
                } else if (contents == "userpin") {
                    App.api.model.csc.adultPincodeCheck(result);
                } else if (contents == "StartedVux") {
                    /**
                     * 스크린 컨텍스트
                     * VUX가 실행중인지 여부 파악
                     */
                    if (App.fn.globalUtil.is("VOICE") == true) {
                        if (result == "true") {
                            // VUX 실행중일 경우 VUX 시작
                            Voiceable.isSessionStarted();
                        }
                    }
                    break;
                }
                break;
            case 'iniciate' :
                switch (contents) {
                    case "system" :
                    case "System" :
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);
                        App.api.model.csc.IniciateSystemCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA.result);
                        App.api.model.csc.IniciateSystemCallback = function () {
                        };
                        break;
                }
                break;
            case 'notifykey' :
                var value = $xmlDoc.find("value").text();
                var e = $.Event("keydown");
                e.which = value;
                e.keyCode = value;
                $("body").trigger(e);

                if (window.location.hash != "#homeShopping") {
                    var notifykey = {
                        TYPE: "response",
                        COMMAND: "NotifyKey",
                        CONTENTS: "",
                        DATA: {
                            result: "true"
                        }
                    };
                    var xmlString = X2JS.json2xml_str(notifykey);
                    xmlString = "<INTERFACE version='3'>" + xmlString + "</INTERFACE>";
                    setTimeout(function () {
                        App.api.csApi.request(xmlString);
                    }, 50);

                    if (e.keyCode == 191) {
                        if(App.fn.globalUtil.is("WIDGET")){
                            //
                            return;
                        }
                        /**
                         * 1. stopVod
                         * 2. stopApp : exit
                         */
                        console.log('csApi RED ', App.fn.globalUtil.is("RED"));
                        console.log('csApi SMART ', App.fn.globalUtil.is("SMART"));
                        if (App.fn.globalUtil.is("RED") || App.fn.globalUtil.is("SMART") || App.fn.globalUtil.is("UHD2")) {
                            if (App.vars.vodDetailPIPPlay ||
                                (window.location.hash == "#vodPlayStopPopup" && App.view.vodPlayStopPopup.menuId == "505") ||
                                (window.location.hash == "#vodPlayStopPopup" && App.view.vodPlayStopPopup.menuId == "508") ||
                                (window.location.hash == "#vodPlayStopPopup" && App.view.vodPlayStopPopup.menuId == "504") ||
                                (window.location.hash == "#vodPlayStopPopup" && App.view.vodPlayStopPopup.menuId == "509") ||
                                window.location.hash == "#eventApplyPopup" || window.location.hash == "#eventResult" ||
                                window.location.hash == "#eventEnter") {
                                var stopApp = {
                                    TYPE: "notify",
                                    COMMAND: "StopApp",
                                    CONTENTS: "ExitWithLiveTune",
                                    DATA: {}
                                };
                            }
                            // else if(window.location.hash == "#cugChannelLtype" || window.location.hash == "#cugTempleteDetail"){
                            //     //L바 화면에서 나가기 키 예외 처리
                            //     //나가기 키 처리는 해당 화면에서 자체 처리
                            //     return;
                            // }
                            else {
                                var stopApp = {
                                    TYPE: "notify",
                                    COMMAND: "StopApp",
                                    CONTENTS: "Exit",
                                    DATA: {}
                                };
                            }
                        } else {
                            console.log('App.vars.vodDetailPIPPlay ', App.vars.vodDetailPIPPlay);
                            console.log('window.location.hash ', window.location.hash);

                            if (App.vars.vodDetailPIPPlay) {
                                var stopApp = {
                                    TYPE: "notify",
                                    COMMAND: "StopApp",
                                    CONTENTS: "ExitWithLiveTune",
                                    DATA: {}
                                };
                            } else if(window.location.hash == "#cugChannelLtype" || window.location.hash == "#cugTempleteDetail"){
                                //L바 화면에서 나가기 키 예외 처리
                                //나가기 키 처리는 해당 화면에서 자체 처리
                                return;
                            } else {
                                var stopApp = {
                                    TYPE: "notify",
                                    COMMAND: "StopApp",
                                    CONTENTS: "Exit",
                                    DATA: {}
                                };
                            }
                        }

                        var xmlString2 = X2JS.json2xml_str(stopApp);
                        xmlString2 = "<INTERFACE version='3'>" + xmlString2 + "</INTERFACE>";
                        App.api.csApi.request(xmlString2);
                    }
                }
                break;
            case 'launchcsapp' : // LaunchCsApp 처리한다. 20170914 add by jjhan //채널

                if (!channelMode) {
                    /**
                     * 메인 앱 전용 소스
                     */
                    var appId = $xmlDoc.find("launchInfo>appId").text();
                    var subAppId = $xmlDoc.find("launchInfo>subAppId").text();
                    // console.log('appId    -->'+appId);
                    // console.log('subAppId -->'+subAppId);
                    $.ajax({
                        // url: "../../gateway/applist-live-appid-"+appId+".json",
                        url: "../../gateway_json/applist-live-v1.0.json", // 20170919 modified by jjhan
                        type: 'GET',
                        dataType: "json",
                        success: function (jdata, errorString, code) {
                            var jdata = jdata;
                            var flag = false;
                            for (var type in jdata) {
                                if (jdata.hasOwnProperty(type)) {
                                    if (jdata[type].appId == appId && jdata[type].subAppId == subAppId) {
                                        // console.log('appId    -->'+appId);
                                        App.api.csApi.launchCSAppResponse({result: "true"});
                                        setTimeout(function () {
                                            location.href = jdata[type].url;
                                        }, 500);
                                        flag = true;
                                        break;
                                    }
                                }
                            }
                            if (!flag) {
                                //$(".ui-page-active").empty();
                                //$.mobile.changePage("#pageDefault");
                                //App.error.popup({logType : "APP", errorType : "LOAD_ERROR", errorString : "정해지지 않은 subAppId : " + subAppId});
                                App.api.csApi.launchCSAppResponse({result: "false"});
                            }
                        },
                        error: function (request, status) {
                            console.log("gateway/applist-live-appid-" + csAppId + ".json 로드 실패");
                        }

                    })
                } else {
                    /**
                     * 채널 앱 전용 소스
                     */
                    App.api.csApi.launchCSAppResponse({result: "true"});
                }
                break;
            case 'startvod' :
                if (contents == "cugvod") {
                    App.view.cugChannelLtype.resultPip(xmlDoc);
                } else {
                    /**
                     * App.view.channelVodPIP 프레임 지우기
                     */
                    App.vars.vodDetailPipOffset = 0;

                    if (App.view.channelVodPIP !== undefined) {
                        App.view.channelVodPIP.hideFrame();
                    }
                    if (isStopApp == true) {
                        isStopApp = false;
                        setTimeout(function () {
                            App.api.fn.stopApp();
                        }, 100);
                    }
                }
                break;
            case 'startoap' :
                setTimeout(function () {
                    App.api.fn.stopApp();
                }, 100);
                break;
            case 'startsettings' :
                setTimeout(function () {
                    App.api.fn.stopApp();
                }, 100);
                break;
            case 'Set' :
            case 'set' :
                switch (contents) {
                    case "deviceinfo" :
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);
    
                        //맞춤형 광고 adid
                        if (X2JS.xml_str2json(xmlText).INTERFACE.DATA.adid) {
                            if (X2JS.xml_str2json(xmlText).INTERFACE.DATA.adid == "SUCCESS") {
                                App.api.model.csc.setDeviceInfoCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                                App.api.model.csc.setDeviceInfoCallback = function () {
                                };
                            } else {
                                App.api.model.csc.setDeviceInfoErrorCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                                App.api.model.csc.setDeviceInfoErrorCallback = function () {
                                };
                            }
                        }

                        // 키즈모드 전환시에만 검사
                        if (App.provider.service.useIsKids) {
                            if (X2JS.xml_str2json(xmlText).INTERFACE.DATA.isKids) {
                                if (X2JS.xml_str2json(xmlText).INTERFACE.DATA.isKids == "SUCCESS") {
                                    // App.api.model.csc.setDeviceInfoErrorCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                                    // App.api.model.csc.setDeviceInfoErrorCallback = function () {};
                                    App.api.model.csc.setDeviceInfoCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                                    App.api.model.csc.setDeviceInfoCallback = function () {
                                    };
                                } else {
                                    App.api.model.csc.setDeviceInfoErrorCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                                    App.api.model.csc.setDeviceInfoErrorCallback = function () {
                                    };
                                }
                            }
                        } else {
                            if (X2JS.xml_str2json(xmlText).INTERFACE.DATA.channelMode) {
                                if (X2JS.xml_str2json(xmlText).INTERFACE.DATA.channelMode == "SUCCESS") {
                                    App.api.model.csc.setDeviceInfoCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                                    App.api.model.csc.setDeviceInfoCallback = function () {
                                    };
                                } else {
                                    App.api.model.csc.setDeviceInfoErrorCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                                    App.api.model.csc.setDeviceInfoErrorCallback = function () {
                                    };
                                }
                            }
                        }

                        break;
                    case "ChangeFocus":
                    case "changefocus":
                        if (App.vars.iFramePurchaseChannalFlag) {
                            if ($xmlDoc.find("productId").text() == "") {
                                App.api.bizpf.channel_products({
                                    region: App.config.settopInfo.soCode,//SO 코드  M
                                    //todo : sourceId  확인
                                    // sourceId: self.params.sourceId, // 채널 소스 ID M
                                    sourceId: App.config.settopInfo.sourceId, // 채널 소스 ID M
                                    offset: "0", // 시작 offset M
                                    limit: "0",//반환 개수 M
                                    sort: "",//상품 정렬 기준 O (nm_asc: 상품명 가나다순, pr_asc (Default): 낮은 가격순)
                                    selector: "",//응답 필드 선택 (필드 목록 또는 Field Group) O []
                                    callback: function (oData) {
                                        App.view.iFramePurchaseChannal.productId = oData.data[2].productId;
                                    }
                                });
                            } else {
                                App.view.iFramePurchaseChannal.productId = $xmlDoc.find("productId").text();
                            }
                            App.view.iFramePurchaseChannal.sourceId = $xmlDoc.find("sourceId").text();
                            App.view.iFramePurchaseChannal.render();
                            console.log(App.view.iFramePurchaseChannal.productId);
                        } else {
                            setTimeout(function () {
                                if ($xmlDoc.find("productId").text() == "") {
                                    App.api.bizpf.channel_products({
                                        region: App.config.settopInfo.soCode,//SO 코드  M
                                        //todo : sourceId  확인
                                        // sourceId: self.params.sourceId, // 채널 소스 ID M
                                        sourceId: App.config.settopInfo.sourceId, // 채널 소스 ID M
                                        offset: "0", // 시작 offset M
                                        limit: "0",//반환 개수 M
                                        sort: "",//상품 정렬 기준 O (nm_asc: 상품명 가나다순, pr_asc (Default): 낮은 가격순)
                                        selector: "",//응답 필드 선택 (필드 목록 또는 Field Group) O []
                                        callback: function (oData) {
                                            App.view.iFramePurchaseChannal.productId = oData.data[2].productId;
                                        }
                                    });
                                } else {
                                    App.view.iFramePurchaseChannal.productId = $xmlDoc.find("productId").text();
                                }
                                App.view.iFramePurchaseChannal.sourceId = $xmlDoc.find("sourceId").text();
                                App.view.iFramePurchaseChannal.render();
                                console.log(App.view.iFramePurchaseChannal.productId);
                            }, 200);
                        }
                        break;
                    case "addbooking":
                        if ($xmlDoc.find("booking").text() == "SUCCESS") {
                            $('body').append(templete["09_channelAllProgram/channelBooking"](App.vars.setAddBooking));
                            var entryCode = null;

                            var channelNum = $('.channel_list ul .current .box_channel .num').text();
                            var channelId = $('.channel_list ul .current').data('sourceid');
                            var channelName = $('.channel_list ul .current').data('channelname');
                            var channelLog = [channelNum, channelId, channelName];

                            if (App.fn.entryCode.getCode(false) != undefined) {
                                entryCode = App.fn.entryCode.getCode();
                            }

                            App.api.fn.setLog({
                                logLevel: "4",
                                log_name: "viewLog",
                                storage_group_id: "VIEW",
                                log_id: "VIEW_0078",
                                data: {
                                    "entry": entryCode,
                                    "add_1": channelLog, // 채널 번호/소스ID/채널명
                                    "add_2": "addbooking" // 예약/취소 여부
                                },
                                callback: function (data) {
                                    console.log(data);
                                },
                                errorCallback: function (error) {
                                    console.log(error);
                                }
                            });
                            clearTimeout(App.vars.timer.setAddBooking);
                            App.vars.timer.setAddBooking = setTimeout(function () {
                                $('.dim_bottom').remove();
                            }, 2000);
                        } else {
                            data = {
                                desc: "시청예약이 실패하였습니다"
                            };
                            $('body').append(templete["09_channelAllProgram/channelBookingRemove"](data));
                            clearTimeout(App.vars.timer.removeBooking);
                            App.vars.timer.setAddBooking = setTimeout(function () {
                                $('.dim_bottom').remove();
                            }, 2000);
                        }
                        /**
                         * 부킹 정보 갱신
                         */
                        App.api.csApi.getBookingList()
                        break;
                    case "removebooking":
                        if ($xmlDoc.find("booking").text() == "SUCCESS") {
                            if (App.vars.setRemoveBooking != null) {
                                $('body').append(templete["09_channelAllProgram/channelBookingRemove"](App.vars.setRemoveBooking));
                                var entryCode = null;

                                var channelNum = $('.channel_list ul .current .box_channel .num').text();
                                var channelId = $('.channel_list ul .current').data('sourceid');
                                var channelName = $('.channel_list ul .current').data('channelname');
                                var channelLog = [channelNum, channelId, channelName];

                                if (App.fn.entryCode.getCode(false) != undefined) {
                                    entryCode = App.fn.entryCode.getCode();
                                }

                                App.api.fn.setLog({
                                    logLevel: "4",
                                    log_name: "viewLog",
                                    storage_group_id: "VIEW",
                                    log_id: "VIEW_0078",
                                    data: {
                                        "entry": entryCode,
                                        "add_1": channelLog, // 채널 번호/소스ID/채널명
                                        "add_2": "removebooking" // 예약/취소 여부
                                    },
                                    callback: function (data) {
                                        console.log(data);
                                    },
                                    errorCallback: function (error) {
                                        console.log(error);
                                    }
                                });
                                clearTimeout(App.vars.timer.removeBooking);
                                App.vars.timer.removeBooking = setTimeout(function () {
                                    $('.dim_bottom').remove();
                                }, 2000)
                            }
                        } else {
                            data = {
                                desc: "시청예약이 실패하였습니다"
                            };
                            $('body').append(templete["09_channelAllProgram/channelBookingRemove"](data));
                            clearTimeout(App.vars.timer.removeBooking);
                            App.vars.timer.setAddBooking = setTimeout(function () {
                                $('.dim_bottom').remove();
                            }, 2000);
                        }
                        /**
                         * 부킹 정보 갱신
                         */
                        App.api.csApi.getBookingList()
                        break;
                    case "addscheduleitem": // [PVR] 1. 녹화 시작 / 예약 녹화
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        if (X2JS.xml_str2json(xmlText).INTERFACE.DATA.result == "false") {
                            // 오류처리
                            App.fn.pvr = new directory.pvrView();
                            App.fn.pvr.setErrorCode(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                            App.api.model.pvr.setAddScheduleItemErrorCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                            App.api.model.pvr.setAddScheduleItemErrorCallback = function () {
                            };
                        } else {
                            App.api.model.pvr.setAddScheduleItemCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                            App.api.model.pvr.setAddScheduleItemCallback = function () {
                            };
                        }


                        break;
                    case "removescheduleitem": // [PVR] 2. 예약 녹화 삭제 / 녹화 중지
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        if (X2JS.xml_str2json(xmlText).INTERFACE.DATA.result == "false") {
                            // 오류처리
                            App.fn.pvr = new directory.pvrView();
                            App.fn.pvr.setErrorCode(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                            App.api.model.pvr.setRemoveScheduleItemErrorCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                            App.api.model.pvr.setRemoveScheduleItemErrorCallback = function () {
                            };
                        } else {
                            App.api.model.pvr.setRemoveScheduleItemCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                            App.api.model.pvr.setRemoveScheduleItemCallback = function () {
                            };
                        }
                        break;
                    case "stopallrecordingprogram": // [PVR] 3. 녹화 중인 모든 프로그램 중지
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);
                        if (X2JS.xml_str2json(xmlText).INTERFACE.DATA.result == "true") {
                            App.api.model.pvr.setStopAllRecordingProgramCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                            App.api.model.pvr.setStopAllRecordingProgramCallback = function () {
                            };
                        } else {
                            // 오류처리
                            App.fn.pvr = new directory.pvrView();
                            App.fn.pvr.setErrorCode(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                            App.api.model.pvr.setStopAllRecordingProgramErrorCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                            App.api.model.pvr.setStopAllRecordingProgramErrorCallback = function () {
                            };
                        }
                        break;
                    case "blockrecordings": // [PVR] 10. 녹화물 보호하기
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        App.api.model.pvr.setBlockRecordingsCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.pvr.setBlockRecordingsCallback = function () {
                        };
                        break;
                    case "unblockrecordings": // [PVR] 11. 녹화물 보호 해제하기
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        App.api.model.pvr.setUnblockRecordingsCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.pvr.setUnblockRecordingsCallback = function () {
                        };
                        break;
                    case "deleterecordings": // [PVR] 12. 녹화물 삭제하기
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        App.api.model.pvr.setDeleteRecordingsCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.pvr.setDeleteRecordingsCallback = function () {
                        };
                        break;
                    case "hiderecordings": // [PVR] 13. 녹화물 숨기기
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        App.api.model.pvr.setHideRecordingsCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.pvr.setHideRecordingsCallback = function () {
                        };
                        break;
                    case "showrecordings": // [PVR] 14. 녹화물 보이기
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        App.api.model.pvr.setShowRecordingsCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.pvr.setShowRecordingsCallback = function () {
                        };
                        break;

                    case "remoconpairing": // 리모컨 페어링
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        App.api.model.app.remoconPairingCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.app.remoconPairingCallback = function () {
                        };
                        break;
                    case "remoconpairingcancel": // 리모컨 페어링 취소
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        App.api.model.app.remoconPairingCancelCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                        App.api.model.app.remoconPairingCancelCallback = function () {
                        };
                        break;
                }
                break;

            case "update" :
                switch (contents) {
                    case "cugvod":
                        //CUG VOD 재생종료시 값 전달(cugVod는 전용 채널에서만 재생 가능)
                        console.log("%c update - cugVod", "color: #ff00ff; background-color : #000; font-size: 14px");

                        var nextWatchId = $xmlDoc.find("nextWatchId").text();
                        App.view.cugChannelLtype.startPip(nextWatchId);
                        break;

                    case "vodiframeshow":
                        App.view.channelVodTunePIP.showIFrame();
                        break;
                    case "finishrecordingplay": // [PVR] 19. 녹화물 재생 종료 Event
                        var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                        var jsonData = X2JS.xml_str2json(xmlText).INTERFACE.DATA;
                        var splitJsonData = [];
                        var returnData = {};
                        if (jsonData.recording != "") {
                            splitJsonData = jsonData.recording.split("|");
                            returnData.uri = splitJsonData[0];
                            returnData.scheduleItemId = splitJsonData[1];
                            returnData.recordingType = splitJsonData[2];
                            returnData.chSrcId = splitJsonData[3];
                            returnData.chName = splitJsonData[4];
                            returnData.chNumber = splitJsonData[5];
                            returnData.repeatWeek = splitJsonData[6];
                            returnData.rating = App.fn.pvr.convertRatingInverse(splitJsonData[7]);
                            returnData.state = splitJsonData[8];
                            returnData.size = splitJsonData[9];
                            returnData.lastViewTime = splitJsonData[10];
                            returnData.expirationTime = splitJsonData[11];
                            returnData.thumbNailUri = splitJsonData[12];
                            returnData.isLocked = splitJsonData[13];
                            returnData.isHide = splitJsonData[14];
                            returnData.title = splitJsonData[15];
                            returnData.startTimeSec = splitJsonData[16];
                            returnData.durationSec = splitJsonData[17];
                            returnData.mediaDurationSec = splitJsonData[18];
                            returnData.endReason = splitJsonData[19];
                            returnData.childCount = splitJsonData[20];
                            jsonData.recording = [];
                            jsonData.recording.push(returnData);
                        } else {
                            jsonData.recording = [];
                        }
                        console.log(jsonData);
                        App.api.model.pvr.updateFinishRecordingPlayCallback(jsonData);
                        App.api.model.pvr.updateFinishRecordingPlayCallback = function () {
                        };
                        break;
                }
                break;

            case "playrecording" : // [PVR] 8. 녹화물 재생 요청
                var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                App.api.model.pvr.playRecordingCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                App.api.model.pvr.playRecordingCallback = function () {
                };
                if (App.vars.isStopAppRecording == true) {
                    App.vars.isStopAppRecording = false;
                    setTimeout(function () {
                        App.api.fn.stopApp();
                    }, 100);
                }
                break;

            case "inithdd" : // [PVR] 22. HDD 초기화
                var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                if (X2JS.xml_str2json(xmlText).INTERFACE.DATA.result == "false") {
                    // 오류처리
                    App.fn.pvr = new directory.pvrView();
                    App.fn.pvr.setErrorCode(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                    App.api.model.pvr.initHddErrorCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                    App.api.model.pvr.initHddErrorCallback = function () {
                    };
                } else {
                    App.api.model.pvr.initHddCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                    App.api.model.pvr.initHddCallback = function () {
                    };
                }
                break;

            case "notify" : // [PVR] 27. ScheduleItem update event
                if (contents == "notifyscheduleitemupdated") {
                    var xmlText = new XMLSerializer().serializeToString($xmlDoc[0]);

                    App.api.model.pvr.notifyScheduleItemUpdatedCallback(X2JS.xml_str2json(xmlText).INTERFACE.DATA);
                    App.api.model.pvr.notifyScheduleItemUpdatedCallback = function () {
                    };

                    /**
                     * 스케쥴 업데이트시
                     * 시나리오
                     */
                    if (window.location.hash == "#homeMain") {
                        App.router.callMenu(App.historyApp.getPresent());
                    } else if (window.location.hash == "#channelAllProgram") {
                        // 채널편성표
                        App.fn.globalUtil.switchMode(App.view.channelAllProgram.mode, "channel");
                        App.router.callMenu(App.historyApp.getPresent());
                    } else if (window.location.hash == "#recordingMain") {
                        // 녹화메뉴
                        if (App.view.recordingMain.mode.recPopup) {
                            App.view.recPopup.remove();
                            App.fn.globalUtil.switchMode(App.view.recordingMain.mode, "dep02preview");
                            App.view.recordingMain.setRecordMark();
                        }
                    } else if (window.location.hash == "#recordingRecommendRank") {
                        if (App.view.recordingRecommendRank.activeSection.recPopup) {
                            App.view.recPopup.remove();
                            App.fn.globalUtil.switchMode(App.view.recordingRecommendRank.activeSection, "list");
                            App.view.recordingRecommendRank.setRecordMark();
                        }
                    } else if (window.location.hash == "#recordingRecommendTheme") {
                        if (App.view.recordingRecommendTheme.activeSection.recPopup) {
                            App.view.recPopup.remove();
                            App.fn.globalUtil.switchMode(App.view.recordingRecommendTheme.activeSection, "list");
                            App.view.recordingRecommendTheme.setRecordMark();
                        }
                    } else if (window.location.hash == "#recordingTimeSpecific") {
                        // 시간지정녹화 설정
                        $('#container_popup').empty();
                        App.router.callMenu(App.historyApp.pop());
                    }

                } else if (contents == "NotifyStartVux") {
                    /**
                     * 스크린 컨텍스트
                     * VUX 시작
                     */
                    if (App.fn.globalUtil.is("VOICE") == true) {
                        Voiceable.sessionStart();
                    }
                } else if (contents == "NotifyEndVux") {
                    /**
                     * 스크린 컨텍스트
                     * VUX 종료
                     */
                    if (App.fn.globalUtil.is("VOICE") == true) {
                        Voiceable.sessionStop();
                    }
                } else if (contents == "RequestVuxAction") {
                    /**
                     * 스크린 컨텍스트
                     * VUX 액션 Parameter 전달
                     */
                    var targetValue = $xmlDoc.find("value").text();
                    App.api.link.move({
                        type: "vo01",
                        value: targetValue
                    })
                } else if (contents == "notifygooglenoti") {
                    App.config.settopInfo.googleTotalNoti = $xmlDoc.find("googleTotalNoti").text();
                    App.config.settopInfo.googleNewNoti = $xmlDoc.find("googleNewNoti").text();
    
                    if (Backbone.history.getFragment() === 'homeMain') {
                        if ($('#home_google_push').length) {
                            $('#home_google_push em').html(App.config.settopInfo.googleTotalNoti);
                        } else {
                            $('#search-bar').prepend('<div class="google_push" id="home_google_push">알림 <em>'+ App.config.settopInfo.googleTotalNoti +'</em></div>')
                        }
                    }
                }
                break;
        }
    }


    /**
     * 사용자 설정정보 세팅 함수
     * @param infoObj
     */
    function setDeviceInfo(infoObj) {
        var opts = {
            TYPE: "request",
            COMMAND: "Set",
            CONTENTS: "DeviceInfo",
            DATA: {}
        };
        $.extend(opts, infoObj);

        for (var key in opts.DATA) {
            App.config.settopInfo[key] = opts.DATA[key];
        }

        var xmlString = X2JS.json2xml_str(opts);
        xmlString = "<INTERFACE version='3'>" + xmlString + "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    /**
     * 세션 타임아웃 설정
     * @param options
     */
    function SetSessionTimeout(time) {
        var opts = {
            TYPE: "request",
            COMMAND: "Set",
            CONTENTS: "SessionTimeout",
            DATA: {
                timeout: "320" //grib
                // timeout : "40" //alti
            }
        };
        opts.DATA.timeout = time;
        console.log("%c SetSessionTimeout : " + time, "color: #ff00ff; background-color : #000; font-size: 14px");
        var xmlString = X2JS.json2xml_str(opts);
        xmlString = "<INTERFACE version='3'>" + xmlString + "</INTERFACE>";
        App.api.csApi.request(xmlString);
    }


    /**
     * 셋탑 재시작
     */
    function reBoot() {
        var opts = {
            TYPE: "notify",
            COMMAND: "Reboot",
            CONTENTS: "",
            DATA: {}
        };

        var xmlString = X2JS.json2xml_str(opts);
        xmlString = "<INTERFACE version='3'>" + xmlString + "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    /**
     * 웹앱 에서 특정키 사용을 요청함
     * @param infoObj
     */
    function setKeyFilter(infoObj) {
        var opts = {
            TYPE: "request",
            COMMAND: "Set",
            CONTENTS: "KeyFilter",
            DATA: {
                numKeyUse: "off"
            }
        };
        $.extend(opts, infoObj);


        var xmlString = X2JS.json2xml_str(opts);
        xmlString = "<INTERFACE version='3'>" + xmlString + "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function sportsKeyFilter(option) {
        var xmlString = "";

        xmlString += "<INTERFACE version='3'>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>KeyFilter</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<previousKeyUse>" + option + "</previousKeyUse>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function homeShoppingKeyFilter() {
        var xmlString = "";

        xmlString += "<INTERFACE version='3'>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>KeyFilter</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<numKeyUse>on</numKeyUse>";
        xmlString += "<previousKeyUse>on</previousKeyUse>";
        xmlString += "<channelKeyUse>on</channelKeyUse>";
        xmlString += "<favoriteChannelKeyUse>on</favoriteChannelKeyUse>";
        xmlString += "<homeKeyUse>on</homeKeyUse>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function homeShoppingStopApp() {
        var stopApp = {
            TYPE: "notify",
            COMMAND: "StopApp",
            CONTENTS: "HomeShopping",
            DATA: {}
        };
        var xmlString2 = X2JS.json2xml_str(stopApp);
        xmlString2 = "<INTERFACE version='3'>" + xmlString2 + "</INTERFACE>";
        App.api.csApi.request(xmlString2);
    }

    /**
     * 선택형 디바이스정보 요청 함수
     * @param options[]
     * 선택한 항목을 xml로 생성하여 해당 설정 정보를 요청한다.
     * App.api.csApi.getDeviceInfo({
     * mec : '',
     * })
     */
    function getDeviceInfo(options) {
        var opts = {
            TYPE: "request",
            COMMAND: "Get",
            CONTENTS: "DeviceInfo",
            DATA: {},
            callback: function () { //요청한 정보를 받은 뒤 실행할 callback함수
            }
        };
        $.extend(opts, options);

        var reCallDeviceInfo = false;

        for (var key in opts.DATA) {
            if (App.config.settopInfo[key] == "") {
                reCallDeviceInfo = true;
                break;
            }
        }

        if (reCallDeviceInfo == false) {

            for (var key in opts.DATA) {
                opts.DATA[key] = App.config.settopInfo[key];
            }

            opts.callback(opts.DATA);
            return;
        }

        App.api.model.csc.getDeviceInfoCallback = opts.callback;
        delete opts.callback;


        var xmlString = X2JS.json2xml_str(opts);
        xmlString = "<INTERFACE version='3'>" + xmlString + "</INTERFACE>";

        App.api.csApi.request(xmlString);

        if (!App.config.isContainer) {
            App.api.csApi.getDeviceInfoTest();
        }
    }

    /**
     * 선택형 디바이스정보 요청 함수
     * @param options[]
     * 선택한 항목을 xml로 생성하여 해당 설정 정보를 요청한다.
     * App.api.csApi.getDeviceInfo({
     * mec : '',
     * })
     */
    function getSystemInfo(options) {
        var opts = {
            TYPE: "request",
            COMMAND: "Get",
            CONTENTS: "SystemInfo",
            DATA: {},
            callback: function () { //요청한 정보를 받은 뒤 실행할 callback함수
            }
        };
        $.extend(opts, options);

        App.api.model.csc.getSystemInfoCallback = opts.callback;
        delete opts.callback;


        var xmlString = X2JS.json2xml_str(opts);
        xmlString = "<INTERFACE version='3'>" + xmlString + "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    /**
     * 안내 설정용 디바이스 정보 요청 함수
     */
    function getGuideDeviceInfo(options) {
        var opts = {
            TYPE: "request",
            COMMAND: "Get",
            CONTENTS: "DeviceInfo",
            DATA: {
                blockedChannels: "", //시청제한채널설정
                favoriteChannels: "", //선호채널설정
                skippedChannels: "", //지움채널설정
                minibarDuration: "", //채널정보표시시간설정
                restrictionPeriod: "", //시청시간제한설정
                quickMenuGuide: "", //퀵메뉴표시설정
                quickMenuChannelType: "", //퀵메뉴채널보기설정
                multiView: "", //멀티화면사용설정
                powerSaveMode: "", //절전모드사용설정
                powerSaveTime: "", //절전모드-신규셋톱박스용 (0:사용안함, 10: 빠른절전, 240:일반절전)
                sleepTime: "",     //취침모드-신규셋톱박스용 (0:사용안함, 15: 15분, 30:30분, 60: 1시간, 120: 2시간 )
                targetAd: "", //맞춤광고 설정
                adid: "",
                eventAlarm: "", //마케팅수신알림-이벤트수신
                couponAlarm: "", //마케팅수신알림-쿠폰수신
                ibcService: "", //채널전환시광고서비스노출설정
                channelResetTime: "", //기본채널자동이동설정
                ratio: "", //화면비율설정
                assistanceService: "", //시청보조서비스-해설방송설정
                speechBubble: "", //말풍선안내설정
                closedCaption: "", //시청보조서비스-자막방송설정
                rating: "", //시청연령설정
                vodAdultMenuCheck: "", //성인용VOD메뉴및콘텐츠진입설정
                simplePurchase: "", //VOD 간편결제설정
                voiceGuide: "", //음성안내 사용설정
                voiceGuideSpeed: "", //음성안내 속도설정
                voiceGuideDesc: "", // 음성안내 상세설명 설정
                hddFormat: "", // HDD 정리 설정
                isKids: "", // HDD 정리 설정
                channelMode: "", // HDD 정리 설정
                timeMachine: "", // 타임머신 사용설정
                timeMachineTimer: "", //타임머신 최대시간 설정
                isSmartSignLang: "", //수어방송 설정
                hdmiCEC:"",//HDMI 전원설정
                vst:"",//음성데이터 전송 서버 설정 조회 0 : VUX접속설정, 1 : Proxy접속설정
                bluetoothDevice: "", //블루투스 디바이스 정보(갯수) - 신규셋톱박스용
                isWarmBootingHome:""
            },
            callback: function () { //요청한 정보를 받은 뒤 실행할 callback함수
            }
        };
        $.extend(opts, options);

        var reCallDeviceInfo = false;

        for (var key in opts.DATA) {
            if (App.config.settopInfo[key] == "") {
                reCallDeviceInfo = true;
                break;
            }
        }

        if (reCallDeviceInfo == false) {

            for (var key in opts.DATA) {
                opts.DATA[key] = App.config.settopInfo[key];
            }

            opts.callback(opts.DATA);
            return;
        }

        App.api.model.csc.getDeviceInfoCallback = opts.callback;
        delete opts.callback;

        var xmlString = X2JS.json2xml_str(opts);
        xmlString = "<INTERFACE version='3'>" + xmlString + "</INTERFACE>";

        App.api.csApi.request(xmlString);

        if (!App.config.isContainer) {
            App.api.csApi.getGuideDeviceInfoTest();
        }
    }

//startApp api response (요청 아님.... stb응답 데이터)
    function requestStartApp($xmlDoc, xmlDoc) {

        var nodeGroupId = $xmlDoc.find("nodeGroupId").text();
        var stbModel = $xmlDoc.find("stbModel").text();
        var macAddress = $xmlDoc.find("macAddress").text();
        var superCasId = $xmlDoc.find("superCasId").text();
        var subscriberId = $xmlDoc.find("subscriberId").text();
        var smartCardId = $xmlDoc.find("smartCardId").text();
        var groupBits = $xmlDoc.find("groupBits").text();
        var soCode = $xmlDoc.find("soCode").text();
        var cugGroupId = $xmlDoc.find("cugGroupId").text();
        var mapId = $xmlDoc.find("mapId").text();
        var soLogLevel = $xmlDoc.find("soLogLevel").text();
        var enableLog = $xmlDoc.find("enableLog").text();
        var urlPopServer = $xmlDoc.find("urlPopServer").text();
        var urlGatherServer = $xmlDoc.find("urlGatherServer").text();
        var vodAdultMenuCheck = $xmlDoc.find("vodAdultMenuCheck").text();
        var rating = $xmlDoc.find("deviceInfo rating").text();
        var simplePurchase = $xmlDoc.find("simplePurchase").text();
        var isKids = $xmlDoc.find("deviceInfo isKids").text();
        var isChannelMode = $xmlDoc.find("channelMode").text();
        var voiceGuide = $xmlDoc.find("voiceGuide").text();
        var voiceGuideDesc = $xmlDoc.find("voiceGuideDesc").text();
        var multiView = $xmlDoc.find("multiView").text();
        var stbRegCode = $xmlDoc.find("stbRegCode").text();
        var vodWatching = $xmlDoc.find("vodWatching").text();
        var privateAgreement = $xmlDoc.find("privateAgreement").text();
        var marketingAgreement = $xmlDoc.find("marketingAgreement").text();
        var speechBubble = $xmlDoc.find("speechBubble").text();
        var extInfo = $xmlDoc.find("launchInfo extInfo").text();
        var sourceId = $xmlDoc.find("deviceInfo sourceId").text();
        var appId = $xmlDoc.find("launchInfo appId").text();
        // var isEOF = $xmlDoc.find("deviceInfo isEOF").text();
        // var vodwatching = $xmlDoc.find("deviceInfo vodwatching").text();
        // var nextWatchId = $xmlDoc.find("deviceInfo nextWatchId").text();
        // var totalDuration = $xmlDoc.find("deviceInfo totalDuration").text();
        // var currentDuration = $xmlDoc.find("deviceInfo currentDuration").text();
        var cugChannel = $xmlDoc.find("cugChannel").text();
        var channelResetTime = $xmlDoc.find("channelResetTime").text();
        var widgetMode = $xmlDoc.find("isWidgetMode").text();
        var hdmiCEC = $xmlDoc.find("hdmiCEC").text();
        var vst = $xmlDoc.find("vst").text();
        var googleNewNoti = $xmlDoc.find("googleNewNoti").text();
        var googleTotalNoti = $xmlDoc.find("googleTotalNoti").text();

        var adid = $xmlDoc.find("adid").text();

        App.config.settopInfo.widgetMode = widgetMode;
        App.config.settopInfo.nodeGroupId = nodeGroupId;
        App.config.settopInfo.stbModel = stbModel;
        App.config.settopInfo.macAddress = macAddress;
        App.config.settopInfo.superCasId = superCasId;
        //live 모드 일때 변경 필요
        App.config.settopInfo.subscriberId = subscriberId;
        App.config.settopInfo.smartCardId = smartCardId;
        App.config.settopInfo.groupBits = groupBits;
        App.config.settopInfo.soCode = soCode;
        App.config.settopInfo.cugGroupId = cugGroupId;
        App.config.settopInfo.mapId = mapId;
        App.config.settopInfo.soLogLevel = soLogLevel;
        App.config.settopInfo.enableLog = enableLog;
        App.config.settopInfo.urlPopServer = urlPopServer;
        App.config.settopInfo.urlGatherServer = urlGatherServer;
        App.api.logApi._serverIp = urlGatherServer;
        App.api.logApi._serverUrl = App.api.logApi._serverIp;
        App.config.settopInfo.vodAdultMenuCheck = vodAdultMenuCheck;
        App.config.settopInfo.rating = rating;
        App.config.settopInfo.simplePurchase = simplePurchase;
        App.config.settopInfo.isKids = isKids;
        App.config.settopInfo.channelMode = isChannelMode;
        App.config.settopInfo.voiceGuide = voiceGuide;
        App.config.settopInfo.voiceGuideDesc = voiceGuideDesc;
        App.config.settopInfo.multiView = multiView;
        App.config.settopInfo.stbRegCode = stbRegCode;
        App.config.settopInfo.vodWatching = vodWatching;
        App.config.settopInfo.privateAgreement = privateAgreement;
        App.config.settopInfo.marketingAgreement = marketingAgreement;
        App.config.settopInfo.speechBubble = speechBubble;
        App.config.settopInfo.sourceId = sourceId;
        App.config.settopInfo.channelResetTime = channelResetTime;
        // App.config.settopInfo.isEOF = isEOF;
        // App.config.settopInfo.vodwatching = vodwatching;
        // App.config.settopInfo.nextWatchId = nextWatchId;
        // App.config.settopInfo.totalDuration = totalDuration;
        // App.config.settopInfo.currentDuration = currentDuration;
        App.config.settopInfo.cugChannel = cugChannel;
        App.config.settopInfo.hdmiCEC = hdmiCEC;

        //음성데이터 전송 서버 설정 조회 0 : VUX접속설정, 1 : Proxy접속설정
        App.config.settopInfo.vst = vst;
        
        //구글 알림
        App.config.settopInfo.googleNewNoti = googleNewNoti;
        App.config.settopInfo.googleTotalNoti = googleTotalNoti;

        App.config.settopInfo.adid = adid;
        /**
         * soCode에 맞는 provider 세팅
         */
        console.log('%c >>>> soCode : ' + App.config.settopInfo.soCode, "background-color : yellow; font-size: 14px");
        var soName = App.fn.globalUtil.getSOName(App.config.settopInfo.soCode)
        if(network === 'Live'){
            App.provider = providerSO[soName];
        }else{
            App.provider = providerSO[soName+'_testbed'];
        }

        /**
         * provider에 맞는 class 세팅
         */
        $('body').addClass('wrap_' + App.fn.globalUtil.getSOClassName(App.config.settopInfo.soCode));

        console.log('%c >>>>>>>>>>>>>>>>>>>>>>>>> Set provider <<<<<<<<<<<<<<<<<<<<<<<<<', "background-color : yellow; font-size: 14px");
        console.log('%c >>>>>>>>>>>>>>>>>>>>>>>>> soName : ' + App.provider.so.soName, "background-color : yellow; font-size: 14px");
        console.log('%c >>>>>>>>>>>>>>>>>>>>>>>>> spName : ' + App.provider.so.spName, "background-color : yellow; font-size: 14px");
        console.log('%c >>>>>>>>>>>>>>>>>>>>>>>>> App.provider :', "background-color : yellow; font-size: 14px");
        console.log(App.provider);
        console.log('%c >>>>>>>>>>>>>>>>>>>>>>>>> Set provider complete!! <<<<<<<<<<<<<<<<<<<<<<<<<', "background-color : yellow; font-size: 14px");

        App.provider.stb.uhdStb.forEach(function (str,idx) {
            if (str == stbModel) {
                App.config.settopInfo.stbModelResolution = "UHD";
            }
        })

        // 애니메이션 모드 처리
        App.provider.stb.animationSettopBox.forEach(function (str, idx) {
            if (str == stbModel) {
                App.vars.modeAnimation = true;
            }
        });

        App.config.csAppId = appId;

        // 샘플 그룹비트
        // B2B
        // App.config.settopInfo.groupBits = "AAAAAAAQAAAAAAAAAAAAAAAAAAAAAAGAAAgAAAAAAAA=";
        // 일반사용자
        // App.config.settopInfo.groupBits = "AAAAAAAQAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAA=";


        /*
            이용약관 : 185
            선개통 처리 : 186
        */
        var _groupBits = Base64.base64ToBase16(App.config.settopInfo.groupBits);

        /**
         * groupBitsB2B
         * @type {string}
         * @private
         */
        var _B2BGroupBits = parseInt(_groupBits.slice(45, 46), 16).toString(2);

        var zero = '';
        var digits = 4;
        var n = _B2BGroupBits;
        n = n.toString();

        if (_B2BGroupBits.length < digits) {
            for (var i = 0; i < digits - _B2BGroupBits.length; i++)
                zero += '0';
        }

        _B2BGroupBits = zero + _B2BGroupBits;

        App.config.settopInfo.groupBitsB2B = _B2BGroupBits.slice(3, 4); //183번째 B2B사용자


        /**
         * _agreementGroupBits
         * @type {string}
         * @private
         */
        var _agreementGroupBits = parseInt(_groupBits.slice(46, 47), 16).toString(2);

        var zero = '';
        var digits = 4;
        var n = _agreementGroupBits;
        n = n.toString();

        if (_agreementGroupBits.length < digits) {
            for (var i = 0; i < digits - _agreementGroupBits.length; i++)
                zero += '0';
        }

        _agreementGroupBits = zero + _agreementGroupBits;

        App.config.settopInfo.groupBitsAgreement = _agreementGroupBits.slice(1, 2); //185번째 이용약관
        App.config.settopInfo.groupBitsOpening = _agreementGroupBits.slice(2, 3);  //186번째 선 개통


        /**
         * groupBitsPopup
         * @type {string}
         * @private
         */
        var _popupGroupBits = parseInt(_groupBits.slice(51, 52), 16).toString(2);

        var zero = '';
        var digits = 4;
        var n = _popupGroupBits;
        n = n.toString();

        if (_popupGroupBits.length < digits) {
            for (var i = 0; i < digits - _popupGroupBits.length; i++)
                zero += '0';
        }

        _popupGroupBits = zero + _popupGroupBits;

        App.config.settopInfo.groupBitsPopup = _popupGroupBits.slice(0, 1); //204번째 이용약관


        // noLogGroupBits 184번째
        var _noLogGroupBits = parseInt(_groupBits.slice(46, 47), 16).toString(2);

        var zero = '';
        var digits = 4;
        var n = _noLogGroupBits;
        n = n.toString();

        if (_noLogGroupBits.length < digits) {
            for (var i = 0; i < digits - _noLogGroupBits.length; i++)
                zero += '0';
        }

        _noLogGroupBits = zero + _noLogGroupBits;

        App.config.settopInfo.groupBitsNoLog = _noLogGroupBits.slice(0, 1); //184번째


        /**
         * _pvrGroupBits
         * @type {string}
         * @private
         */
        var _pvrGroupBits = parseInt(_groupBits.slice(43, 44), 16).toString(2);

        var zero = '';
        var digits = 4;
        var n = _pvrGroupBits;
        n = n.toString();

        if (_pvrGroupBits.length < digits) {
            for (var i = 0; i < digits - _pvrGroupBits.length; i++)
                zero += '0';
        }

        _pvrGroupBits = zero + _pvrGroupBits;

        App.config.settopInfo.groupBitsPvrJoin = _pvrGroupBits.slice(3, 4); //175번째 PVR 셋탑


        // var _pvrGroupBits = parseInt(_groupBits.slice(44, 45), 16).toString(2);
        //
        // var zero = '';
        // var digits = 4;
        // var n = _pvrGroupBits;
        // n = n.toString();
        //
        // if (_pvrGroupBits.length < digits) {
        //     for (var i = 0; i < digits - _pvrGroupBits.length; i++)
        //         zero += '0';
        // }
        //
        // _pvrGroupBits = zero + _pvrGroupBits;
        //
        // App.config.settopInfo.groupBitsPvrJoin = _pvrGroupBits.slice(0, 1); //176번째 PVR 셋탑

        var _pvrGroupBits = parseInt(_groupBits.slice(44, 45), 16).toString(2);

        var zero = '';
        var digits = 4;
        var n = _pvrGroupBits;
        n = n.toString();

        if (_pvrGroupBits.length < digits) {
            for (var i = 0; i < digits - _pvrGroupBits.length; i++)
                zero += '0';
        }

        _pvrGroupBits = zero + _pvrGroupBits;

        App.config.settopInfo.groupBitsPvrNone = _pvrGroupBits.slice(1, 2); //177번째 NO-PVR STB 여부

        /**
         * EPG xml에 history 없을 때 방어로직
         * stopApp
         */
        try {
            App.vars.startApp = X2JS.xml2json(xmlDoc);

            var launchInfoHistorys = App.vars.startApp.INTERFACE.DATA.launchInfo.historyList;

            var keys = Object.keys(launchInfoHistorys.history);

            if (launchInfoHistorys.history[0] === undefined) {
                for (var i = 0; i < keys.length; i++) {
                    if (launchInfoHistorys.history[keys[i]] == "true") {
                        launchInfoHistorys.history[keys[i]] = true;
                    } else if (launchInfoHistorys.history[keys[i]] == "false") {
                        launchInfoHistorys.history[keys[i]] = false;
                    }

                    if (typeof launchInfoHistorys.history[keys[i]] === "object") {
                        var keysJ = Object.keys(launchInfoHistorys.history[keys[i]]);
                        for (var j = 0; j < keysJ.length; j++) {

                            if (launchInfoHistorys.history[keys[i]][keysJ[j]] == "true") {
                                launchInfoHistorys.history[keys[i]][keysJ[j]] = true;
                            } else if (launchInfoHistorys.history[keys[i]][keysJ[j]] == "false") {
                                launchInfoHistorys.history[keys[i]][keysJ[j]] = false;
                            }

                            if (typeof launchInfoHistorys.history[keys[i]][keysJ[j]] === "object") {
                                var keysK = Object.keys(launchInfoHistorys.history[keys[i]][keysJ[j]]);
                                for (var k = 0; k < keysK.length; k++) {

                                    if (launchInfoHistorys.history[keys[i]][keysJ[j]][keysK[k]] == "true") {
                                        launchInfoHistorys.history[keys[i]][keysJ[j]][keysK[k]] = true;
                                    } else if (launchInfoHistorys.history[keys[i]][keysJ[j]][keysK[k]] == "false") {
                                        launchInfoHistorys.history[keys[i]][keysJ[j]][keysK[k]] = false;
                                    }

                                    if (typeof launchInfoHistorys.history[keys[i]][keysJ[j]][keysK[k]] === "object") {
                                        var keysL = Object.keys(launchInfoHistorys.history[keys[i]][keysJ[j]][keysK[k]]);
                                        for (var l = 0; l < keysL.length; l++) {

                                            if (launchInfoHistorys.history[keys[i]][keysJ[j]][keysK[k]][keysL[l]] == "true") {
                                                launchInfoHistorys.history[keys[i]][keysJ[j]][keysK[k]][keysL[l]] = true;
                                            } else if (launchInfoHistorys.history[keys[i]][keysJ[j]][keysK[k]][keysL[l]] == "false") {
                                                launchInfoHistorys.history[keys[i]][keysJ[j]][keysK[k]][keysL[l]] = false;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                for (var j = 0; j < keys.length; j++) {
                    console.log(launchInfoHistorys.history[j]);

                    if (launchInfoHistorys.history[j] == "true") {
                        launchInfoHistorys.history[j] = true;
                    } else if (launchInfoHistorys.history[j] == "false") {
                        launchInfoHistorys.history[j] = false;
                    }

                    if (typeof launchInfoHistorys.history[j] === "object") {
                        var keysJ = Object.keys(launchInfoHistorys.history[j]);
                        for (var i = 0; i < keysJ.length; i++) {
                            console.log(launchInfoHistorys.history[j][keysJ[i]]);

                            if (launchInfoHistorys.history[j][keysJ[i]] == "true") {
                                launchInfoHistorys.history[j][keysJ[i]] = true;
                            } else if (launchInfoHistorys.history[j][keysJ[i]] == "false") {
                                launchInfoHistorys.history[j][keysJ[i]] = false;
                            }

                            if (typeof launchInfoHistorys.history[j][keysJ[i]] === "object") {
                                var keysK = Object.keys(launchInfoHistorys.history[j][keysJ[i]]);
                                for (var k = 0; k < keysK.length; k++) {
                                    console.log(launchInfoHistorys.history[j][keysJ[i]][keysK[k]]);

                                    if (launchInfoHistorys.history[j][keysJ[i]][keysK[k]] == "true") {
                                        launchInfoHistorys.history[j][keysJ[i]][keysK[k]] = true;
                                    } else if (launchInfoHistorys.history[j][keysJ[i]][keysK[k]] == "false") {
                                        launchInfoHistorys.history[j][keysJ[i]][keysK[k]] = false;
                                    }

                                    if (typeof launchInfoHistorys.history[j][keysJ[i]][keysK[k]] === "object") {
                                        var keysL = Object.keys(launchInfoHistorys.history[j][keysJ[i]][keysK[k]]);
                                        for (var l = 0; l < keysL.length; l++) {
                                            console.log(launchInfoHistorys.history[j][keysJ[i]][keysK[k]][keysL[l]]);

                                            if (launchInfoHistorys.history[j][keysJ[i]][keysK[k]][keysL[l]] == "true") {
                                                launchInfoHistorys.history[j][keysJ[i]][keysK[k]][keysL[l]] = true;
                                            } else if (launchInfoHistorys.history[j][keysJ[i]][keysK[k]][keysL[l]] == "false") {
                                                launchInfoHistorys.history[j][keysJ[i]][keysK[k]][keysL[l]] = false;
                                            }

                                            if (typeof launchInfoHistorys.history[j][keysJ[i]][keysK[k]][keysL[l]] === "object") {
                                                var keysM = Object.keys(launchInfoHistorys.history[j][keysJ[i]][keysK[k]][keysL[l]]);
                                                for (var m = 0; m < keysM.length; m++) {
                                                    console.log(launchInfoHistorys.history[j][keysJ[i]][keysK[k]][keysL[l]][keysM[m]]);

                                                    if (launchInfoHistorys.history[j][keysJ[i]][keysK[k]][keysL[l]][keysM[m]] == "true") {
                                                        launchInfoHistorys.history[j][keysJ[i]][keysK[k]][keysL[l]][keysM[m]] = true;
                                                    } else if (launchInfoHistorys.history[j][keysJ[i]][keysK[k]][keysL[l]][keysM[m]] == "false") {
                                                        launchInfoHistorys.history[j][keysJ[i]][keysK[k]][keysL[l]][keysM[m]] = false;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            console.log(launchInfoHistorys);

            if (launchInfoHistorys.history.userEventCode != undefined) {
                App.vars.userEventCode = launchInfoHistorys.history.userEventCode;
            }
            if (launchInfoHistorys.history.sourceId != undefined) {
                App.vars.sourceId = launchInfoHistorys.history.sourceId;
            }

            /**
             * screenContext
             * CSP환경에서 VOICEABLE 연동 선언, 서버 config 연동 테스트 필요
             */
            if (App.fn.globalUtil.is("VOICE") == true) {
                // VUX 실행중인지 확인
                // 초기화
                // todo EPG 연결파트 구현 시 sessionTimeout​ 은 true로 변경 필요
                App.voiceableManager.init('cjhv', App.vars.screenContextProfile);
                // startVux 확인하기
                App.api.csApi.getStartedVux();
            }

            // var launchInfoHistorys = X2JS.xml2json($xmlDoc.find("launchInfo historyList")[0]);
            // var backInfoHistorys = X2JS.xml2json($xmlDoc.find("backInfo historyList")[0]);

            var appId = $xmlDoc.find("launchInfo>appId").text();
            var subAppId = $xmlDoc.find("launchInfo>subAppId").text();

            //1. 모드셋에 appId와 launchInfo에 appId 가 다르면 무조껀 다른 앱으로 이동
            //2. subAppId가 0이 아니면 무조껀 다른 앱으로 이동
            App.api.multiview.serviceAlarm({
                callback: function (data) {
                    if (!channelMode) {
                        /**
                         * Main App용 소스
                         */
                        if (subAppId != 0) { //채널
                            $.ajax({
                                url: "../../gateway_json/applist-live-v1.0.json",
                                type: 'GET',
                                dataType: "json",
                                success: function (jdata, errorString, code) {
                                    var jdata = jdata;
                                    var flag = false;
                                    for (var type in jdata) {
                                        if (jdata.hasOwnProperty(type)) {
                                            if (jdata[type].appId == appId && jdata[type].subAppId == subAppId) {
                                                App.api.csApi.launchCSAppResponse({result: "true"});
                                                setTimeout(function () {
                                                    location.href = jdata[type].url;
                                                }, 500);
                                                flag = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (!flag) {
                                        //장애시나리오 작업하세요
                                        App.api.csApi.launchCSAppResponse({result: "false"});
                                    }
                                    // App.api.csApi.launchCSAppResponse({result : "true"});
                                },
                                error: function (request, status) {
                                    //장애시나리오 작업하세요
                                    console.log("gateway_json/applist-live-v1.0_test.json 로드 실패");
                                }
                            });
                            // App.api.csApi.launchCSAppResponse({result : "true"});
                        } else {
                            if (launchInfoHistorys.history[0] === undefined) {
                                var menuId = launchInfoHistorys.history.menuId;
                            } else {
                                var menuId = launchInfoHistorys.history[0].menuId;
                            }


                            if (menuId == "9999") {
                                location.hash = $xmlDoc.find("launchInfo menuName").text();

                            } else if (menuId == "101") {
                                // 브릿지 화면 추가하기 위한 menuId 
                                // 앱이 처음 실행될때, menuId가 101 홈메일 경우는 : 
                                console.log('BridgeHome >>>' , menuId);
                                console.log('BridgeHome >>> cjh ', App.fn.globalUtil.is("ISCJH") );
                                console.log('BridgeHome >>> cug' , App.fn.globalUtil.is("CUG") );
                                console.log('BridgeHome >>> bridge' , App.fn.globalUtil.is("ISBRIDGEBLOCK") );
                                
                                if ( App.fn.globalUtil.is("ISCJH") && !App.fn.globalUtil.is("CUG") && !App.fn.globalUtil.is("ISBRIDGEBLOCK") ) {
                                    // 홈메인에서 브릿지로 변경해서 callMenu 한다. 
                                    console.log('BridgeHome >>> history' , launchInfoHistorys.history );
                                    if (launchInfoHistorys.history[0] === undefined) {
                                        launchInfoHistorys.history.menuId="100"; // 브릿지 강제 설정 
                                        launchInfoHistorys.history.startApp = true
                                        App.router.callMenu(launchInfoHistorys.history);
                                    } else {
                                        launchInfoHistorys.history[0].menuId="100";// 브릿지 강제 설정 
                                        launchInfoHistorys.history[0].startApp = true
                                        App.router.callMenu(launchInfoHistorys.history[0]);
                                        launchInfoHistorys.history.shift();
                                        App.historyApp.setHistoryArray(launchInfoHistorys.history);
                                    }
                                } else {
                                    // 
                                    if (launchInfoHistorys.history[0] === undefined) {
                                        launchInfoHistorys.history.startApp = true
                                        App.router.callMenu(launchInfoHistorys.history);
                                    } else {
                                        launchInfoHistorys.history[0].startApp = true
                                        App.router.callMenu(launchInfoHistorys.history[0]);
                                        launchInfoHistorys.history.shift();
                                        App.historyApp.setHistoryArray(launchInfoHistorys.history);
                                    }
                                }
                                // App.api.csApi.startAnimation(animation.ani_main_home_SlideIn);
                                animation.homebg = true;
                            } else {
                                if (launchInfoHistorys.history[0] === undefined) {
                                    launchInfoHistorys.history.startApp = true
                                    App.router.callMenu(launchInfoHistorys.history);
                                } else {
                                    launchInfoHistorys.history[0].startApp = true
                                    App.router.callMenu(launchInfoHistorys.history[0]);
                                    launchInfoHistorys.history.shift();
                                    App.historyApp.setHistoryArray(launchInfoHistorys.history);
                                }
                            }
                            App.api.csApi.responseStartApp("true");
                        }
                    } else {
                        /**
                         * Channel App 용 소스
                         */
                        if (launchInfoHistorys.history[0] === undefined) {
                            var menuId = launchInfoHistorys.history.menuId;
                        } else {
                            var menuId = launchInfoHistorys.history[0].menuId;
                        }

                        if (menuId == "9999") {
                            location.hash = $xmlDoc.find("launchInfo menuName").text();
                        } else {
                            if (launchInfoHistorys.history[0] === undefined) {
                                launchInfoHistorys.history.startApp = true
                                App.router.callMenu(launchInfoHistorys.history);
                            } else {
                                launchInfoHistorys.history[0].startApp = true
                                App.router.callMenu(launchInfoHistorys.history[0]);
                                launchInfoHistorys.history.shift();
                                App.historyApp.setHistoryArray(launchInfoHistorys.history);
                            }
                            if (menuId == "101") {
                                App.api.csApi.startAnimation(animation.ani_main_home_SlideIn);
                                animation.homebg = true;
                            }
                        }
                        App.api.csApi.responseStartApp("true");
                    }
                }
            });
        } catch (e) {
            App.api.fn.stopApp();
        }
    }

    function IniciateSystem(options) {
        var opts = {
            TYPE: "request",
            COMMAND: "Iniciate",
            CONTENTS: "System",
            DATA: {},
            callback: function () { //요청한 정보를 받은 뒤 실행할 callback함수
            }
        };
        $.extend(opts, options);

        App.api.model.csc.IniciateSystemCallback = opts.callback;
        delete opts.callback;

        var xmlString = X2JS.json2xml_str(opts);
        xmlString = "<INTERFACE version='3'>" + xmlString + "</INTERFACE>";

        App.api.csApi.request(xmlString);
        // if (!App.config.isContainer) {
        //     App.api.csApi.IniciateSystemTest();
        // }
    }


//startApp api request (응답 아님.... stb으로 요청 보내는 함수)
    function responseStartApp(result) {
        var opts = {
            TYPE: "response",
            COMMAND: "StartApp",
            DATA: {
                result: "onLoad",
                appVersion: App.config.appVersion
            }
        };
        opts.DATA.result = result;

        var xmlString = X2JS.json2xml_str(opts);
        xmlString = "<INTERFACE version='3'>" + xmlString + "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function pincodeCheck(options) {
        var opts = {
            target: "",
            code: ""
        };
        $.extend(opts, options);

        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Check</COMMAND>";
        xmlString += "<CONTENTS>" + opts.target + "</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<value>" + opts.code + "</value>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function startAnimation(data) {

        // 애니메이션 Flag 설정
        if (App.vars.modeAnimation) {
            animation.animationFlag = true
        } else {
            animation.animationFlag = false
        }

        if (animation.animationFlag == false) {
            return;
        }

        if (data != null) {
            if (data.name == "main.home.SlideIn" || data.name == "main.home.SlideIn2") {
                if (animation.homeAnimationBGFlag == 1) {
                    data = animation.ani_main_home_SlideIn;
                } else if (animation.homeAnimationBGFlag == 2) {
                    data = animation.ani_main_home_SlideIn2;
                }
            }
            if (data.name == "main.home.SlideIn") {
                $("#wrap").addClass("animation_mode");
            }
            var url = '';
            var totalNum = '';
            var repeatCnt = '';
            var xml = '<?xml version="1.0" ?>' +
                "<INTERFACE>" +
                "<COMMAND>request</COMMAND>" +
                "<GROUP>Animation_Info</GROUP>" +
                "<GTYPE>Slide</GTYPE>" +
                "<DATA>";
            if (Array.isArray(data.startX)) {
                var effectType = [],
                    isNextBlock = [],
                    isRefresh = [],
                    duration = [];
                for (var i = 0; i < data.startX.length; i++) {
                    url = '';
                    totalNum = '';
                    repeatCnt = '';
                    if (typeof data.url !== 'undefined' && data.effectType[i] != "DEFAULT") {
                        url = (Array.isArray(data.url)) ? "\" url=\"" + data.url[i] : "\" url=\"" + data.url;
                        totalNum = (Array.isArray(data.totalNum)) ? "\" totalNum=\"" + data.totalNum[i] : "\" totalNum=\"" + data.totalNum;
                        repeatCnt = (Array.isArray(data.repeatCnt)) ? "\" repeatCnt=\"" + data.repeatCnt[i] : "\" repeatCnt=\"" + data.repeatCnt;
                    }
                    effectType[i] = (Array.isArray(data.effectType)) ? data.effectType[i] : data.effectType;
                    isNextBlock[i] = (Array.isArray(data.isNextBlock)) ? data.isNextBlock[i] : data.isNextBlock;
                    isRefresh[i] = (Array.isArray(data.isRefresh)) ? data.isRefresh[i] : data.isRefresh;
                    duration[i] = (Array.isArray(data.duration)) ? data.duration[i] : data.duration;
                    xml += "<effect type=\"" + effectType[i] + "\" isNextBlock=\"" + isNextBlock[i] + url + totalNum + repeatCnt +
                        "\" isRefresh=\"" + isRefresh[i] + "\" duration=\"" + duration[i] + "\" />" +
                        "<start X=\"" + data.startX[i] + "\" Y=\"" + data.startY[i] + "\" W=\"" + data.startW[i] +
                        "\" H=\"" + data.startH[i] + "\" Z=\"" + data.startZ[i] + "\" A=\"" + data.startA[i] + "\" />" +
                        "<end X=\"" + data.endX[i] + "\" Y=\"" + data.endY[i] + "\" W=\"" + data.endW[i] +
                        "\" H=\"" + data.endH[i] + "\" Z=\"" + data.endZ[i] + "\" A=\"" + data.endA[i] + "\" />";
                }
            } else {
                url = '';
                totalNum = '';
                repeatCnt = '';
                if (typeof data.url !== 'undefined') {
                    url = "\" url=\"" + data.url;
                    totalNum = "\" totalNum=\"" + data.totalNum;
                    repeatCnt = "\" repeatCnt=\"" + data.repeatCnt;
                }
                xml += "<effect type=\"" + data.effectType + "\" isNextBlock=\"" + data.isNextBlock + url + totalNum + repeatCnt +
                    "\" isRefresh=\"" + data.isRefresh + "\" duration=\"" + data.duration + "\" />" +
                    "<start X=\"" + data.startX + "\" Y=\"" + data.startY + "\" W=\"" + data.startW +
                    "\" H=\"" + data.startH + "\" Z=\"" + data.startZ + "\" A=\"" + data.startA + "\" />" +
                    "<end X=\"" + data.endX + "\" Y=\"" + data.endY + "\" W=\"" + data.endW +
                    "\" H=\"" + data.endH + "\" Z=\"" + data.endZ + "\" A=\"" + data.endA + "\" />";
            }
            xml += "</DATA></INTERFACE>";
            App.api.csApi.request(xml);
        }
    }


    function getDeviceInfoTest() {
        App.api.csApi.response("<INTERFACE><TYPE>response</TYPE><COMMAND>Get</COMMAND><CONTENTS>DeviceInfo</CONTENTS>" +
            "<DATA><restrictionPeriod>10</restrictionPeriod></DATA></INTERFACE>");
    }


    function getGuideDeviceInfoTest() {

        var xmlString = "";

        xmlString += "<INTERFACE version='3'>";
        xmlString += "<TYPE>response</TYPE>";
        xmlString += "<COMMAND>Get</COMMAND>";
        xmlString += "<CONTENTS>DeviceInfo</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<blockedChannels>111|222|333</blockedChannels>";
        xmlString += "<favoriteChannels>111|222|333</favoriteChannels>";
        xmlString += "<skippedChannels>111|222|333</skippedChannels>";
        xmlString += "<minibarDuration>3</minibarDuration>";
        xmlString += "<restrictionPeriod>1|0000100|23:00|23:40</restrictionPeriod>";
        xmlString += "<quickMenuGuide>true</quickMenuGuide>";
        xmlString += "<quickMenuChannelType>ALL</quickMenuChannelType>";
        xmlString += "<multiView>On</multiView>";
        xmlString += "<powerSaveMode>On</powerSaveMode>";
        xmlString += "<eventAlarm>On</eventAlarm>";
        xmlString += "<couponAlarm>On</couponAlarm>";
        xmlString += "<ibcService>On</ibcService>";
        xmlString += "<channelResetTime>3</channelResetTime>";
        xmlString += "<ratio></ratio>";
        xmlString += "<closedCaption>On</closedCaption>";
        xmlString += "<assistanceService>On</assistanceService>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";


        App.api.csApi.response(xmlString);
    }

    function IniciateSystemTest() {
        var xmlString = "";
        xmlString += "<INTERFACE version='3'>";
        xmlString += "<TYPE>response</TYPE>";
        xmlString += "<COMMAND>Iniciate</COMMAND>";
        xmlString += "<CONTENTS>System</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<result>true</result>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";
        App.api.csApi.response(xmlString);
    }

    function startAppTest() {

        var xmlString = "";

        xmlString += "<INTERFACE version='3'>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StartApp</COMMAND>";
        xmlString += "<DATA>";
        xmlString += "<deviceInfo>";
        xmlString += "<mac>3c:62:00:b7:f4:66</mac>";
        xmlString += "<STBModel>CJ_HV1000</STBModel>";
        xmlString += "<subscriberId>64330543</subscriberId>";
        xmlString += "<smartCardId>63223809066</smartCardId>";
        xmlString += "<simplePurchase>true</simplePurchase>";
        xmlString += "<vodAdultMenuCheck>2</vodAdultMenuCheck>";
        xmlString += "<rating>7</rating>";
        xmlString += "<superCASId>503382017</superCASId>";
        xmlString += "<SOLogLevel>43|10.10.69.21/12001|11111</SOLogLevel>";
        xmlString += "<isB2B>true</isB2B>";
        xmlString += "<isKids>true</isKids>";
        xmlString += "<vodhistory>false</vodhistory>";
        xmlString += "<vodListType>Poster</vodListType>";
        xmlString += "<voiceGuide>1|On</voiceGuide>";
        xmlString += "</deviceInfo>";
        xmlString += "<cloudVersion>5.0.0.0</cloudVersion>";
        xmlString += "<launchInfo>";
        xmlString += "<csType>ICS</csType>";
        xmlString += "<appType>0</appType>";
        xmlString += "<appId>136</appId>";
        xmlString += "<subAppId>0</subAppId>";
        xmlString += "<extInfo></extInfo>";
        xmlString += "<historyList>";
        xmlString += "<history>";
        xmlString += "<menuId>101</menuId>";
        xmlString += "</history>";
        xmlString += "</historyList>";
        xmlString += "</launchInfo>";
        xmlString += "<backInfo>";
        xmlString += "<csType></csType>";
        xmlString += "<appType></appType>";
        xmlString += "<appId></appId>";
        xmlString += "<subAppId></subAppId>";
        xmlString += "<extInfo></extInfo>";
        xmlString += "<historyList></historyList>";
        xmlString += "</backInfo>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";


        App.api.csApi.response(xmlString);
    }


    function getRecordingTest() {
        var xmlString = "";

        // 녹화물 없음
        // xmlString ='<INTERFACE version="3"><TYPE>response </TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>Recordings</CONTENTS><DATA><totalCount>0</totalCount><count>0</count></DATA></INTERFACE>';

        // reqType 1
        // xmlString = '</DATA></INTERFACE>';

        // xmlString = '<INTERFACE version="3"><TYPE>response </TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>Recordings</CONTENTS><DATA><totalCount>65</totalCount><count>65</count><recording_0><![CDATA[dvr://65|1154940938|16|312|KBS2|7||2|1|2738221056|0|0|file:///mnt/expand/52…2d89-8ee1-4edb-a9ba-3a5fd848f808/KBS2-2018-04-02-160002.thumb|false|false|여유만만|1522652402|1200|0|1]]></recording_0><recording_1><![CDATA[dvr://64|1154940936|16|312|KBS2|7||0|2|4102221824|0|0|file:///mnt/expand/52…2d89-8ee1-4edb-a9ba-3a5fd848f808/KBS2-2018-04-02-153002.thumb|false|false|TV 유치원|1522650602|1797|0|1]]></recording_1><recording_2><![CDATA[dvr://63|1154940935|16|312|KBS2|7||3|2|1181487104|0|0|file:///mnt/expand/52…2d89-8ee1-4edb-a9ba-3a5fd848f808/KBS2-2018-04-02-141002.thumb|false|false|영화가 좋다|1522645802|2400|1|1]]></recording_2><recording_3><![CDATA[dvr://62|1154940934|16|312|KBS2|7||0|2|1366388736|0|0|file:///mnt/expand/52…2d89-8ee1-4edb-a9ba-3a5fd848f808/KBS2-2018-04-02-140001.thumb|false|false|KBS 뉴스타임|1522645201|598|0|1]]></recording_3><recording_4><![CDATA[dvr://61|1154940933|128|312|KBS2|7||0|2|2570592256|0|0|file:///mnt/expand/52…2d89-8ee1-4edb-a9ba-3a5fd848f808/KBS2-2018-04-02-134108.thumb|false|false|다큐멘터리 3일|1522644068|1126|0|1]]></recording_4><recording_5><![CDATA[dvr://60|0|128|311|SBS|5|0111110|3|2|1158119424|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-27-083001.thumb|false|false|해피 시스터즈(78회)|1522107001|2398|0|1]]></recording_5><recording_6><![CDATA[dvr://59|0|64|314|MBC|11|0111110|3|2|1163104256|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/MBC-2018-03-27-075002.thumb|false|false|역류(96회)|1522104602|2393|0|1]]></recording_6><recording_7><![CDATA[dvr://58|0|16|242|홈&쇼핑|8||0|2|619782144|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/홈&쇼핑-2018-03-23-025001.thumb|false|false|다시보는인기방송|1521741001|598|0|1]]></recording_7><recording_8><![CDATA[dvr://57|0|16|242|홈&쇼핑|8||0|2|2484322304|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/홈&쇼핑-2018-03-23-021001.thumb|false|false|다시보는인기방송|1521738601|2398|0|1]]></recording_8><recording_9><![CDATA[dvr://56|0|16|313|KBS1|9||0|2|994082816|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/KBS1-2018-03-23-012001.thumb|false|false|인간극장 스페셜|1521735601|5998|0|1]]></recording_9><recording_10><![CDATA[dvr://55|0|16|311|SBS|5||0|2|2699960320|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-23-010010.thumb|false|false|문화가중계|1521734410|1188|0|1]]></recording_10><recording_11><![CDATA[dvr://54|0|16|311|SBS|5||0|2|4090085376|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-23-003001.thumb|false|false|나이트라인|1521732601|1799|0|1]]></recording_11><recording_12><![CDATA[dvr://53|0|16|311|SBS|5||0|2|1359769600|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-22-235002.thumb|false|false|김어준의 블랙하우스 2부|1521730202|598|0|1]]></recording_12><recording_13><![CDATA[dvr://52|0|16|311|SBS|5||0|2|1145925632|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-22-231001.thumb|false|false|김어준의 블랙하우스 1부|1521727801|2393|0|1]]></recording_13><recording_14><![CDATA[dvr://51|0|128|311|SBS|5|0001100|3|2|4071968768|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-22-220002.thumb|false|false|리턴(33회)|1521723602|1792|0|1]]></recording_14><recording_15><![CDATA[dvr://50|0|16|311|SBS|5||2|2|4087152640|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-22-205501.thumb|false|false|순간포착 세상에 이런일이|1521719701|1797|0|1]]></recording_15><recording_16><![CDATA[dvr://49|0|16|311|SBS|5||0|2|4087029760|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-22-200001.thumb|false|false|SBS 8 뉴스|1521716401|1797|0|1]]></recording_16><recording_17><![CDATA[dvr://48|0|16|311|SBS|5||0|2|4085649408|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-22-190002.thumb|false|false|생방송 투데이|1521712802|1797|0|1]]></recording_17><recording_18><![CDATA[dvr://47|0|16|311|SBS|5||3|2|4086222848|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-22-180002.thumb|false|false|정글의 법칙|1521709202|1797|0|1]]></recording_18><recording_19><![CDATA[dvr://46|0|16|311|SBS|5||0|2|4077146112|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-22-170001.thumb|false|false|SBS 오뉴스|1521705601|1793|0|1]]></recording_19><recording_20><![CDATA[dvr://45|0|16|311|SBS|5||3|2|1247924224|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-22-160002.thumb|false|false|본격연예 한밤|1521702002|549|0|1]]></recording_20><recording_21><![CDATA[dvr://44|0|16|461|GS SHOP|6||0|2|4252950528|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/GS SHOP-2018-03-22-144001.thumb|false|false|보험|1521697201|3600|0|1]]></recording_21><recording_22><![CDATA[dvr://43|0|16|311|SBS|5||0|2|4085403648|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-22-140002.thumb|false|false|뉴스브리핑|1521694802|1798|0|1]]></recording_22><recording_23><![CDATA[dvr://42|0|16|194|YTN|24||0|2|14356480|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/YTN-2018-03-22-134516.thumb|false|false|뉴스N이슈|1521693916|13|0|1]]></recording_23><recording_24><![CDATA[dvr://41|0|16|461|GS SHOP|6||0|2|210087936|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/GS SHOP-2018-03-22-133702.thumb|false|false|교육문화|1521693422|177|0|1]]></recording_24><recording_25><![CDATA[dvr://40|0|16|311|SBS|5||3|2|3614019584|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-22-133344.thumb|false|false|백년손님|1521693224|1571|0|1]]></recording_25><recording_26><![CDATA[dvr://39|0|16|314|MBC|11|0001100|3|2|404488192|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/MBC-2018-03-21-223502.thumb|false|false|손 꼭 잡고, 지는 석양을 바라보자(2회...|1521639302|2097|0|1]]></recording_26><recording_27><![CDATA[dvr://38|0|128|312|KBS2|7|0001100|3|2|4104028160|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/KBS2-2018-03-21-220001.thumb|false|false|추리의 여왕 시즌2(7회)|1521637201|1798|0|1]]></recording_27><recording_28><![CDATA[dvr://37|0|16|312|KBS2|7||3|2|4104019968|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/KBS2-2018-03-21-205501.thumb|false|false|살림하는 남자들|1521633301|1798|0|1]]></recording_28><recording_29><![CDATA[dvr://36|0|16|311|SBS|5||0|2|273711104|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-21-205501.thumb|false|false|영재발굴단|1521633301|3898|0|1]]></recording_29><recording_30><![CDATA[dvr://35|0|16|312|KBS2|7||0|2|3415810048|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/KBS2-2018-03-21-203001.thumb|false|false|글로벌24|1521631801|1496|0|1]]></recording_30><recording_31><![CDATA[dvr://34|0|16|312|KBS2|7||3|2|4087177216|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/KBS2-2018-03-21-195001.thumb|false|false|인형의 집(18회)|1521629401|1792|0|1]]></recording_31><recording_32><![CDATA[dvr://33|0|16|312|KBS2|7||0|2|4103237632|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/KBS2-2018-03-21-183002.thumb|false|false|2TV 생생정보|1521624602|1798|0|1]]></recording_32><recording_33><![CDATA[dvr://32|0|16|312|KBS2|7||0|2|2432536576|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/KBS2-2018-03-21-181209.thumb|false|false|KBS 경제타임|1521623529|1065|0|1]]></recording_33><recording_34><![CDATA[dvr://31|0|16|313|KBS1|9||0|2|721063936|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/KBS1-2018-03-21-162331.thumb|false|false|4시 뉴스집중|1521617011|2188|0|1]]></recording_34><recording_35><![CDATA[dvr://30|0|16|312|KBS2|7||2|2|754307072|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/KBS2-2018-03-21-162307.thumb|false|false|여유만만|1521616987|2212|0|1]]></recording_35><recording_36><![CDATA[dvr://29|0|16|312|KBS2|7||0|2|4103159808|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/KBS2-2018-03-21-153001.thumb|false|false|TV 유치원|1521613801|1798|0|1]]></recording_36><recording_37><![CDATA[dvr://28|0|16|727|헬로TV+HD|0||3|2|1727651840|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/헬로TV+HD-2018-03-21-142002.thumb|false|false|신작 VOD|1521609602|2398|0|1]]></recording_37><recording_38><![CDATA[dvr://27|0|16|462|NS홈쇼핑|4||1|2|2824642560|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/NS홈쇼핑-2018-03-21-134001.thumb|false|false|수납용품|1521607201|2398|0|1]]></recording_38><recording_39><![CDATA[dvr://26|0|16|727|헬로TV+HD|0||3|2|1534304256|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/헬로TV+HD-2018-03-21-132424.thumb|false|false|신작 VOD|1521606264|2130|0|1]]></recording_39><recording_40><![CDATA[dvr://25|0|16|727|헬로TV+HD|0||3|2|683991040|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/헬로TV+HD-2018-03-21-114352.thumb|false|false|신작 VOD|1521600232|962|0|1]]></recording_40><recording_41><![CDATA[dvr://24|0|16|311|SBS|5||0|2|4086046720|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-21-102502.thumb|false|false|SBS 생활경제|1521595502|1797|0|1]]></recording_41><recording_42><![CDATA[dvr://23|0|16|311|SBS|5||0|2|2039771136|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-21-101002.thumb|false|false|SBS 뉴스|1521594602|897|0|1]]></recording_42><recording_43><![CDATA[dvr://22|0|16|311|SBS|5||2|2|4089802752|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-21-091001.thumb|false|false|좋은아침|1521591001|1798|0|1]]></recording_43><recording_44><![CDATA[dvr://21|0|128|311|SBS|5|0111110|3|2|716685312|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/SBS-2018-03-21-090444.thumb|false|false|해피 시스터즈(74회)|1521590684|315|0|1]]></recording_44><recording_45><![CDATA[dvr://20|0|16|138|tvN HD|17||3|2|1520418816|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-21-084001.thumb|false|false|화유기(6회)|1521589201|1445|0|1]]></recording_45><recording_46><![CDATA[dvr://19|0|16|138|tvN HD|17||3|2|1891348480|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-21-070001.thumb|false|false|화유기(5회)|1521583201|1797|0|1]]></recording_46><recording_47><![CDATA[dvr://18|0|16|0||-1||2|2|1840828416|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-21-060001.thumb|false|false||1521579601|1798|0|1]]></recording_47><recording_48><![CDATA[dvr://17|0|16|138|tvN HD|17||3|2|1886621696|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-21-052401.thumb|false|false|명단공개(209회)|1521577441|1793|0|1]]></recording_48><recording_49><![CDATA[dvr://16|0|16|138|tvN HD|17||3|2|1886830592|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-21-041601.thumb|false|false|어쩌다 어른(126회)<김미경>|1521573361|1793|0|1]]></recording_49><recording_50><![CDATA[dvr://15|0|16|138|tvN HD|17||3|2|1886961664|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-21-025101.thumb|false|false|라이브(4회)|1521568261|1793|0|1]]></recording_50><recording_51><![CDATA[dvr://14|0|16|138|tvN HD|17||3|2|1887121408|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-21-012901.thumb|false|false|라이브(3회)|1521563341|1793|0|1]]></recording_51><recording_52><![CDATA[dvr://13|0|16|138|tvN HD|17||3|2|1886601216|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-21-002001.thumb|false|false|프리한 19(97회)|1521559201|1793|0|1]]></recording_52><recording_53><![CDATA[dvr://12|0|16|138|tvN HD|17||3|2|1886892032|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-230001.thumb|false|false|달팽이 호텔(8회)|1521554401|1793|0|1]]></recording_53><recording_54><![CDATA[dvr://11|0|128|138|tvN HD|17|0110000|3|2|1886736384|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-214001.thumb|false|false|크로스(16회)<최종화>|1521549601|1793|0|1]]></recording_54><recording_55><![CDATA[dvr://10|0|16|138|tvN HD|17||3|2|1891647488|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-202602.thumb|false|false|크로스(15회)|1521545162|1798|0|1]]></recording_55><recording_56><![CDATA[dvr://9|0|16|138|tvN HD|17||0|2|4163694592|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-192002.thumb|false|false|토론대첩(3회)|1521541202|3957|0|1]]></recording_56><recording_57><![CDATA[dvr://8|0|16|141|OCN|21||2|2|69304320|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/OCN-2018-03-20-191209.thumb|false|false|임금님의 사건수첩<1부>|1521540729|67|0|1]]></recording_57><recording_58><![CDATA[dvr://7|0|16|442|TV조선HD|19||0|2|54595584|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/TV조선HD-2018-03-20-191019.thumb|false|false|야생의 왕국|1521540619|52|0|1]]></recording_58><recording_59><![CDATA[dvr://6|0|16|441|jTBC HD|18||3|2|174907392|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/jTBC HD-2018-03-20-190537.thumb|false|false|아는 형님(119회)|1521540337|177|0|1]]></recording_59><recording_60><![CDATA[dvr://5|0|16|195|MBN|16||0|2|1557663744|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/MBN-2018-03-20-183137.thumb|false|false|MBN 뉴스와이드|1521538297|1984|0|1]]></recording_60><recording_61><![CDATA[dvr://4|1147928579|10|242|홈&쇼핑|8||0|2|14856192|2|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/홈&쇼핑-2017-12-17-085812.thumb|false|false|에드워드권아보카도오일|1513468692|14|0|1]]></recording_61><recording_62><![CDATA[dvr://3|1147928578|10|122|CJ오쇼핑|10||0|2|16539648|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/CJ오쇼핑-2017-12-17-085602.thumb|false|false|이미용품 1부|1513468562|16|0|1]]></recording_62><recording_63><![CDATA[dvr://2|1147928576|10|309||-1||0|2|569729024|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/KBS1-2017-12-17-085546.thumb|false|false|일요진단|1513468546|254|0|1]]></recording_63><recording_64><![CDATA[dvr://1|1147928576|10|309||-1||0|2|0|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/KBS1-2017-12-17-085539.thumb|false|false|일요진단|1513468539|7200|1|1]]></recording_64></DATA></INTERFACE>';
        // xmlString = '<INTERFACE version="3"><TYPE>response </TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>Recordings</CONTENTS><DATA><totalCount>11</totalCount><count>11</count><recording_0><![CDATA[dvr://11|0|128|138|tvN HD|17|0110000|3|2|1886736384|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-214001.thumb|false|false|크로스 16회 최종화|1521549601|1793|0|1]]></recording_0><recording_1><![CDATA[dvr://11|0|128|138|tvN HD|17|0110000|3|2|1886736384|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-214001.thumb|false|false|크로스 15회|1521549601|1793|0|1]]></recording_1><recording_2><![CDATA[dvr://11|0|128|138|tvN HD|17|0110000|3|2|1886736384|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-214001.thumb|false|false|크로스 14회|1521549601|1793|0|1]]></recording_2><recording_3><![CDATA[dvr://11|0|128|138|tvN HD|17|0110000|3|2|1886736384|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-214001.thumb|false|false|크로스 13회|1521549601|1793|0|1]]></recording_3><recording_4><![CDATA[dvr://11|0|128|138|tvN HD|17|0110000|3|2|1886736384|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-214001.thumb|false|false|크로스 12회|1521549601|1793|0|1]]></recording_4><recording_5><![CDATA[dvr://11|0|128|138|tvN HD|17|0110000|3|2|1886736384|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-214001.thumb|false|false|크로스 11회|1521549601|1793|0|1]]></recording_5><recording_6><![CDATA[dvr://11|0|128|138|tvN HD|17|0110000|3|2|1886736384|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-214001.thumb|false|false|크로스 10회|1521549601|1793|0|1]]></recording_6><recording_7><![CDATA[dvr://11|0|128|138|tvN HD|17|0110000|3|2|1886736384|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-214001.thumb|false|false|크로스 9회|1521549601|1793|0|1]]></recording_7><recording_8><![CDATA[dvr://11|0|128|138|tvN HD|17|0110000|3|2|1886736384|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-214001.thumb|false|false|크로스 8회|1521549601|1793|0|1]]></recording_8><recording_9><![CDATA[dvr://11|0|128|138|tvN HD|17|0110000|3|2|1886736384|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-214001.thumb|false|false|크로스 7회|1521549601|1793|0|1]]></recording_9><recording_10><![CDATA[dvr://11|0|128|138|tvN HD|17|0110000|3|2|1886736384|0|0|file:///mnt/expand/52922d89-8ee1-4edb-a9ba-3a5fd848f808/tvN HD-2018-03-20-214001.thumb|false|false|크로스 6회|1521549601|1793|0|1]]></recording_10></DATA></INTERFACE>';

        xmlString = '<INTERFACE version="3"><TYPE>response</TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>Recordings</CONTENTS><DATA><totalCount>24</totalCount><count>24</count><recording_0><![CDATA[dvr://24|1161363467|16|227|K star|48||3|2|11071488|0|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/K star-2018-07-09-205602.thumb|false|false|히든싱어(4회)|1531137362|15|0|1]]></recording_0><recording_1><![CDATA[dvr://23|1161363466|16|139|채널CGV|49||3|2|15663104|0|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/채널CGV-2018-07-09-205558.thumb|false|false|엑스맨:퍼스트 클래스<1부>|1531137358|14|0|1]]></recording_1><recording_2><![CDATA[dvr://22|1161363465|16|197|KBS W|53||3|2|46067712|0|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/KBS W-2018-07-09-205502.thumb|false|false|영화가 좋다(602회)|1531137302|44|0|1]]></recording_2><recording_3><![CDATA[dvr://21|1161363464|16|140|XtvN|52||2|2|46665728|0|0|file:///mnt/expand/aa7…f2a-4442-949a-7bd32fc1bb3a/media/XtvN-2018-07-09-205455.thumb|false|false|동방신기의 72시간(10회)<72시간 동...|1531137295|44|0|1]]></recording_3><recording_4><![CDATA[dvr://20|1161363463|16|227|K star|48||3|2|23965696|0|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/K star-2018-07-09-205356.thumb|false|false|히든싱어(4회)|1531137236|33|0|1]]></recording_4><recording_5><![CDATA[dvr://19|1161363462|16|139|채널CGV|49||3|2|44253184|0|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/채널CGV-2018-07-09-205343.thumb|false|false|엑스맨:퍼스트 클래스<1부>|1531137223|42|0|1]]></recording_5><recording_6><![CDATA[dvr://18|1161363461|16|468|GTV|55||2|2|32268288|0|0|file:///mnt/expand/aa7a…cf2a-4442-949a-7bd32fc1bb3a/media/GTV-2018-07-09-205243.thumb|false|false|혼밥스타그램 시즌2(12회)<브로맨스...|1531137163|42|0|1]]></recording_6><recording_7><![CDATA[dvr://17|1161363460|16|135|O tvN|41||3|2|46710784|0|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/O tvN-2018-07-09-205235.thumb|false|false|꽃보다 할배 리턴즈(1회)|1531137155|45|0|1]]></recording_7><recording_8><![CDATA[dvr://16|1161363459|16|285|CNTV|46||3|2|11976704|0|0|file:///mnt/expand/aa7…f2a-4442-949a-7bd32fc1bb3a/media/CNTV-2018-07-09-205210.thumb|false|false|은희<15,16회>|1531137130|11|0|1]]></recording_8><recording_9><![CDATA[dvr://15|1161363458|16|197|KBS W|53||3|2|24813568|0|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/KBS W-2018-07-09-205203.thumb|false|false|영화가 좋다(602회)|1531137123|23|0|1]]></recording_9><recording_10><![CDATA[dvr://14|1161363457|16|227|K star|48||3|2|32559104|0|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/K star-2018-07-09-205111.thumb|false|false|히든싱어(4회)|1531137071|44|0|1]]></recording_10><recording_11><![CDATA[dvr://13|1161363456|16|139|채널CGV|49||3|2|49717248|0|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/채널CGV-2018-07-09-205104.thumb|false|false|엑스맨:퍼스트 클래스<1부>|1531137064|47|0|1]]></recording_11><recording_12><![CDATA[dvr://12|1161232385|64|0||-1|0000000|0|2|166211584|0|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/트렌디-2018-07-07-235601.thumb|false|false||0|0|0|1]]></recording_12><recording_13><![CDATA[dvr://11|1161232387|16|468|GTV|55||3|2|0|1|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/GTV-2018-07-07-234903.thumb|false|false|NEW 코리아 헌터(19회)|1530974943|9|1|1]]></recording_13><recording_14><![CDATA[dvr://10|1161232385|64|0||-1|0000000|0|2|0|2|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/트렌디-2018-07-07-234844.thumb|false|false||0|0|1|1]]></recording_14><recording_15><![CDATA[dvr://9|1161232385|64|0||-1|0000000|0|2|38486016|0|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/트렌디-2018-07-07-234801.thumb|false|false||0|0|0|1]]></recording_15><recording_16><![CDATA[dvr://8|1161166862|32|314|MBC|11||0|2|3119890432|0|0|file:///mnt/expand/aa7…-4442-949a-7bd32fc1bb3a/media/MBC-2018-07-07-020001.thumb|false|false|2018 FIFA 러시아 월드컵<브라질:벨기 ...|1530896401|10798|0|1]]></recording_16><recording_17><![CDATA[dvr://7|1161166861|32|314|MBC|11||0|2|3922792448|0|0|file:///mnt/expand/aa7…-4442-949a-7bd32fc1bb3a/media/MBC-2018-07-07-010001.thumb|false|false|2018 FIFA 러시아월드컵 하이라이트 / ...|1530892801|3598|0|1]]></recording_17><recording_18><![CDATA[dvr://6|1161166859|128|441|jTBC HD|18|0000011|3|2|452157440|0|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/jTBC HD-2018-07-06-230001.thumb|false|false|스케치(13회)|1530885601|4798|0|1]]></recording_18><recording_19><![CDATA[dvr://4|1161166860|32|314|MBC|11||0|2|195252224|0|0|file:///mnt/expand/aa7a…-4442-949a-7bd32fc1bb3a/media/MBC-2018-07-06-215002.thumb|false|false|2018 FIFA 러시아 월드컵<우루과이,프 ...|1530881402|11392|0|1]]></recording_19><recording_20><![CDATA[dvr://5|1161166863|16|134|MBC에브리원|1||3|2|1982844928|0|0|file:///mnt/expand/aa7a07a3-cf2a-4442-949a-7bd32fc1bb3a/media/MBC에브리원-2018-07-06-192205.thumb|false|false|나 혼자 산다(250회)|1530872525|1914|0|1]]></recording_20><recording_21><![CDATA[dvr://3|1161166854|128|314|MBC|11|0111110|3|2|1158692864|0|0|file:///mnt/ex…cf2a-4442-949a-7bd32fc1bb3a/media/MBC-2018-07-06-191501.thumb|false|false|비밀과 거짓말(10회)|1530872101|2398|0|1]]></recording_21><recording_22><![CDATA[dvr://2|1161166853|16|314|MBC|11||2|2|452763648|0|0|file:///mnt/expand/aa7a…cf2a-4442-949a-7bd32fc1bb3a/media/MBC-2018-07-06-184013.thumb|false|false|생방송 오늘 저녁|1530870013|2086|0|1]]></recording_22><recording_23><![CDATA[dvr://1|1161166852|16|141|OCN|21||3|2|2494636032|0|0|file:///mnt/expand/aa7…cf2a-4442-949a-7bd32fc1bb3a/media/OCN-2018-07-06-183951.thumb|false|false|킹스맨:시크릿 에이전트<1부>|1530869991|2409|0|1]]></recording_23></DATA></INTERFACE>';

        App.api.csApi.response(xmlString);
    }

    function getStorageInfoTest() {
        var xmlString = "";

        // 90%
        xmlString = '<INTERFACE version="3"><TYPE>response </TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>StorageInfo</CONTENTS><DATA><total>948819280</total><free>94881928</free></DATA></INTERFACE>';
        // 89%
        // xmlString = '<INTERFACE version="3"><TYPE>response </TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>StorageInfo</CONTENTS><DATA><total>948819280</total><free>104370120</free></DATA></INTERFACE>';
        // xmlString = '<INTERFACE version="3"><TYPE>response </TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>StorageInfo</CONTENTS><DATA><total>0</total><free>0</free></DATA></INTERFACE>';

        App.api.csApi.response(xmlString);
    }

    function getScheduleItemTest() {
        var xmlString = "";

        // 예약 없음
        xmlString = '<INTERFACE version="3"><TYPE>response </TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>ScheduleItems</CONTENTS><DATA><totalCount>0</totalCount><count>0</count></DATA></INTERFACE>';

        // 예약 정보 있음
        // xmlString = '<INTERFACE version="3"><TYPE>response</TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>ScheduleItems</CONTENTS><DATA><totalCount>16</totalCount><count>16</count><scheduleItem_0><![CDATA[1154940933|128|314|MBC|11|1527502500|1527504900|0000000|0|0||1527502500|2400|14022|314|M814102586314|0|전생에 웬수들|]]></scheduleItem_0><scheduleItem_1><![CDATA[1154940934|32|313|KBS1|9|1527506700|1527508800|0000000|0|0||1527506700|2100|14031|313|M914123740313|0|내일도 맑음|]]></scheduleItem_1><scheduleItem_2><![CDATA[1154940935|32|312|KBS2|7|1522645800|1522648800||0|0||1522645800|3000|1015|312||3|영화가 좋다|]]></scheduleItem_2><scheduleItem_3><![CDATA[1154940930|64|314|MBC|11|0|0|0000000|0|0||1522645816|2400|-1|314||-1|시간지정 녹화 단건|]]></scheduleItem_3><scheduleItem_4><![CDATA[1154940937|32|312|KBS2|7|1522648800|1522650600||0|0||1522648800|1800|1016|312||0|자동공부책상 위키 2|]]></scheduleItem_4><scheduleItem_5><![CDATA[1154940936|32|312|KBS2|7|1522650600|1522652400||0|0||1522650600|1800|1017|312||0|TV 유치원|]]></scheduleItem_5><scheduleItem_6><![CDATA[1154940938|32|312|KBS2|7|1522652400|1522656000||0|0||1522652400|3600|1018|312||2|여유만만|]]></scheduleItem_6><scheduleItem_7><![CDATA[1154940939|32|312|KBS2|7|1522656000|1522659600||0|0||1522656000|3600|1019|312||3|살림하는 남자들|]]></scheduleItem_7><scheduleItem_8><![CDATA[1154940940|32|312|KBS2|7|1522659600|1522661400||0|0||1522659600|1800|1020|312||0|KBS 경제타임|]]></scheduleItem_8><scheduleItem_9><![CDATA[1154940941|32|312|KBS2|7|1522661400|1522666200||0|0||1522661400|4800|1021|312||0|2TV 생생정보|]]></scheduleItem_9><scheduleItem_10><![CDATA[1154940942|32|312|KBS2|7|1522666200|1522668600||0|0||1522666200|2400|1022|312|M914114342312|3|인형의 집(26회)|]]></scheduleItem_10><scheduleItem_11><![CDATA[1154940943|32|312|KBS2|7|1522668600|1522670100||0|0||1522668600|1500|1023|312||0|글로벌24|]]></scheduleItem_11><scheduleItem_12><![CDATA[1154940944|32|312|KBS2|7|1522670100|1522674000||0|0||1522670100|3900|1024|312||3|제보자들|]]></scheduleItem_12><scheduleItem_13><![CDATA[1154940945|32|312|KBS2|7|1522674000|1522678200||0|0||1522674000|4200|1025|312|M914115962312|3|우리가 만난 기적(1회)|]]></scheduleItem_13><scheduleItem_14><![CDATA[1154940946|128|312|KBS2|7|51000000|-30300000|0100000|0|0||1522678200|5100|1026|312|M013037395312|3|대국민 토크쇼 안녕하세요|]]></scheduleItem_14><scheduleItem_15><![CDATA[1154940929|64|311|SBS|5|16200000|18600000|0111110|0|0||1522729800|2400|-1|311||-1|시간지정 녹화 반복|]]></scheduleItem_15></DATA></INTERFACE>';

        //채널가이드 라벨용 더미
        // xmlString = '<INTERFACE version="3"><TYPE>response </TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>ScheduleItems</CONTENTS><DATA><totalCount>12</totalCount><count>12</count><scheduleItem_0><![CDATA[1155661826|16|118|K쇼핑 HD|26|1523611083|1523612700||0|1||1523611083|1617|6525|118||0|캘리포니아 생 아보카도|]]></scheduleItem_0><scheduleItem_1><![CDATA[1155661827|16|710|롯데oneTV|28|1523611090|1523611680||0|0||1523611090|590|6535|710||0|신선식품|]]></scheduleItem_1><scheduleItem_2><![CDATA[1155661829|32|706|신세계쇼핑|30|1523612040|1523615700||0|0||1523612040|3660|6521|706||0|여행|]]></scheduleItem_2><scheduleItem_3><![CDATA[1155661830|32|706|신세계쇼핑|30|1523615700|1523619300||0|0||1523615700|3600|6522|706||0|레포츠|]]></scheduleItem_3><scheduleItem_4><![CDATA[1155661831|32|706|신세계쇼핑|30|1523619300|1523622960||0|0||1523619300|3660|6523|706||0|여행|]]></scheduleItem_4><scheduleItem_5><![CDATA[1155661832|32|706|신세계쇼핑|30|1523622960|1523626560||0|0||1523622960|3600|6524|706||0|의류|]]></scheduleItem_5><scheduleItem_6><![CDATA[1155661833|32|706|신세계쇼핑|30|1523626560|1523630220||0|0||1523626560|3660|6525|706||0|레포츠|]]></scheduleItem_6><scheduleItem_7><![CDATA[1155661834|32|706|신세계쇼핑|30|1523633820|1523637480||0|0||1523633820|3660|7007|706||0|여행|]]></scheduleItem_7><scheduleItem_8><![CDATA[1155661835|32|706|신세계쇼핑|30|1523637480|1523646000||0|0||1523637480|8520|7008|706||0|레포츠|]]></scheduleItem_8><scheduleItem_9><![CDATA[1155661836|32|706|신세계쇼핑|30|1523646000|1523660400||0|0||1523646000|14400|7002|706||0|추천상품 입니다|]]></scheduleItem_9><scheduleItem_10><![CDATA[1155661837|32|706|신세계쇼핑|30|1523660400|1523674800||0|0||1523660400|14400|7003|706||0|추천상품 입니다|]]></scheduleItem_10><scheduleItem_11><![CDATA[1155661838|32|706|신세계쇼핑|30|1523674800|1523689200||0|0||1523674800|14400|7004|706||0|추천상품 입니다|]]></scheduleItem_11></DATA></INTERFACE>';

        App.api.csApi.response(xmlString);
    }

    function getCurrentRecordingProgramTest() {
        var xmlString = "";

        xmlString = '<INTERFACE version="3"><TYPE>response </TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>CurrentRecordingProgram</CONTENTS><DATA></DATA></INTERFACE>';
        // xmlString = '<INTERFACE version="3"><TYPE>response </TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>CurrentRecordingProgram</CONTENTS><DATA><scheduleItem><![CDATA[1523514309|2211|6010|134||2|전지적 참견 시점(5회)]]></scheduleItem><scheduleItem><![CDATA[1523514420|1080|6017|198||0|행복 부동산 연구소]]></scheduleItem></DATA></INTERFACE>';
        // xmlString = '<INTERFACE version="3"><TYPE>response </TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>CurrentRecordingProgram</CONTENTS><DATA><scheduleItem><![CDATA[1523514309|2211|6010|134||2|전지적 참견 시점(5회)]]></scheduleItem></DATA></INTERFACE>';
        // xmlString = '<INTERFACE version="3"><TYPE>response </TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>CurrentRecordingProgram</CONTENTS><DATA></DATA></INTERFACE>';

        App.api.csApi.response(xmlString);
    }


    function startVodTest() {

        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StartVod</COMMAND>";
        xmlString += "<CONTENTS>VOD</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<title>루시드 드림(무료)</title><actors>고수,설경구,박유천,강혜정,박인환,천호진,진석호,이석</actors><directors>김준성</directors><fileName>M4409493.mpg</fileName><offset>0</offset><VODType>fp</VODType><categoryId>2665165</categoryId><assetId>cjc|M4409493LFO692799001</assetId><productId>475</productId><goodId>2659266</goodId><nextVODPlay>false</nextVODPlay><nextWatchId></nextWatchId><tmpSeriesPlayOn>false</tmpSeriesPlayOn><CBRVOD>0</CBRVOD><ecmResultCode></ecmResultCode><ecmGroupData></ecmGroupData><fromCPA>false</fromCPA><iFrameEndURL>http://10.10.69.100:3080/static/image/background/vodEnd/copy/d71fa1cf-29b0-4a83-9df7-bbc5286ebd76.jpg</iFrameEndURL>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    /* modified by jjhan 20170909 더미로 구현한 부분 실제로 구현해 놓음 */
    function startVod(options) {

        var opts = {
            title: ""
            , actors: ""
            , directors: ""
            , fileName: ""
            , offset: ""
            , VODType: ""
            , categoryId: ""
            , assetId: ""
            , sassetId: ""
            , seriesId: ""
            , productId: ""
            , goodId: ""
            , nextVODPlay: ""
            , nextWatchId: ""
            , tmpSeriesPlayOn: ""
            , CBRVOD: ""
            , ecmResultCode: ""
            , ecmGroupData: ""
            , fromCPA: ""
            , iFrameEndURL: ""
            , cookie: ""           /* 20170909 추가된 항목 add by jjhan */
            , thumbnailBaseUrl: "" /* 20170909 추가된 항목 add by jjhan */
            , stopApp: true
            , isSeries: false
        };
        $.extend(opts, options);

        var resultThumbnailBaseUrl = "";
        if (opts.thumbnailBaseUrl == undefined || opts.thumbnailBaseUrl == "" || opts.thumbnailBaseUrl == null) {
            resultThumbnailBaseUrl = "";
        } else {
            resultThumbnailBaseUrl = App.api.bizpf._serverIpImg + opts.thumbnailBaseUrl;
        }

        var add_1 = '';
        if (opts.offset == 0) {
            add_1 = 1;
        } else {
            add_1 = 2;
        }

        //@TODO RED STB에 WTCH_0001로그 적재 삭제되면 아래 레드만 전달하는 로직 제거 할것!
        //@TODO 모든 셋톱박스에서 로그 올라가도록 수정 필
        if(!App.fn.globalUtil.is("RED")){
            App.api.fn.setLog({
                logLevel: "1",
                log_name: "vodWatchLog",
                storage_group_id: "VOD",
                log_id: "WTCH_0001",
                data: {
                    "ctgr": opts.categoryId,
                    "series": opts.seriesId,
                    "sasset": opts.sassetId,
                    "asset": opts.assetId,
                    "evnt": null,
                    "cpn": opts.logData ? opts.logData.cpn : null,
                    "dc_cpn": opts.logData ? opts.logData.dc_cpn : null,
                    "lst_dtl_entry": App.fn.entryCode.getCode(),
                    "drtn": null,
                    "wtch_log_id": null,
                    "ct_tp": "asset",
                    "ct_id": opts.assetId,
                    "paymnt_mthd": opts.logData ? opts.logData.paymnt_mthd: null,
                    "paymnt_mthd_prc": opts.logData ? opts.logData.paymnt_mthd_prc : null,
                    "paymnt_opt": opts.logData ? opts.logData.paymnt_opt : null,
                    "paymnt_opt_prc": opts.logData ? opts.logData.paymnt_opt_prc : null,
                    "prchs_log_id": opts.logData ? opts.logData.prchs_log_id: null,
                    "prchs_prod_id": opts.logData ? opts.logData.prchs_prod_id: null,
                    "prchs_prod_tp": opts.logData ? opts.logData.prchs_prod_tp: null,
                    "add_1": add_1,
                    "add_2": ""
                }
            });
        }


        /**
         * globalUtil 확인 (방어로직)
         * @type {string}
         */
        if (!App.fn.globalUtil) {
            App.fn.globalUtil = new directory.globalUtil();
        }

        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StartVod</COMMAND>";
        xmlString += "<CONTENTS>VOD</CONTENTS>";
        xmlString += "<DATA>";

        /**
         * red 셋탑 CDATA 처리
         * 모든 셋탑으로 확대 2018.11.30
         */
        // if(App.fn.globalUtil.is("RED")){
        xmlString += "<title><![CDATA[" + opts.title + "]]></title><actors><![CDATA[" + opts.actors + "]]></actors><directors><![CDATA[" + opts.directors + "]]></directors><fileName>" + opts.fileName + "</fileName><offset>" + opts.offset + "</offset><VODType>" + opts.VODType + "</VODType><categoryId>" + opts.categoryId + "</categoryId><assetId>" + opts.assetId + "</assetId><sassetId>" + opts.sassetId + "</sassetId><seriesId>" + opts.seriesId + "</seriesId><productId>" + opts.productId + "</productId><goodId>" + opts.goodId + "</goodId><nextVODPlay>" + opts.nextVODPlay + "</nextVODPlay><nextWatchId>" + opts.nextWatchId + "</nextWatchId><tmpSeriesPlayOn>" + opts.tmpSeriesPlayOn + "</tmpSeriesPlayOn><CBRVOD>" + opts.CBRVOD + "</CBRVOD><ecmResultCode>" + opts.ecmResultCode + "</ecmResultCode><ecmGroupData>" + opts.ecmGroupData + "</ecmGroupData><fromCPA>" + opts.fromCPA + "</fromCPA><iFrameEndURL>" + opts.iFrameEndURL + "</iFrameEndURL><cookie>" + opts.cookie + "</cookie><thumbnailBaseUrl>" + resultThumbnailBaseUrl + "</thumbnailBaseUrl>";
        // }else{
        //     xmlString += "<title>" + opts.title + "</title><actors>" + opts.actors + "</actors><directors>" + opts.directors + "</directors><fileName>" + opts.fileName + "</fileName><offset>" + opts.offset + "</offset><VODType>" + opts.VODType + "</VODType><categoryId>" + opts.categoryId + "</categoryId><assetId>" + opts.assetId + "</assetId><sassetId>" + opts.sassetId + "</sassetId><seriesId>" + opts.seriesId + "</seriesId><productId>" + opts.productId + "</productId><goodId>" + opts.goodId + "</goodId><nextVODPlay>" + opts.nextVODPlay + "</nextVODPlay><nextWatchId>" + opts.nextWatchId + "</nextWatchId><tmpSeriesPlayOn>" + opts.tmpSeriesPlayOn + "</tmpSeriesPlayOn><CBRVOD>" + opts.CBRVOD + "</CBRVOD><ecmResultCode>" + opts.ecmResultCode + "</ecmResultCode><ecmGroupData>" + opts.ecmGroupData + "</ecmGroupData><fromCPA>" + opts.fromCPA + "</fromCPA><iFrameEndURL>" + opts.iFrameEndURL + "</iFrameEndURL><cookie>" + opts.cookie + "</cookie><thumbnailBaseUrl>" + resultThumbnailBaseUrl + "</thumbnailBaseUrl>";
        // }

        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        console.timeEnd('startVod');

        App.api.csApi.request(xmlString);


        App.api.fn.getPromotionList({
            typeId: "BG", //유형 ID M
            reqType: "TAG", //요청 유형
            areaId: "VODLOADING", //영역 아이디 M (baseId (home일경우)
            offset: "0", //페이지 시작위치  O
            limit: "0", //조회할 항목 갯수  O 기본값 전체
            callback: function (oData) {
                console.log('App.api.fn.getPromotionList =========================================');
                console.log(oData);
                var bgData = oData.data[Math.floor(Math.random() * oData.data.length)].image1;
                $('#container').hide();

                $('#wrap').append('<div id="iframevod" style="width:1280px; height:720px; padding: 0; overflow: hidden; position:absolute; top:0; left: 0; z-index: 10000"><img src ="' + bgData + '" style="width:100%; height:100%"></div>');

                var TTSString = "VOD 다운로드, HelloTV VOD를 불러오고 있습니다. 잠시만 기다려 주세요";
                App.fn.globalUtil.talkTTS(TTSString, true);

                $('._resumePopup').remove();
                setTimeout(function () {
                    $('._popup_buy_complete').remove();
                    $('#iframevod').remove();
                }, 3000);
            }, errorCallback: function (error) {
                var bgData = 'img/common/bg_iframe_default_image.gif';
                $('#wrap').append('<div id="iframevod" style="width:1280px; height:720px; padding: 0; overflow: hidden; position:absolute; top:0; left: 0; z-index: 10000"><img src ="' + bgData + '" style="width:100%; height:100%"></div>');
                $('._resumePopup').remove();
                setTimeout(function () {
                    $('._popup_buy_complete').remove();
                    $('#iframevod').remove();
                }, 3000);
            }
        });

        if (opts.stopApp == true) {
            isStopApp = true;
        }
    }

    function startVodPreview(options) {

        var opts = {
            title: ""
            , actors: ""
            , directors: ""
            , fileName: ""
            , offset: ""
            , VODType: ""
            , categoryId: ""
            , assetId: ""
            , sassetId: ""
            , seriesId: ""
            , productId: ""
            , goodId: ""
            , nextVODPlay: ""
            , nextWatchId: ""
            , tmpSeriesPlayOn: ""
            , CBRVOD: ""
            , ecmResultCode: ""
            , ecmGroupData: ""
            , fromCPA: ""
            , iFrameEndURL: ""
            , cookie: ""           /* 20170909 추가된 항목 add by jjhan */
            , thumbnailBaseUrl: "" /* 20170909 추가된 항목 add by jjhan */
            , stopApp: true
            , isSeries: false
        };
        $.extend(opts, options);

        var resultThumbnailBaseUrl = "";
        if (opts.thumbnailBaseUrl == undefined || opts.thumbnailBaseUrl == "" || opts.thumbnailBaseUrl == null) {
            resultThumbnailBaseUrl = "";
        } else {
            resultThumbnailBaseUrl = App.api.bizpf._serverIpImg + opts.thumbnailBaseUrl;
        }

        App.vars.userEventCode = "105";

        App.api.fn.setLog({
            logLevel: "4",
            bEntry: false,
            log_name: "vodWatchLog",
            storage_group_id: "VOD",
            log_id: "WTCH_0005",
            data: {
                "ctgr": opts.categoryId,
                "series": opts.seriesId,
                "sasset": opts.sassetId,
                "asset": opts.assetId,
                "evnt": null,
                "cpn": null,
                "dc_cpn": null,
                "lst_dtl_entry": "105",
                "drtn": null,
                "wtch_log_id": null,
                "ct_tp": "asset",
                "ct_id": opts.assetId,
                "add_1": null,
                "add_2": null
            }
        });

        /**
         * globalUtil 확인 (방어로직)
         * @type {string}
         */
        if (!App.fn.globalUtil) {
            App.fn.globalUtil = new directory.globalUtil();
        }

        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StartVod</COMMAND>";
        xmlString += "<CONTENTS>PREVIEW</CONTENTS>";
        xmlString += "<DATA>";
        /**
         * red 셋탑 CDATA 처리
         * 모든 셋탑으로 확대 2018.11.30
         */
        // if(App.fn.globalUtil.is("RED")){
        xmlString += "<title><![CDATA[" + opts.title + "]]></title><actors><![CDATA[" + opts.actors + "]]></actors><directors><![CDATA[" + opts.directors + "]]></directors><fileName>" + opts.fileName + "</fileName><offset>" + opts.offset + "</offset><VODType>" + opts.VODType + "</VODType><categoryId>" + opts.categoryId + "</categoryId><assetId>" + opts.assetId + "</assetId><sassetId>" + opts.sassetId + "</sassetId><seriesId>" + opts.seriesId + "</seriesId><productId>" + opts.productId + "</productId><goodId>" + opts.goodId + "</goodId><nextVODPlay>" + opts.nextVODPlay + "</nextVODPlay><nextWatchId>" + opts.nextWatchId + "</nextWatchId><tmpSeriesPlayOn>" + opts.tmpSeriesPlayOn + "</tmpSeriesPlayOn><CBRVOD>" + opts.CBRVOD + "</CBRVOD><ecmResultCode>" + opts.ecmResultCode + "</ecmResultCode><ecmGroupData>" + opts.ecmGroupData + "</ecmGroupData><fromCPA>" + opts.fromCPA + "</fromCPA><iFrameEndURL>" + opts.iFrameEndURL + "</iFrameEndURL><cookie>" + opts.cookie + "</cookie><thumbnailBaseUrl>" + resultThumbnailBaseUrl + "</thumbnailBaseUrl>";
        // }else{
        //     xmlString += "<title>" + opts.title + "</title><actors>" + opts.actors + "</actors><directors>" + opts.directors + "</directors><fileName>" + opts.fileName + "</fileName><offset>" + opts.offset + "</offset><VODType>" + opts.VODType + "</VODType><categoryId>" + opts.categoryId + "</categoryId><assetId>" + opts.assetId + "</assetId><sassetId>" + opts.sassetId + "</sassetId><seriesId>" + opts.seriesId + "</seriesId><productId>" + opts.productId + "</productId><goodId>" + opts.goodId + "</goodId><nextVODPlay>" + opts.nextVODPlay + "</nextVODPlay><nextWatchId>" + opts.nextWatchId + "</nextWatchId><tmpSeriesPlayOn>" + opts.tmpSeriesPlayOn + "</tmpSeriesPlayOn><CBRVOD>" + opts.CBRVOD + "</CBRVOD><ecmResultCode>" + opts.ecmResultCode + "</ecmResultCode><ecmGroupData>" + opts.ecmGroupData + "</ecmGroupData><fromCPA>" + opts.fromCPA + "</fromCPA><iFrameEndURL>" + opts.iFrameEndURL + "</iFrameEndURL><cookie>" + opts.cookie + "</cookie><thumbnailBaseUrl>" + resultThumbnailBaseUrl + "</thumbnailBaseUrl>";
        // }
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.vars.vodDetailPIPPlay = true;
        App.api.csApi.request(xmlString);

        if (opts.stopApp == true) {
            isStopApp = true;
        }
    }

    function startVodTrailer(options) {
        var opts = {
            title: ""
            , actors: ""
            , directors: ""
            , fileName: ""
            , offset: ""
            , VODType: ""
            , categoryId: ""
            , assetId: ""
            , sassetId: ""
            , seriesId: ""
            , productId: ""
            , goodId: ""
            , nextVODPlay: ""
            , nextWatchId: ""
            , tmpSeriesPlayOn: ""
            , CBRVOD: ""
            , ecmResultCode: ""
            , ecmGroupData: ""
            , fromCPA: ""
            , iFrameEndURL: ""
            , cookie: ""           /* 20170909 추가된 항목 add by jjhan */
            , thumbnailBaseUrl: "" /* 20170909 추가된 항목 add by jjhan */
            , stopApp: true
            , isSeries: false
        };
        $.extend(opts, options);

        var resultThumbnailBaseUrl = "";
        if (opts.thumbnailBaseUrl == undefined || opts.thumbnailBaseUrl == "" || opts.thumbnailBaseUrl == null) {
            resultThumbnailBaseUrl = "";
        } else {
            resultThumbnailBaseUrl = App.api.bizpf._serverIpImg + opts.thumbnailBaseUrl;
        }

        /**
         * globalUtil 확인 (방어로직)
         * @type {string}
         */
        if (!App.fn.globalUtil) {
            App.fn.globalUtil = new directory.globalUtil();
        }

        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StartVod</COMMAND>";
        xmlString += "<CONTENTS>VOD</CONTENTS>";
        xmlString += "<DATA>";
        /**
         * red 셋탑 CDATA 처리
         * 모든 셋탑으로 확대 2018.11.30
         */
        // if(App.fn.globalUtil.is("RED")){
        xmlString += "<title><![CDATA[" + opts.title + "]]></title><actors><![CDATA[" + opts.actors + "]]></actors><directors><![CDATA[" + opts.directors + "]]></directors><fileName>" + opts.fileName + "</fileName><offset>" + opts.offset + "</offset><VODType>" + opts.VODType + "</VODType><categoryId>" + opts.categoryId + "</categoryId><assetId>" + opts.assetId + "</assetId><sassetId>" + opts.sassetId + "</sassetId><seriesId>" + opts.seriesId + "</seriesId><productId>" + opts.productId + "</productId><goodId>" + opts.goodId + "</goodId><nextVODPlay>" + opts.nextVODPlay + "</nextVODPlay><nextWatchId>" + opts.nextWatchId + "</nextWatchId><tmpSeriesPlayOn>" + opts.tmpSeriesPlayOn + "</tmpSeriesPlayOn><CBRVOD>" + opts.CBRVOD + "</CBRVOD><ecmResultCode>" + opts.ecmResultCode + "</ecmResultCode><ecmGroupData>" + opts.ecmGroupData + "</ecmGroupData><fromCPA>" + opts.fromCPA + "</fromCPA><iFrameEndURL>" + opts.iFrameEndURL + "</iFrameEndURL><cookie>" + opts.cookie + "</cookie><thumbnailBaseUrl>" + resultThumbnailBaseUrl + "</thumbnailBaseUrl>";
        // }else{
        //     xmlString += "<title>" + opts.title + "</title><actors>" + opts.actors + "</actors><directors>" + opts.directors + "</directors><fileName>" + opts.fileName + "</fileName><offset>" + opts.offset + "</offset><VODType>" + opts.VODType + "</VODType><categoryId>" + opts.categoryId + "</categoryId><assetId>" + opts.assetId + "</assetId><sassetId>" + opts.sassetId + "</sassetId><seriesId>" + opts.seriesId + "</seriesId><productId>" + opts.productId + "</productId><goodId>" + opts.goodId + "</goodId><nextVODPlay>" + opts.nextVODPlay + "</nextVODPlay><nextWatchId>" + opts.nextWatchId + "</nextWatchId><tmpSeriesPlayOn>" + opts.tmpSeriesPlayOn + "</tmpSeriesPlayOn><CBRVOD>" + opts.CBRVOD + "</CBRVOD><ecmResultCode>" + opts.ecmResultCode + "</ecmResultCode><ecmGroupData>" + opts.ecmGroupData + "</ecmGroupData><fromCPA>" + opts.fromCPA + "</fromCPA><iFrameEndURL>" + opts.iFrameEndURL + "</iFrameEndURL><cookie>" + opts.cookie + "</cookie><thumbnailBaseUrl>" + resultThumbnailBaseUrl + "</thumbnailBaseUrl>";
        // }
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);

        App.api.fn.setLog({
            logLevel: "4",
            log_name: "vodWatchLog",
            storage_group_id: "VOD",
            log_id: "WTCH_0005",
            data: {
                "ctgr": opts.categoryId,
                "series": opts.seriesId,
                "sasset": opts.sassetId,
                "asset": opts.assetId,
                "evnt": null,
                "cpn": null,
                "dc_cpn": null,
                "lst_dtl_entry": "68",
                "drtn": null,
                "wtch_log_id": null,
                "ct_tp": "asset",
                "ct_id": opts.assetId,
                "add_1": null,
                "add_2": null
            }
        });

        App.api.fn.getPromotionList({
            typeId: "BG", //유형 ID M
            reqType: "TAG", //요청 유형
            areaId: "VODLOADING", //영역 아이디 M (baseId (home일경우)
            offset: "0", //페이지 시작위치  O
            limit: "0", //조회할 항목 갯수  O 기본값 전체
            callback: function (oData) {
                console.log('App.api.fn.getPromotionList =========================================');
                console.log(oData);
                var bgData = oData.data[Math.floor(Math.random() * oData.data.length)].image1;
                $('#container').hide();
                // {
                //     "total": 1,
                //     "totalCount": 1,
                //     "countPerPage": 0,
                //     "title": "시청제한채널",
                //     "subtitle": "시청제한채널",
                //     "description": "시청제한채널",
                //     "matlType": "BG",
                //     "data": [
                //     {
                //         "image1": "http://10.10.71.31:5081/public/static/images/cjhv/svc/promo/material/bg/104/07837b5f-9898-4a30-8202-0738b3837f2b.png",
                //         "image2": "http://10.10.71.31:5081/public/static/images/cjhv/svc/promo/material/bg/104/c9be9423-b983-46e8-95e9-8ff9930ec26d.m2v"
                //     }
                // ]
                // }
                $('body').append('<div id="iframevod" style="width:1280px; height:720px; padding: 0; overflow: hidden; position:absolute; top:0; left: 0; z-index: 10000"><img src ="' + bgData + '" style="width:100%; height:100%"></div>');

                var TTSString = "VOD 다운로드, HelloTV VOD를 불러오고 있습니다. 잠시만 기다려 주세요";
                App.fn.globalUtil.talkTTS(TTSString, true);

                setTimeout(function () {
                    $('.popup_dim').remove();
                    $('#iframevod').remove();
                }, 2500);
            }, errorCallback: function (error) {
                var bgData = 'img/common/bg_iframe_default_image.gif';
                $('body').append('<div id="iframevod" style="width:1280px; height:720px; padding: 0; overflow: hidden; position:absolute; top:0; left: 0; z-index: 10000"><img src ="' + bgData + '" style="width:100%; height:100%"></div>');
                setTimeout(function () {
                    $('.popup_dim').remove();
                    $('#iframevod').remove();
                }, 2500);
            }
        });

        if (opts.stopApp == true) {
            isStopApp = true;
        }
    }

    function startVodNumVod(options) {
        var opts = {
            title: ""
            , actors: ""
            , directors: ""
            , fileName: ""
            , offset: ""
            , VODType: ""
            , categoryId: ""
            , assetId: ""
            , productId: ""
            , goodId: ""
            , nextVODPlay: ""
            , nextWatchId: ""
            , tmpSeriesPlayOn: ""
            , CBRVOD: ""
            , ecmResultCode: ""
            , ecmGroupData: ""
            , fromCPA: ""
            , iFrameEndURL: ""
            , cookie: ""           /* 20170909 추가된 항목 add by jjhan */
            , thumbnailBaseUrl: "" /* 20170909 추가된 항목 add by jjhan */
            , previewTime: ""
        };
        $.extend(opts, options);

        var resultThumbnailBaseUrl = "";
        if (opts.thumbnailBaseUrl == undefined || opts.thumbnailBaseUrl == "" || opts.thumbnailBaseUrl == null) {
            resultThumbnailBaseUrl = "";
        } else {
            resultThumbnailBaseUrl = App.api.bizpf._serverIpImg + opts.thumbnailBaseUrl;
        }

        /**
         * globalUtil 확인 (방어로직)
         * @type {string}
         */
        if (!App.fn.globalUtil) {
            App.fn.globalUtil = new directory.globalUtil();
        }

        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StartVod</COMMAND>";
        xmlString += "<CONTENTS>NUMVOD</CONTENTS>";
        xmlString += "<DATA>";
        /**
         * red 셋탑 CDATA 처리
         * 모든 셋탑으로 확대 2018.11.30
         */
        // if(App.fn.globalUtil.is("RED")){
        xmlString += "<title><![CDATA[" + opts.title + "]]></title><actors><![CDATA[" + opts.actors + "]]></actors><directors><![CDATA[" + opts.directors + "]]></directors><fileName>" + opts.fileName + "</fileName><offset>" + opts.offset + "</offset><VODType>" + opts.VODType + "</VODType><categoryId>" + opts.categoryId + "</categoryId><assetId>" + opts.assetId + "</assetId><productId>" + opts.productId + "</productId><goodId>" + opts.goodId + "</goodId><nextVODPlay>" + opts.nextVODPlay + "</nextVODPlay><nextWatchId>" + opts.nextWatchId + "</nextWatchId><tmpSeriesPlayOn>" + opts.tmpSeriesPlayOn + "</tmpSeriesPlayOn><CBRVOD>" + opts.CBRVOD + "</CBRVOD><ecmResultCode>" + opts.ecmResultCode + "</ecmResultCode><ecmGroupData>" + opts.ecmGroupData + "</ecmGroupData><fromCPA>" + opts.fromCPA + "</fromCPA><iFrameEndURL>" + opts.iFrameEndURL + "</iFrameEndURL><cookie>" + opts.cookie + "</cookie><thumbnailBaseUrl>" + resultThumbnailBaseUrl + "</thumbnailBaseUrl>";
        // }else{
        //     xmlString += "<title>" + opts.title + "</title><actors>" + opts.actors + "</actors><directors>" + opts.directors + "</directors><fileName>" + opts.fileName + "</fileName><offset>" + opts.offset + "</offset><VODType>" + opts.VODType + "</VODType><categoryId>" + opts.categoryId + "</categoryId><assetId>" + opts.assetId + "</assetId><productId>" + opts.productId + "</productId><goodId>" + opts.goodId + "</goodId><nextVODPlay>" + opts.nextVODPlay + "</nextVODPlay><nextWatchId>" + opts.nextWatchId + "</nextWatchId><tmpSeriesPlayOn>" + opts.tmpSeriesPlayOn + "</tmpSeriesPlayOn><CBRVOD>" + opts.CBRVOD + "</CBRVOD><ecmResultCode>" + opts.ecmResultCode + "</ecmResultCode><ecmGroupData>" + opts.ecmGroupData + "</ecmGroupData><fromCPA>" + opts.fromCPA + "</fromCPA><iFrameEndURL>" + opts.iFrameEndURL + "</iFrameEndURL><cookie>" + opts.cookie + "</cookie><thumbnailBaseUrl>" + resultThumbnailBaseUrl + "</thumbnailBaseUrl>";
        // }

        xmlString += "<previewTime>" + opts.previewTime + "</previewTime>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";
        setTimeout(function () {
            App.api.csApi.request(xmlString);
        }, 2000);
    }

    function VodStatus() {

        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Get</COMMAND>";
        xmlString += "<CONTENTS>VodStatus</CONTENTS>";
        xmlString += "<MSGID></MSGID>";
        xmlString += "<DATA>";
        xmlString += "<assetId></assetId>";
        xmlString += "<isEOF></isEOF>";
        xmlString += "<vodwatching></vodwatching>";
        xmlString += "<nextWatchId></nextWatchId>";
        xmlString += "<totalDuration></totalDuration>";
        xmlString += "<currentDuration></currentDuration>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function stopVod() {

        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StopVod</COMMAND>";
        xmlString += "<CONTENTS>VOD</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<action>stop</action>";
        xmlString += "<userEventCode>" + App.vars.userEventCode + "</userEventCode>";
        xmlString += "<sourceId>" + App.vars.sourceId + "</sourceId>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function stopVodContinue() {

        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StopVod</COMMAND>";
        xmlString += "<CONTENTS>VOD</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<action>continue</action>";
        xmlString += "<userEventCode>" + App.vars.userEventCode + "</userEventCode>";
        xmlString += "<sourceId>" + App.vars.sourceId + "</sourceId>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function stopVodPreview() {

        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StopVod</COMMAND>";
        xmlString += "<CONTENTS>PREVIEW</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<action>stop</action>";
        xmlString += "<userEventCode>" + App.vars.userEventCode + "</userEventCode>";
        xmlString += "<sourceId>" + App.vars.sourceId + "</sourceId>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.vars.vodDetailPIPPlay = false;
        App.api.csApi.request(xmlString);
    }

    function stopPIP() {

        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StopVod</COMMAND>";
        xmlString += "<CONTENTS>PIP</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<action>stop</action>";
        xmlString += "<userEventCode>" + App.vars.userEventCode + "</userEventCode>";
        xmlString += "<sourceId>" + App.vars.sourceId + "</sourceId>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function stopWithCpa(options) {
        var opts = {
            ASSET_ID: "",
            TITLE: "",
            TEL_NO: "",
            sourceId: "",
            eventId: ""
        };
        $.extend(opts, options);
        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StopVod</COMMAND>";
        xmlString += "<CONTENTS>VOD</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<action>stopWithCpa</action>";
        xmlString += "<assetId>" + opts.ASSET_ID + "</assetId>";
        xmlString += "<title>" + opts.TITLE + "</title>";
        xmlString += "<telNo>" + opts.TEL_NO + "</telNo>";
        xmlString += "<sourceId>" + opts.sourceId + "</sourceId>";
        xmlString += "<eventId>" + opts.eventId + "</eventId>";
        xmlString += "<userEventCode>" + App.vars.userEventCode + "</userEventCode>";
        xmlString += "<sourceId>" + App.vars.sourceId + "</sourceId>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function nextWatchId(options) {
        var opts = {
            nextWatchId: "sampleData"
        };
        $.extend(opts, options);
        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>DirectVod</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<nextWatchId>" + opts.nextWatchId + "</nextWatchId>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }


    function cancelVod() {

        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StopVod</COMMAND>";
        xmlString += "<CONTENTS>VOD</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<action>cancel</action>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function companionDevice(options) {
        var opts = {
            pairing: "true"
        };
        $.extend(opts, options);

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>notify</TYPE>";
        xmlString += "<COMMAND>Update</COMMAND>";
        xmlString += "<CONTENTS>CompanionDevice</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<pairing>" + opts.pairing + "</pairing>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function startPip(filename) {
        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StartVod</COMMAND>";
        xmlString += "<CONTENTS>PIP</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<title>루시드 드림(무료)</title><actors>고수,설경구,박유천,강혜정,박인환,천호진,진석호,이석</actors><directors>김준성</directors><offset>0</offset><VODType>pv</VODType><assetId>cjc|M4409493LFO692799001</assetId><productId>475</productId><goodId>2659266</goodId><nextVODPlay>false</nextVODPlay><nextWatchId></nextWatchId><tmpSeriesPlayOn>false</tmpSeriesPlayOn><CBRVOD>0</CBRVOD><ecmResultCode></ecmResultCode><ecmGroupData></ecmGroupData><fromCPA>false</fromCPA>";
        xmlString += "<fileName>" + filename + "</fileName><x>101</x><y>158</y><width>353</width><height>198</height>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function startCugPip(filename, x, y, w, h) {
        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StartVod</COMMAND>";
        xmlString += "<CONTENTS>cugVod</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<title>startCugPip</title><actors>startCugPip</actors><directors>startCugPip</directors><offset>0</offset><VODType>pv</VODType><assetId>cjc|M4409493LFO692799001</assetId><productId>475</productId><goodId>2659266</goodId><nextVODPlay>false</nextVODPlay><nextWatchId></nextWatchId><tmpSeriesPlayOn>false</tmpSeriesPlayOn><CBRVOD>0</CBRVOD><ecmResultCode></ecmResultCode><ecmGroupData></ecmGroupData><fromCPA>false</fromCPA>";
        xmlString += "<fileName>" + filename + "</fileName><x>" + x + "</x><y>" + y + "</y><width>" + w + "</width><height>" + h + "</height>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function startPipTune(filename) {
        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StartVod</COMMAND>";
        xmlString += "<CONTENTS>PIP</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<title>루시드 드림(무료)</title><actors>고수,설경구,박유천,강혜정,박인환,천호진,진석호,이석</actors><directors>김준성</directors><offset>0</offset><VODType>pv</VODType><assetId>cjc|M4409493LFO692799001</assetId><productId>475</productId><goodId>2659266</goodId><nextVODPlay>false</nextVODPlay><nextWatchId></nextWatchId><tmpSeriesPlayOn>false</tmpSeriesPlayOn><CBRVOD>0</CBRVOD><ecmResultCode></ecmResultCode><ecmGroupData></ecmGroupData><fromCPA>false</fromCPA>";
        xmlString += "<fileName>" + filename + "</fileName><x>0</x><y>0</y><width>1280</width><height>720</height>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function startOap(options) {
        var opts = {
            fileName: "",
            sourceId: ""
        };
        $.extend(opts, options);

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StartOap</COMMAND>";
        xmlString += "<CONTENTS></CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<fileName>" + opts.fileName + "</fileName>";
        xmlString += "<sourceId>" + opts.sourceId + "</sourceId>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    /**
     *    Google Launcher의 Settings로 이동 요청을 한다.
     *
     *    TODO options check
     */
    function startSettings(options) {
        var opts = {
            menu: ""
        };
        $.extend(opts, options);

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StartSettings</COMMAND>";
        xmlString += "<CONTENTS></CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<menu>" + opts.menu + "</menu>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function pipResize() {
        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>PipResize</CONTENTS>";
        xmlString += "<DATA>";
        // xmlString += "<size><x>0</x><y>0</y><width>1280</width><height>720</height></size>";
        xmlString += "<size>0|0|1280|720</size>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function pipResizeSmall() {
        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>PipResize</CONTENTS>";
        xmlString += "<DATA>";
        // xmlString += "<size><x>99</x><y>158</y><width>355</width><height>212</height></size>";
        xmlString += "<size>101|158|353|198</size>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function launchApp(options) {
        var opts = {
            srcId: ""
        };
        $.extend(opts, options);

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>notify</TYPE>";
        xmlString += "<COMMAND>LaunchApp</COMMAND>";
        xmlString += "<CONTENTS></CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<srcId>" + opts.srcId + "</srcId>";
        if (options.menuPath != undefined) {
            xmlString += "<menuPath>AppDrawer</menuPath>";
        }
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function launchCsApp(options) {
        var opts = {
            DATA: {
                launchInfo: {
                    csType: "",
                    appType: "",
                    appId: "",
                    subAppId: "",
                    historyList: {}, //가고싶을곳
                    extInfo: {}
                },
                backInfo: {
                    csType: "",
                    appType: "",
                    appId: "",
                    subAppId: "",
                    historyList: {},
                    extInfo: {}
                }
            }
        };
        $.extend(true, opts, options);

        var xmldata = X2JS.json2xml_str(opts);

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>LaunchCsApp</COMMAND>";
        xmlString += "<CONTENTS></CONTENTS>";
        xmlString += "" + xmldata + "";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    /* 20170914  add by jjhan */
    function launchCSAppResponse(options) {
        var opts = {
            result: "true"
        };
        $.extend(opts, options);

        var xmlString = "";

        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>response</TYPE>";
        xmlString += "<COMMAND>LaunchCsApp</COMMAND>";
        xmlString += "<DATA>";
        xmlString += "<result>" + opts.result + "</result>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        request(xmlString);
    }

    /**
     * tuneChannel : 채널 이동
     * @param options
     */
    function tuneChannel(options) {
        var opts = {
            srcId: "",
            userEventCode: ""
        };
        $.extend(opts, options);

        // 개선 #1171 [CUG] 홈프로모션 배너 채널링크 적용 수정건
        // App.api.fn.setLog 함수가 이미 주석처리되어있어 로그 정보를 위한 api 조회가 필요없으므로 삭제
        // var logLevel = '';
        // var log_id = '';
        // var add_1 = null;
        // var add_2 = null;
        /*App.api.bizpf.mget_region_channel({
            sourceId : opts.srcId,
            callback : function(data){
                var dataObj = data.data[0];
                switch (dataObj.channelType.code) {
                    // 일반채널
                    case "1":
                    case "22":
                        if(opts.srcId == "738"){
                            logLevel = "5";
                            log_id = "CHNL_0013";
                            add_1 = dataObj.channelType.code;
                        }else{
                            logLevel = "6";
                            log_id = "CHNL_0002";
                        }
                        break;
                    // 가상채널
                    case "2":
                    case "3":
                    case "20":
                    case "21":
                        logLevel = "5";
                        log_id = "CHNL_0013";
                        add_1 = dataObj.channelType.code;
                        break;
                    // 오디오채널
                    case "4":
                        logLevel = "4";
                        log_id = "CHNL_0012";
                        add_1 = opts.srcId;
                        add_2 = dataObj.channelNum;
                        break;
                    // default:
                    //     log_id = null;
                    //     break;
                }*/
        // App.api.fn.setLog({
        //         logLevel: logLevel,
        //         log_name: "channelLog",
        //         storage_group_id: "CHANNEL",
        //         log_id : log_id,
        //         data: {
        //             "chnl": opts.srcId,
        //             "lst_chnl": null,
        //             "lst_chnl_strt_dt": null,
        //             "lst_drtn": null,
        //             "so": parseInt(App.config.settopInfo.soCode),
        //             "ng_id": parseInt(App.config.settopInfo.nodeGroupId),
        //             "ch_series": null,
        //             "ch_evnt": null,
        //             "add_1": add_1,
        //             "add_2": add_2
        //     }
        // });
        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>notify</TYPE>";
        xmlString += "<COMMAND>TuneChannel</COMMAND>";
        xmlString += "<CONTENTS></CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<srcId>" + opts.srcId + "</srcId>";
        xmlString += "<userEventCode>" + App.fn.entryCode.getCode() + "</userEventCode>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);

        setTimeout(function () {
            App.api.fn.stopApp();
        }, 500)
        // }
        // });
    }

    /**
     * SceneChange : 멀티뷰 씬체인지
     * Alaska에서 MultiviewChanged로 변경된걸로 알고 있음  : 최현원
     * @param options
     */
    function sceneChange(options) {
        var opts = {
            sourceChannelId: "",
            audioChannelId: "",
            genre: "sports",
            gridType: "General",
            startHomeShopping: false
        }
        $.extend(opts, options)

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<COMMAND>request</COMMAND>";
        xmlString += "<GROUP>CJ_VOD</GROUP>";
        xmlString += "<GTYPE>SceneChange</GTYPE>";
        xmlString += "<DATA>";
        xmlString += "<sourceChannelId>" + opts.sourceChannelId + "</sourceChannelId>";
        xmlString += "<audioChannelId>" + opts.audioChannelId + "</audioChannelId>";
        xmlString += "<iFrameName>id_" + opts.genre.toLowerCase() + "_" + opts.gridType.toLowerCase() + "</iFrameName>";
        xmlString += "<startHomeShopping>" + opts.startHomeShopping + "</startHomeShopping>"
        xmlString += "<timeout>5</timeout>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        request(xmlString);
    }

    /**
     * MultiviewChanged 멀티뷰 체인지
     * @param options
     * @constructor
     */
    function MultiviewChanged(options) {
        var opts = {
            sourceChannelId: "",
            audioChannelId: "",
            genre: "sports",
            gridType: "general",
            startHomeShopping: false
        }
        $.extend(opts, options)

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>notify</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>MultiviewChanged</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<sourceChannelId>" + opts.sourceChannelId + "</sourceChannelId>";
        xmlString += "<audioChannelId>" + opts.audioChannelId + "</audioChannelId>";
        xmlString += "<iFrameName>id_" + opts.genre.toLowerCase() + "_" + opts.gridType.toLowerCase() + "</iFrameName>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        request(xmlString);
    }

    /**
     * getFileData
     *
     */
    function getFileData() {

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Get</COMMAND>";
        xmlString += "<CONTENTS>FileData</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<directVod></directVod>";
        xmlString += "<cugVod></cugVod>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";
        request(xmlString);
    }

    function setFileData(options) {
        var opts = {
            assetId: ''
        }
        $.extend(opts, options)

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>FileData</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<directVod>" + opts.assetId + "</directVod>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";
        request(xmlString);
    }

    function setFileDataCug(options) {
        var opts = {
            assetId: ''
        }
        $.extend(opts, options)

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>FileData</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<cugVod>" + opts.assetId + "</cugVod>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";
        request(xmlString);
    }

    function getPinLock() {

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Get</COMMAND>";
        xmlString += "<CONTENTS>PinLock</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<isLocked></isLocked>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        request(xmlString);
    }

    function setPinLock(password) {

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>PinLock</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<value>" + password + "</value>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        request(xmlString);
    }

    function setHistory() {
        var aPresent = App.historyApp.getPresent();
        var aHistoryArray = App.historyApp.getHistoryArray();

        var xmlPresent = X2JS.json2xml_str(aPresent);
        var xmlHistoryArray = '';

        for (var i = 0; i < App.historyApp.getHistoryArray().length; i++) {
            xmlHistoryArray += "<history>";
            xmlHistoryArray += X2JS.json2xml_str(App.historyApp.getHistoryArray()[i]);
            xmlHistoryArray += "</history>";
        }
        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>notify</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>History</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<kind>replace</kind>";
        xmlString += "<historyList>";
        xmlString += "<history>";
        xmlString += xmlPresent;
        xmlString += "</history>";
        xmlString += xmlHistoryArray;
        xmlString += "</historyList>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";
        App.api.csApi.request(xmlString);
    }

    function setHistoryAll() {
        var aPresent = App.historyApp.getPresent();
        var aHistoryArray = App.historyApp.getHistoryArray();

        var xmlPresent = X2JS.json2xml_str(aPresent);
        var xmlHistoryArray = '';

        for (var i = 0; i < App.historyApp.getHistoryArray().length; i++) {
            xmlHistoryArray += "<history>";
            xmlHistoryArray += X2JS.json2xml_str(App.historyApp.getHistoryArray()[i]);
            xmlHistoryArray += "</history>";
        }
        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>History</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<kind>all</kind>";
        xmlString += "<historyList>";
        xmlString += "<history>";
        xmlString += xmlPresent;
        xmlString += "</history>";
        xmlString += xmlHistoryArray;
        xmlString += "</historyList>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";
        App.api.csApi.request(xmlString);
    }


    function getHistory() {
        var aPresent = App.historyApp.getPresent();
        var aHistoryArray = App.historyApp.getHistoryArray();

        var xmlPresent = X2JS.json2xml_str(aPresent);
        var xmlHistoryArray = '';

        for (var i = 0; i < App.historyApp.getHistoryArray().length; i++) {
            xmlHistoryArray += "<history>";
            xmlHistoryArray += X2JS.json2xml_str(App.historyApp.getHistoryArray()[i]);
            xmlHistoryArray += "</history>";
        }

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>Get</TYPE>";
        xmlString += "<COMMAND>History</COMMAND>";
        xmlString += "<CONTENTS></CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<historyList>";
        xmlString += "<history>";
        xmlString += xmlPresent;
        xmlString += "</history>";
        xmlString += xmlHistoryArray;
        xmlString += "</historyList>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function getBookingList() {
        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Get</COMMAND>";
        xmlString += "<CONTENTS>BookingList</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function setAddBooking(bookingData) {
        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>AddBooking</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<booking><![CDATA[" + bookingData + "]]></booking>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function setRemoveBooking(bookingData) {
        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>RemoveBooking</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<booking><![CDATA[" + bookingData + "]]></booking>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    window.onload = function () {
        if(window.parent.webc !== undefined){
            if(window.parent.webc.api.iframe.menuId  === undefined && window.parent.webc.api.iframe.menuId !== '9999'){
                App.api.csApi.responseStartApp("onLoad");
            }
        }else{
            App.api.csApi.responseStartApp("onLoad");
        }

    };


    /**
     * test 영역 구현
     */

    /**
     * 메뉴 아이디 테스트
     * @param id // menuId
     * @param sourceId // sourceId
     */
    function testMenuId(test) {

        var xmlString = "";

        xmlString += "<INTERFACE version='3'>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<MSGID>1504689570454</MSGID>";
        xmlString += "<COMMAND>StartApp</COMMAND>";
        xmlString += "<CONTENTS></CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<deviceInfo>";
        xmlString += "<marketingAgreement></marketingAgreement>";
        xmlString += "<privateAgreement></privateAgreement>";
        xmlString += "<vodHistory></vodHistory>";
        xmlString += "<stbRegCode>1ed53706-e30e-4fc6-b02e-119e46dd2b3b</stbRegCode>";
        xmlString += "<searchKeyword></searchKeyword>";
        xmlString += "<voiceGuide></voiceGuide>";
        xmlString += "<vodListType></vodListType>";
        xmlString += "<isKids></isKids>";
        xmlString += "<simplePurchase>false</simplePurchase>";
        xmlString += "<rating>0</rating>";
        xmlString += "<vodAdultMenuCheck>1</vodAdultMenuCheck>";
        xmlString += "<soLogLevel></soLogLevel>";
        xmlString += "<mapId>0</mapId>";
        xmlString += "<cugGroupId></cugGroupId>";
        xmlString += "<soCode>43</soCode>";
        xmlString += "<groupBits>AAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=</groupBits>";
        xmlString += "<smartCardId>63223808296</smartCardId>";
        xmlString += "<subscriberId>64330545</subscriberId>";
        xmlString += "<superCasId>503382017</superCasId>";
        xmlString += "<macAddress>00:21:4c:f0:85:db</macAddress>";
        xmlString += "<stbModel>SMTC3021X</stbModel>";
        xmlString += "<cloudVersion>5.0.0.0</cloudVersion>";
        xmlString += "</deviceInfo>";
        xmlString += "<cloudVersion>5.0.0.0</cloudVersion>";
        xmlString += "<launchInfo>";
        xmlString += "<historyList>";
        xmlString += "<history>";
        xmlString += test;
        xmlString += "</history>";
        xmlString += "</historyList>";
        xmlString += "<extInfo></extInfo>";
        xmlString += "<subAppId>0</subAppId>";
        xmlString += "<appId>147</appId>";
        xmlString += "<appType>0</appType>";
        xmlString += "<csType>ICS</csType>";
        xmlString += "</launchInfo>";
        xmlString += "<backInfo>";
        xmlString += "<historyList></historyList>";
        xmlString += "<extInfo></extInfo>";
        xmlString += "<subAppId></subAppId>";
        xmlString += "<appId></appId>";
        xmlString += "<appType></appType>";
        xmlString += "<csType></csType>";
        xmlString += "</backInfo>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.response(xmlString);
    }


    /**
     * STB별 화면 분할 설정
     */
    function setScreenPartirion() {

        // 기본 분할
        var wblock = "1";
        var hblock = "1";

        App.provider.stb.hyperStb.forEach(function (str, idx) {
            if (str == App.config.settopInfo.stbModel) {
                wblock = "5";
                hblock = "4";
            }
        });

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<COMMAND>information</COMMAND>";
        xmlString += "<GROUP>CSS</GROUP>";
        xmlString += "<GTYPE>ImageBlock</GTYPE>";
        xmlString += "<DATA>";
        xmlString += "<MaxImgBlockW>" + wblock + "</MaxImgBlockW>";
        xmlString += "<MaxImgBlockH>" + hblock + "</MaxImgBlockH>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function textToSpeech(options) { // TTS 요청
        var opts = {
            message: "", // [TTS요청 하고 싶은 문구]
            stopPreviousRequest: true // [시나리오에 따른 값, 이전 요청을 중지하고, 새로운 요청을 읽게 할 것 인가. 아니면 이전 요청이 끝난 후 읽을 것인가의 값] true/false
        };
        $.extend(opts, options);

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>notify</TYPE>";
        xmlString += "<COMMAND>TextToSpeech</COMMAND>";
        xmlString += "<CONTENTS></CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<message>" + opts.message + "</message>";
        xmlString += "<stopPreviousRequest>" + opts.stopPreviousRequest + "</stopPreviousRequest>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function getTvAppList(options) {
        var self = this;
        var opts = {
            callback: function () {

            }
        }
        $.extend(opts, options);

        App.api.model.app.getTvAppListCallback = opts.callback;
        delete opts.callback;

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Get</COMMAND>";
        xmlString += "<CONTENTS>TvAppList</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }


    function getTvAppIcon(options) {
        var self = this;
        var opts = {
            packageId: options.packageId,
            callback: function () {

            }
        }
        $.extend(opts, options);

        App.api.model.app.getTvAppIconCallback = opts.callback;
        delete opts.callback;


        // var tvAppIconArray = X2JS.json2xml_str()

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Get</COMMAND>";
        xmlString += "<CONTENTS>TvAppIcon</CONTENTS>";
        xmlString += "<DATA>";
        for (var i = 0; i < opts.packageId.length; i++) {
            xmlString += "<" + opts.packageId[i] + "></" + opts.packageId[i] + ">"
        }
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }


    /**
     * Android Tv Recommend 리스트 조회 요청
     * @param options
     */
    function getRecommendList(options) {
        var self = this;
        var opts = {
            callback: function () {

            }
        }
        $.extend(opts, options);

        App.api.model.app.getRecommendListCallback = opts.callback;
        delete opts.callback;

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Get</COMMAND>";
        xmlString += "<CONTENTS>RecommendList</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }


    /**
     * Android Tv Recommend Thumbnail 요청
     * @param options
     */
    function getRecommendThumbnail(options) {
        var self = this;
        var opts = {
            key: options.key,
            callback: function () {

            }
        }
        $.extend(opts, options);

        App.api.model.app.getRecommendThumbnailCallback = opts.callback;
        delete opts.callback;

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Get</COMMAND>";
        xmlString += "<CONTENTS>RecommendThumbnail</CONTENTS>";
        xmlString += "<DATA>";

        xmlString += "<thumbnail>";
        for (var i = 0; i < opts.key.length; i++) {
            if (i === opts.key.length - 1) {
                xmlString += opts.key[i];
            } else {
                xmlString += opts.key[i] + ",";
            }
        }
        xmlString += "</thumbnail>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    /**
     * Android Tv Recommend 실행
     * @param options
     */
    function launchRecommend(options) {
        var self = this;
        var opts = {
            key: options.key,
            callback: function () {

            }
        }
        $.extend(opts, options);

        App.api.model.app.launchRecommendCallback = opts.callback;
        delete opts.callback;

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>notify</TYPE>";
        xmlString += "<COMMAND>LaunchRecommend</COMMAND>";
        xmlString += "<CONTENTS></CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<key>" + opts.key + "</key>";

        //xmlString += "<key>0|com.google.android.youtube.tv|-1570839515|null|10061</key>";
        // xmlString += "<key><![CDATA[\"0|com.google.android.youtube.tv|-1570839515|null|10061\"]]></key>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);

    }


    function launchApp(options) {
        var self = this;
        var opts = {
            sourceId: "",
            menuPath: "AppDrawer",
            callback: function () {

            }
        }
        $.extend(opts, options);

        App.api.model.app.launchAppCallback = opts.callback;
        delete opts.callback;

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>notify</TYPE>";
        xmlString += "<COMMAND>LaunchApp</COMMAND>";
        xmlString += "<CONTENTS></CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<srcId>" + opts.sourceId + "</srcId> "
        xmlString += "<menuPath>" + opts.menuPath + "</menuPath>"
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);

    }

    function remoconPairing(options) {
        var self = this;
        var opts = {
            callback: function () {

            }
        }
        $.extend(opts, options);

        App.api.model.app.remoconPairingCallback = opts.callback;
        delete opts.callback;

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>RemoconPairing</CONTENTS>";
        xmlString += "<DATA></DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
        // App.api.csApi.response('<INTERFACE><TYPE>request</TYPE><COMMAND>Set</COMMAND><CONTENTS>RemoconPairing</CONTENTS><DATA><result>true</result></DATA></INTERFACE>');
    }

    function remoconPairingCancel(options) {
        var self = this;
        var opts = {
            callback: function () {

            }
        }
        $.extend(opts, options);

        App.api.model.app.remoconPairingCancelCallback = opts.callback;
        delete opts.callback;

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>RemoconPairingCancel</CONTENTS>";
        xmlString += "<DATA></DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
        // App.api.csApi.response('<INTERFACE><TYPE>request</TYPE><COMMAND>Set</COMMAND><CONTENTS>RemoconPairingCancel</CONTENTS><DATA><result>true</result></DATA></INTERFACE>');
    }

    function externalStorageList(options) {
        var self = this;
        var opts = {
            callback: function () {

            }
        }
        $.extend(opts, options);

        App.api.model.app.externalStorageListCallback = opts.callback;
        delete opts.callback;

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Get</COMMAND>";
        xmlString += "<CONTENTS>ExternalStorageList</CONTENTS>";
        xmlString += "<DATA></DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
        // App.api.csApi.response('<INTERFACE version="3"><TYPE>response</TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>ExternalStorageList</CONTENTS><DATA><externalStorage>/mnt/media_rw/428B-6C2F^SD card</externalStorage></DATA></INTERFACE>');
    }

    function LaunchFileExplorer(options) {
        var self = this;
        var opts = {
            path: "",
            displayName: "",
            callback: function () {

            }
        }
        $.extend(opts, options);

        App.api.model.app.LaunchFileExplorerCallback = opts.callback;
        delete opts.callback;

        var aPresent = App.historyApp.getPresent();
        var xmlPresent = X2JS.json2xml_str(aPresent);

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>notify</TYPE>";
        xmlString += "<COMMAND>LaunchFileExplorer</COMMAND>";
        xmlString += "<CONTENTS></CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<path>" + opts.path + "</path>";
        xmlString += "<displayName>" + opts.displayName + "</displayName>";
        xmlString += "<previousHistory>";
        xmlString += "<historyList>";
        xmlString += "<history>";
        xmlString += xmlPresent;
        xmlString += "</history>";
        xmlString += "</historyList>";
        xmlString += "</previousHistory></DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
        // App.api.csApi.response('<INTERFACE version="3"><TYPE>response</TYPE><MSGID></MSGID><COMMAND>Get</COMMAND><CONTENTS>ExternalStorageList</CONTENTS><DATA><ExternalStorage>/mnt/media_rw/428B-6C2F^SD card</ExternalStorage></DATA></INTERFACE>');
    }

    function tuneMultiView(options) {
        var self = this;
        var opts = {
            sourceId: "",
            callback: function () {

            }
        }
        $.extend(opts, options);

        // var entryCode = null;

        // if(App.fn.entryCode.getCode(false) != undefined){
        //     entryCode = App.fn.entryCode.getCode();
        // }

        // App.api.model.app.tuneMultiView = opts.callback;
        // delete opts.callback;

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>notify</TYPE>";
        xmlString += "<COMMAND>TuneMultiView</COMMAND>";
        xmlString += "<CONTENTS></CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<srcId>" + opts.sourceId + "</srcId>";
        xmlString += "<userEventCode>" + 31 + "</userEventCode>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    function setCugChannel(options) {
        var self = this;
        var opts = {
            version: "",
            cugChannelList: [],
            callback: function () {

            }
        }
        $.extend(opts, options);
        if (opts.version == App.config.settopInfo.cugChannel) {
            return false;
        }
        var channel = "";
        opts.cugChannelList.splice(10);
        for (var i = 0; i < opts.cugChannelList.length; i++) {
            channel += opts.cugChannelList[i].sourceId + "^" + opts.cugChannelList[i].link.type + "^" + opts.cugChannelList[i].link.value;
            if (i < opts.cugChannelList.length - 1) {
                if (App.fn.globalUtil.is("RED") || App.fn.globalUtil.is("SMART") || App.fn.globalUtil.is("UHD2")) {
                    channel += "|";
                } else {
                    channel += "&";
                }
            }
        }

        // App.api.model.csc.setCugChannelCallback = opts.callback;
        // delete opts.callback;

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>CugChannel</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<version>" + opts.version + "</version>";
        xmlString += "<cugGroupId>" + App.config.settopInfo.cugGroupId + "</cugGroupId>";
        if (App.fn.globalUtil.is("RED") || App.fn.globalUtil.is("SMART") || App.fn.globalUtil.is("UHD2")) {
            xmlString += "<channel>" + channel + "</channel>";
        } else {
            xmlString += "<channel><![CDATA[" + channel + "]]></channel>";
        }
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        if (App.vars.cugChannel == false) {
            // App.api.csApi.request('<INTERFACE><TYPE>request</TYPE><COMMAND>Set</COMMAND><CONTENTS>CugChannel</CONTENTS><DATA><version>1</version><channel>805^sc01^13000|806^sc01^13000</channel></DATA></INTERFACE>');
        } else {
            App.api.csApi.request(xmlString);
        }
    }

    function getCugChannel(options) {
        var self = this;
        var opts = {
            cugChannelList: [],
            callback: function () {

            }
        }
        $.extend(opts, options);
        var channel = "";
        opts.cugChannelList.splice(10);
        for (var i = 0; i < opts.cugChannelList.length; i++) {
            channel += opts.cugChannelList[i].sourceId + "^" + opts.cugChannelList[i].link.type + "^" + opts.cugChannelList[i].link.value;
            if (i < opts.cugChannelList.length - 1) {
                channel += "&";
            }
        }

        // App.api.model.csc.getCugChannelCallback = opts.callback;
        // delete opts.callback;

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Get</COMMAND>";
        xmlString += "<CONTENTS>CugChannel</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<channel>" + channel + "</channel>";
        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    /**
     * LG Smart BT pairing 요청
     * EnableBTPairing
     * 리모컨 페어링 Step.1 에서
     리모컨의 OK키로 확인 버튼을 눌러주세요.
     화면에서 해당 notify호출 필요 - LG smart만
     * @param options
     */
    function notifyEnableBTPairing(options) {
        var self = this;
        var opts = {
            callback: function () {
            }
        };
        $.extend(opts, options);

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>notify</TYPE>";
        xmlString += "<COMMAND>EnableBTPairing</COMMAND>";
        xmlString += "<CONTENTS></CONTENTS>";
        xmlString += "<DATA></DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    /**
     * 스크린 컨텍스트
     * VUX가 실행중인지 여부 조회
     * @param options
     */
    function getStartedVux(options) {
        var self = this;
        var opts = {
            callback: function () {
            }
        };
        $.extend(opts, options);

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Check</COMMAND>";
        xmlString += "<CONTENTS>StartedVux</CONTENTS>";
        xmlString += "<DATA></DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    /**
     * 스크린 컨텍스트
     * VUX 실행시 발생한 Error Message를 EPG에 전달
     * @param options
     */
    function setVuxErrorMessage(options) {
        var self = this;
        var opts = {
            message: '',
            callback: function () {
            }
        };
        $.extend(opts, options);

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>VuxErrorMessage</CONTENTS>";
        xmlString += "<DATA><message>" + opts.message + "</message></DATA>";
        xmlString += "</INTERFACE>";

        App.api.csApi.request(xmlString);
    }

    //////////// 헬로TV 클럽 추가 함수 (2019.08.13) ////////////
    /**
     *  공통 set command
     */
    function setCommand(options) {
        var opts = {
            TYPE: "request",
            COMMAND: "Set",
            CONTENTS: "",
            DATA: {}
        };
        $.extend(opts, options);

        console.log(opts);

        var xmlString = X2JS.json2xml_str(opts);
        xmlString = "<INTERFACE version='3'>" + xmlString + "</INTERFACE>";
        App.api.csApi.request(xmlString);
    }

    function setBootingHome(bool) {
        var tempFlag = false;
        if (bool) {
            tempFlag = bool;
        }
        var param = {CONTENTS: "isBootingHome", DATA: {flag: tempFlag}};
        App.api.csApi.setCommand(param);
    }

    function setWidgetMode(bool) {
        var tempFlag = false;
        if (bool) {
            tempFlag = bool;
        }
        var param = {CONTENTS: "isWidgetMode", DATA: {flag: tempFlag}};
        App.api.csApi.setCommand(param);
    }

    function setEPGTrigger(bool) {
        var tempFlag = false;
        if (bool) {
            tempFlag = bool;
        }
        var param = {CONTENTS: "isEPGTrigger", DATA: {flag: tempFlag}};
        App.api.csApi.setCommand(param);
    }

    function setIAD(bool) {
        var tempFlag = false;
        if (bool) {
            tempFlag = bool;
        }
        var param = {CONTENTS: "IAD", DATA: {flag: tempFlag}};
        App.api.csApi.setCommand(param);
    }

    function setMiniBar(bool) {
        var tempFlag = false;
        if (bool) {
            tempFlag = bool;
        }
        var param = {CONTENTS: "isMiniBar", DATA: {flag: tempFlag}};
        App.api.csApi.setCommand(param);
    }

    function setAVResize(x, y, width, height) {
        var avSize = "0|0|1280|720";
        if (x !== undefined && y !== undefined && width !== undefined && height !== undefined) {
            avSize = x + "|" + y + "|" + width + "|" + height;
        }
        var param = {CONTENTS: "AvResize", DATA: {size: avSize}};
        App.api.csApi.setCommand(param);
    }

    function setPipResize(x, y, width, height) {
        var avSize = "0|0|1280|720";
        if (x !== undefined && y !== undefined && width !== undefined && height !== undefined) {
            avSize = x + "|" + y + "|" + width + "|" + height;
        }
        var param = {CONTENTS: "PipResize", DATA: {size: avSize}};
        App.api.csApi.setCommand(param);
    }

    /**
     * 중복 전용 채널 제거
     * @param arr
     * @returns {*}
     */
    function uniqueDedicatedChn(arr) {
        if(arr == undefined || arr.length <=0 ){
            return undefined;
        }
        for (var i = 0; i < arr.length; i++) {
            for (var j = i+1; j < arr.length; j++) {
                if(arr[i].sourceId === arr[j].sourceId){
                    arr.splice(j,1);
                }
            }
        }
        return arr;
    }

    /**
     * 중복 히든 채널 제거
     * @param arr
     * @returns {*}
     */
    function uniqueHiddenChn(arr) {
        if(arr == undefined || arr.length <=0 ){
            return undefined;
        }
        for (var i = 0; i < arr.length; i++) {
            for (var j = i+1; j < arr.length; j++) {
                if(arr[i] === arr[j]){
                    arr.splice(j,1);
                }
            }
        }
        return arr;
    }

    function setCugConfig(options) {
        var self = this;
        var opts = {
            version: "",
            dedicatedChnlList: [],
            hiddenChnlList: [],
            defaultChnlList: [],
            alwaysDispYn : "",
            bootDispYn : "",
            iAdDispYn : "",
            miniEpgDispYn : "",
            triggerDispYn : "",
            callback: function () {
            }
        }
        $.extend(opts, options);

        console.log("==> cug config version : ", opts.version);
        if (opts.version == App.config.settopInfo.cugChannel) {
            console.log("cug config version same : ", App.config.settopInfo.cugChannel);
            return false;
        }

        // 전용채널설정
        var cChannelList = "";
        var cChannelArr = App.api.csApi.uniqueDedicatedChn(opts.dedicatedChnlList);
        if(cChannelArr){
            for (var i = 0; i < cChannelArr.length; i++) {
                cChannelList += cChannelArr[i].sourceId + "^" + cChannelArr[i].link.type + "^" + cChannelArr[i].link.value;
                if (i < cChannelArr.length - 1) {
                    if (App.fn.globalUtil.is("RED") || App.fn.globalUtil.is("SMART") || App.fn.globalUtil.is("UHD2")) {
                        cChannelList += "|";
                    } else {
                        cChannelList += "&";
                    }
                }
            }
        }

        // 히든채널설정
        var hChannelList = "";
        var hChannelArr = App.api.csApi.uniqueHiddenChn(opts.hiddenChnlList);
        if(hChannelArr){
            for (var i = 0; i < hChannelArr.length; i++) {
                hChannelList += hChannelArr[i];
                if (i < hChannelArr.length - 1) {
                    hChannelList += "^";
                }
            }
        }

        // 디폴트채널설정 - 하나로 전체 설정
        var dChannel = "0";
        if(opts.defaultChnlList){
            for (var i = 0; i < opts.defaultChnlList.length; i++) {
                if(opts.defaultChnlList[i].defaultType === "BOOT"){
                    dChannel = opts.defaultChnlList[i].sourceId;
                }
            }
        }

        // 위젯 여부
        var widgetFlag = false;
        opts.alwaysDispYn === "Y" ? widgetFlag = true : widgetFlag = false;
        // 부팅시 홈 노출 여부
        var bootingHomeFlag = false;
        opts.bootDispYn === "Y" ? bootingHomeFlag = true : bootingHomeFlag = false;
        // iAD 노출 여부
        var iADFlag = false;
        opts.iAdDispYn === "Y" ? iADFlag = true : iADFlag = false;
        // miniEPG 노출 여부
        var miniBarFlag = false;
        opts.miniEpgDispYn === "Y" ? miniBarFlag = true : miniBarFlag = false;
        // 트리거 노출 여부
        var triggerFlag = false;
        opts.triggerDispYn === "Y" ? triggerFlag = true : triggerFlag = false;

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>Set</COMMAND>";
        xmlString += "<CONTENTS>CugChannel</CONTENTS>";
        xmlString += "<DATA>";
        xmlString += "<version>" + opts.version + "</version>";
        xmlString += "<cugGroupId>" + App.config.settopInfo.cugGroupId + "</cugGroupId>";
        if (App.fn.globalUtil.is("RED") || App.fn.globalUtil.is("SMART") || App.fn.globalUtil.is("UHD2")) {
            xmlString += "<channel>" + cChannelList + "</channel>";
        } else {
            xmlString += "<channel><![CDATA[" + cChannelList + "]]></channel>";
        }
        xmlString += "<skippedChannel>" + hChannelList + "</skippedChannel>";
        xmlString += "<bootingChannel>" + dChannel + "</bootingChannel>";
        xmlString += "<activeOnChannel>" + dChannel + "</activeOnChannel>";
        xmlString += "<vodStopChannel>" + dChannel + "</vodStopChannel>";
        xmlString += "<appStopChannel>" + dChannel + "</appStopChannel>";
        xmlString += "<noSignalChannel>" + dChannel + "</noSignalChannel>";

        xmlString += "<isWidgetMode>" + widgetFlag + "</isWidgetMode>";
        xmlString += "<isBootingHome>" + bootingHomeFlag + "</isBootingHome>";
        xmlString += "<IAD>" + iADFlag + "</IAD>";
        xmlString += "<isMiniBar>" + miniBarFlag + "</isMiniBar>";
        xmlString += "<isEPGTrigger>" + triggerFlag + "</isEPGTrigger>";

        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";

        if (App.vars.cugChannel == false) {
            // App.api.csApi.request('<INTERFACE><TYPE>request</TYPE><COMMAND>Set</COMMAND><CONTENTS>CugChannel</CONTENTS><DATA><version>1</version><channel>805^sc01^13000|806^sc01^13000</channel></DATA></INTERFACE>');
        } else {
            App.api.csApi.request(xmlString);
        }
    }

    function startCugVOD(options) {
        var opts = {
            title: ""
            , actors: ""
            , directors: ""
            , fileName: ""
            , offset: ""
            , VODType: ""
            , categoryId: ""
            , assetId: ""
            , productId: ""
            , goodId: ""
            , nextVODPlay: ""
            , nextWatchId: ""
            , tmpSeriesPlayOn: ""
            , CBRVOD: ""
            , ecmResultCode: ""
            , ecmGroupData: ""
            , fromCPA: ""
            , x: ""
            , y: ""
            , width: ""
            , height: ""

        };
        $.extend(opts, options);

        var resultThumbnailBaseUrl = "";
        if (opts.thumbnailBaseUrl == undefined || opts.thumbnailBaseUrl == "" || opts.thumbnailBaseUrl == null) {
            resultThumbnailBaseUrl = "";
        } else {
            resultThumbnailBaseUrl = App.api.bizpf._serverIpImg + opts.thumbnailBaseUrl;
        }

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StartVod</COMMAND>";
        xmlString += "<CONTENTS>cugVod</CONTENTS>";
        xmlString += "<DATA>";

        // CDATA로 인해 X2JS.json2xml_str 미사용은 추구 개선 고려
        xmlString += "<title><![CDATA[" + opts.title + "]]></title>" +
            "<actors><![CDATA[" + opts.actors + "]]></actors>" +
            "<directors><![CDATA[" + opts.directors + "]]></directors>" +
            "<fileName>" + opts.fileName + "</fileName>" +
            "<offset>" + opts.offset + "</offset>" +
            "<VODType>" + opts.VODType + "</VODType>" +
            "<categoryId>" + opts.categoryId + "</categoryId>" +
            "<assetId>" + opts.assetId + "</assetId>" +
            "<productId>" + opts.productId + "</productId>" +
            "<goodId>" + opts.goodId + "</goodId>" +
            "<nextVODPlay>" + opts.nextVODPlay + "</nextVODPlay>" +
            "<nextWatchId>" + opts.nextWatchId + "</nextWatchId>" +
            "<tmpSeriesPlayOn>" + opts.tmpSeriesPlayOn + "</tmpSeriesPlayOn>" +
            "<CBRVOD>" + opts.CBRVOD + "</CBRVOD>" +
            "<ecmResultCode>" + opts.ecmResultCode + "</ecmResultCode>" +
            "<ecmGroupData>" + opts.ecmGroupData + "</ecmGroupData>" +
            "<fromCPA>" + opts.fromCPA + "</fromCPA>" +
            "<iFrameEndURL>" + opts.iFrameEndURL + "</iFrameEndURL>" +
            "<cookie>" + opts.cookie + "</cookie>" +
            "<thumbnailBaseUrl>" + resultThumbnailBaseUrl + "</thumbnailBaseUrl>";
        xmlString += "<x>" + opts.x + "</x><y>" + opts.y + "</y><width>" + opts.width + "</width><height>" + opts.height + "</height>";

        xmlString += "</DATA>";
        xmlString += "</INTERFACE>";
        setTimeout(function () {
            App.api.csApi.request(xmlString);
        }, 2000);
    }

    // function setCugConfigTest() {
    //     var opts = {
    //         "version": "100120190827110000",
    //         "dedicatedChnlList": [{"sourceId": "552", "channelNo": 456, "link": {"type": "sc01", "value": "13000"}}],
    //         "hiddenChnlList": [123, 125, 145, 144, 151, 155, 169],
    //         "defaultChnlList": [{"defaultType": "BOOT", "sourceId ":0}]
    //     };
    //     App.api.csApi.setCugConfig(opts);
    // }
    //
    //
    // // function setCugConfigTest() {
    // //     var opts = {
    // //         "version": "100120190827110000",
    // //         "exclusiveChnlList": [{"sourceId": "552", "channelNo": 456, "link": {"type": "sc01", "value": "13000"}},
    // //             {"sourceId": "553", "channelNo": 456, "link": {"type": "sc01", "value": "13000"}},
    // //             {"sourceId": "554", "channelNo": 458, "link": {"type": "sc01", "value": "13000"}},
    // //             {"sourceId": "555", "channelNo": 459, "link": {"type": "sc01", "value": "13000"}},
    // //             {"sourceId": "556", "channelNo": 460, "link": {"type": "sc01", "value": "13000"}},
    // //             {"sourceId": "557", "channelNo": 461, "link": {"type": "sc01", "value": "13000"}},
    // //             {"sourceId": "558", "channelNo": 462, "link": {"type": "sc01", "value": "13000"}}],
    // //         "hiddenChnlList": [123, 125, 145, 144, 151, 155, 169],
    // //         "defaultChannel": 25
    // //     };
    // //     App.api.csApi.setCugConfig(opts);
    // // }
    //
    // function setBootingHomeTest() {
    //     App.api.csApi.setBootingHome(true);
    // }
    //
    // function setWidgetModeTest() {
    //     App.api.csApi.setWidgetMode(true);
    // }
    //
    // function setEPGTriggerTest() {
    //     App.api.csApi.setEPGTrigger(false);
    // }
    //
    // function setIADTest() {
    //     App.api.csApi.setIAD(false);
    // }
    //
    // function setMiniBarTest() {
    //     App.api.csApi.setMiniBar(false);
    // }
    //
    // function setAVResizeTest() {
    //
    // }
    //
    // function startVodTest2() {
    //
    //     var xmlString = "<INTERFACE><TYPE>request</TYPE><COMMAND>StartVod</COMMAND><CONTENTS>VOD</CONTENTS><DATA><title><![CDATA[(HD)MBC 스페셜 783회(18/08/20)]]></title><actors><![CDATA[-]]></actors><directors><![CDATA[이우환]]></directors><fileName>M4540385.mpg</fileName><offset>0</offset><VODType>fp</VODType><categoryId>1009814</categoryId><assetId>cjc|M4540385LFO816376301</assetId><sassetId>600373</sassetId><seriesId>27638</seriesId><productId></productId><goodId></goodId><nextVODPlay></nextVODPlay><nextWatchId>cjc|M4540387LFO816377501</nextWatchId><tmpSeriesPlayOn></tmpSeriesPlayOn><CBRVOD></CBRVOD><ecmResultCode></ecmResultCode><ecmGroupData></ecmGroupData><fromCPA></fromCPA><iFrameEndURL></iFrameEndURL><cookie>64HJCE9O70RJ8CPM70HM6QJ3FH6J8D9K60PJGDAC8P7JGC9M6CRJCCPG64</cookie><thumbnailBaseUrl>http://10.10.78.65:18080//mnt/thumb/CJHV/thumbnail/18/08/21/M4540385LSG816375801</thumbnailBaseUrl></DATA></INTERFACE>";
    //
    //     // xmlString += "<INTERFACE>";
    //     // xmlString += "<TYPE>request</TYPE>";
    //     // xmlString += "<COMMAND>StartVod</COMMAND>";
    //     // xmlString += "<CONTENTS>VOD</CONTENTS>";
    //     // xmlString += "<DATA>";
    //     // xmlString += "<title>루시드 드림(무료)</title><actors>고수,설경구,박유천,강혜정,박인환,천호진,진석호,이석</actors><directors>김준성</directors><fileName>M4409493.mpg</fileName><offset>0</offset><VODType>fp</VODType><categoryId>2665165</categoryId><assetId>cjc|M4409493LFO692799001</assetId><productId>475</productId><goodId>2659266</goodId><nextVODPlay>false</nextVODPlay><nextWatchId></nextWatchId><tmpSeriesPlayOn>false</tmpSeriesPlayOn><CBRVOD>0</CBRVOD><ecmResultCode></ecmResultCode><ecmGroupData></ecmGroupData><fromCPA>false</fromCPA><iFrameEndURL>http://10.10.69.100:3080/static/image/background/vodEnd/copy/d71fa1cf-29b0-4a83-9df7-bbc5286ebd76.jpg</iFrameEndURL>";
    //     // xmlString += "</DATA>";
    //     // xmlString += "</INTERFACE>";
    //
    //     App.api.csApi.request(xmlString);
    //
    //     isStopApp = true;
    // }

    function standAlone(options) {
        var self = this;
        var opts = {
            alaskaHigtory : '',
            callback : function(){
            }
        };
        $.extend(opts, options);

        var xmlString = "";
        xmlString += "<INTERFACE>";
        xmlString += "<TYPE>request</TYPE>";
        xmlString += "<COMMAND>StandAlone</COMMAND>";
        xmlString += "<CONTENTS>StandAlone</CONTENTS>";
        xmlString += "<DATA><JSON><![CDATA["+ JSON.stringify(opts.alaskaHigtory) +"]]></JSON></DATA>";
        xmlString += "</INTERFACE>";
        App.api.csApi.request(xmlString);
    }

    return {
        request: request,
        response: response,
        setDeviceInfo: setDeviceInfo,
        getDeviceInfo: getDeviceInfo,
        getSystemInfo: getSystemInfo,
        getGuideDeviceInfo: getGuideDeviceInfo,
        responseStartApp: responseStartApp,
        IniciateSystem: IniciateSystem, //시스템 초기화
        IniciateSystemTest: IniciateSystemTest, //시스템 초기화 테스트
        SetSessionTimeout: SetSessionTimeout, //세션 타임아웃 설정
        setScreenPartirion: setScreenPartirion, // STB별 화면 분할 설정

        requestStartApp: requestStartApp,

        pincodeCheck: pincodeCheck,

        setKeyFilter: setKeyFilter, // 웹앱 에서 특정키 사용을 요청함
        sportsKeyFilter: sportsKeyFilter,
        homeShoppingKeyFilter: homeShoppingKeyFilter,
        homeShoppingStopApp: homeShoppingStopApp,
        reBoot: reBoot, //셋탑 재시작


        ////////////Test 함수 ////////////
        getDeviceInfoTest: getDeviceInfoTest,
        getGuideDeviceInfoTest: getGuideDeviceInfoTest,
        startAppTest: startAppTest,


        testMenuId: testMenuId,

        getRecordingTest: getRecordingTest,
        getStorageInfoTest: getStorageInfoTest,
        getScheduleItemTest: getScheduleItemTest,
        getCurrentRecordingProgramTest: getCurrentRecordingProgramTest,

        //애니메이션 함수 ////
        startAnimation: startAnimation,

        startVod: startVod,
        startVodPreview: startVodPreview,
        startVodTrailer: startVodTrailer,
        startVodNumVod: startVodNumVod,
        VodStatus: VodStatus,
        stopVod: stopVod,
        stopVodContinue: stopVodContinue,
        stopVodPreview: stopVodPreview,
        stopPIP: stopPIP,
        stopWithCpa: stopWithCpa,
        cancelVod: cancelVod,
        companionDevice: companionDevice,
        startPip: startPip,
        startCugPip: startCugPip,
        startPipTune: startPipTune,
        startOap: startOap,
        startSettings: startSettings, // 구글 설정 실행
        pipResize: pipResize,
        pipResizeSmall: pipResizeSmall,
        launchApp: launchApp,
        launchCsApp: launchCsApp,
        tuneChannel: tuneChannel,
        sceneChange: sceneChange,
        MultiviewChanged: MultiviewChanged,
        getFileData: getFileData,
        setFileData: setFileData,
        setFileDataCug: setFileDataCug,
        getPinLock: getPinLock,
        setPinLock: setPinLock,
        setHistory: setHistory,
        setHistoryAll: setHistoryAll,
        getHistory: getHistory,
        // 20170914 add by jjhan
        launchCSAppResponse: launchCSAppResponse,
        nextWatchId: nextWatchId,
        //채널 부킹 함수
        getBookingList: getBookingList,
        setAddBooking: setAddBooking,
        setRemoveBooking: setRemoveBooking,

        textToSpeech: textToSpeech, // TTS 요청t
        getTvAppList: getTvAppList, // TV앱 리스트 조회
        getTvAppIcon: getTvAppIcon, //TV앱 아이콘 요청

        getRecommendList: getRecommendList, //Android Tv Recommend 리스트 조회
        getRecommendThumbnail: getRecommendThumbnail, //Android Tv Recommend Thumbnail
        launchRecommend: launchRecommend, //Android Tv Recommend 실행

        launchApp: launchApp, //TV앱 실행
        remoconPairing: remoconPairing, // 리모컨 페어링
        remoconPairingCancel: remoconPairingCancel, // 리모컨 페어링 취소
        externalStorageList: externalStorageList, // 개인미디어 외장 디바이스 조회
        LaunchFileExplorer: LaunchFileExplorer, // 개인미디어 외장 탐색기 실행

        tuneMultiView: tuneMultiView, // 좌방향트리거 pip
        setCugChannel: setCugChannel, // cugChannel
        getCugChannel: getCugChannel, // cugChannel

        notifyEnableBTPairing: notifyEnableBTPairing, // cugChannel


        //////////// 스크린 컨텍스트 함수 ////////////
        getStartedVux: getStartedVux,
        setVuxErrorMessage: setVuxErrorMessage,


        //////////// 헬로TV 클럽 추가 함수 (2019.08.13) ////////////
        //set command
        setCommand: setCommand,          // 공통 셋
        setAVResize: setAVResize,        // avResize 채널 영상 리사이징 (contents : AvResize)
        setPipResize : setPipResize,     // vod 재생시 pip 리사이징 (contents : PipResize)
        setBootingHome: setBootingHome,  // 부팅시 홈 시작 여부 설정(contents : isBootingHome)
        setWidgetMode: setWidgetMode,    // 위젯 모드 설정 (contents : isWidgetMode)
        setEPGTrigger: setEPGTrigger,    // EPG 트리거 노출 여부 설정(contents : isEPGTrigger)
        setIAD: setIAD,                  // IAD 노출 여부 설정(contents : IAD)
        setMiniBar: setMiniBar,          // mini-EPG 노출 여부 설정(contents : isMiniBar)
        setCugConfig: setCugConfig,      // 초기 EPG 설정
        startCugVOD : startCugVOD,

        uniqueHiddenChn : uniqueHiddenChn,  //중복 히든 채널 처리
        uniqueDedicatedChn : uniqueDedicatedChn, //중복 전용 채널 처리
        //TODO 추후 테스트 메서드 삭제
        // setCugConfigTest: setCugConfigTest,
        // startVodTest: startVodTest,
        // setBootingHomeTest: setBootingHomeTest,
        // setWidgetModeTest: setWidgetModeTest,
        // setEPGTriggerTest: setEPGTriggerTest,
        // setIADTest: setIADTest,
        // setMiniBarTest: setMiniBarTest,
        // setAVResizeTest: setAVResizeTest,
        // startVodTest2 : startVodTest2

        //////////// iFrame ////////////
        standAlone: standAlone
    }

})();
