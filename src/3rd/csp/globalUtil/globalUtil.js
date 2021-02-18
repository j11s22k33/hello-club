directory.globalUtil = Backbone.View.extend({
    cugTm: null, //cug ltype에서 사용
    initialize: function () {
        App.view.coinInfoView = new directory.coinInfoView();
        App.view.errorPopup = new directory.errorPopup();
        App.view.defaultPopup = new directory.defaultPopup();
    },
    setTime : function () {
        var nTimer;
        $('.txt_time .hour').html(moment().format('hh'));
        $('.txt_time .minute').html(moment().format('mm'));
        $('.txt_date').html(moment().format('a'));
        $('._now_date').html(moment().format("MMMDo(dddd)"));
        if (window.location.hash === "#homeMain") {
            clearInterval(nTimer);
            nTimer = setInterval(function () {
                $('.txt_time .hour').html(moment().format('hh'));
                $('.txt_time .minute').html(moment().format('mm'));
                $('.txt_date').html(moment().format('a'));
                $('._now_date').html(moment().format("MMMDo(dddd)"));
            },30000)
        }
    },
    isWeather : function (data) {
        switch (data) {
            case "01" :
                return "맑음";
                break;
            case "02" :
                return "구름조금";
                break;
            case "03" :
                return "구름많음";
                break;
            case "04" :
                return "흐림";
                break;
            case "05" :
                return "비";
                break;
            case "06" :
                return "눈";
                break;
            case "07" :
                return "비온후갬";
                break;
            case "08" :
                return "소나기";
                break;
            case "09" :
                return "비/눈";
                break;
            case "10" :
                return "눈/비";
                break;
            case "11" :
                return "낙뢰";
                break;
            case "12" :
                return "안개";
                break;
            case "13" :
                return "흐린후 갬";
                break;
            case "14" :
                return "맑은 후 흐림";
                break;
            case "15" :
                return "눈온후 갬";
                break;
            case "16" :
                return "눈 또는 비후 갬";
                break;
        }
    },

    switchMode: function (mode, selectMode) {
        Object.keys(mode).forEach(function (name, index) {
            if (name === selectMode) {
                mode[name] = true;
                console.log('%c 현재 모드 : ' + name + " ", 'background: #666; color: #fff');
            } else {
                mode[name] = false;
            }
        });

    },
    getMode: function (mode) {
        var modeName = "";
        Object.keys(mode).forEach(function (name) {
            if (mode[name] === true) {
                modeName = name;
            }
        });
        return modeName;
    },
    moveActive: function (opt) {
        var option = {
            step: 0, //움직일 거리 (정수)
            ignoreClass: '._ignore', //필터링하는 클래스네임
            activeClass: 'active', //엑티브 클래스네임
            el: $('._section'), //기준 클래스 네임
            circulation: false,
            beforeCallback: function () {
            },
            afterCallback: function () {
            }
        };
        var setting = $.extend(option, opt);
        var totalStep; //전체 길이
        var currentStep; //현재 활성화
        var nextStep; //변경 활성화
        setting.beforeCallback();
        totalStep = setting.el.length - 1;
        //console.log("totalStep : " + totalStep);
        var elSection = setting.el.not(setting.ignoreClass);
        elSection.each(function (index) {
            if ($(this).hasClass(setting.activeClass)) {

                /* 현재 인덱스 구성 */
                currentStep = index;
                elSection.removeClass(setting.activeClass);
                //console.log("currentStep : " + currentStep);
                nextStep = currentStep + setting.step;

                /* 전체 길이 순환 체크 */
                if (setting.circulation) {
                    if (nextStep > totalStep) {
                        nextStep = 0;
                    } else if (nextStep < 0) {
                        nextStep = totalStep;
                    }
                } else {
                    if (nextStep > totalStep) {
                        nextStep = totalStep;
                    } else if (nextStep < 0) {
                        nextStep = 0;
                    }
                }

                /* 차세대 인덱스 구성 */
                console.log("nextStep : " + nextStep);
                elSection.eq(nextStep).addClass(setting.activeClass);
                console.log(elSection);
                setting.afterCallback();
                return false;

            }
        })
    },
    moveFocus: function (opt) {
        var option = {
            changeClass: 'focus', //바뀔 클래스 네임
            filterClass: '.focus', //필터링하는 클래스네임
            ignoreClass: '._ignore', //필터링하는 클래스네임
            el: $('._moveFocus'), //기준 클래스 네임
            findScope: '>*', //find할 노드s
            direction: "next", //움직이는 값 prev || next || eq
            eqIndex: 0,
            circulation: false,
            beforeCallback: function () {
            },
            afterCallback: function () {
            }
        };

        var setting = $.extend(option, opt);
        var welFocusWrap = setting.el;
        var $el = welFocusWrap.find(setting.findScope).not(setting.ignoreClass);
        var $elFocus = $el.filter(setting.filterClass);
        // before

        setting.beforeCallback();
        if (setting.direction === "prev") {
            if ($elFocus.prev().length) {
                if ($elFocus.prev().hasClass('_ignore')) {
                    $elFocus.removeClass(setting.changeClass).prev().prev().addClass(setting.changeClass);
                } else {
                    $elFocus.removeClass(setting.changeClass).prev().addClass(setting.changeClass);
                }
            } else if (!$elFocus.prev().length) {
                if (setting.circulation) {
                    $elFocus.removeClass(setting.changeClass).end().last().addClass(setting.changeClass);
                }
            }
        } else if (setting.direction === "next") {
            if ($elFocus.next().length) {
                if ($elFocus.next().hasClass('_ignore')) {
                    $elFocus.removeClass(setting.changeClass).next().next().addClass(setting.changeClass);
                } else {
                    $elFocus.removeClass(setting.changeClass).next().addClass(setting.changeClass);
                }
            } else if (!$elFocus.next().length) {
                if (setting.circulation) {
                    $elFocus.removeClass(setting.changeClass).end().first().addClass(setting.changeClass);
                }
            }
        } else if (setting.direction === "eq") {
            welFocusWrap.find(setting.findScope).eq(setting.eqIndex).addClass(setting.changeClass).siblings().removeClass(setting.changeClass);
        }
        setting.afterCallback();
    },

    moveFocusSelector: function (opt) {
        var option = {
            changeClass: 'focus', //바뀔 클래스 네임
            filterClass: '.focus', //필터링하는 클래스네임
            ignoreClass: '._ignore', //필터링하는 클래스네임
            el: $('._moveFocus'), //기준 클래스 네임
            findScope: '>*', //find할 노드s
            direction: "next", //움직이는 값 prev || next || eq
            eqIndex: 0,
            circulation: true,
            beforeCallback: function () {
            },
            afterCallback: function () {
            }
        };

        var setting = $.extend(option, opt);
        var welFocusWrap = setting.el;
        var $el = welFocusWrap.find(setting.findScope).not(setting.ignoreClass);
        var $elFocus = $el.filter(setting.filterClass);
        var nSize = $el.length;
        var nIndex;
        // before

        setting.beforeCallback($el);
        if (setting.direction === "prev") {
            $el.each(function (index) {
                if ($(this).hasClass('focus')){
                    if (setting.circulation) {
                        if(index > 0) {
                            $el.removeClass('focus').eq(index-1).addClass('focus');
                            nIndex = index -1 ;
                        } else {
                            $el.removeClass('focus').last().addClass('focus');
                            nIndex = nSize-1;
                        }
                    } else {
                        if(index > 0) {
                            $el.removeClass('focus').eq(index-1).addClass('focus');
                            nIndex = index -1 ;
                        }
                    }

                    return false;
                }
            });
        } else if (setting.direction === "next") {
            $el.each(function (index) {
                if ($(this).hasClass('focus')){
                    if (setting.circulation) {
                        if(index < nSize-1) {
                            $el.removeClass('focus').eq(index+1).addClass('focus');
                            nIndex = index + 1;
                        } else {
                            $el.removeClass('focus').first().addClass('focus');
                            nIndex = 0;
                        }
                    }else {
                        if(index < nSize-1) {
                            $el.removeClass('focus').eq(index+1).addClass('focus');
                            nIndex = index + 1;
                        }
                    }
                    return false;
                }
            });
        }
        console.log(nIndex);
        setting.afterCallback($el , nIndex);
    },

    /**
     * 블랙 UI 2020.05.25 : sbng : 변경함 
     * @param {*} opt 
     */
    moveSlideMenu: function (opt) {
        var option = {
            wrapper: '._moveSlideMenu',
            sliderMenu: '._moveFocus',
            margin: 75,
            nOffSet: 0,
            sidemenu: false,
            direction: 'next',
            eqIndex: 0,
            beforeCallback: function () {
            },
            afterCallback: function () {
            }
        };
        var setting = $.extend(option, opt);
        var $wrapper = $(setting.wrapper);
        var $sliderMenu = $wrapper.find(setting.sliderMenu);
        var $sliderMenuWidth = $sliderMenu.outerWidth(true);
        var $sliderMenuSize = $sliderMenu.find('>').length;
        var $vodListWidth = 1280 - (setting.margin * 2);

        var $leftBaseLine = setting.margin ;
        var $rightBaseLine = 1280 - setting.margin ;        
        setting.beforeCallback();

        App.fn.globalUtil.moveFocus({
            el: $sliderMenu ,
            findScope: '>li' ,
            direction: setting.direction ,
            circulation: false ,
            eqIndex: setting.eqIndex ,
            afterCallback: function () {
                var nFocusIdx = $sliderMenu.find('.focus').index();
                var nFocusObj = $sliderMenu.find('.focus');

                if ( setting.direction ==='prev' ) {
                    var leftEdge = nFocusObj.position().left ; 
                    if ( $leftBaseLine > leftEdge ) {
                        var move = $wrapper.position().left + ( nFocusObj.outerWidth(true) ) ;
                        if ( nFocusIdx === 0 ) move = $leftBaseLine; // 0 인텍스는 기본값으로 셋팅 
                        $wrapper.css('transform', 'translateX(' + move + 'px)');
                    }
                } else if ( setting.direction === 'next' ) {
                    var rightEdge = nFocusObj.position().left + nFocusObj.outerWidth(true) ;
                    if ( $rightBaseLine < rightEdge ) {
                        var move = $wrapper.position().left - ( rightEdge - $rightBaseLine ) ;
                        $wrapper.css('transform', 'translateX(' + move + 'px)');
                    }
                }

                setting.afterCallback();    

                // 
                // if ( nFocusIdx > 0 && nFocusIdx < $sliderMenuSize ){
                //     setting.afterCallback();    
                // }
                // 
                // var nMoveSize = ($sliderMenuWidth - $vodListWidth + setting.nOffSet) / $sliderMenuSize;
                // var move;
                // if (setting.sidemenu) {
                //     move = ((nMoveSize * nFocusIdx) + $sliderMenuWidth) * -1 + setting.nOffSet
                // } else {
                //     move = ((nMoveSize * nFocusIdx)) * -1 + setting.nOffSet
                // }
                // if ($sliderMenuWidth < $vodListWidth) {
                //     move = setting.nOffSet;
                // }
                // $wrapper.css('transform', 'translateX(' + move + 'px)');
                // 

                
            }
        })
    },
 
    setSlideInit: function (opt) {
        var option = {
            wrapper: '._moveSlideMenu',
            sliderMenu: '._moveFocus',
            margin: 75,
            nOffSet: 0,
            sidemenu: false
        };
        var setting = $.extend(option, opt);
        var $wrapper = $(setting.wrapper);
        var $sliderMenu = $wrapper.find(setting.sliderMenu);
        var $sliderMenuWidth = $sliderMenu.outerWidth(true);
        var $sliderMenuSize = $sliderMenu.find('>').length;
        var $vodListWidth = 1280 - (setting.margin * 2);

        var nFocusIdx = $sliderMenu.find('.focus').index();
        var nFocusObj = $sliderMenu.find('.focus');
        var $leftBaseLine = setting.margin ;
        var $rightBaseLine = 1280 - setting.margin ;

        if ( nFocusIdx >= 0 ){
            var rightEdge = nFocusObj.position().left + nFocusObj.outerWidth(true) ;
            if ($rightBaseLine < rightEdge) {
                var move = $wrapper.position().left - ( rightEdge - $rightBaseLine ) ;
                $wrapper.css('transform', 'translateX(' + move + 'px)');    
            } else {
                $wrapper.css('transform', 'translateX(' + $leftBaseLine + 'px)');    
            }
            // console.log( '>>>>>>>>>' + setting.wrapper ,  nFocusIdx) ;
            // console.log( '>>>>>>>>>' , nFocusObj ,  nFocusIdx) ;
            // console.log( '>>>>>>>>>' + rightEdge ,  nFocusIdx) ;
        }
    },
    setSlideWidth: function (opt) {
        var option = {
            target: '._moveSlideMenu',
            menuList: '._moveFocus li',
            sideMenu: false,
            beforeCallback: function () {

            },
            afterCallback: function () {
            }
        };
        var setting = $.extend(option, opt);
        var nListWidth = 0;
        $(setting.target).find(setting.menuList).each(function () {
            nListWidth = nListWidth + $(this).outerWidth(true);
        });
        
        // 퍼블리싱에서 margin : 0 10px 추가로 인한 수치증가
        if (setting.sideMenu) {
            $(setting.target).width(nListWidth * 3 + 100);
        } else {
            $(setting.target).width(nListWidth + 200);
        }

        console.log( '>>>>>>>>>' + setting.target  ) ;

    },
    /**
     *  패스워드 입력 함수
     *  작성자 : 김성규
     *  number : 패스워드 숫자 입력 값
     *  html 태그 구조 :
     *  <div class="_section active _field" data-password="">
     *      $('._section._field').data('password');
     *      1. _section 동일 위치에 _field 클래스
     *      2. _field 는 패스워드 키값을 가져오기 위해
     *         data 어트리뷰트를 기본으로 가진다. (default : data-password="")
     *      3. _field 하위에 focus 되는 엘리먼트는 4개를 가진다. (각각 입력됨)
     *      4. 마지막 focus일 때 moveActive를 위해 callback 함수를 가진다.
     **/
    insertPassword: function (number, opt) {
        var self = this;
        var option = {
            field: $('.active._field'),
            beforeCallback: function () {
            },
            afterCallback: function () {
            },
            fieldLastCallback: function () {

            }
        };
        var setting = $.extend(option, opt);

        // 4자리 입력 후 키를 더 입력했을 때 방어로직
        if(setting.field.find('.enter').length < 4){
            //section에 동일 위치에 _field 구성
            setting.beforeCallback();
            var $focus = setting.field.find('.focus');
            if ($focus.index() === 0) {
                setting.field.data('password', number.toString());
                // console.log('password : ' + option.field.data('password'));
                $focus.removeClass('focus').addClass('enter').next('p').addClass('focus');
            } else if ($focus.index() < 3) {
                setting.field.data('password', setting.field.data('password') + number.toString());
                // console.log('password : ' + option.field.data('password'));
                $focus.removeClass('focus').addClass('enter').next('p').addClass('focus');
            } else {
                setting.field.data('password', setting.field.data('password') + number.toString());
                // console.log('password : ' + option.field.data('password'));
                $focus.removeClass('focus').addClass('enter focus').next('p').addClass('focus');
                self.checkPassword();
                setting.fieldLastCallback();
            }
            setting.afterCallback();
        }
    },
    /**
     * 패스워드 삭제 함수
     * 작성자 : 김성규
     * 해당 페이지 left key 입력시 사용.
     **/
    deletePassword: function (opt) {
        var option = {
            el: $('._section.active._field')
        };
        var setting = $.extend(option, opt);
        var $field = setting.el;
        var $focus = $field.find('.focus');
        $focus.each(function () {
            if ($focus.index() > 0) {
                $field.data('password', $field.data('password').substring(0, $focus.index()));
                // console.log($field.data('password'));
                $focus.removeClass('enter focus').prev().attr('class', ' focus');
            } else if ($focus.index() === 0) {
                $field.data('password', '');
                // console.log($field.data('password'));
                $focus.removeClass('enter').addClass('focus');
            } else if ($focus.index() === 3) {
                $focus.removeClass('enter').prev().attr('class', 'enter focus');
            }
        });
    },
    checkPassword: function () {
        var self = this;
        var arr = [];
        var $field1 = $('._field.first');
        arr.push($field1.data('password'));
        var $field2 = $('._field').eq(1);
        arr.push($field2.data('password'));
        var $field3 = $('._field.last');
        arr.push($field3.data('password'));

        if (arr[1] === arr[2] && arr[1] === "") {
            // alert('true 빈값');
            return false;
        } else if (arr[1] !== arr[2]) {
            // 새 비밀번호, 비밀번호 확인이 다를 경우
            return 'newFalse';
        } else if (arr[1] === arr[2]) {
            // 새 비밀번호, 비밀번호 확인이 같을 경우
            return 'newSuccess';
        } else {
            // 현재 비밀번호가 잘못된 경우
            return 'currentFail';
        }
    },
    resetPassword: function () {
        var self = this;
        var $field = $('._field');
        var $field1 = $field.eq(0);
        var $field2 = $field.eq(1);
        var $field3 = $field.eq(2);
        console.log(self.checkPassword());

        if ($field.length === 3) {
            // 입력필드 3개일때
            if (self.checkPassword() === 'newFalse') {
                //새 비밀번호 틀림
                $field2.find('.enter').removeClass('enter');
                $field3.find('.enter').removeClass('enter');
                $field2.addClass('active').siblings().removeClass('active');
                $field2.find('.auth p').eq(0).addClass('focus');
                $field3.find('.auth p').eq(0).addClass('focus');
            } else if (self.checkPassword() === 'currentFail') {
                //현재 비밀번호 틀림
                $field.find('.enter').removeClass('enter');
                $field1.addClass('active').siblings().removeClass('active');
                $field1.find('.auth p').eq(0).addClass('focus');
            }
        } else {
            // 입력필드 1개일때
            $field.addClass('active').siblings().removeClass('active');
            $field.find('.auth p').eq(0).addClass('focus');
        }
    },

    /**
     * 번호 초기화
     */
    resetField: function ($target) {
        var self = this;
        var $textbox = $target;
        $textbox.find('span').html("").end().eq(0).addClass('focus').siblings().removeClass('focus')
    },
    deleteField: function ($target) {
        var self = this;
        var $textbox = $target;
        if($textbox.eq(2).hasClass('focus')){
            //마지막 텍스트박스에 포커스일 때
            if($textbox.eq(2).find('span').text().length === 0){
                $textbox.eq(2).removeClass('focus').prev().addClass('focus');
            } else {
                $textbox.eq(2).find('span').text($textbox.eq(2).find('span').text().slice(0, -1));
            }
        } else if($textbox.eq(1).hasClass('focus')){
            //가운데 텍스트박스에 포커스일 때
            if($textbox.eq(1).find('span').text().length === 0){
                $textbox.eq(1).removeClass('focus').prev().addClass('focus');
            } else {
                $textbox.eq(1).find('span').text($textbox.eq(1).find('span').text().slice(0, -1));

            }
        } else {
            //첫 텍스트박스에 포커스일 때
            if($textbox.eq(0).find('span').text().length === 0){
                return false;
            } else {
                $textbox.eq(0).find('span').text($textbox.eq(0).find('span').text().slice(0, -1))
            }
        }
    },



    /**
     * 컨테이너 초기화
     */
    containerClassReset: function () {
        //컨테이너에 추가된 클래스 초기화
        $('#container').attr('class', '');
    },
    containerClear: function () {
        //컨테이너에 추가된 클래스 초기화
        $('#container').empty();
        $('#container_popup').empty();
    },
    /**
     * 토스트팝업메세지
     */
    toastPopup : function(html){
        $('.dim_bottom').remove();
        var aPopup = [];
        aPopup.push("<div class=\"popup_dim dim_bottom\">");
        aPopup.push("<div class=\"popup popup_bottom_type1\">");
        aPopup.push("<div class=\"popup_body\">");
        aPopup.push("<p class=\"title\">" + html + "</p>");
        aPopup.push("</div>");
        aPopup.push("</div>");
        aPopup.push("</div>");
        $('body').append(aPopup.join(''));

        var timer;
        timer = setTimeout(function(){
            $('.dim_bottom').remove();
            clearTimeout(timer);
        },2000)
    },

    errorPopup : function(html){
        $('.dim_bottom').remove();
        App.view.errorPopup.render(html);
    },

    cugNoticeWithWelcome: function(envJson, isColdBooting) {
        // 웰컴 메세지 표시 여부가 설정이 안되어있을경우 콜드 부팅에 따라 결정
        if (App.vars.showWelcomeMessage == null) {
            App.vars.showWelcomeMessage = isColdBooting ? true : false;
        }

        async.parallel({
            cugNotice: function(asyncCallback) {
                App.api.cugApi.getNotice({
                    callback: function (data) { asyncCallback(null, data); }
                    , errorCallback: function(error) {asyncCallback(null, {isError: true, error:error});}
                });
            },
            welcomeMsg: function(asyncCallback) {
                App.api.cugApi.getWelcomeMsg({
                    'sp_id': App.provider.ip.flagUi //사업자 ID M
                    , 'subs_id': App.config.settopInfo.subscriberId
                    , 'cug_id': App.config.settopInfo.cugGroupId
                    , callback : function(data) { asyncCallback(null, data); }
                    , errorCallback: function(error) {asyncCallback(null, {isError: true, error:error});}
                });
            }
        }, function(err, results) {

            var cugNotice = results.cugNotice;
            var welcomeMsg = results.welcomeMsg;

            var showWelcomeMsg = function() {};

            if (App.vars.showWelcomeMessage == true && !welcomeMsg.isError && welcomeMsg.title != '') {
                showWelcomeMsg = function() {
                    console.log('getWelcomeMsg data', welcomeMsg);

                    App.historyApp.push(envJson); // 히스토리 복구 시 기억할 위치
                    App.router.callMenu({
                        menuId : "cugWelcomePopup",
                        envJson : {
                            id : 'welcome',
                            cugInfo : welcomeMsg
                        }
                    });
                }
            }

            if (App.vars.showPopupNotice && !cugNotice.isError && cugNotice.noticeId > -1) {
                // App.vars.showPopupNotice = false;
                App.historyApp.push(envJson); // 히스토리 복구 시 기억할 위치
                $.extend(true, cugNotice, {coldBooting:isColdBooting});
                setTimeout(function(){
                    App.api.link.move(
                        {type: "cug05"
                        , contentType: "notice"
                        , value: cugNotice
                        , afterMove: showWelcomeMsg}
                    );
                }, 500);
            } else {
                showWelcomeMsg();
            }
        });
    },


    setCategoryHistory : function (option) {
        opt = App.api.categoryHistory;
        $.extend(opt, option);
        App.api.categoryHistory = opt;
    },
    delCategoryHistory : function (option) {
        App.api.categoryHistory = {
            depth1 : "",
            depth2 : "",
            depth3 : "",
            depth4 : "",
            sasset : "",
            asset : "",
            series : "",
            product : ""
        };
    },
    addFavorChannel : function (option) {
        var opt = {
            sourceId : "",
            channelNum : "",
            channelName : ""
        };
        $.extend(opt, option);
        /**
         * 선호채널 등록
         */
        var channel = App.config.settopInfo.favoriteChannels;
        var aChannel = channel.split('|');
        var bAdd = true;
        var index = 0;
        var self = this;
        aChannel.forEach(function (a,i) {
            if (a == opt.sourceId){
                bAdd = false;
                index = i;
            }
        });

        if(aChannel.length < 40) {
            if (bAdd) {
                aChannel.push(opt.sourceId.toString());
                App.fn.globalUtil.toastPopup("[" + opt.channelNum + opt.channelName + "] 채널이 선호 채널로 등록되었습니다");
                self.setLog();

            } else {
                aChannel.splice(index,1);
                App.fn.globalUtil.toastPopup("[" + opt.channelNum + opt.channelName + "] 채널이 선호 채널 목록에서 삭제되었습니다");
            }

            if (aChannel[0] == "") {
                aChannel = aChannel.pop();
            }
            if (typeof(aChannel) != "string"){
                aChannel = aChannel.join("|");
            }

            App.api.fn.setDeviceInfo({
                DATA: {
                    favoriteChannels:  aChannel
                }
            });

            App.config.settopInfo.favoriteChannels = aChannel;

        } else if(aChannel.length >= 40) { // 선호채널이 40개 이상일 때
            if (bAdd) {
                App.fn.globalUtil.toastPopup("선호채널이 40개를 초과하였습니다");
            } else {
                aChannel.splice(index,1);
                App.fn.globalUtil.toastPopup("[" + opt.channelNum + opt.channelName + "] 채널이 선호 채널 목록에서 삭제되었습니다");

                if (aChannel[0] == "") {
                    aChannel = aChannel.pop();
                }
                if (typeof(aChannel) != "string"){
                    aChannel = aChannel.join("|");
                }

                App.api.fn.setDeviceInfo({
                    DATA: {
                        favoriteChannels:  aChannel
                    }
                });
            }
        }
    },

    setLog: function(){
        /**
         * view Type log
         */
        var entryCode = null;
        var channelNum = $('.channel_list ul .current .box_channel .num').text();
        var channelId = $('.channel_list ul .current').data('sourceid');
        var channelName = $('.channel_list ul .current').data('channelname');
        var channelLog = [channelNum, channelId, channelName];

        if(App.fn.entryCode.getCode(false) != undefined){
            entryCode = App.fn.entryCode.getCode();
        }

        App.api.fn.setLog({
            logLevel: "4",
            log_name: "viewLog",
            storage_group_id: "VIEW",
            log_id : "VIEW_0095",
            data: {
                "entry": entryCode,
                "add_1": channelLog // 채널 번호/소스ID/채널명
            },
            callback: function (data) {
                console.log(data);
            },
            errorCallback: function (error) {
                console.log(error);
            }
        });
    },
    setPath : function (categoryId, MENUTYPE) {
        var isKids = false;
        if(App.fn.globalUtil.is("KIDSMODE")) {
            isKids = true;
        }
        if(MENUTYPE === "MC1008"){
            if(App.fn.globalUtil.is("KIDSMODE")){
                var oData = {
                    list :[
                        {title : ""},
                        {title : "검색"}
                    ],
                    isHome : false,
                    isKids : isKids,
                    MENUTYPE :  "MC1008"
                };
            } else if(!App.fn.globalUtil.is("KIDSMODE")){
                var oData = {
                    list :[{
                        title : "검색"
                    }],
                    isHome : false,
                    isKids : isKids,
                    MENUTYPE :  "MC1008"
                };
            }

            $('#page_path').remove();
            $('#container').append(templete["globalUtil/pagePath"](oData));

            if(App.fn.globalUtil.is("KIDSMODE")){
                $('.entry_route').addClass('kids_theme');
            }
        }else if (MENUTYPE ==="MC1009"){
            var oData = {
                list :[{
                    title : "영화맞춤검색"
                }],
                isHome : false,
                MENUTYPE :  "MC1009"
            };
            $('#page_path').remove();
            $('#container').append(templete["globalUtil/pagePath"](oData));
        }else if (MENUTYPE === "MC0006"){
            var oData = {
                list :[{
                    title : "즐겨찾기"
                }],
                isHome : false,
                MENUTYPE :  "MC0006"
            };
            $('#page_path').remove();
            $('#container').append(templete["globalUtil/pagePath"](oData));
        } else if(MENUTYPE === "MC0015"){
            var oData = {
                list :[{
                    title : "스마트 미디어"
                }],
                isHome : false,
                MENUTYPE :  "MC0015"
            };
            $('#page_path').remove();
            $('#container').append(templete["globalUtil/pagePath"](oData));
        } else if (MENUTYPE === "MC0012") {
            if (App.fn.globalUtil.is("LODGE")) {
                //숙박업소 전용관의 경우는 일반 카테고리명을 사용하도록 함
                App.api.fn.getCategoryPath({
                    categoryId : categoryId,
                    // categoryId : "3IGL4",
                    callback : function(data){
                        if (data.length > 1){
                            var oData = {
                                list : data,
                                isHome : false,
                                isKids : isKids,
                                MENUTYPE : MENUTYPE
                            };
                            $('#page_path').remove();
                            $('#container').append(templete["globalUtil/pagePath"](oData));
                            console.log(oData);
                        } else {
                            var oData = {
                                list : data,
                                id: categoryId,
                                isHome : true,
                                isKids : isKids,
                                MENUTYPE : MENUTYPE
                            };
                            $('#page_path').remove();
                            $('#container').append(templete["globalUtil/pagePath"](oData));
                        }
                    }
                });
            } else {
                var curHomeMenu = App.vars.cugHomeMenu.filter( function(cate) { return cate.categoryId == categoryId;} );
                var oData = {
                    list :[{
                        title : curHomeMenu[0].title
                    }],
                    isHome : false,
                    MENUTYPE :  "MC0012"
                };
                $('#page_path').remove();
                $('#container').append(templete["globalUtil/pagePath"](oData));
            }

        } else{
            App.api.fn.getCategoryPath({
                categoryId : categoryId,
                // categoryId : "3IGL4",
                callback : function(data){
                    if (data.length > 1){
                        var oData = {
                            list : data,
                            isHome : false,
                            isKids : isKids,
                            MENUTYPE : MENUTYPE
                        };
                        $('#page_path').remove();
                        $('#container').append(templete["globalUtil/pagePath"](oData));
                        console.log(oData);
                    } else {
                        var oData = {
                            list : data,
                            id: categoryId,
                            isHome : true,
                            isKids : isKids,
                            MENUTYPE : MENUTYPE
                        };
                        $('#page_path').remove();
                        $('#container').append(templete["globalUtil/pagePath"](oData));
                    }
                }
            });
        }

    },
    channelLaunchCsApp: function(opt){
        var option = {
            menuId : ""
        };
        $.extend(option, opt);

        App.api.csApi.launchCsApp({
            DATA: {
                launchInfo: {
                    csType: "ICS",
                    appType: "0",
                    appId: App.vars.startApp.INTERFACE.DATA.mainAppId,
                    subAppId: "0",
                    historyList: {
                        history : option
                    },
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
        });
    },

    debounce : function (func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    throttle : function (func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        options || (options = {});

        var later = function() {
            previous = options.leading === false ? 0 : _.now();
            timeout = null;
            result = func.apply(context, args);
            context = args = null;
        };

        return function() {
            var now = _.now();
            if (!previous && options.leading === false) previous = now;

            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
                context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    },

    getSassetCategoryPath: function(opt){
        // 333552
        var option = {
            contentType : "",
            id : "",
            callback : function(){}
        };
        $.extend(option, opt);
        var contentCategory = "";
        var contentSubcategory = "";

        var aDepth= [];
        async.waterfall([
                function(callback){
                    if(option.contentType == "series"){
                        App.api.bizpf.mget_series({
                            seriesId : option.id,// 슈퍼 애셋 ID 목록 C
                            callback: function (data) {
                                contentCategory = data.data[0].contentCategory;
                                contentSubcategory = data.data[0].contentSubcategory;
                                console.log(contentCategory);
                                console.log(contentSubcategory);
                                callback(null, data);
                            },
                            errorCallback: function (error) {}
                        });
                    }else if(option.contentType == "sasset"){
                        App.api.bizpf.mget_sasset({
                            sassetId : option.id,// 슈퍼 애셋 ID 목록 C
                            callback: function (data) {
                                contentCategory = data.data[0].contentCategory;
                                contentSubcategory = data.data[0].contentSubcategory;
                                console.log(contentCategory);
                                console.log(contentSubcategory);
                                callback(null, data);
                            },
                            errorCallback: function (error) {}
                        });
                    }
                },
                function(data, callback){
                    switch (contentCategory){
                        case "00":
                            aDepth.push("기타");
                            switch (contentSubcategory){
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("홈쇼핑");
                                    break;
                                case "02":
                                    aDepth.push("데이터방송");
                                    break;
                                case "03":
                                    aDepth.push("테스트")
                                    break;
                            }
                            break;
                        case "01":
                            aDepth.push("영화");
                            switch (contentSubcategory){
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("공포/스릴러");
                                    break;
                                case "02":
                                    aDepth.push("다큐멘터리");
                                    break;
                                case "03":
                                    aDepth.push("단편")
                                    break;
                                case "04":
                                    aDepth.push("로맨틱코미디")
                                    break;
                                case "05":
                                    aDepth.push("멜로")
                                    break;
                                case "06":
                                    aDepth.push("뮤지컬")
                                    break;
                                case "07":
                                    aDepth.push("서부")
                                    break;
                                case "08":
                                    aDepth.push("애니메이션");
                                    break;
                                case "09":
                                    aDepth.push("액션/어드벤쳐")
                                    break;
                                case "10":
                                    aDepth.push("무협")
                                    break;
                                case "11":
                                    aDepth.push("성인")
                                    break;
                                case "12":
                                    aDepth.push("역사")
                                    break;
                                case "13":
                                    aDepth.push("컬트")
                                    break;
                                case "14":
                                    aDepth.push("코미디")
                                    break;
                                case "15":
                                    aDepth.push("SF/환타지")
                                    break;
                                case "16":
                                    aDepth.push("드라마")
                                    break;
                                case "17":
                                    aDepth.push("영화해설")
                                    break;
                            }
                            break;
                        case "02":
                            aDepth.push("TV드라마")
                            switch (contentSubcategory) {
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("월화드라마");
                                    break;
                                case "02":
                                    aDepth.push("수목드라마");
                                    break;
                                case "03":
                                    aDepth.push("금토드라마")
                                    break;
                                case "04":
                                    aDepth.push("토일드라마")
                                    break;
                                case "05":
                                    aDepth.push("스페셜")
                                    break;
                                case "06":
                                    aDepth.push("외화 시리즈")
                                    break;
                            }
                            break;
                        case "03":
                            aDepth.push("TV 연예/오락")
                            switch (contentSubcategory) {
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("쇼버라이어티/여행 예능");
                                    break;
                                case "02":
                                    aDepth.push("쿡방/먹방 예능");
                                    break;
                                case "03":
                                    aDepth.push("뮤직 예능")
                                    break;
                                case "04":
                                    aDepth.push("연예/정보 예능")
                                    break;
                                case "05":
                                    aDepth.push("관찰형/토크쇼 예능")
                                    break;
                            }
                            break;
                        case "04":
                            aDepth.push("TV 시사/교양")
                            switch (contentSubcategory) {
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("문화/예술");
                                    break;
                                case "02":
                                    aDepth.push("의학/건강");
                                    break;
                                case "03":
                                    aDepth.push("뉴스/시사")
                                    break;
                                case "04":
                                    aDepth.push("경제/창업/취업")
                                    break;
                                case "05":
                                    aDepth.push("인물/다큐")
                                    break;
                            }
                            break;
                        case "05":
                            aDepth.push("성인")
                            switch (contentSubcategory) {
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("영화(핑크무비)");
                                    break;
                                case "02":
                                    aDepth.push("한국");
                                    break;
                                case "03":
                                    aDepth.push("일본")
                                    break;
                                case "04":
                                    aDepth.push("서양")
                                    break;
                                case "05":
                                    aDepth.push("애니")
                                    break;
                            }
                            break;
                        case "06":
                            aDepth.push("TV애니메이션")
                            switch (contentSubcategory) {
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("스포츠");
                                    break;
                                case "02":
                                    aDepth.push("SF/메카");
                                    break;
                                case "03":
                                    aDepth.push("학원/순정/연애")
                                    break;
                                case "04":
                                    aDepth.push("호러/공포")
                                    break;
                                case "05":
                                    aDepth.push("추리/미스터리")
                                    break;
                                case "06":
                                    aDepth.push("무협/환타지")
                                    break;
                                case "07":
                                    aDepth.push("명랑/코믹")
                                    break;
                                case "08":
                                    aDepth.push("액션/모험")
                                    break;
                            }
                            break;
                        case "07":
                            aDepth.push("키즈")
                            switch (contentSubcategory){
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("학습");
                                    break;
                                case "02":
                                    aDepth.push("영화");
                                    break;
                                case "03":
                                    aDepth.push("오락");
                                    break;
                                case "04":
                                    aDepth.push("애니메이션");
                                    break;
                            }
                            break;
                        case "08":
                            aDepth.push("다큐")
                            switch (contentSubcategory){
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("동물");
                                    break;
                                case "02":
                                    aDepth.push("자연");
                                    break;
                                case "03":
                                    aDepth.push("인물");
                                    break;
                                case "04":
                                    aDepth.push("역사");
                                    break;
                            }
                            break;
                        case "09":
                            aDepth.push("교육")
                            switch (contentSubcategory){
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("초등");
                                    break;
                                case "02":
                                    aDepth.push("중등");
                                    break;
                                case "03":
                                    aDepth.push("고등/수능");
                                    break;
                                case "04":
                                    aDepth.push("외국어강좌");
                                    break;
                                case "05":
                                    aDepth.push("자격증강좌");
                                    break;
                                case "06":
                                    aDepth.push("방송대학");
                                    break;
                            }
                            break;
                        case "10":
                            aDepth.push("라이프")
                            switch (contentSubcategory){
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("요리");
                                    break;
                                case "02":
                                    aDepth.push("운동/건강");
                                    break;
                                case "03":
                                    aDepth.push("다이어트");
                                    break;
                                case "04":
                                    aDepth.push("미용/패션");
                                    break;
                                case "05":
                                    aDepth.push("리빙");
                                    break;
                                case "06":
                                    aDepth.push("여행");
                                    break;
                            }
                            break;
                        case "11":
                            aDepth.push("스포츠")
                            switch (contentSubcategory) {
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("골프");
                                    break;
                                case "02":
                                    aDepth.push("축구");
                                    break;
                                case "03":
                                    aDepth.push("야구")
                                    break;
                                case "04":
                                    aDepth.push("농구")
                                    break;
                                case "05":
                                    aDepth.push("배구")
                                    break;
                                case "06":
                                    aDepth.push("격투기")
                                    break;
                                case "07":
                                    aDepth.push("레슬링")
                                    break;
                                case "08":
                                    aDepth.push("레이싱")
                                    break;
                                case "09":
                                    aDepth.push("낚시")
                                    break;
                                case "10":
                                    aDepth.push("레저")
                                    break;
                                case "11":
                                    aDepth.push("정보")
                                    break;
                            }
                            break;
                        case "12":
                            aDepth.push("게임")
                            switch (contentSubcategory){
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("중계");
                                    break;
                                case "02":
                                    aDepth.push("정보");
                                    break;
                                case "03":
                                    aDepth.push("강좌");
                                    break;
                            }
                            break;
                        case "13":
                            aDepth.push("공연/음악")
                            switch (contentSubcategory){
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("콘서트");
                                    break;
                                case "02":
                                    aDepth.push("연극");
                                    break;
                                case "03":
                                    aDepth.push("뮤지컬/오페라");
                                    break;
                                case "04":
                                    aDepth.push("클래식");
                                    break;
                            }
                            break;
                        case "14":
                            aDepth.push("종교")
                            switch (contentSubcategory){
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("천주교");
                                    break;
                                case "02":
                                    aDepth.push("기독교");
                                    break;
                                case "03":
                                    aDepth.push("불교");
                                    break;
                            }
                            break;
                        case "15":
                            aDepth.push("우리동네")
                            switch (contentSubcategory){
                                case "00":
                                    aDepth.push("기타");
                                    break;
                                case "01":
                                    aDepth.push("뉴스");
                                    break;
                                case "02":
                                    aDepth.push("교양");
                                    break;
                                case "03":
                                    aDepth.push("연예/오락");
                                    break;
                                case "04":
                                    aDepth.push("운동/건강");
                                    break;
                            }
                            break;
                    }
                    callback(null, aDepth);
                },],
            function (err,result) {
                option.callback(result);
            }
        );
    },

    moveSubLink : function () {
        var subLink = {};
        // subLink 지역변수에 담기
        $.extend(true, subLink, App.vars.subLinkObj.subLink);

        // subLink 전역변수 초기화
        App.vars.subLinkObj = {
            type: '',
            value: '',
            subLink: {
                type: '',
                value:''
            }
        };

        App.api.link.move({
            type: subLink.type,
            value: subLink.value
        });
    },
    getChannelLogoUrl: function () {
        if (App.vars.channelLogoUrl === "") {
            App.api.bizpf.region_channels({
                type: "1", // 일반채널
                limit: "1",
                callback: function (data) {
                    if (data.data.length) {
                        App.vars.channelLogoUrl = data.data[0].logoBaseUrl + '/';
                    }
                },
                errorCallback: function (error) {
                }
            });
        }
    },
    setDimLayer: function () {
        clearTimeout(App.vars.timer.dimLayer);
        $("#wrap_popup").addClass('dim_layer');
        App.vars.timer.dimLayer = setTimeout(function () {
            // $("#wrap_popup").removeClass('dim_layer');
        },3000)
    },
    is : function (option, value) {
        var b = false;
        switch(option) {
            case "WIDGET": // 위젯 여부
                if(App.config.settopInfo.widgetMode == "true") {
                    b = true;
                }
                break;
            case "B2B" : // B2B 사용자 여부
                if(App.config.settopInfo.groupBitsB2B == "1"  || App.config.settopInfo.groupBitsB2B == '2') {
                    b = true;
                }
                break;
            case "PVR" : // PVR 셋탑
                if(App.provider.service.pvr == true && App.config.settopInfo.groupBitsPvrNone == "0") {
                    App.provider.stb.pvrStb.forEach(function (array, index) {
                        if (array == App.config.settopInfo.stbModel) {
                            b = true;
                        }
                    });
                }
                break;
            case "PVRService" : // PVR 서비스 가입자
                if(App.provider.service.pvr == true && App.config.settopInfo.groupBitsPvrNone == "0") {
                    if (App.config.settopInfo.groupBitsPvrJoin == "0" || App.config.settopInfo.groupBitsPvrJoin == 0) {
                        b = true;
                    }
                }
                break;
            case "OCAP" : // OCAP 셋탑
                b = true;
                App.provider.stb.pvrRedStb.forEach(function (array, index) {
                    if(array == App.config.settopInfo.stbModel){
                        b = false;
                    }
                });
                App.provider.stb.pvrSmartStb.forEach(function (array, index) {
                    if(array == App.config.settopInfo.stbModel){
                        b = false;
                    }
                });
                App.provider.stb.uhdStb2.forEach(function (array, index) {
                    if(array == App.config.settopInfo.stbModel){
                        b = false;
                    }
                });
                break;
            case "RED" : // PVR red 셋탑
                if(App.provider.service.pvr == true) {
                    App.provider.stb.pvrRedStb.forEach(function (array, index) {
                        if (array == App.config.settopInfo.stbModel) {
                            b = true;
                        }
                    });
                }
                break;
            case "SMART" : // PVR smart 셋탑
                if(App.provider.service.pvr == true) {
                    App.provider.stb.pvrSmartStb.forEach(function (array, index) {
                        if (array == App.config.settopInfo.stbModel) {
                            b = true;
                        }
                    });
                }
                break;
            case "PVROCAP" : // PVR OCAP 셋탑
                if(App.provider.service.pvr == true) {
                    App.provider.stb.pvrOcapStb.forEach(function (array, index) {
                        if (array == App.config.settopInfo.stbModel) {
                            b = true;
                        }
                    });
                }
                break;
            case "UHD" : // UHD 셋탑
                App.provider.stb.uhdStb.forEach(function (array, index) {
                    if(array == App.config.settopInfo.stbModel){
                        b = true;
                    }
                });
                App.provider.stb.uhdStb2.forEach(function (array, index) {
                    if(array == App.config.settopInfo.stbModel){
                        b = true;
                    }
                });
                break;
            case "UHD2" : // UHD 셋탑
                App.provider.stb.uhdStb2.forEach(function (array, index) {
                    if(array == App.config.settopInfo.stbModel){
                        b = true;
                    }
                });
                break;
            case "VOICE" : // PVR 셋탑
                // todo 개발완료 후 App.vars.screenContextTest 삭제 예정
                if(App.provider.service.screenContext == true && App.vars.screenContextTest == true) {
                    App.provider.stb.voiceStb.forEach(function (array, index) {
                        if (array == App.config.settopInfo.stbModel) {
                            b = true;
                        }
                    });
                }
                break;
            case "WANotStb" : // 단방향 셋탑 여부
                App.provider.stb.watchAssistNotStb.forEach(function (array, index) {
                    if(array == App.config.settopInfo.stbModel){
                        b = true;
                    }
                });
                break;
            case "CUG" : // CUG
                if(App.provider.service.cug == true) {
                    if (App.config.settopInfo.cugGroupId != "") {
                        b = true;
                    }
                }
                break;
            case "HCNSMART" : // UHD 셋탑
                if(App.fn.globalUtil.is("ISHCN")) {
                    App.provider.stb.smartStb.forEach(function (array, index) {
                        if (array == App.config.settopInfo.stbModel) {
                            b = true;
                        }
                    });
                }
                break;
            case "NORMALMODE":
                if(App.provider.service.channelMode == true) {
                    if (App.config.settopInfo.channelMode == "0") {
                        b = true;
                    }
                }
                break
            case "KIDSMODE" : // 키즈모드
                if(App.provider.service.kidsMode == true) {
                    if (App.config.settopInfo.isKids == "true") {
                        b = true;
                    }
                }
                if(App.provider.service.channelMode == true) {
                    if (App.config.settopInfo.channelMode == "1") {
                        b = true;
                    }
                }

                // sbng kidsmode ; 
                // b = true; 

                break;
            case "EASYMODE":
                if(App.provider.service.channelMode == true) {
                    if (App.config.settopInfo.channelMode == "2") {
                        b = true;
                    }
                }
                
                break
            case "RATING" : // 연령제한
                if(App.config.settopInfo.rating == "0"){
                    b = true;
                }else if(App.config.settopInfo.rating * 1 - 1 >= value * 1){
                    b = true;
                }
                break;
            // 서비스
            case "TTS" :
                // voiceGuide
                if(App.provider.service.tts == true){
                    if(App.config.settopInfo.voiceGuide == "true") {
                        b = true;
                    }
                }

                break;
            case "TTSMSG" :
                // voiceGuideDesc
                if(App.provider.service.tts == true) {
                    if (App.config.settopInfo.voiceGuideDesc == "true") {
                        b = true;
                    }
                }
                break;
            case "ISHCN":
                if(App.config.settopInfo.soCode === "1" || App.config.settopInfo.soCode === "01" ||    //DMC
                    App.config.settopInfo.soCode === "8" || App.config.settopInfo.soCode === "08" ||   // 서초
                    App.config.settopInfo.soCode === "9" || App.config.settopInfo.soCode === "09" ||   // 동작
                    App.config.settopInfo.soCode === "10" ||   // 관악
                    App.config.settopInfo.soCode === "11" ||   // 충북
                    App.config.settopInfo.soCode === "13" ||   // 금호
                    App.config.settopInfo.soCode === "14" ||   // 부산
                    App.config.settopInfo.soCode === "16" ||   // 경북
                    App.config.settopInfo.soCode === "17" ||   // 새로넷
                    App.config.settopInfo.soCode === "15"){
                    b = true;
                }
                break;
            case "ISCJH":
                if(App.config.settopInfo.soCode === "40"|| App.config.settopInfo.soCode === "41"||
                    App.config.settopInfo.soCode === "42"|| App.config.settopInfo.soCode === "43"||
                    App.config.settopInfo.soCode === "44"|| App.config.settopInfo.soCode === "45"||
                    App.config.settopInfo.soCode === "46"|| App.config.settopInfo.soCode === "50"||
                    App.config.settopInfo.soCode === "51"|| App.config.settopInfo.soCode === "52"||
                    App.config.settopInfo.soCode === "53"|| App.config.settopInfo.soCode === "54"||
                    App.config.settopInfo.soCode === "55"|| App.config.settopInfo.soCode === "56"||
                    App.config.settopInfo.soCode === "57"|| App.config.settopInfo.soCode === "58"||
                    App.config.settopInfo.soCode === "59"|| App.config.settopInfo.soCode === "60"||
                    App.config.settopInfo.soCode === "61"|| App.config.settopInfo.soCode === "62"||
                    App.config.settopInfo.soCode === "63"|| App.config.settopInfo.soCode === "64"){
                    b = true;
                }
                break;
            
            case "ISBRIDGEBLOCK": //bridge
                if(App.config.settopInfo.stbModel === "K1100UA" || App.config.settopInfo.stbModel === "GX-CJ680CL") {
                    b = true;  
                }
                break ;
            /**
             * provider service 항목 추가
             */
            case "PUSH": // 1. 사업자 Push
                if(App.provider.service.push == true) {
                    b = true;
                }
                break;
            case "NVOD": // 2. NVOD 채널
                if(App.provider.service.nvod == true) {
                    b = true;
                }
                break;
            case "TRIGGER": // 3. 4방향 트리거
                if(App.provider.service.trigger == true) {
                    b = true;
                }
                break;
            case "SIMPLEPURCHASE": // 4. VOD 간편결재
                if(App.provider.service.simplePurchase == true) {
                    b = true;
                }
                break;
            case "MULTIPURCHASE": // 5. 복합결재
                if(App.provider.service.multiPurchase == true) {
                    b = true;
                }
                break;
            case "COINCHARGE": // 6. TV코인 충전
                if(App.provider.service.coinCharge == true) {
                    b = true;
                }
                break;
            case "CJONEPOINT": // 7. CJ One point
                if(App.provider.service.cjonePoint == true) {
                    b = true;
                }
                break;
            case "HPOINT": // 8. H. point
                if(App.provider.service.hPoint == true) {
                    b = true;
                }
                break;
            case "NETFLIX": // 9. 넷플릭스
                if(App.provider.service.netflix == true) {
                    b = true;
                }
                break;
            case "SAMSUNGAPPS": // 10. 삼성 앱스
                if(App.provider.service.samsungApps == true) {
                    b = true;
                }
                break;
            case "PREVIEWDETAIL": // 11. 본편미리보기
                if(App.provider.service.previewDetail == true) {
                    b = true;
                }
                break;
            case "SERIESCONTINUOUS": // 12. 시리즈 연속보기
                if(App.provider.service.seriesContinuous == true) {
                    b = true;
                }
                break;
            case "USBMEDIA": // 13. 개인미디어
                if(App.provider.service.usbMedia == true) {
                    b = true;
                }
                break;
            case "FAVORITE": // 14. 즐겨찾기
                if(App.provider.service.favorite == true) {
                    b = true;
                }
                break;
            case "SMARTRECOMMEND": // 15. 스마트 추천
                if(App.provider.service.smartRecommend == true) {
                    b = true;
                }
                break;
            case "ANDROIDAPP": // 16. TV앱
                if(App.provider.service.androidApp == true) {
                    b = true;
                }
                break;
            // case "TTS": // 17. TTS (기존)
            //     if(App.provider.service.tts == true) {
            //         b = true;
            //     }
            //     break;
            case "CJHCPA": // 18. CJ Hello Smart App
                if(App.provider.service.cjhCPA == true) {
                    b = true;
                }
                break;
            case "HCNCPA": // 19. 현대 HCN Smart App
                if(App.provider.service.hcnCPA == true) {
                    b = true;
                }
                break;
            // case "KIDSMODE": // 20. 키즈모드 (기존)
            //     if(App.provider.service.kidsMode == true) {
            //         b = true;
            //     }
            //     break;
            case "CHANNELMODE": // 21. channelMode
                if(App.provider.service.channelMode == true) {
                    b = true;
                }
                break;
            // case "PVR": // 22. 녹화(PVR) (기존)
            //     if(App.provider.service.pvr == true) {
            //         b = true;
            //     }
            //     break;
            // case "CUG": // 23. CUG
            //     if(App.provider.service.cug == true) {
            //         b = true;
            //     }
            //     break;
            case "BILLS": // 24. TV청구서
                if(App.provider.service.bills == true) {
                    b = true;
                }
                break;
            case "CHEONJIIN": // 25. 천지인
                if(App.provider.service.cheonjiin == true) {
                    b = true;
                }
                break;
            case "PIP": // 28. PIP
                if(App.provider.service.pip == true) {
                    b = true;
                }
                break;
            case "TESTLOGSEND": // 29. 로그 허용 여부
                if(App.provider.service.testLogSend == true) {
                    b = true;
                }
                break;

            case "TVPOINT": // TV포인트 사용여부
                if(App.provider.service.tvpoint == true) {
                    b = true;
                }
                break;
            case "PAYNOW": // paynow 사용여부
                if(App.provider.service.paynow == true) {
                    b = true;
                }
                break;
            case "KAKAOPAY": // kakaopay 사용여부
                if(App.provider.service.kakaopay == true) {
                    b = true;
                }
                break;
            case "CANCELSVODCONTACT": // 특정 월정액 해지시 고객센터 팝업 시나리오 여부
                if(App.provider.service.cancelSVODContact == true) {
                    if(App.provider.product.cancelContactPrd.indexOf(value) !== -1){
                        b = true;
                    }
                }
                break;
            case "FIXEDCHARGECOIN": // 코인상품 하드코딩 여부 (충전/쿠폰)
                if(App.provider.service.fixedChargeCoin == true) {
                    b = true;
                }
                break;
            case "CUGHOMETYPE": // CUG홈 사용 여부
                if(App.config.isCugHomeType == true) {
                    b = true;
                }
                break;
            case "LODGE": // 숙박업소 전용관 여부
                if (App.fn.globalUtil.is("CUG")){
                    console.log("App.provider.lodge.cugId", App.provider.lodge.cugId ) ; 
                    console.log("App.config.settopInfo.cugGroupId", App.config.settopInfo.cugGroupId ) ; 
                    if(App.provider.lodge.cugId  === App.config.settopInfo.cugGroupId){
                        b = true;
                    }
                }
                break;
            default :
                b = error;
                break;
        }

        return b;
    },

    /**
     * 안내설정 link 시 화면 categoryId확인
     * 이후 안내설정 외 다른 메뉴에서 사용할 경우 케이스 추가 필요
     * @param menuId
     * @returns {string}
     */
    menuIdToCategoryCode : function (menuId) {
        var menuCategoryCode = '';
        switch(menuId){
            /**
             * 안내설정 - 사용환경설정
             */
            case '5902': // 우리자녀지킴이
                menuCategoryCode = 'MC2007';
                break;
            case '5903': // 시청제한채널설정
                menuCategoryCode = 'MC2008';
                break;
            case '5904': // 선호채널설정
                menuCategoryCode = 'MC2009';
                break;
            case '5905': // 채널지움설정
                menuCategoryCode = 'MC2010';
                break;
            case '5906': // VOD 간편결제 설정
                menuCategoryCode = 'MC2011';
                break;
            case '5907': // 채널정보표시시간
                menuCategoryCode = 'MC2012';
                break;
            case '5908': // 비밀번호 변경
                menuCategoryCode = 'MC2013';
                break;
            case '5909': // 시청시간제한설정
                menuCategoryCode = 'MC2014';
                break;
            // case '5910': // 콘텐츠보기방식설정
            //     menuCategoryCode = '';
            //     break;
            case '5911': // 퀵메뉴 설정
                menuCategoryCode = 'MC2029';
                break;
            case '5918': // 말풍선 안내 설정
                menuCategoryCode = 'MC2027';
                break;
            case '5919': // 서비스 동의 설정
                menuCategoryCode = 'MC2018';
                break;
            case '5913': // 멀티화면사용설정
                menuCategoryCode = 'MC2015';
                break;
            case '5914': // 절전모드설정
                menuCategoryCode = 'MC2016';
                break;
            case '5915': // 마케팅 수신알림 설정
                menuCategoryCode = 'MC2017';
                break;
            case '5916': // 채널전환정보서비스 노출 설정
                menuCategoryCode = 'MC2019';
                break;
            case '5917': // 기본채널자동이동 설정
                menuCategoryCode = 'MC2020';
                break;

            /**
             * 안내설정 - 시스템 설정
             */
            case '5930': // 화면비율설정
                menuCategoryCode = 'MC2021';
                break;
            case '5931': // 시청보조서비스
                menuCategoryCode = 'MC2022';
                break;
            case '5932': // 음성안내설정
                menuCategoryCode = 'MC2023';
                break;
            case '5933': // 리모컨페어링 설정
                menuCategoryCode = 'MC2024';
                break;
            case '5936': // 리모컨 음성 검색
                menuCategoryCode = 'MC2035';
                break;

            case '5943': // 취침모드
                menuCategoryCode = 'MC2036';
                break;
            case '5944': // 블루투스 연결
                menuCategoryCode = 'MC2037';
                break;
        }
        return menuCategoryCode;
    },

    /**
     * TTS 관련 이벤트 실행
     */
    playTTS : function (bStop) {
        var $Section = $('._section.active');
        var data = $Section.find('.focus').data('tts');
        // var bStop = $Section.find('.focus').data('ttsstop'); // 18.05.10 김혜신 true가 디폴트. 이전 요청 유지할 때 파라미터 값 요청으로 변경
        var msg = $Section.find('.focus').data('ttsmsg');
        this.talkTTS(data, bStop);
    },
    talkTTS : function (data, bStop) {
        if(data == undefined){
            return false;
        }
        if(data == ''){
            return false;
        }

        var opt = {
            message : data, // [TTS요청 하고 싶은 문구]
            stopPreviousRequest : true // [시나리오에 따른 값, 이전 요청을 중지하고, 새로운 요청을 읽게 할 것 인가. 아니면 이전 요청이 끝난 후 읽을 것인가의 디폴트값] true/false
        };

        if (bStop != undefined) {
            opt.stopPreviousRequest = bStop;
        };

        console.log('[TTS]>>>>>>>>>>>> stop :'+opt.stopPreviousRequest+' : '+data);

        if (this.is("TTS")) {
            //epg에 문장 전달
            $('.ttsbox p').text(data); //화면 발화
            App.api.csApi.textToSpeech(opt);
        };
    },

    defaultPopup : function(html, cb){
        $('.dim_bottom').remove();
        App.view.defaultPopup.render(html);
        App.view.defaultPopup.callback = cb;
    },

    /**
     *
     * HCN 특정 map id('03' or '3')에 대한 변환 SO code 반환
     * 상주의 경우 SO code가 16이나,  map id = '3' or '03'인 경우, SO code가 17로 되도록 처리 필요
     * 특정 Biz API에서만 사용하며, 나머지는 그대로 사용하도록 한다.
     */
    getExceptionSoCode : function(){
        if(App.fn.globalUtil.is("ISHCN")) {
            if(App.config.settopInfo.mapId === '03' || App.config.settopInfo.mapId === '3'){
                return "17";
            } else {
                return App.config.settopInfo.soCode;
            }
        } else {
            return App.config.settopInfo.soCode;
        }
    },

    isCugMenu : function(menuType) {
        switch(menuType) {
            case "MC1201":
            case "MC1202":
                return true;

        }
        return false;
    },

    mergeHomeMenuWithCug: function(homeMenu, cugMenu, incChild) {

        // Biz P/F의 카테고리를 baseId로 접근하기 위해 array 를 object로 변경
        const bizCateMap = (homeMenu || []).reduce( function(obj, ele, i) {
            obj[ele.baseId] = ele;
            return obj;
        }, {});

        var cugBaseIdSeq = 0;
        const categories = (cugMenu || []).map( function(cate) {
            const baseId = cate.baseCategoryId.toString();
            if (baseId in bizCateMap) {
                if (cate.title && cate.title.length > 0) {
                    bizCateMap[baseId].title = cate.title
                }

                return bizCateMap[baseId];
            }

            // CUG 가상 메뉴일경우 동일한 구조로 데이터를 생성함
            if (App.fn.globalUtil.isCugMenu(cate.menuType)) {
                const cugBaseId = "cug_"+String(cugBaseIdSeq++);
                const children = (incChild ? (cate.children || []) : []);

                // CUG 하위 메뉴의 menuId를 baseId로 변경 처리
                // 카테고리 이동시 동일하게 처리하기 위함
                children.forEach( function(child) {
                    child.baseId = child.menuId;
                });

                return {
                    "title": cate.title,
                    "menuType":"MC0012",
                    "categoryCode": cate.menuType,
                    "baseId": cugBaseId,
                    "categoryId": cugBaseId,
                    "children": children
                }
            }

            return null;
        })
            .filter( function(cate) { return cate != null});
        return categories;
    },

    getSOName : function (soCode) {
        var spName = 'cjh'; // default

        // soCode table
        switch(soCode){
            case '40': //  KaYa SO
            case '41': //  KyungNam SO
            case '42': //  Kangwon SO
            case '43': //  YangCheon SO
            case '44': //  JoongBuSan SO
            case '45': //  HaeWoonDae SO
            case '46': //  PukInCheon SO
            // case '47': //  Arum SO
            // case '48': //  PuRum SO
            // case '49': //  NamInCheon SO
            case '50': //  YoungNam SO
            case '51': //  ChoongNam SO
            case '52': //  JoongAng SO
            case '53': //  KumJung SO
            case '54': //  BuCheon/KimPo SO
            case '55': //  EunPyung SO
            case '56': //  YoungDong SO
            case '57': //  DaeGu SO
            case '58': //  SoonCheon SO
            case '59': //  Shilla SO
            case '60': //  Test SO
            case '61': //  NaRa SO
            case '62': //  YoungSeo SO
            case '63': //  JunBok SO
            case '64': //  HoNam SO
                spName = 'cjh';
                break;
            case '1': //  DMC
            case '8': //  서초 SO
            case '9': //  동작 SO
            case '10': //  관악 SO
            case '11': //  충북 SO
            case '13': //  금호 SO
            case '14': //  부산 SO
            case '16': //  경북 SO
            case '17': //  새로넷경주 SO
            case '15': //  경북
                spName = 'hcn';
                break;
            case '65':
                spName = 'jcn';
                break;
            case '66': // 광주
                spName = 'kctv';
                break;
            case '48': // 푸른
                spName = 'gcs';
                break;
            case '49': // 남인천
                spName = 'nib';
                break;



        }
        return spName;
    },
    getSOClassName : function (soCode) {
        var spName = 'b2b'; // default

        // soCode table
        switch(soCode){
            case '40': //  KaYa SO
            case '41': //  KyungNam SO
            case '42': //  Kangwon SO
            case '43': //  YangCheon SO
            case '44': //  JoongBuSan SO
            case '45': //  HaeWoonDae SO
            case '46': //  PukInCheon SO
            // case '47': //  Arum SO
            // case '48': //  PuRum SO
            // case '49': //  NamInCheon SO
            case '50': //  YoungNam SO
            case '51': //  ChoongNam SO
            case '52': //  JoongAng SO
            case '53': //  KumJung SO
            case '54': //  BuCheon/KimPo SO
            case '55': //  EunPyung SO
            case '56': //  YoungDong SO
            case '57': //  DaeGu SO
            case '58': //  SoonCheon SO
            case '59': //  Shilla SO
            case '60': //  Test SO
            case '61': //  NaRa SO
            case '62': //  YoungSeo SO
            case '63': //  JunBok SO
            case '64': //  HoNam SO
                spName = 'cjh';
                break;
            case '1': //  DMC
            case '8': //  서초 SO
            case '9': //  동작 SO
            case '10': //  관악 SO
            case '11': //  충북 SO
            case '13': //  금호 SO
            case '14': //  부산 SO
            case '16': //  경북 SO
            case '17': //  새로넷경주 SO
            case '15': //  경북
                spName = 'hcn';
                break;
            case '65':
            // spName = 'jcn';
            // break;
            case '66': // 광주
            // spName = 'kctv';
            // break;
            case '48': // 푸른
            // spName = 'gcs';
            // break;
            case '49': // 남인천
                spName = 'b2b';
                break;



        }
        return spName;
    },
    convertSlotDataToVodData: function(contentsData, pageSize, previewSize) {
        // 슬롯 카테고리의 UI가 일반 VOD 카테고리와 유사하기 때문에 UI P/F에 전달받은 슬롯 카테고리 데이터를 기존 데이터 규격으로 변환 처리
        var list = [];
        for (var i=0; i<contentsData.list.length; i++) {
            var subList = [];

            var item = contentsData.list[i];
            if (item.tmplType == 'SLOT') {
                var banner = {
                    'isBanner': true,
                    'isSlotCatetory': true,
                    'isTextSlotType': false,
                    'isImageSlotType': false,
                    'link': {
                        'type': item.slot.slotLinkType,
                        'value': item.slot.slotLinkValue
                    }
                };

                if (item.slot.slotType == "TEXT") {
                    banner.isTextSlotType = true;
                    banner.bar = item.bar;
                    banner.slotText1 = item.slot.slotText1;
                    banner.slotText2 = item.slot.slotText2;
                    banner.slotText3 = item.slot.slotText3;
                } else if (item.slot.slotType == "IMAGE") {
                    banner.isImageSlotType = true;
                    banner.slotImage = item.slot.slotImage;
                }
                
                subList.push(banner);

                for (var j=0; j<item.bnrList.length; j++) {
                    var bnr = item.bnrList[j];
                    subList.push({
                        'isSlotCatetoryBanner': true,
                        'title': bnr.title,
                        'bnrImage': bnr.bnrImage,
                        'rating': bnr.rating,
                        'link': {
                            'type': bnr.linkType,
                            'value': bnr.linkValue
                        }
                    });
                }
            } else {
                var bannerClassName;
                if (item.tmplType === "7") {
                    bannerClassName = '7';
                } else if (item.tmplType === "3.5") {
                    bannerClassName = '3';
                } else if (item.tmplType === "2.5") {
                    bannerClassName = '2_5';
                } else {
                    continue;
                }
                
                for (var j=0; j<item.bnrList.length; j++) {
                    var bnr = item.bnrList[j];
                    subList.push({
                        'bannerClassName': bannerClassName,
                        'isBanner': true,
                        'image1': bnr.bnrImage,
                        'link' : { 'type': bnr.linkType, 'value': bnr.linkValue }
                    });
                }
            }

            list.push(subList);
        }
        
        var vodListObj = [];
        var vodListPreviewObj = [];
        var vodListAll = [];
        for (var i=0; i<list.length; i++) {
            for (var j=0; j<list[i].length; j++) {
                if (i < (pageSize/7)) {
                    vodListObj.push(list[i][j]);
                } else if (i < ((pageSize + previewSize) / 7)) {
                    vodListPreviewObj.push(list[i][j]);
                }
                vodListAll.push(list[0][i]);
            }
        }

        return {
            error: false,
            isSlotCategory: true,
            vodListObj: vodListObj,
            vodListPreviewObj: vodListPreviewObj,
            vodListAll: vodListAll
        };
    },
});
