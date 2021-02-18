directory.globalEventView = Backbone.View.extend({
    el: "body",
    htActKey: {
        /* 방향키 */
        37: "left",
        38: "top",
        39: "right",
        40: "bottom",
        13: "ok",
        8: 'back',
        /* 숫자키 */
        48: 'num0',
        49: 'num1',
        50: 'num2',
        51: 'num3',
        52: 'num4',
        53: 'num5',
        54: 'num6',
        55: 'num7',
        56: 'num8',
        57: 'num9',
        46: '*',
        187: '#',
        /* 기능키 */
        36: 'home',
        116: 'search',
        117: 'chart',
        118: 'menu',
        119: 'star',
        /* 사용안함
         ?? : 'allChanel',
         ?? : 'subtitles',
         */
        /* 특수컬러키 */
        112: 'red',
        113: 'green',
        114: 'yellow',
        115: 'blue',
        /* 플레이키 */
        120: 'play',
        121: 'stop',
        122: 'backward',
        123: 'forward',
        188: 'prev',
        190: 'next',
        /* 채널 관련 */
        238: 'channelUp',
        241: 'channelDown',
        234: 'favorUp',
        249: 'favorDown',

        // 219: 'channelUp',
        // 221: 'channelDown',
        // 186: 'favorUp',
        // 222: 'favorDown',

        191: 'end',
        120: 'delete',
        243: 'switch',

        245: 'simplePurchase', //CSP에서 603번을 97번으로 변경하여 보내주기로 함 //[Alaska OCAP] CSP Library v5.0.2.5 배포 0509

        603: 'simplePurchase',

        500 :'voice',

        251 : 'voiceSearch'

    },
    events: {
        'keydown': _.throttle(function (e) {
            this.onKeydown(e)
        }, 0),
        'click a[href="#"]': 'prevent'
    },
    initialize: function () {
    },
    onKeydown: function (e) {
        //브라우저 back 키에 히스토리백 기능 제거
        if (
            e.keyCode === 8 ||
           // e.keyCode === 112 ||
            e.keyCode === 113 ||
            e.keyCode === 114 ||
            e.keyCode === 115 ||
            e.keyCode === 120 ||
            e.keyCode === 121 ||
            e.keyCode === 122 ||
            e.keyCode === 123 ||
            e.keyCode === 188 ||
            e.keyCode === 190
        ) {
            e.preventDefault();
        }

        /**
         * 간편결제 설정 메뉴 진입
         * link 통해서 진입해야 성인인증팝업 노출 가능
         * router callMenu로 진입 시 인증팝업 노출하지 않음.
         */
        if(e.keyCode == 245 && App.config.settopInfo.simplePurchase == "false" && window.location.hash !== "#settingPopupAdultCheck" && window.location.hash !== "#settingVodPurchase" && $('.popup_dim').length == 0){
            App.historyApp.push();
            App.api.link.move({
                type: "sc01",
                value: "5906"
            });
            return false;
        }

        // if( App.fn.globalUtil.is("HCNSMART") ){
        //
        //     if(e.keyCode == 112 ){
        //         App.historyApp.push();
        //         App.router.callMenu({
        //             menuId : "14001"
        //         });
        //         return false;
        //     }else if (e.keyCode == 113){
        //         App.historyApp.push();
        //         App.router.callMenu({
        //             menuId : "14002"
        //         });
        //         return false;
        //     }else if (e.keyCode == 114){
        //         App.historyApp.push();
        //         App.router.callMenu({
        //             menuId : "14003"
        //         });
        //         return false;
        //     }
        //
        // }

        /**
         * 에러팝업시 닫기
         */

        if ($("#popup_error").is(':visible')) {
            if (e.keyCode === 13 || e.keyCode === 8) {
                $("#popup_error").remove();
            }
            /**
             * 에러팝업시 모드셋 변경
             * 임시 소스라서 지워야함!!
             */
            if (e.keyCode === 112) {
                var xml = [];
                xml.push("<INTERFACE>");
                xml.push("<TYPE>notify</TYPE>");
                xml.push("<COMMAND>Set</COMMAND>");
                xml.push("<CONTENTS>HiddenPopup</CONTENTS>");
                xml.push("<DATA>");
                xml.push("<kind>csplayer</kind>");
                xml.push("</DATA>");
                xml.push("</INTERFACE>");
                App.api.csApi.request(xml.join(""));
            }


            return false;
        }

        if ($("#popup_default").is(':visible')) {
            console.log("popup_default : keyAction");

            if (e.keyCode === 13 || e.keyCode === 8) {
                console.log("popup_default : " + e.keyCode);
                App.view.defaultPopup.remove();
            }
            return false;
        }

        /**
         * TTS 히든키 한영키(243) 5회 + 0번키(48) 1회
         */


        var voiceGuide
        var correct = [243,243,243,243,243,48]

        if(e.keyCode === 243 ||e.keyCode === 48 ){
            App.vars.ttsHiddenMenu.push(e.keyCode);
        }else{
            App.vars.ttsHiddenMenu = []
        }

        if (App.vars.ttsHiddenMenu.length === 6) {
            if (App.vars.ttsHiddenMenu.join("") === correct.join("")) {

                if(App.config.settopInfo.voiceGuide === "true"){
                    voiceGuide = "false"
                }else {
                    voiceGuide = "true"
                }
                var oData = {
                    DATA: {
                        voiceGuide: voiceGuide,
                    }
                };
                App.api.fn.setDeviceInfo(oData);
            }else {
                App.vars.ttsHiddenMenu.shift(0);
            }
        }

        var page = Backbone.history.getFragment();
        // 예외사항
        // if (e.keyCode == 8 || e.keyCode == 122 || e.keyCode == 123) { //back 버튼 예외처리
        //     e.preventDefault();
        // }

        /**
         * 서비스 장애 안내 팝업
         * 홈키시 stopApp
         */
        if(e.keyCode == 36 && window.location.hash == "#serviceAlarmFailurePopup"){
            App.api.fn.stopApp();
            return false;
        }

        /**
         * 위젯 모드일 경우에는 앱을 종료 시키지 않음
         */
        if(e.keyCode == 36 && App.fn.globalUtil.is("WIDGET")){
            e.preventDefault();
            return false;
        }

        if (e.keyCode == 36 && window.location.hash != "#homeShopping") {

            clearInterval(App.vars.timer.setOffset);
            App.vars.vodDetailPipOffset = 0;

            if(window.location.hash == "#vodDetailPIP"){
                clearTimeout(App.vars.timer.moveLink);
                App.api.csApi.stopVodPreview();
            }

            if (window.location.hash != "#homeMain" && window.location.hash != "#homeMainKids" && window.location.hash != "#cugChannelLtype") {
                $('body').empty();
                App.view.wrapContainer = new directory.wrapContainer();
                $('body').html(App.view.wrapContainer.render().el);

                if (App.fn.globalUtil.is("ISCJH") && !App.fn.globalUtil.is("CUG") && !App.fn.globalUtil.is("ISBRIDGEBLOCK")) {
                    // 헬로비전 일반사용자 - 
                    App.router.callMenu({menuId: "100",
                        envJson: {
                            activeSection: "nav2Dep",
                            nFocus1Dep: 0,
                            nFocus2Dep: 0,
                            nFocus3Dep: 0
                        }
                    });

                } else {
                    if(App.fn.globalUtil.is("KIDSMODE")){
                        App.router.callMenu({
                            menuId: "101",
                            envJson:{
                                activeSection: 'dep01'
                            }
                        });
                    }else{
                        App.router.callMenu({
                            menuId: "101",
                            envJson: {
                                activeSection: "nav1Depth",
                                nFocus1Depth : App.vars.nDefaultIndex
                            }
                        });
                    }
                }
                
                //vodPayment timer clear
                if (
                    App.view.vodPayment != null &&
                    (App.view.vodPayment.payTimer !== undefined ||
                    App.view.vodPayment.authTimer !== undefined)
                ) {
                    clearInterval(App.view.vodPayment.payTimer);
                    clearInterval(App.view.vodPayment.authTimer);
                }
            }
        }
        var t = e.charCode || e.keyCode || 0;


        if (this.htActKey.hasOwnProperty(t)) {
            console.log(this.htActKey[t]);
            var oPage = App.view[page];
            var sCode = this.htActKey[t];
            console.log('page : ', page);
            console.log('oPage : ', oPage);
            console.log('sCode : ', sCode);
            if (typeof(oPage[sCode]) == "function") {
                oPage[sCode]();
            } else {
                return false;
            }
        }

        /**
         * TTS 실행
         */
        // App.fn.globalUtil.playTTS();

    },

    onKeydownBack: function () {
        //브라우저 back 키에 히스토리백 기능 제거

        // console.log("e.keyCode : " + e.keyCode);
        var page = Backbone.history.getFragment();

        var t = 8;
        if (this.htActKey.hasOwnProperty(t)) {
            console.log(this.htActKey[t]);
            var oPage = App.view[page];
            var sCode = this.htActKey[t];
            if (typeof(oPage[sCode]) == "function") {
                oPage[sCode]();
            } else {
                return false;
            }
        }
    },

    prevent: function (event) {
        event.preventDefault();

    }
});
