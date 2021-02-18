var providerSO = {} || providerSO;







providerSO.cjh_testbed = {
    so : {
        soCode : ["40","41","42","43","44","45","46","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64"],
        soName : "cjh",
        flag : "CJHV", // Log 등에 쓰이는 flag
        spCode : "testbed",
        spName : "CJH TESTBED",
        key : "cjh_testbed", // soName + spCode
        SVC_CD : "040"
    },
    policy : {
        sessionTimeoutDefault : "320"
    },
    service : {
        push : true, // 사업자 Push
        nvod : true, // NVOD 채널
        trigger : true, // 4방향 트리거
        simplePurchase : true, // VOD 간편결재ip
        multiPurchase : false, // 복합결재
        coinCharge : true, // TV코인 충전
        cjonePoint : false, // CJ One point
        hPoint : false, // H. point
        netflix : true, // 넷플릭스
        samsungApps : true, // 삼성 앱스
        previewDetail : true, // 본편미리보기
        seriesContinuous : true, // 시리즈 연속보기
        usbMedia : true, // 개인미디어
        favorite : true, // 즐겨찾기
        smartRecommend : true, // 스마트 추천
        androidApp : true, // TV앱
        tts : true, // TTS
        cjhCPA : true, // CJ Hello Smart App
        hcnCPA : false, // 현대 HCN Smart App
        kidsMode : true, // 키즈모드
        channelMode : true, // 채널모드 (키즈모드, 쉬운 사용 모드)
        pvr : true, // 녹화(PVR)
        cug : true, // CUG
        bills : false, // TV청구서
        cheonjiin : true, // 천지인
        pip : true, // PIP
        testLogSend : false,// 로그 허용 여부
        useIsKids : true, //isKids 사용 여부
        uipfTvPoint : true, // UI P/F TV포인트 조회 사용 여부
        usePaymentRedKey : false,// 결제화면 REDKEY 사용 여부
        useZeroPayment : true, // 0원 일 경우 코인결제 -> 청구서결제 변경 여부
        limitCancelSubscription: false, // 1개월 이전일 경우 가입해지 불가능
        unSubscribeCheck : true, // 해지방어 프로모션 여부
        isSvodPayment : false,// isSvod 구매 시 class 추가 여부 체크
        beforeAdultChecked : true, // 포스터 그리기 전 성인 인증 여부
        screenContext : true, // 음성 UX 스크린 컨텍스트 기능 여부
        isMobileUse : true, // 모바일 사용 여부
        useGroupBitsB2B : false, // GroupBitsB2B = 2 사용여부
        useTierUpSellingPrd : false, // 티어업셀링 시나리오 사용여부
        hideLodgeCategory : false, // 숙박업소 VOD 홈메뉴에서 삭제 여부
        bizpfThumbnail : false, // BIZ P/F 채널 매핑 API 사용 여부
        usePromotionHistory : false, // 채널 프로모션 영역에서 히스토리 사용 여부
        useMonthlyCoinShop : true, // 코인 정기 충전소 월정액 코인 상품 편성 여부
        usePairing : true, // 리모컨 페어링 사용 여부
        isKakaoi : true, //카카오i 페어링 설정 사용 여부
        cancelSVODContact : false, // 특정 월정액 해지시 고객센터 팝업 시나리오
        limitSVODPurchaseB2B : false, // B2B 사용자 월정액 구매 불가 여부
        tvpoint : true, // TV포인트 사용여부
        paynow : true, // paynow 사용여부
        kakaopay : true, // kakaopay 사용여부
        fixedChargeCoin : false // 코인상품 하드코딩 여부
    },
    ip : {
        serverIpLiveBiz : "http://10.9.26.16:18080/",
        "X-Client-App-Key" : "9CQQR9V1UHJF87PMRUOD6JSLG4",
        flagBiz : "CJHV",
        token : "",

        serverIpLiveUi : "http://10.9.26.16:18080/",
        flagUi : "CJHV",

        serverIpLiveData : "http://10.9.26.16:18080/",
        serverIpLiveSearch : "http://10.9.26.16:18080/",
        flagData : "CJHV",

        serverIpMGW : "http://10.9.4.85:2080/",
        flagMgw : "CJHV",

        serverIpMGWKakaoi : "http://10.9.4.85:20770/",
        svcCDMGWKakaoi : "770",
        authCodeMGWKakaoi : "AI00000000-TEST-TEST-TEST-AI00000000",

        serverIpLiveCug: "http://10.10.113.50:18080/",

        serverIpKidsLand: "http://10.10.113.72:18080/",
    
        serverIpAd: 'http://10.10.113.66:18080/'
    },
    stb : {
        ibcModel : ['SMTC3021X', 'SMTC5010X', 'SMTC5011X', 'SMTC5012X', 'UC1600X', 'UC2300X', 'UC1300X'],
        energyModel : ['SMTC5012X', 'UC1600X', 'UC2300X', 'GXCJ630CH', 'GXCJ545CL','UC3300','GX-CJ680CL'],
        uhdStb : ['GXCJ630CH',"GX-CJ680CL"],
        pvrStb : ['GXCJ545CL','GX-CJ680CL','UC3300','SX930CX'],
        pvrRedStb : ['GX-CJ680CL'],
        pvrSmartStb : ['SX930CX'],
        pvrOcapStb : ['GXCJ545CL','UC3300'],
        hyperStb : ['GXCJ630CH', 'GXCJ545CL','GX-CJ680CL','UC3300','SX930CX'],
        animationSettopBox : ["GX-CJ680CL","K1100UA", "T1100UA"],
        smartStb : [],
        voiceStb : ['GX-CJ680CL'],
        watchAssistNotStb : [],
        voiceSearchStb : ['GX-CJ680CL','GXCJ545CL','UC3300'],
        uhdStb2 : ["K1100UA", "T1100UA"]
    },
    channel : {
        channelDeleteList : ["176", "192", "193", "345", "349", "163", "181", "108", "429", "443"],
        channelJoinList : ["103", "108", "163", "176", "181", "192", "193", "214", "304", "317", "345", "349", "429", "443", "492", "493", "551"],
        channelHideList : ["177", "121"]
    },
    product : {
        limitProductB2B : ["VDCTSSXX100000000387","VDCTSSXX100000000385","VDCTSSXX100000000381","VDCTSSXX100000000380","VDCTSSXX100000000376","VDCTSSXX100000000375","VDCTSSXX100000000372","VDCTSSXX100000000370","VDCTSSXX100000000369","BDNNSSNM100000000394","BDNNSSNM100000010465","BDNNSSNM100000023665"],
        offlineAgreementPrd : ["CHNMSSXX100000002151","BDNNSSNM100000003572","CHNMSSXX100000000149"],
        tierUpSellingPrd : [],
        cancelContactPrd : [],
        monthlyCoinPrd : [],
        onceCoinPrd : []
    },
    category : {
        baseId : {
            vodChannel : "1006339", //가상채널(vod채널)
            audioChannel: "1006340", //오디오채널
            defaultPromo : "1000235", // promoTrigger 스케쥴 안걸려있는경우 default
            defaultPromoKids : "1014981" // Kids promoTrigger 스케쥴 안걸려있는경우 default
        }
    },
    text : {
        sBiTxt : "헬로tv",
        sBiTel : "1855-1000",
        bMethodTxt : "청구서결제",
        appBiTxt : "헬로tv",
    },
    appId : {
        tvPointAppId : "800|016|VCS|0"
    },
    lodge : {
        cugId : ""  // 숙박업소전용관으로 개통된 CUG ID
    },
    image : {
        image : {
            serverImg : 'http://10.9.26.16:18080/',
            serverLogo : 'http://10.9.26.16:18080/',
            serverThumbnail : "http://10.9.26.16:18080/",
        },
        srcPath : {
            srcPath : 'provider/img/cjh/'
        },
        defaultImage : {
            defaultPoster : 'img/common/default_img/img_default_poster_220_316.png',
            defaultPosterSquare : 'img/common/default_img/img_default_poster_220_220.png',
            defaultPromotion : '',
            defaultThumbnail : 'img/common/default_img/img_default_thumbnail_355_200.png',
            defaultThumbnailLine : 'img/common/default_img/img_default_thumbnail_line.png',
            defaultChannelLogo : 'img/common/hello_logo.png'
        }
    }
};






providerSO.cjh = {
    so : {
        soCode : ["40","41","42","43","44","45","46","50","51","52","53","54","55","56","57","58","59","60","61","62","63","64"],
        soName : "cjh",
        flag : "CJHV", // Log 등에 쓰이는 flag
        spCode : "livebed",
        spName : "CJH LIVEBED",
        key : "cjh_livebed", // soName + spCode
        SVC_CD : "040"
    },
    policy : {
        sessionTimeoutDefault : "320"
    },
    service : {
        push : true, // 사업자 Push
        nvod : true, // NVOD 채널
        trigger : true, // 4방향 트리거
        simplePurchase : true, // VOD 간편결재ip
        multiPurchase : false, // 복합결재
        coinCharge : true, // TV코인 충전
        cjonePoint : false, // CJ One point
        hPoint : false, // H. point
        netflix : true, // 넷플릭스
        samsungApps : true, // 삼성 앱스
        previewDetail : true, // 본편미리보기
        seriesContinuous : true, // 시리즈 연속보기
        usbMedia : true, // 개인미디어
        favorite : true, // 즐겨찾기
        smartRecommend : true, // 스마트 추천
        androidApp : true, // TV앱
        tts : true, // TTS
        cjhCPA : true, // CJ Hello Smart App
        hcnCPA : false, // 현대 HCN Smart App
        kidsMode : true, // 키즈모드
        channelMode : true, // 채널모드 (키즈모드, 쉬운 사용 모드)
        pvr : true, // 녹화(PVR)
        cug : true, // CUG
        bills : false, // TV청구서
        cheonjiin : true, // 천지인
        pip : true, // PIP
        testLogSend : false,// 로그 허용 여부
        useIsKids : true, //isKids 사용 여부
        uipfTvPoint : true, // UI P/F TV포인트 조회 사용 여부
        usePaymentRedKey : false,// 결제화면 REDKEY 사용 여부
        useZeroPayment : true, // 0원 일 경우 코인결제 -> 청구서결제 변경 여부
        limitCancelSubscription: false, // 1개월 이전일 경우 가입해지 불가능
        unSubscribeCheck : true, // 해지방어 프로모션 여부
        isSvodPayment : false,// isSvod 구매 시 class 추가 여부 체크
        beforeAdultChecked : true, // 포스터 그리기 전 성인 인증 여부
        screenContext : true, // 음성 UX 스크린 컨텍스트 기능 여부
        isMobileUse : true, // 모바일 사용 여부
        useGroupBitsB2B : false, // GroupBitsB2B = 2 사용여부
        useTierUpSellingPrd : false, // 티어업셀링 시나리오 사용여부
        hideLodgeCategory : false, // 숙박업소 VOD 홈메뉴에서 삭제 여부
        bizpfThumbnail : false, // BIZ P/F 채널 매핑 API 사용 여부
        usePromotionHistory : false, // 채널 프로모션 영역에서 히스토리 사용 여부
        useMonthlyCoinShop : true, // 코인 정기 충전소 월정액 코인 상품 편성 여부
        usePairing : true, // 리모컨 페어링 사용 여부
        isKakaoi : true, //카카오i 페어링 설정 사용 여부
        cancelSVODContact : false, // 특정 월정액 해지시 고객센터 팝업 시나리오
        limitSVODPurchaseB2B : false, // B2B 사용자 월정액 구매 불가 여부
        tvpoint : true, // TV포인트 사용여부
        paynow : true, // paynow 사용여부
        kakaopay : true, // kakaopay 사용여부
        fixedChargeCoin : false // 코인상품 하드코딩 여부
    },
    ip : {
        serverIpLiveBiz : "http://10.10.78.66:18080/",
        "X-Client-App-Key" : "9CQQR9V1UHJF87PMRUOD6JSLG4",
        flagBiz : "CJHV",
        token : "",

        serverIpLiveUi : "http://10.10.78.66:18080/",
        flagUi : "CJHV",

        serverIpLiveData : "http://10.10.78.66:18080/",
        serverIpLiveSearch : "http://10.10.78.66:18080/",
        flagData : "CJHV",

        serverIpMGW : "http://10.10.69.140:2080/",
        flagMgw : "CJHV",

        serverIpMGWKakaoi : "http://10.10.69.140:20770/",
        svcCDMGWKakaoi : "770",
        authCodeMGWKakaoi : "353f27ac-d1ed-434d-8990-4159b9266de9",

        serverIpLiveCug: "http://10.10.113.50:18080/",

        serverIpKidsLand: 'http://10.10.113.111:18080/',
        
        serverIpAd: 'http://10.10.113.144:18080/'
    },
    stb : {
        ibcModel : ['SMTC3021X', 'SMTC5010X', 'SMTC5011X', 'SMTC5012X', 'UC1600X', 'UC2300X', 'UC1300X'],
        energyModel : ['SMTC5012X', 'UC1600X', 'UC2300X', 'GXCJ630CH', 'GXCJ545CL','UC3300','GX-CJ680CL','SX930CX',"K1100UA", "T1100UA"],
        uhdStb : ['GXCJ630CH',"GX-CJ680CL"],
        pvrStb : ['GXCJ545CL','GX-CJ680CL','UC3300','SX930CX'],
        pvrRedStb : ['GX-CJ680CL'],
        pvrSmartStb : ['SX930CX'],
        pvrOcapStb : ['GXCJ545CL','UC3300'],
        hyperStb : ['GXCJ630CH', 'GXCJ545CL','GX-CJ680CL','UC3300','SX930CX'],
        animationSettopBox : ["GX-CJ680CL","K1100UA", "T1100UA"],
        smartStb : [],
        voiceStb : ['GX-CJ680CL'],
        watchAssistNotStb : [],
        uhdStb2 : ["K1100UA", "T1100UA"]
    },
    channel : {
        channelDeleteList : ["176", "192", "193", "345", "349", "163", "181", "108", "429", "443"],
        channelJoinList : ["103", "108", "163", "176", "181", "192", "193", "214", "304", "317", "345", "349", "429", "443", "492", "493", "551"],
        channelHideList : ["177", "121"]
    },
    product : {
        limitProductB2B : ["VDCTSSXX100000000387","VDCTSSXX100000000385","VDCTSSXX100000000381","VDCTSSXX100000000380","VDCTSSXX100000000376","VDCTSSXX100000000375","VDCTSSXX100000000372","VDCTSSXX100000000370","VDCTSSXX100000000369","BDNNSSNM100000000394","BDNNSSNM100000010465","BDNNSSNM100000023665"],
        offlineAgreementPrd : ["CHNMSSXX100000002151","BDNNSSNM100000003572","CHNMSSXX100000000149"],
        tierUpSellingPrd : [],
        cancelContactPrd : [],
        monthlyCoinPrd : [],
        onceCoinPrd : []
    },
    category : {
        baseId : {
            vodChannel : "1006339", //가상채널(vod채널)
            audioChannel: "1006340", //오디오채널
            defaultPromo : "1000235", // promoTrigger 스케쥴 안걸려있는경우 default
            defaultPromoKids : "1014981" // Kids promoTrigger 스케쥴 안걸려있는경우 default
        }
    },
    text : {
        sBiTxt : "헬로tv",
        sBiTel : "1855-1000",
        bMethodTxt : "청구서결제",
        appBiTxt : "헬로tv",
    },
    appId : {
        tvPointAppId : "800|016|VCS|0"
    },
    lodge : {
        cugId : ""  // 숙박업소전용관으로 개통된 CUG ID
    },
    image : {
        image : {
            serverImg : 'http://10.10.78.65:18080/',
            serverLogo : 'http://10.10.78.66:18080/',
            serverThumbnail : "http://10.10.78.66:18080/mnt/chthumb/"
        },
        srcPath : {
            srcPath : 'provider/img/cjh/'
        },
        defaultImage : {
            defaultPoster : 'img/common/default_img/img_default_poster_220_316.png',
            defaultPosterSquare : 'img/common/default_img/img_default_poster_220_220.png',
            defaultPromotion : '',
            defaultThumbnail : 'img/common/default_img/img_default_thumbnail_355_200.png',
            defaultThumbnailLine : 'img/common/default_img/img_default_thumbnail_line.png',
            defaultChannelLogo : 'img/common/hello_logo.png'
        }
    }
};






providerSO.nib_testbed = {
    so : {
        soCode : ["48"],
        soName : "gcs",
        flag : "CJHV", // Log 등에 쓰이는 flag
        spCode : "testbed",
        spName : "GCS TESTBED",
        key : "gcs_testbed", // soName + spCode
        SVC_CD : "040"
    },
    policy : {
        sessionTimeoutDefault : "320"
    },
    service : {
        push : true, // 사업자 Push
        nvod : true, // NVOD 채널
        trigger : true, // 4방향 트리거
        simplePurchase : true, // VOD 간편결재ip
        multiPurchase : false, // 복합결재
        coinCharge : true, // TV코인 충전
        cjonePoint : false, // CJ One point
        hPoint : false, // H. point
        netflix : false, // 넷플릭스
        samsungApps : false, // 삼성 앱스
        previewDetail : true, // 본편미리보기
        seriesContinuous : true, // 시리즈 연속보기
        usbMedia : true, // 개인미디어
        favorite : true, // 즐겨찾기
        smartRecommend : true, // 스마트 추천
        androidApp : true, // TV앱
        tts : true, // TTS
        cjhCPA : false, // CJ Hello Smart App
        hcnCPA : false, // 현대 HCN Smart App
        kidsMode : true, // 키즈모드
        channelMode : false, // 채널모드 (키즈모드, 쉬운 사용 모드)
        pvr : true, // 녹화(PVR)
        cug : true, // CUG
        bills : false, // TV청구서
        cheonjiin : true, // 천지인
        pip : true, // PIP
        testLogSend : false,// 로그 허용 여부
        useIsKids : true, //isKids 사용 여부
        uipfTvPoint : true, // UI P/F TV포인트 조회 사용 여부
        usePaymentRedKey : false,// 결제화면 REDKEY 사용 여부
        useZeroPayment : true, // 0원 일 경우 코인결제 -> 청구서결제 변경 여부
        limitCancelSubscription: false, // 1개월 이전일 경우 가입해지 불가능
        unSubscribeCheck : false, // 해지방어 프로모션 여부
        isSvodPayment : false,// isSvod 구매 시 class 추가 여부 체크
        beforeAdultChecked : true, // 포스터 그리기 전 성인 인증 여부
        screenContext : true, // 음성 UX 스크린 컨텍스트 기능 여부
        isMobileUse : false, // 모바일 사용 여부
        useGroupBitsB2B : false, // GroupBitsB2B = 2 사용여부
        useTierUpSellingPrd : false, // 티어업셀링 시나리오 사용여부
        hideLodgeCategory : false, // 숙박업소 VOD 홈메뉴에서 삭제 여부
        bizpfThumbnail : false, // BIZ P/F 채널 매핑 API 사용 여부
        usePromotionHistory : false, // 채널 프로모션 영역에서 히스토리 사용 여부
        useMonthlyCoinShop : true, // 코인 정기 충전소 월정액 코인 상품 편성 여부
        usePairing : true, // 리모컨 페어링 사용 여부
        isKakaoi : false, //카카오i 페어링 설정 사용 여부
        cancelSVODContact : true, // 특정 월정액 해지시 고객센터 팝업 시나리오
        limitSVODPurchaseB2B : false, // B2B 사용자 월정액 구매 불가 여부
        tvpoint : false, // TV포인트 사용여부
        paynow : false, // paynow 사용여부
        kakaopay : true, // kakaopay 사용여부
        fixedChargeCoin : true // 코인상품 하드코딩 여부
    },
    ip : {
        serverIpLiveBiz : "http://10.9.26.16:18080/",
        "X-Client-App-Key" : "9CQQR9V1UHJF87PMRUOD6JSLG4",
        flagBiz : "CJHV",
        token : "",

        serverIpLiveUi : "http://10.9.26.16:18080/",
        flagUi : "CJHV",

        serverIpLiveData : "http://10.9.26.16:18080/",
        serverIpLiveSearch : "http://10.9.26.16:18080/",
        flagData : "CJHV",

        serverIpMGW : "http://10.9.4.85:2080/",
        flagMgw : "CJHV",

        serverIpMGWKakaoi : "http://10.10.69.140:20770/",
        svcCDMGWKakaoi : "770",
        authCodeMGWKakaoi : "353f27ac-d1ed-434d-8990-4159b9266de9",

        serverIpLiveCug: "http://10.10.113.50:18080/",
    
        serverIpAd: 'http://10.10.113.66:18080/'
    },
    stb : {
        ibcModel : [],
        energyModel : ['GXCJ545CL','SMTC5012X','GXCJ630CH','GX-CJ680CL'],
        uhdStb : ['GXCJ630CH','GX-CJ680CL'],
        pvrStb : ['GXCJ545CL','GX-CJ680CL'],
        pvrRedStb : ['GX-CJ680CL'],
        pvrSmartStb : [],
        pvrOcapStb : ['GXCJ545CL'],
        hyperStb : ['GXCJ545CL','GXCJ630CH','GX-CJ680CL'],
        animationSettopBox : ['GX-CJ680CL'],
        smartStb : [],
        voiceStb : ['GX-CJ680CL'],
        watchAssistNotStb : [],
        uhdStb2 : []
    },
    channel : {
        channelDeleteList : ["176", "181", "192", "193", "345", "443"],
        channelJoinList : ["176", "181", "192", "193", "345", "443", "689", "551"],
        channelHideList : ["177"]
    },
    product : {
        limitProductB2B : ["BDCHSSNM100000017065", "BDCHSSNM100000017068", "BDCHSSNM100000017066","BDCHSSNM100000017069","BDCHSSNM100000017070", "BDNNSSNM100000000393", "BDNNSSNM100000000394", "BDNNSSNM100000010465", "CHNMSSXX100000015675", "CHTRSSXX100000015865", "CHTRSSXX100000015866", "CHNMSSXX100000015676", "CHNMSSXX100000015677", "CHNMSSXX100000015678", "CHNMSSXX100000015679", "CHNMSSXX100000015680", "VDCTSSXX100000000370", "VDCTSSXX100000000369", "VDCTSSXX100000000372", "VDCTSSXX100000001075", "VDCTSSXX100000000368", "VDCTSSXX100000003265", "VDCTSSXX100000000367", "VDCTSSXX100000000373", "VDCTSSXX100000000382", "VDCTSSXX100000001166", "VDCTSSXX100000001168", "VDCTSSXX100000000366", "VDCTSSXX100000000383", "VDCTSSXX100000000386", "VDCTSSXX100000000377", "VDCTSSXX100000000374", "VDCTSSXX100000000371", "VDCTSSXX100000005466", "VDCTSSXX100000000365", "VDCTSSXX100000000381"],
        offlineAgreementPrd : [],
        tierUpSellingPrd : [],
        monthlyCoinPrd : ["EXCISSXX100000015765", "EXCISSXX100000015767", "EXCISSXX100000015770"],
        onceCoinPrd : ["EXCIOTXX100000015766", "EXCIOTXX100000015768", "EXCIOTXX100000015771", "EXCIOTXX100000015773"],
        cancelContactPrd : ["BDNNSSNM100000000393", "BDNNSSNM100000000394", "BDNNSSNM100000010465", "VDCTSSXX100000000370", "VDCTSSXX100000000369", "VDCTSSXX100000000372", "VDCTSSXX100000001075", "VDCTSSXX100000000368", "VDCTSSXX100000003265", "VDCTSSXX100000000367", "VDCTSSXX100000000373", "VDCTSSXX100000000382", "VDCTSSXX100000001166", "VDCTSSXX100000001168", "VDCTSSXX100000000366", "VDCTSSXX100000000383", "VDCTSSXX100000000386", "VDCTSSXX100000000377", "VDCTSSXX100000000374", "VDCTSSXX100000000371", "VDCTSSXX100000005466", "VDCTSSXX100000000365", "VDCTSSXX100000000381", "VDCTSSXX100000016965", "VDCTSSXX100000001065", "VDCTSSXX100000021165"]
    },
    category : {
        baseId : {
            vodChannel : "1006339", //가상채널(vod채널)
            audioChannel: "1006340", //오디오채널
            defaultPromo : "1000235", // promoTrigger 스케쥴 안걸려있는경우 default
            defaultPromoKids : "1014981" // Kids promoTrigger 스케쥴 안걸려있는경우 default
        }
    },
    text : {
        sBiTxt : "푸른방송",
        sBiTel : "053-551-2000",
        bMethodTxt : "청구서결제",
        appBiTxt : "푸른방송",
    },
    appId : {
        tvPointAppId : ""
    },
    lodge : {
        cugId : ""  // 숙박업소전용관으로 개통된 CUG ID
    },
    image : {
        image : {
            serverImg : 'http://10.9.26.16:18080/',
            serverLogo : 'http://10.9.26.16:18080/',
            serverThumbnail : "http://10.9.26.16:18080/",
        },
        srcPath : {
            srcPath : 'provider/img/b2b/'
        },
        defaultImage : {
            defaultPoster : 'img/common/default_img/img_default_poster_220_316.png',
            defaultPosterSquare : 'img/common/default_img/img_default_poster_220_220.png',
            defaultPromotion : '',
            defaultThumbnail : 'img/common/default_img/img_default_thumbnail_355_200.png',
            defaultThumbnailLine : 'img/common/default_img/img_default_thumbnail_line.png',
            defaultChannelLogo : 'img/common/hello_logo.png'
        }
    }
};






providerSO.gcs = {
    so : {
        soCode : ["48"],
        soName : "gcs",
        flag : "CJHV", // Log 등에 쓰이는 flag
        spCode : "livebed",
        spName : "GCS LIVEBED",
        key : "gcs_livebed", // soName + spCode
        SVC_CD : "040"
    },
    policy : {
        sessionTimeoutDefault : "320"
    },
    service : {
        push : true, // 사업자 Push
        nvod : true, // NVOD 채널
        trigger : true, // 4방향 트리거
        simplePurchase : true, // VOD 간편결재ip
        multiPurchase : false, // 복합결재
        coinCharge : true, // TV코인 충전
        cjonePoint : false, // CJ One point
        hPoint : false, // H. point
        netflix : false, // 넷플릭스
        samsungApps : false, // 삼성 앱스
        previewDetail : true, // 본편미리보기
        seriesContinuous : true, // 시리즈 연속보기
        usbMedia : true, // 개인미디어
        favorite : true, // 즐겨찾기
        smartRecommend : true, // 스마트 추천
        androidApp : true, // TV앱
        tts : true, // TTS
        cjhCPA : false, // CJ Hello Smart App
        hcnCPA : false, // 현대 HCN Smart App
        kidsMode : true, // 키즈모드
        channelMode : false, // 채널모드 (키즈모드, 쉬운 사용 모드)
        pvr : true, // 녹화(PVR)
        cug : true, // CUG
        bills : false, // TV청구서
        cheonjiin : true, // 천지인
        pip : true, // PIP
        testLogSend : false,// 로그 허용 여부
        useIsKids : true, //isKids 사용 여부
        uipfTvPoint : true, // UI P/F TV포인트 조회 사용 여부
        usePaymentRedKey : false,// 결제화면 REDKEY 사용 여부
        useZeroPayment : true, // 0원 일 경우 코인결제 -> 청구서결제 변경 여부
        limitCancelSubscription: false, // 1개월 이전일 경우 가입해지 불가능
        unSubscribeCheck : false, // 해지방어 프로모션 여부
        isSvodPayment : false,// isSvod 구매 시 class 추가 여부 체크
        beforeAdultChecked : true, // 포스터 그리기 전 성인 인증 여부
        screenContext : true, // 음성 UX 스크린 컨텍스트 기능 여부
        isMobileUse : false, // 모바일 사용 여부
        useGroupBitsB2B : false, // GroupBitsB2B = 2 사용여부
        useTierUpSellingPrd : false, // 티어업셀링 시나리오 사용여부
        hideLodgeCategory : false, // 숙박업소 VOD 홈메뉴에서 삭제 여부
        bizpfThumbnail : false, // BIZ P/F 채널 매핑 API 사용 여부
        usePromotionHistory : false, // 채널 프로모션 영역에서 히스토리 사용 여부
        useMonthlyCoinShop : true, // 코인 정기 충전소 월정액 코인 상품 편성 여부
        usePairing : true, // 리모컨 페어링 사용 여부
        isKakaoi : false, //카카오i 페어링 설정 사용 여부
        cancelSVODContact : true, // 특정 월정액 해지시 고객센터 팝업 시나리오
        limitSVODPurchaseB2B : false, // B2B 사용자 월정액 구매 불가 여부
        tvpoint : false, // TV포인트 사용여부
        paynow : false, // paynow 사용여부
        kakaopay : true, // kakaopay 사용여부
        fixedChargeCoin : true // 코인상품 하드코딩 여부
    },
    ip : {
        serverIpLiveBiz : "http://10.10.78.66:18080/",
        "X-Client-App-Key" : "9CQQR9V1UHJF87PMRUOD6JSLG4",
        flagBiz : "CJHV",
        token : "",

        serverIpLiveUi : "http://10.10.78.66:18080/",
        flagUi : "CJHV",

        serverIpLiveData : "http://10.10.78.66:18080/",
        serverIpLiveSearch : "http://10.10.78.66:18080/",
        flagData : "CJHV",

        serverIpMGW : "http://10.10.69.140:2080/",
        flagMgw : "CJHV",

        serverIpMGWKakaoi : "http://10.10.69.140:20770/",
        svcCDMGWKakaoi : "770",
        authCodeMGWKakaoi : "353f27ac-d1ed-434d-8990-4159b9266de9",

        serverIpLiveCug: "http://10.10.113.50:18080/",
    
        serverIpAd: 'http://:18080/'
    },
    stb : {
        ibcModel : [],
        energyModel : ['GXCJ545CL','SMTC5012X','GXCJ630CH','GX-CJ680CL'],
        uhdStb : ['GXCJ630CH','GX-CJ680CL'],
        pvrStb : ['GXCJ545CL','GX-CJ680CL'],
        pvrRedStb : ['GX-CJ680CL'],
        pvrSmartStb : [],
        pvrOcapStb : ['GXCJ545CL'],
        hyperStb : ['GXCJ545CL','GXCJ630CH','GX-CJ680CL'],
        animationSettopBox : ['GX-CJ680CL'],
        smartStb : [],
        voiceStb : ['GX-CJ680CL'],
        watchAssistNotStb : [],
        uhdStb2 : []
    },
    channel : {
        channelDeleteList : ["176", "181", "192", "193", "345", "443"],
        channelJoinList : ["176", "181", "192", "193", "345", "443", "689", "551"],
        channelHideList : ["177"]
    },
    product : {
        limitProductB2B : ["BDCHSSNM100000017065", "BDCHSSNM100000017068", "BDCHSSNM100000017066","BDCHSSNM100000017069","BDCHSSNM100000017070", "BDNNSSNM100000000393", "BDNNSSNM100000000394", "BDNNSSNM100000010465", "CHNMSSXX100000015675", "CHTRSSXX100000015865", "CHTRSSXX100000015866", "CHNMSSXX100000015676", "CHNMSSXX100000015677", "CHNMSSXX100000015678", "CHNMSSXX100000015679", "CHNMSSXX100000015680", "VDCTSSXX100000000370", "VDCTSSXX100000000369", "VDCTSSXX100000000372", "VDCTSSXX100000001075", "VDCTSSXX100000000368", "VDCTSSXX100000003265", "VDCTSSXX100000000367", "VDCTSSXX100000000373", "VDCTSSXX100000000382", "VDCTSSXX100000001166", "VDCTSSXX100000001168", "VDCTSSXX100000000366", "VDCTSSXX100000000383", "VDCTSSXX100000000386", "VDCTSSXX100000000377", "VDCTSSXX100000000374", "VDCTSSXX100000000371", "VDCTSSXX100000005466", "VDCTSSXX100000000365", "VDCTSSXX100000000381", "VDCTSSXX100000016965"],
        offlineAgreementPrd : [],
        tierUpSellingPrd : [],
        monthlyCoinPrd : ["EXCISSXX100000015765", "EXCISSXX100000015767", "EXCISSXX100000015770"],
        onceCoinPrd : ["EXCIOTXX100000015766", "EXCIOTXX100000015768", "EXCIOTXX100000015771", "EXCIOTXX100000015773"],
        cancelContactPrd : ["BDNNSSNM100000000393", "BDNNSSNM100000000394", "BDNNSSNM100000010465", "VDCTSSXX100000000370", "VDCTSSXX100000000369", "VDCTSSXX100000000372", "VDCTSSXX100000001075", "VDCTSSXX100000000368", "VDCTSSXX100000003265", "VDCTSSXX100000000367", "VDCTSSXX100000000373", "VDCTSSXX100000000382", "VDCTSSXX100000001166", "VDCTSSXX100000001168", "VDCTSSXX100000000366", "VDCTSSXX100000000383", "VDCTSSXX100000000386", "VDCTSSXX100000000377", "VDCTSSXX100000000374", "VDCTSSXX100000000371", "VDCTSSXX100000005466", "VDCTSSXX100000000365", "VDCTSSXX100000000381", "VDCTSSXX100000016965", "VDCTSSXX100000001065", "VDCTSSXX100000021165"]
    },
    category : {
        baseId : {
            vodChannel : "1006339", //가상채널(vod채널)
            audioChannel: "1006340", //오디오채널
            defaultPromo : "1000235", // promoTrigger 스케쥴 안걸려있는경우 default
            defaultPromoKids : "1014981" // Kids promoTrigger 스케쥴 안걸려있는경우 default
        }
    },
    text : {
        sBiTxt : "푸른방송",
        sBiTel : "053-551-2000",
        bMethodTxt : "청구서결제",
        appBiTxt : "푸른방송",
    },
    appId : {
        tvPointAppId : ""
    },
    lodge : {
        cugId : ""  // 숙박업소전용관으로 개통된 CUG ID
    },
    image : {
        image : {
            serverImg : 'http://10.10.78.65:18080/',
            serverLogo : 'http://10.10.78.66:18080/',
            serverThumbnail : "http://10.10.78.66:18080/mnt/chthumb/"
        },
        srcPath : {
            srcPath : 'provider/img/b2b/'
        },
        defaultImage : {
            defaultPoster : 'img/common/default_img/img_default_poster_220_316.png',
            defaultPosterSquare : 'img/common/default_img/img_default_poster_220_220.png',
            defaultPromotion : '',
            defaultThumbnail : 'img/common/default_img/img_default_thumbnail_355_200.png',
            defaultThumbnailLine : 'img/common/default_img/img_default_thumbnail_line.png',
            defaultChannelLogo : 'img/common/hello_logo.png'
        }
    }
};






providerSO.hcn_testbed = {
    so : {
        soCode : ["1","8","9","10","11","13","14","16","17","15"],
        soName : "hcn",
        flag : "HCN", // Log 등에 쓰이는 flag
        spCode : "testbed",
        spName : "HCN TESTBED",
        key : "hcn_testbed", // soName + spCode
        SVC_CD : "550"
    },
    policy : {
        sessionTimeoutDefault : "320"
    },
    service : {
        push : true, // 사업자 Push
        nvod : true, // NVOD 채널
        trigger : true, // 4방향 트리거
        simplePurchase : true, // VOD 간편결재ip
        multiPurchase : true, // 복합결재
        coinCharge : true, // TV코인 충전
        cjonePoint : false, // CJ One point
        hPoint : true, // H. point
        netflix : false, // 넷플릭스
        samsungApps : true, // 삼성 앱스
        previewDetail : true, // 본편미리보기
        seriesContinuous : true, // 시리즈 연속보기
        usbMedia : false, // 개인미디어
        favorite : true, // 즐겨찾기
        smartRecommend : true, // 스마트 추천
        androidApp : false, // TV앱
        tts : false, // TTS
        cjhCPA : false, // CJ Hello Smart App
        hcnCPA : true, // 현대 HCN Smart App
        kidsMode : true, // 키즈모드
        channelMode : true, // 채널모드 (키즈모드, 쉬운 사용 모드)
        pvr : false, // 녹화(PVR)App.
        cug : true, // CUG
        bills : true, // TV청구서
        cheonjiin : false, // 천지인
        cjhOSK : true, // CJH OSK
        hcnOSK : false, // HCN OSK
        pip : true, // PIP
        testLogSend : false,// 로그 허용 여부,
        useIsKids : false, //isKids 사용 여부
        uipfTvPoint : true, // UI P/F TV포인트 조회 사용 여부
        usePaymentRedKey : true,// 결제화면 REDKEY 사용 여부
        useZeroPayment : true, // 0원 일 경우 코인결제 -> 청구서결제 변경 여부
        limitCancelSubscription: true, // 1개월 이전일 경우 가입해지 불가능
        unSubscribeCheck : false, // 해지방어 프로모션 여부
        isSvodPayment : true, // isSvod 구매 시 class 추가 여부 체크
        beforeAdultChecked : true, // 포스터 그리기 전 성인 인증 여부
        screenContext : false, // 음성 UX 스크린 컨텍스트 기능 여부
        isMobileUse : true, // 모바일 사용 여부
        useGroupBitsB2B : true, // GroupBitsB2B = 2 사용여부
        useTierUpSellingPrd : true, // 티어업셀링 시나리오 사용여부
        hideLodgeCategory : true, // 숙박업소 VOD 홈메뉴에서 삭제 여부
        bizpfThumbnail : true, // BIZ P/F 채널 매핑 API 사용 여부
        usePromotionHistory : true, // 채널 프로모션 영역에서 히스토리 사용 여부
        useMonthlyCoinShop : false, // 코인 정기 충전소 월정액 코인 상품 편성 여부
        usePairing : false, // 리모컨 페어링 사용 여부
        isKakaoi : false, //카카오i 페어링 설정 사용 여부
        cancelSVODContact : false, // 특정 월정액 해지시 고객센터 팝업 시나리오
        limitSVODPurchaseB2B : false, // B2B 사용자 월정액 구매 불가 여부
        tvpoint : true, // TV포인트 사용여부
        paynow : true, // paynow 사용여부
        kakaopay : true, // kakaopay 사용여부
        fixedChargeCoin : false // 코인상품 하드코딩 여부
    },
    ip : {
        serverIpLiveBiz : "http://192.168.137.31:45001/",
        "X-Client-App-Key" : "NEEBJF29F2KONAV6VCN4HTGTNC",
        flagBiz : "HCN",
        token : "",

        serverIpLiveUi : "http://192.168.137.31:45001/",
        flagUi : "HCN",

        serverIpLiveData : "http://192.168.137.31:45001/",
        serverIpLiveSearch : "http://192.168.137.31:45001/",
        flagData : "HCN",

        serverIpMGW : "http://192.168.137.31:45006/",
        flagMgw : "HCN",

        serverIpMGWKakaoi : "http://10.10.69.140:20770/",
        svcCDMGWKakaoi : "770",
        authCodeMGWKakaoi : "353f27ac-d1ed-434d-8990-4159b9266de9",

        serverIpLiveCug: "http://10.10.113.50:18080/",
    
        serverIpAd: 'http://10.10.113.66:18080/'
    },
    stb : {
        ibcModel : ['SMTC3021H','SMTC5011H','SMTC5012H', 'CN540H', 'GX630H', 'HC-5000CM'],
        energyModel : ['SMTC5012H', 'GX630H', 'CN540H', 'HC-5000CM'],
        smartStb : ["GX-HC830CH"],
        animationSettopBox : [],
        uhdStb : ['GX630H'],
        pvrStb : [],
        pvrRedStb : [],
        pvrSmartStb : [],
        pvrOcapStb : [],
        hyperStb : [],
        voiceStb : [],
        watchAssistNotStb : [],
        voiceSearchStb : [],
        uhdStb2 : []
    },
    channel : {
        channelDeleteList : [],
        channelJoinList : [],
        channelHideList : ['4400','4410','6990']
    },
    product : {
        limitProductB2B : [],
        offlineAgreementPrd : [],
        tierUpSellingPrd : ['CHTRSSXX100000005292'],
        cancelContactPrd : [],
        monthlyCoinPrd : [],
        onceCoinPrd : []
    },
    category : {
        baseId : {
            vodChannel : "1085974", //가상채널(vod채널)
            audioChannel: "1085975",
            defaultPromo : "1344081", // promoTrigger 스케쥴 안걸려있는경우 default (영화 > 금주의 신작)
            defaultPromoKids : "1344124" // Kids promoTrigger 스케쥴 안걸려있는경우 default (키즈 > 만화)
        }
    },
    text : {
        sBiTxt : "현대 HCN ",
        appBiTxt : "현대 HCN 모바일 TV",
        sBiTel : "1877-8000",
        bMethodTxt : "청구서결제"
    },
    appId : {
        tvPointAppId : "521|303|VCS|0"
    },
    lodge : {
        cugId : "2018102403"  // 숙박업소전용관으로 개통된 CUG ID
    },
    image : {
        image : {
            serverImg : "http://192.168.137.31:45001/",
            serverLogo : "http://192.168.137.31:45001/",
            serverThumbnail : "http://192.168.137.31:45001/mnt/chthumb/",
        },
        srcPath : {
            srcPath : 'provider/img/hcn/'
        },
        defaultImage : {
            defaultPoster : 'img/common/default_img/img_default_poster_220_316.png',
            defaultPosterSquare : 'img/common/default_img/img_default_poster_220_220.png',
            defaultPromotion : '',
            defaultThumbnail : 'img/common/default_img/img_default_thumbnail_355_200.png',
            defaultThumbnailLine : 'img/common/default_img/img_default_thumbnail_line.png',
            defaultChannelLogo : 'img/common/hello_logo.png'
        }
    }
};






providerSO.hcn = {
    so : {
        soCode : ["1","8","9","10","11","13","14","16","17","15"],
        soName : "hcn",
        flag : "HCN", // Log 등에 쓰이는 flag
        spCode : "livebed",
        spName : "HCN LIVEBED",
        key : "hcn_livebed", // soName + spCode
        SVC_CD : "550"
    },
    policy : {
        sessionTimeoutDefault : "320"
    },
    service : {
        push : true, // 사업자 Push
        nvod : true, // NVOD 채널
        trigger : true, // 4방향 트리거
        simplePurchase : true, // VOD 간편결재ip
        multiPurchase : true, // 복합결재
        coinCharge : true, // TV코인 충전
        cjonePoint : false, // CJ One point
        hPoint : true, // H. point
        netflix : false, // 넷플릭스
        samsungApps : true, // 삼성 앱스
        previewDetail : true, // 본편미리보기
        seriesContinuous : true, // 시리즈 연속보기
        usbMedia : false, // 개인미디어
        favorite : true, // 즐겨찾기
        smartRecommend : true, // 스마트 추천
        androidApp : false, // TV앱
        tts : false, // TTS
        cjhCPA : false, // CJ Hello Smart App
        hcnCPA : true, // 현대 HCN Smart App
        kidsMode : true, // 키즈모드
        channelMode : true, // 채널모드 (키즈모드, 쉬운 사용 모드)
        pvr : false, // 녹화(PVR)App.
        cug : true, // CUG
        bills : true, // TV청구서
        cheonjiin : false, // 천지인
        pip : true, // PIP
        testLogSend : false,// 로그 허용 여부,
        useIsKids : false, //isKids 사용 여부
        uipfTvPoint : true, // UI P/F TV포인트 조회 사용 여부
        usePaymentRedKey : true,// 결제화면 REDKEY 사용 여부
        useZeroPayment : true, // 0원 일 경우 코인결제 -> 청구서결제 변경 여부
        limitCancelSubscription: true, // 1개월 이전일 경우 가입해지 불가능
        unSubscribeCheck : false, // 해지방어 프로모션 여부
        isSvodPayment : true, // isSvod 구매 시 class 추가 여부 체크
        beforeAdultChecked : true, // 포스터 그리기 전 성인 인증 여부
        screenContext : false, // 음성 UX 스크린 컨텍스트 기능 여부
        isMobileUse : true , // 모바일 사용 여부
        useGroupBitsB2B : true, // GroupBitsB2B = 2 사용여부
        useTierUpSellingPrd : true, // 티어업셀링 시나리오 사용여부
        hideLodgeCategory : true, // 숙박업소 VOD 홈메뉴에서 삭제 여부
        bizpfThumbnail : true, // BIZ P/F 채널 매핑 API 사용 여부
        usePromotionHistory : true, // 채널 프로모션 영역에서 히스토리 사용 여부
        useMonthlyCoinShop : false, // 코인 정기 충전소 월정액 코인 상품 편성 여부
        usePairing : false, // 리모컨 페어링 사용 여부
        isKakaoi : false, //카카오i 페어링 설정 사용 여부
        cancelSVODContact : false, // 특정 월정액 해지시 고객센터 팝업 시나리오
        limitSVODPurchaseB2B : false, // B2B 사용자 월정액 구매 불가 여부
        tvpoint : true, // TV포인트 사용여부
        paynow : true, // paynow 사용여부
        kakaopay : true, // kakaopay 사용여부
        fixedChargeCoin : false // 코인상품 하드코딩 여부
    },
    ip : {
        serverIpLiveBiz : "http://10.10.78.66:18080/",
        "X-Client-App-Key" : "NEEBJF29F2KONAV6VCN4HTGTNC",
        flagBiz : "HCN",
        token : "",

        serverIpLiveUi : "http://10.10.78.66:18080/",
        flagUi : "HCN",

        serverIpLiveData : "http://10.10.78.66:18080/",
        serverIpLiveSearch : "http://10.10.78.66:18080/",
        flagData : "HCN",

        serverIpMGW : "http://10.10.69.140:2080/",
        flagMgw : "HCN",

        serverIpMGWKakaoi : "http://10.10.69.140:20770/",
        svcCDMGWKakaoi : "770",
        authCodeMGWKakaoi : "353f27ac-d1ed-434d-8990-4159b9266de9",

        serverIpLiveCug: "http://10.10.113.50:18080/",
    
        serverIpAd: 'http://10.10.113.144:18080/'
    },
    stb : {
        ibcModel : ['SMTC3021H','SMTC5011H','SMTC5012H', 'CN540H', 'GX630H', 'HC-5000CM'],
        energyModel : ['SMTC5012H', 'GX630H', 'CN540H', 'HC-5000CM'],
        smartStb : ["GX-HC830CH"],
        animationSettopBox : [],
        uhdStb : ['GX630H'],
        pvrStb : [],
        pvrRedStb : [],
        pvrSmartStb : [],
        pvrOcapStb : [],
        hyperStb : [],
        voiceStb : [],
        watchAssistNotStb : [],
        uhdStb2 : []
    },
    channel : {
        channelDeleteList : [],
        channelJoinList : [],
        channelHideList : ['4400','4410','6990']
    },
    product : {
        limitProductB2B : [],

        offlineAgreementPrd : ['CHNMSSXX100000006067','CHNMSSXX100000006066','CHNMSSXX100000006065','BDCHSSNM100000006077','BDCHSSNM100000006076','BDCHSSNM100000006075','BDCHSSNM100000006074','CHNMSSXX100000006793','CHNMSSXX100000006792','CHNMSSXX100000006791','CHNMSSXX100000006790','CHNMSSXX100000006789','CHNMSSXX100000006717'],
        //CHNMSSXX100000006067    스포츠 미니팩
        // CHNMSSXX100000006066    드라마 미니팩
        // CHNMSSXX100000006065    영화 미니팩
        // BDCHSSNM100000006077    스포츠+영화+드라마 팩
        // BDCHSSNM100000006076    스포츠+영화 팩
        // BDCHSSNM100000006075    드라마+영화 팩
        // BDCHSSNM100000006074    드라마+스포츠 팩

        // CHNMSSXX100000006793   스포츠팩
        // CHNMSSXX100000006792   비지니스팩
        // CHNMSSXX100000006791   시네마팩
        // CHNMSSXX100000006790   키즈팩
        // CHNMSSXX100000006789   매니아팩
        // CHNMSSXX100000006717   HD플러스 팩

        tierUpSellingPrd : ['CHTRSSXX100000005940'],
        cancelContactPrd : [],
        monthlyCoinPrd : [],
        onceCoinPrd : []
    },
    category : {
        baseId : {
            vodChannel : "1129506", //가상채널(vod채널)
            audioChannel: "1129507",
            defaultPromo : "1129550", // promoTrigger 스케쥴 안걸려있는경우 default (영화 > 금주의 신작)
            defaultPromoKids : "1129332" // Kids promoTrigger 스케쥴 안걸려있는경우 default (키즈 > 만화)
        }
    },
    text : {
        sBiTxt : "현대 HCN ",
        appBiTxt : "현대 HCN 모바일 TV",
        sBiTel : "1877-8000",
        bMethodTxt : "청구서결제"
    },
    appId : {
        tvPointAppId : "550|303|VCS|0"
    },
    lodge : {
        cugId : "2018112218"  // 숙박업소전용관으로 개통된 CUG ID
    },
    image : {
        image : {
            serverImg : 'http://10.10.78.65:18080/',
            serverLogo : 'http://10.10.78.66:18080/',
            serverThumbnail : "http://10.10.78.66:18080/mnt/chthumb/"
        },
        srcPath : {
            srcPath : 'provider/img/hcn/'
        },
        defaultImage : {
            defaultPoster : 'img/common/default_img/img_default_poster_220_316.png',
            defaultPosterSquare : 'img/common/default_img/img_default_poster_220_220.png',
            defaultPromotion : '',
            defaultThumbnail : 'img/common/default_img/img_default_thumbnail_355_200.png',
            defaultThumbnailLine : 'img/common/default_img/img_default_thumbnail_line.png',
            defaultChannelLogo : 'img/common/hello_logo.png'
        }
    }
};






providerSO.jcn_testbed = {
    so : {
        soCode : ["65"],
        soName : "JCN",
        flag : "JCN", // Log 등에 쓰이는 flag
        spCode : "testbed",
        spName : "JCN TESTBED",
        key : "JCN_testbed", // soName + spCode
        SVC_CD : "660"
    },
    policy : {
        sessionTimeoutDefault : "320"
    },
    service : {
        push : true, // 사업자 Push
        nvod : true, // NVOD 채널
        trigger : true, // 4방향 트리거
        simplePurchase : true, // VOD 간편결재ip
        multiPurchase : false, // 복합결재
        coinCharge : true, // TV코인 충전
        cjonePoint : false, // CJ One point
        hPoint : false, // H. point
        netflix : false, // 넷플릭스
        samsungApps : false, // 삼성 앱스
        previewDetail : true, // 본편미리보기
        seriesContinuous : true, // 시리즈 연속보기
        usbMedia : true, // 개인미디어
        favorite : true, // 즐겨찾기
        smartRecommend : true, // 스마트 추천
        androidApp : false, // TV앱
        tts : false, // TTS
        cjhCPA : false, // CJ Hello Smart App
        hcnCPA : false, // 현대 HCN Smart App
        kidsMode : true, // 키즈모드
        channelMode : true, // 채널모드 (키즈모드, 쉬운 사용 모드)
        pvr : true, // 녹화(PVR)
        cug : true, // CUG
        bills : false, // TV청구서
        cheonjiin : true, // 천지인
        pip : true, // PIP
        testLogSend : false,// 로그 허용 여부
        useIsKids : true, //isKids 사용 여부
        uipfTvPoint : true, // UI P/F TV포인트 조회 사용 여부
        usePaymentRedKey : false,// 결제화면 REDKEY 사용 여부
        useZeroPayment : true, // 0원 일 경우 코인결제 -> 청구서결제 변경 여부
        limitCancelSubscription: false, // 1개월 이전일 경우 가입해지 불가능
        unSubscribeCheck : false, // 해지방어 프로모션 여부
        isSvodPayment : false, // isSvod 구매 시 class 추가 여부 체크
        beforeAdultChecked : true, // 포스터 그리기 전 성인 인증 여부
        screenContext : false, // 음성 UX 스크린 컨텍스트 기능 여부
        isMobileUse : false, // 모바일 사용 여부
        useGroupBitsB2B : false, // GroupBitsB2B = 2 사용여부
        useTierUpSellingPrd : true, // 티어업셀링 시나리오 사용여부
        hideLodgeCategory : true, // 숙박업소 VOD 홈메뉴에서 삭제 여부
        bizpfThumbnail : false, // BIZ P/F 채널 매핑 API 사용 여부
        usePromotionHistory : false, // 채널 프로모션 영역에서 히스토리 사용 여부
        useMonthlyCoinShop : true, // 코인 정기 충전소 월정액 코인 상품 편성 여부
        usePairing : true, // 리모컨 페어링 사용 여부
        isKakaoi : false, //카카오i 페어링 설정 사용 여부
        cancelSVODContact : false, // 특정 월정액 해지시 고객센터 팝업 시나리오
        limitSVODPurchaseB2B : false, // B2B 사용자 월정액 구매 불가 여부
        tvpoint : true, // TV포인트 사용여부
        paynow : true, // paynow 사용여부
        kakaopay : true, // kakaopay 사용여부
        fixedChargeCoin : false // 코인상품 하드코딩 여부
    },
    ip : {
        serverIpLiveBiz : "http://10.9.26.16:18080/",
        "X-Client-App-Key" : "UE15KGPSEK992UO89PFRTTBOS4",
        flagBiz : "JCN",
        token : "",

        serverIpLiveUi : "http://10.9.26.16:18080/",
        flagUi : "JCN",

        serverIpLiveData : "http://10.9.26.16:18080/",
        serverIpLiveSearch : "http://10.9.26.16:18080/",
        flagData : "JCN",

        serverIpMGW : "http://10.9.4.85:2080/",
        flagMgw : "JCN",

        serverIpMGWKakaoi : "http://10.10.69.140:20770/",
        svcCDMGWKakaoi : "770",
        authCodeMGWKakaoi : "353f27ac-d1ed-434d-8990-4159b9266de9",

        serverIpLiveCug: "http://10.10.113.50:18080/",
    
        serverIpAd: 'http://10.10.113.66:18080/'
    },
    stb : {
        ibcModel : ['SMTC3021X', 'SMTC5010X', 'SMTC5011X', 'SMTC5012X', 'CN540X', 'LSC530X', 'LSC531X', 'SX730CX'],
        energyModel : ['SMTC5012X', 'CN540X', 'SX730CX', 'GXCJ630CH','GXCJ545CL','GX-CJ680CL'],
        uhdStb : ['GXCJ630CH','GX-CJ680CL'],
        pvrStb : ['GXCJ545CL','GX-CJ680CL'],
        pvrRedStb : ['GX-CJ680CL'],
        pvrSmartStb : [],
        pvrOcapStb : ['GXCJ545CL'],
        hyperStb : ['GXCJ545CL','GX-CJ680CL'],
        animationSettopBox : ['GX-CJ680CL'],
        smartStb : [],
        voiceStb : ['GX-CJ680CL'],
        watchAssistNotStb : ['LSC530X','LSC531X','SMTC3021X', 'SMTC5010X', 'SMTC5011X'],
        uhdStb2 : []
    },
    channel : {
        channelDeleteList : ['345','193','192','349','176'],
        channelJoinList : ['177','429','214','551','181','443','345','193','192','349','176','317','304'],
        channelHideList : ['699']
    },
    product : {
        limitProductB2B : [],
        offlineAgreementPrd : [],
        tierUpSellingPrd : ["CHTRSSXX100000006765"],
        cancelContactPrd : [],
        monthlyCoinPrd : [],
        onceCoinPrd : []
    },
    category : {
        baseId : {
            vodChannel : "1042525", //가상채널(vod채널)
            audioChannel: "1042526", //오디오채널
            defaultPromo : "1038633", // promoTrigger 스케쥴 안걸려있는경우 default
            defaultPromoKids : "1041260" // Kids promoTrigger 스케쥴 안걸려있는경우 default
        }
    },
    text : {
        sBiTxt : "JCN 울산중앙방송",
        sBiTel : "1877-9100",
        bMethodTxt : "청구서결제",
        appBiTxt : "JCN"
    },
    appId : {
        tvPointAppId : "100|016|VCS|0"
    },
    lodge : {
        cugId : "0020190201"  // 숙박업소전용관으로 개통된 CUG ID
    },
    image : {
        image : {
            serverImg : 'http://10.9.26.16:18080/',
            serverLogo : 'http://10.9.26.16:18080/',
            serverThumbnail : "http://10.9.26.16:18080/",
        },
        srcPath : {
            srcPath : 'provider/img/b2b/'
        },
        defaultImage : {
            defaultPoster : 'img/common/default_img/img_default_poster_220_316.png',
            defaultPosterSquare : 'img/common/default_img/img_default_poster_220_220.png',
            defaultPromotion : '',
            defaultThumbnail : 'img/common/default_img/img_default_thumbnail_355_200.png',
            defaultThumbnailLine : 'img/common/default_img/img_default_thumbnail_line.png',
            defaultChannelLogo : 'img/common/logo.png'
        }
    }
};






providerSO.jcn = {
    so : {
        soCode : ["65"],
        soName : "JCN",
        flag : "JCN", // Log 등에 쓰이는 flag
        spCode : "livebed",
        spName : "JCN LIVEBED",
        key : "JCN_livebed", // soName + spCode
        SVC_CD : "660"
    },
    policy : {
        sessionTimeoutDefault : "320"
    },
    service : {
        push : true, // 사업자 Push
        nvod : true, // NVOD 채널
        trigger : true, // 4방향 트리거
        simplePurchase : true, // VOD 간편결재ip
        multiPurchase : false, // 복합결재
        coinCharge : true, // TV코인 충전
        cjonePoint : false, // CJ One point
        hPoint : false, // H. point
        netflix : false, // 넷플릭스
        samsungApps : false, // 삼성 앱스
        previewDetail : true, // 본편미리보기
        seriesContinuous : true, // 시리즈 연속보기
        usbMedia : true, // 개인미디어
        favorite : true, // 즐겨찾기
        smartRecommend : true, // 스마트 추천
        androidApp : false, // TV앱
        tts : false, // TTS
        cjhCPA : false, // CJ Hello Smart App
        hcnCPA : false, // 현대 HCN Smart App
        kidsMode : true, // 키즈모드
        channelMode : false, // 채널모드 (키즈모드, 쉬운 사용 모드)
        pvr : true, // 녹화(PVR)
        cug : true, // CUG
        bills : false, // TV청구서
        cheonjiin : true, // 천지인
        pip : true, // PIP
        testLogSend : false,// 로그 허용 여부
        useIsKids : true, //isKids 사용 여부
        uipfTvPoint : true, // UI P/F TV포인트 조회 사용 여부
        usePaymentRedKey : false,// 결제화면 REDKEY 사용 여부
        useZeroPayment : true, // 0원 일 경우 코인결제 -> 청구서결제 변경 여부
        limitCancelSubscription: false, // 1개월 이전일 경우 가입해지 불가능
        unSubscribeCheck : false, // 해지방어 프로모션 여부
        isSvodPayment : false, // isSvod 구매 시 class 추가 여부 체크
        beforeAdultChecked : true, // 포스터 그리기 전 성인 인증 여부
        screenContext : false, // 음성 UX 스크린 컨텍스트 기능 여부
        isMobileUse : false, // 모바일 사용 여부
        useGroupBitsB2B : false, // GroupBitsB2B = 2 사용여부
        useTierUpSellingPrd : true, // 티어업셀링 시나리오 사용여부
        hideLodgeCategory : true, // 숙박업소 VOD 홈메뉴에서 삭제 여부
        bizpfThumbnail : false, // BIZ P/F 채널 매핑 API 사용 여부
        usePromotionHistory : false, // 채널 프로모션 영역에서 히스토리 사용 여부
        useMonthlyCoinShop : true, // 코인 정기 충전소 월정액 코인 상품 편성 여부
        usePairing : true, // 리모컨 페어링 사용 여부
        isKakaoi : false, //카카오i 페어링 설정 사용 여부
        cancelSVODContact : false, // 특정 월정액 해지시 고객센터 팝업 시나리오
        limitSVODPurchaseB2B : true, // B2B 사용자 월정액 구매 불가 여부
        tvpoint : true, // TV포인트 사용여부
        paynow : true, // paynow 사용여부
        kakaopay : true, // kakaopay 사용여부
        fixedChargeCoin : false // 코인상품 하드코딩 여부
    },
    ip : {
        serverIpLiveBiz : "http://10.10.78.66:18080/",
        "X-Client-App-Key" : "UE15KGPSEK992UO89PFRTTBOS4",
        flagBiz : "JCN",
        token : "",

        serverIpLiveUi : "http://10.10.78.66:18080/",
        flagUi : "JCN",

        serverIpLiveData : "http://10.10.78.66:18080/",
        serverIpLiveSearch : "http://10.10.78.66:18080/",
        flagData : "JCN",

        serverIpMGW : "http://10.10.69.140:2080/",
        flagMgw : "JCN",

        serverIpMGWKakaoi : "http://10.10.69.140:20770/",
        svcCDMGWKakaoi : "770",
        authCodeMGWKakaoi : "353f27ac-d1ed-434d-8990-4159b9266de9",

        serverIpLiveCug: "http://10.10.113.50:18080/",
    
        serverIpAd: 'http://10.10.113.144:18080/'
    },
    stb : {
        ibcModel : ['SMTC3021X', 'SMTC5010X', 'SMTC5011X', 'SMTC5012X', 'CN540X', 'LSC530X', 'LSC531X', 'SX730CX'],
        energyModel : ['SMTC5012X', 'CN540X', 'SX730CX', 'GXCJ630CH','GXCJ545CL','GX-CJ680CL'],
        uhdStb : ['GXCJ630CH','GX-CJ680CL'],
        pvrStb : ['GXCJ545CL','GX-CJ680CL'],
        pvrRedStb : ['GX-CJ680CL'],
        pvrSmartStb : [],
        pvrOcapStb : ['GXCJ545CL'],
        hyperStb : ['GXCJ545CL','GX-CJ680CL'],
        animationSettopBox : ['GX-CJ680CL'],
        smartStb : [],
        voiceStb : ['GX-CJ680CL'],
        watchAssistNotStb : ['LSC530X','LSC531X','SMTC3021X', 'SMTC5010X', 'SMTC5011X'],
        uhdStb2 : []
    },
    channel : {
        channelDeleteList : ['345','193','192','349','176'],
        channelJoinList : ['177','429','214','551','181','443','345','193','192','349','176','317','304'],
        channelHideList : ['699']
    },
    product : {
        limitProductB2B : [],
        offlineAgreementPrd : ["VDCTSSXX100000005736"], // 숙박업소 상품 가입내역에서 제외 처리
        tierUpSellingPrd : ["CHTRSSXX100000006765"],
        cancelContactPrd : [],
        monthlyCoinPrd : [],
        onceCoinPrd : []
    },
    category : {
        baseId : {
            vodChannel : "1042525", //가상채널(vod채널)
            audioChannel: "1042526", //오디오채널
            defaultPromo : "1038633", // promoTrigger 스케쥴 안걸려있는경우 default
            defaultPromoKids : "1041260" // Kids promoTrigger 스케쥴 안걸려있는경우 default
        }
    },
    text : {
        sBiTxt : "JCN 울산중앙방송",
        sBiTel : "1877-9100",
        bMethodTxt : "청구서결제",
        appBiTxt : "JCN"
    },
    appId : {
        tvPointAppId : "100|016|VCS|0"
    },
    lodge : {
        cugId : "0020190201"  // 숙박업소전용관으로 개통된 CUG ID
    },
    image : {
        image : {
            serverImg : 'http://10.10.78.65:18080/',
            serverLogo : 'http://10.10.78.66:18080/',
            serverThumbnail : "http://10.10.78.66:18080/mnt/chthumb/"
        },
        srcPath : {
            srcPath : 'provider/img/b2b/'
        },
        defaultImage : {
            defaultPoster : 'img/common/default_img/img_default_poster_220_316.png',
            defaultPosterSquare : 'img/common/default_img/img_default_poster_220_220.png',
            defaultPromotion : '',
            defaultThumbnail : 'img/common/default_img/img_default_thumbnail_355_200.png',
            defaultThumbnailLine : 'img/common/default_img/img_default_thumbnail_line.png',
            defaultChannelLogo : 'img/common/logo.png'
        }
    }
};






providerSO.kctv_testbed = {
    so : {
        soCode : ["66"],
        soName : "kctv",
        flag : "CJHV", // Log 등에 쓰이는 flag
        spCode : "testbed",
        spName : "KCTV TESTBED",
        key : "kctv_testbed", // soName + spCode
        SVC_CD : "040"
    },
    policy : {
        sessionTimeoutDefault : "320"
    },
    service : {
        push : true, // 사업자 Push
        nvod : true, // NVOD 채널
        trigger : true, // 4방향 트리거
        simplePurchase : true, // VOD 간편결재ip
        multiPurchase : false, // 복합결재
        coinCharge : true, // TV코인 충전
        cjonePoint : false, // CJ One point
        hPoint : false, // H. point
        netflix : false, // 넷플릭스
        samsungApps : false, // 삼성 앱스
        previewDetail : true, // 본편미리보기
        seriesContinuous : true, // 시리즈 연속보기
        usbMedia : true, // 개인미디어
        favorite : true, // 즐겨찾기
        smartRecommend : true, // 스마트 추천
        androidApp : true, // TV앱
        tts : true, // TTS
        cjhCPA : false, // CJ Hello Smart App
        hcnCPA : false, // 현대 HCN Smart App
        kidsMode : true, // 키즈모드
        channelMode : false, // 채널모드 (키즈모드, 쉬운 사용 모드)
        pvr : true, // 녹화(PVR)
        cug : true, // CUG
        bills : false, // TV청구서
        cheonjiin : true, // 천지인
        pip : true, // PIP
        testLogSend : false,// 로그 허용 여부
        useIsKids : true, //isKids 사용 여부
        uipfTvPoint : true, // UI P/F TV포인트 조회 사용 여부
        usePaymentRedKey : false,// 결제화면 REDKEY 사용 여부
        useZeroPayment : true, // 0원 일 경우 코인결제 -> 청구서결제 변경 여부
        limitCancelSubscription: false, // 1개월 이전일 경우 가입해지 불가능
        unSubscribeCheck : false, // 해지방어 프로모션 여부
        isSvodPayment : false,// isSvod 구매 시 class 추가 여부 체크
        beforeAdultChecked : true, // 포스터 그리기 전 성인 인증 여부
        screenContext : true, // 음성 UX 스크린 컨텍스트 기능 여부
        isMobileUse : false, // 모바일 사용 여부
        useGroupBitsB2B : false, // GroupBitsB2B = 2 사용여부
        useTierUpSellingPrd : false, // 티어업셀링 시나리오 사용여부
        hideLodgeCategory : true, // 숙박업소 VOD 홈메뉴에서 삭제 여부
        bizpfThumbnail : false, // BIZ P/F 채널 매핑 API 사용 여부
        usePromotionHistory : false, // 채널 프로모션 영역에서 히스토리 사용 여부
        useMonthlyCoinShop : true, // 코인 정기 충전소 월정액 코인 상품 편성 여부
        usePairing : true, // 리모컨 페어링 사용 여부
        isKakaoi : false, //카카오i 페어링 설정 사용 여부
        cancelSVODContact : false, // 특정 월정액 해지시 고객센터 팝업 시나리오
        limitSVODPurchaseB2B : false, // B2B 사용자 월정액 구매 불가 여부
        tvpoint : true, // TV포인트 사용여부
        paynow : true, // paynow 사용여부
        kakaopay : true, // kakaopay 사용여부
        fixedChargeCoin : true // 코인상품 하드코딩 여부
    },
    ip : {
        serverIpLiveBiz : "http://10.9.26.16:18080/",
        "X-Client-App-Key" : "9CQQR9V1UHJF87PMRUOD6JSLG4",
        flagBiz : "CJHV",
        token : "",

        serverIpLiveUi : "http://10.9.26.16:18080/",
        flagUi : "CJHV",

        serverIpLiveData : "http://10.9.26.16:18080/",
        serverIpLiveSearch : "http://10.9.26.16:18080/",
        flagData : "CJHV",

        serverIpMGW : "http://10.9.4.85:2080/",
        flagMgw : "CJHV",

        serverIpMGWKakaoi : "http://10.10.69.140:20770/",
        svcCDMGWKakaoi : "770",
        authCodeMGWKakaoi : "353f27ac-d1ed-434d-8990-4159b9266de9",

        serverIpLiveCug: "http://10.10.113.50:18080/",
    
        serverIpAd: 'http://10.10.113.66:18080/'
    },
    stb : {
        ibcModel : [],
        energyModel : ['GXCJ545CL','CN540X'],
        uhdStb : [],
        pvrStb : ['GXCJ545CL'],
        pvrRedStb : [],
        pvrSmartStb : [],
        pvrOcapStb : ['GXCJ545CL'],
        hyperStb : ['GXCJ545CL'],
        animationSettopBox : [],
        smartStb : [],
        voiceStb : [],
        watchAssistNotStb : ['LSC530X','LSC531X'],
        uhdStb2 : []
    },
    channel : {
        channelDeleteList  : ["181","192","193","345","443"],
        channelJoinList : ["181","192","193","345","443"],
        channelHideList : []
    },
    product : {
        limitProductB2B : ["VDCTSSXX100000000369", "VDCTSSXX100000000370", "VDCTSSXX100000000372", "BDNNSSNM100000000394", "BDNNSSNM100000010465", "VDCTSSXX100000000381"],
        offlineAgreementPrd : [],
        tierUpSellingPrd : [],
        monthlyCoinPrd : ["EXCISSXX100000014565","EXCISSXX100000014566","EXCISSXX100000014567"],
        onceCoinPrd : ["EXCIOTXX100000014568","EXCIOTXX100000014569","EXCIOTXX100000014570"],
        cancelContactPrd : []
    },
    category : {
        baseId : {
            vodChannel : "1006339", //가상채널(vod채널)
            audioChannel: "1006340", //오디오채널
            defaultPromo : "1000235", // promoTrigger 스케쥴 안걸려있는경우 default
            defaultPromoKids : "1014981" // Kids promoTrigger 스케쥴 안걸려있는경우 default
        }
    },
    text : {
        sBiTxt : "KCTV 광주방송",
        sBiTel : "062-417-8000",
        bMethodTxt : "청구서결제",
        appBiTxt : "KCTV 광주방송",
    },
    appId : {
        tvPointAppId : "100|016|VCS|0"
    },
    lodge : {
        cugId : "1909200001"  // 숙박업소전용관으로 개통된 CUG ID
    },
    image : {
        image : {
            serverImg : 'http://10.9.26.16:18080/',
            serverLogo : 'http://10.9.26.16:18080/',
            serverThumbnail : "http://10.9.26.16:18080/",
        },
        srcPath : {
            srcPath : 'provider/img/b2b/'
        },
        defaultImage : {
            defaultPoster : 'img/common/default_img/img_default_poster_220_316.png',
            defaultPosterSquare : 'img/common/default_img/img_default_poster_220_220.png',
            defaultPromotion : '',
            defaultThumbnail : 'img/common/default_img/img_default_thumbnail_355_200.png',
            defaultThumbnailLine : 'img/common/default_img/img_default_thumbnail_line.png',
            defaultChannelLogo : 'img/common/hello_logo.png'
        }
    }
};






providerSO.kctv = {
    so : {
        soCode : ["66"],
        soName : "kctv",
        flag : "CJHV", // Log 등에 쓰이는 flag
        spCode : "livebed",
        spName : "KCTV LIVEBED",
        key : "kctv_livebed", // soName + spCode
        SVC_CD : "040"
    },
    policy : {
        sessionTimeoutDefault : "320"
    },
    service : {
        push : true, // 사업자 Push
        nvod : true, // NVOD 채널
        trigger : true, // 4방향 트리거
        simplePurchase : true, // VOD 간편결재ip
        multiPurchase : false, // 복합결재
        coinCharge : true, // TV코인 충전
        cjonePoint : false, // CJ One point
        hPoint : false, // H. point
        netflix : false, // 넷플릭스
        samsungApps : false, // 삼성 앱스
        previewDetail : true, // 본편미리보기
        seriesContinuous : true, // 시리즈 연속보기
        usbMedia : true, // 개인미디어
        favorite : true, // 즐겨찾기
        smartRecommend : true, // 스마트 추천
        androidApp : true, // TV앱
        tts : true, // TTS
        cjhCPA : false, // CJ Hello Smart App
        hcnCPA : false, // 현대 HCN Smart App
        kidsMode : true, // 키즈모드
        channelMode : false, // 채널모드 (키즈모드, 쉬운 사용 모드)
        pvr : true, // 녹화(PVR)
        cug : true, // CUG
        bills : false, // TV청구서
        cheonjiin : true, // 천지인
        pip : true, // PIP
        testLogSend : false,// 로그 허용 여부
        useIsKids : true, //isKids 사용 여부
        uipfTvPoint : true, // UI P/F TV포인트 조회 사용 여부
        usePaymentRedKey : false,// 결제화면 REDKEY 사용 여부
        useZeroPayment : true, // 0원 일 경우 코인결제 -> 청구서결제 변경 여부
        limitCancelSubscription: false, // 1개월 이전일 경우 가입해지 불가능
        unSubscribeCheck : false, // 해지방어 프로모션 여부
        isSvodPayment : false,// isSvod 구매 시 class 추가 여부 체크
        beforeAdultChecked : true, // 포스터 그리기 전 성인 인증 여부
        screenContext : true, // 음성 UX 스크린 컨텍스트 기능 여부
        isMobileUse : false, // 모바일 사용 여부
        useGroupBitsB2B : false, // GroupBitsB2B = 2 사용여부
        useTierUpSellingPrd : false, // 티어업셀링 시나리오 사용여부
        hideLodgeCategory : true, // 숙박업소 VOD 홈메뉴에서 삭제 여부
        bizpfThumbnail : false, // BIZ P/F 채널 매핑 API 사용 여부
        usePromotionHistory : false, // 채널 프로모션 영역에서 히스토리 사용 여부
        useMonthlyCoinShop : true, // 코인 정기 충전소 월정액 코인 상품 편성 여부
        usePairing : true, // 리모컨 페어링 사용 여부
        isKakaoi : false, //카카오i 페어링 설정 사용 여부
        cancelSVODContact : false, // 특정 월정액 해지시 고객센터 팝업 시나리오
        limitSVODPurchaseB2B : false, // B2B 사용자 월정액 구매 불가 여부
        tvpoint : true, // TV포인트 사용여부
        paynow : true, // paynow 사용여부
        kakaopay : true, // kakaopay 사용여부
        fixedChargeCoin : true // 코인상품 하드코딩 여부
    },
    ip : {
        serverIpLiveBiz : "http://10.10.78.66:18080/",
        "X-Client-App-Key" : "9CQQR9V1UHJF87PMRUOD6JSLG4",
        flagBiz : "CJHV",
        token : "",

        serverIpLiveUi : "http://10.10.78.66:18080/",
        flagUi : "CJHV",

        serverIpLiveData : "http://10.10.78.66:18080/",
        serverIpLiveSearch : "http://10.10.78.66:18080/",
        flagData : "CJHV",

        serverIpMGW : "http://10.10.69.140:2080/",
        flagMgw : "CJHV",

        serverIpMGWKakaoi : "http://10.10.69.140:20770/",
        svcCDMGWKakaoi : "770",
        authCodeMGWKakaoi : "353f27ac-d1ed-434d-8990-4159b9266de9",

        serverIpLiveCug: "http://10.10.113.50:18080/",
    
        serverIpAd: 'http://10.10.113.144:18080/'
    },
    stb : {
        ibcModel : [],
        energyModel : ['GXCJ545CL','CN540X'],
        uhdStb : [],
        pvrStb : ['GXCJ545CL'],
        pvrRedStb : [],
        pvrSmartStb : [],
        pvrOcapStb : ['GXCJ545CL'],
        hyperStb : ['GXCJ545CL'],
        animationSettopBox : [],
        smartStb : [],
        voiceStb : [],
        watchAssistNotStb : ['LSC530X','LSC531X'],
        uhdStb2 : []
    },
    channel : {
        channelDeleteList  : ["181","192","193","345","443"],
        channelJoinList : ["181","192","193","345","443"],
        channelHideList : []
    },
    product : {
        limitProductB2B : ["VDCTSSXX100000000369", "VDCTSSXX100000000370", "VDCTSSXX100000000372", "BDNNSSNM100000000394", "BDNNSSNM100000010465", "VDCTSSXX100000000381"],
        offlineAgreementPrd : [],
        tierUpSellingPrd : [],
        monthlyCoinPrd : ["EXCISSXX100000014565","EXCISSXX100000014566","EXCISSXX100000014567"],
        onceCoinPrd : ["EXCIOTXX100000014568","EXCIOTXX100000014569","EXCIOTXX100000014570"],
        cancelContactPrd : []
    },
    category : {
        baseId : {
            vodChannel : "1006339", //가상채널(vod채널)
            audioChannel: "1006340", //오디오채널
            defaultPromo : "1000235", // promoTrigger 스케쥴 안걸려있는경우 default
            defaultPromoKids : "1014981" // Kids promoTrigger 스케쥴 안걸려있는경우 default
        }
    },
    text : {
        sBiTxt : "KCTV 광주방송",
        sBiTel : "062-417-8000",
        bMethodTxt : "청구서결제",
        appBiTxt : "KCTV 광주방송",
    },
    appId : {
        tvPointAppId : "100|016|VCS|0"
    },
    lodge : {
        cugId : "1909200001"  // 숙박업소전용관으로 개통된 CUG ID
    },
    image : {
        image : {
            serverImg : 'http://10.10.78.65:18080/',
            serverLogo : 'http://10.10.78.66:18080/',
            serverThumbnail : "http://10.10.78.66:18080/mnt/chthumb/"
        },
        srcPath : {
            srcPath : 'provider/img/b2b/'
        },
        defaultImage : {
            defaultPoster : 'img/common/default_img/img_default_poster_220_316.png',
            defaultPosterSquare : 'img/common/default_img/img_default_poster_220_220.png',
            defaultPromotion : '',
            defaultThumbnail : 'img/common/default_img/img_default_thumbnail_355_200.png',
            defaultThumbnailLine : 'img/common/default_img/img_default_thumbnail_line.png',
            defaultChannelLogo : 'img/common/hello_logo.png'
        }
    }
};






providerSO.nib_testbed = {
    so : {
        soCode : ["49"],
        soName : "nib",
        flag : "CJHV", // Log 등에 쓰이는 flag
        spCode : "testbed",
        spName : "NIB TESTBED",
        key : "nib_testbed", // soName + spCode
        SVC_CD : "040"
    },
    policy : {
        sessionTimeoutDefault : "320"
    },
    service : {
        push : true, // 사업자 Push
        nvod : true, // NVOD 채널
        trigger : true, // 4방향 트리거
        simplePurchase : true, // VOD 간편결재ip
        multiPurchase : false, // 복합결재
        coinCharge : true, // TV코인 충전
        cjonePoint : false, // CJ One point
        hPoint : false, // H. point
        netflix : false, // 넷플릭스
        samsungApps : false, // 삼성 앱스
        previewDetail : true, // 본편미리보기
        seriesContinuous : true, // 시리즈 연속보기
        usbMedia : true, // 개인미디어
        favorite : true, // 즐겨찾기
        smartRecommend : true, // 스마트 추천
        androidApp : true, // TV앱
        tts : true, // TTS
        cjhCPA : false, // CJ Hello Smart App
        hcnCPA : false, // 현대 HCN Smart App
        kidsMode : true, // 키즈모드
        channelMode : false, // 채널모드 (키즈모드, 쉬운 사용 모드)
        pvr : true, // 녹화(PVR)
        cug : true, // CUG
        bills : false, // TV청구서
        cheonjiin : true, // 천지인
        pip : true, // PIP
        testLogSend : false,// 로그 허용 여부
        useIsKids : true, //isKids 사용 여부
        uipfTvPoint : true, // UI P/F TV포인트 조회 사용 여부
        usePaymentRedKey : false,// 결제화면 REDKEY 사용 여부
        useZeroPayment : true, // 0원 일 경우 코인결제 -> 청구서결제 변경 여부
        limitCancelSubscription: false, // 1개월 이전일 경우 가입해지 불가능
        unSubscribeCheck : false, // 해지방어 프로모션 여부
        isSvodPayment : false,// isSvod 구매 시 class 추가 여부 체크
        beforeAdultChecked : true, // 포스터 그리기 전 성인 인증 여부
        screenContext : false, // 음성 UX 스크린 컨텍스트 기능 여부
        isMobileUse : false, // 모바일 사용 여부
        useGroupBitsB2B : false, // GroupBitsB2B = 2 사용여부
        useTierUpSellingPrd : false, // 티어업셀링 시나리오 사용여부
        hideLodgeCategory : false, // 숙박업소 VOD 홈메뉴에서 삭제 여부
        bizpfThumbnail : false, // BIZ P/F 채널 매핑 API 사용 여부
        usePromotionHistory : false, // 채널 프로모션 영역에서 히스토리 사용 여부
        useMonthlyCoinShop : true, // 코인 정기 충전소 월정액 코인 상품 편성 여부
        usePairing : true, // 리모컨 페어링 사용 여부
        isKakaoi : false, //카카오i 페어링 설정 사용 여부
        cancelSVODContact : true, // 특정 월정액 해지시 고객센터 팝업 시나리오
        limitSVODPurchaseB2B : false, // B2B 사용자 월정액 구매 불가 여부
        tvpoint : false, // TV포인트 사용여부
        paynow : false, // paynow 사용여부
        kakaopay : true, // kakaopay 사용여부
        fixedChargeCoin : true // 코인상품 하드코딩 여부
    },
    ip : {
        serverIpLiveBiz : "http://10.9.26.16:18080/",
        "X-Client-App-Key" : "9CQQR9V1UHJF87PMRUOD6JSLG4",
        flagBiz : "CJHV",
        token : "",

        serverIpLiveUi : "http://10.9.26.16:18080/",
        flagUi : "CJHV",

        serverIpLiveData : "http://10.9.26.16:18080/",
        serverIpLiveSearch : "http://10.9.26.16:18080/",
        flagData : "CJHV",

        serverIpMGW : "http://10.9.4.85:2080/",
        flagMgw : "CJHV",

        serverIpMGWKakaoi : "http://10.10.69.140:20770/",
        svcCDMGWKakaoi : "770",
        authCodeMGWKakaoi : "353f27ac-d1ed-434d-8990-4159b9266de9",

        serverIpLiveCug: "http://10.10.113.50:18080/",
    
        serverIpAd: 'http://10.10.113.66:18080/'
    },
    stb : {
        ibcModel : ['SMTC3021X', 'SMTC5010X', 'SMTC5011X', 'SMTC5012X', 'UC1600X', 'UC2300X', 'UC1300X'],
        energyModel : ['SMTC5012X', 'UC1600X', 'UC2300X', 'GXCJ630CH', 'GXCJ545CL','UC3300','GX-CJ680CL'],
        uhdStb : ['GXCJ630CH',"GX-CJ680CL"],
        pvrStb : ['GXCJ545CL','GX-CJ680CL','UC3300','SX930CX'],
        pvrRedStb : ['GX-CJ680CL'],
        pvrSmartStb : ['SX930CX'],
        pvrOcapStb : ['GXCJ545CL','UC3300'],
        hyperStb : ['GXCJ630CH', 'GXCJ545CL','GX-CJ680CL','UC3300','SX930CX'],
        animationSettopBox : ["GX-CJ680CL"],
        smartStb : [],
        voiceStb : ['GX-CJ680CL'],
        watchAssistNotStb : [],
        voiceSearchStb : ['GX-CJ680CL','GXCJ545CL','UC3300'],
        uhdStb2 : []
    },
    channel : {
        channelDeleteList : ["181", "192", "193", "176", "349", "443"],
        channelJoinList : ["181", "443", "192", "193", "176", "349", "689", "492", "493", "214", "551"],
        channelHideList : ["177", "121"]
    },
    product : {
        limitProductB2B : ["BDCHSSNM100000011676","BDCHSSNM100000011679","BDCHSSNM100000011680","BDCHSSNM100000011681","BDCHSSNM100000011682","BDCHSSNM100000011683","BDCHSSNM100000005267","BDNNSSNM100000011669","BDNNSSNM100000000394","CHNMSSXX100000011675","CHNMSSXX100000011678","VDCTSSXX100000000369","VDCTSSXX100000000370","VDCTSSXX100000000372","VDCTSSXX100000003265","VDCTSSXX100000001065","VDCTSSXX100000000368","VDCTSSXX100000001075","VDCTSSXX100000000367","VDCTSSXX100000000373","VDCTSSXX100000000382","VDCTSSXX100000000383","VDCTSSXX100000000366","VDCTSSXX100000000374","VDCTSSXX100000000371","VDCTSSXX100000000365","VDCTSSXX100000000378","VDCTSSXX100000000379"],
        offlineAgreementPrd : [],
        tierUpSellingPrd : [],
        monthlyCoinPrd : ["EXCISSXX100000011688","EXCISSXX100000011689","EXCISSXX100000011690"],
        onceCoinPrd : ["EXCIOTXX100000011691","EXCIOTXX100000011692","EXCIOTXX100000011693","EXCIOTXX100000011694"],
        cancelContactPrd : ["VDCTSSXX100000000369","VDCTSSXX100000000372","VDCTSSXX100000000370","VDCTSSXX100000003265","VDCTSSXX100000001065","VDCTSSXX100000000368","VDCTSSXX100000001075","VDCTSSXX100000000367","VDCTSSXX100000000373","VDCTSSXX100000000382","VDCTSSXX100000000383","VDCTSSXX100000000366","VDCTSSXX100000011685","VDCTSSXX100000011668","VDCTSSXX100000000374","VDCTSSXX100000000371","VDCTSSXX100000000365","VDCTSSXX100000000378","VDCTSSXX100000000379","BDNNSSNM100000011669","BDNNSSNM100000000394", "VDCTSSXX100000016965", "VDCTSSXX100000021165","VDCTSSXX100000005466","BDNNSSNM100000041165"]
    },
    category : {
        baseId : {
            vodChannel : "1006339", //가상채널(vod채널)
            audioChannel: "1006340", //오디오채널
            defaultPromo : "1000235", // promoTrigger 스케쥴 안걸려있는경우 default
            defaultPromoKids : "1014981" // Kids promoTrigger 스케쥴 안걸려있는경우 default
        }
    },
    text : {
        sBiTxt : "NIB 남인천방송",
        sBiTel : "1544-0777",
        bMethodTxt : "청구서결제",
        appBiTxt : "NIB 남인천방송",
    },
    appId : {
        tvPointAppId : "800|016|VCS|0"
    },
    lodge : {
        cugId : ""  // 숙박업소전용관으로 개통된 CUG ID
    },
    image : {
        image : {
            serverImg : 'http://10.9.26.16:18080/',
            serverLogo : 'http://10.9.26.16:18080/',
            serverThumbnail : "http://10.9.26.16:18080/",
        },
        srcPath : {
            srcPath : 'provider/img/b2b/'
        },
        defaultImage : {
            defaultPoster : 'img/common/default_img/img_default_poster_220_316.png',
            defaultPosterSquare : 'img/common/default_img/img_default_poster_220_220.png',
            defaultPromotion : '',
            defaultThumbnail : 'img/common/default_img/img_default_thumbnail_355_200.png',
            defaultThumbnailLine : 'img/common/default_img/img_default_thumbnail_line.png',
            defaultChannelLogo : 'img/common/hello_logo.png'
        }
    }
};






providerSO.nib = {
    so : {
        soCode : ["49"],
        soName : "nib",
        flag : "CJHV", // Log 등에 쓰이는 flag
        spCode : "livebed",
        spName : "NIB LIVEBED",
        key : "nib_livebed", // soName + spCode
        SVC_CD : "040"
    },
    policy : {
        sessionTimeoutDefault : "320"
    },
    service : {
        push : true, // 사업자 Push
        nvod : true, // NVOD 채널
        trigger : true, // 4방향 트리거
        simplePurchase : true, // VOD 간편결재ip
        multiPurchase : false, // 복합결재
        coinCharge : true, // TV코인 충전
        cjonePoint : false, // CJ One point
        hPoint : false, // H. point
        netflix : false, // 넷플릭스
        samsungApps : false, // 삼성 앱스
        previewDetail : true, // 본편미리보기
        seriesContinuous : true, // 시리즈 연속보기
        usbMedia : true, // 개인미디어
        favorite : true, // 즐겨찾기
        smartRecommend : true, // 스마트 추천
        androidApp : true, // TV앱
        tts : true, // TTS
        cjhCPA : false, // CJ Hello Smart App
        hcnCPA : false, // 현대 HCN Smart App
        kidsMode : true, // 키즈모드
        channelMode : false, // 채널모드 (키즈모드, 쉬운 사용 모드)
        pvr : true, // 녹화(PVR)
        cug : true, // CUG
        bills : false, // TV청구서
        cheonjiin : true, // 천지인
        pip : true, // PIP
        testLogSend : false,// 로그 허용 여부
        useIsKids : true, //isKids 사용 여부
        uipfTvPoint : true, // UI P/F TV포인트 조회 사용 여부
        usePaymentRedKey : false,// 결제화면 REDKEY 사용 여부
        useZeroPayment : true, // 0원 일 경우 코인결제 -> 청구서결제 변경 여부
        limitCancelSubscription: false, // 1개월 이전일 경우 가입해지 불가능
        unSubscribeCheck : false, // 해지방어 프로모션 여부
        isSvodPayment : false,// isSvod 구매 시 class 추가 여부 체크
        beforeAdultChecked : true, // 포스터 그리기 전 성인 인증 여부
        screenContext : false, // 음성 UX 스크린 컨텍스트 기능 여부
        isMobileUse : false, // 모바일 사용 여부
        useGroupBitsB2B : false, // GroupBitsB2B = 2 사용여부
        useTierUpSellingPrd : false, // 티어업셀링 시나리오 사용여부
        hideLodgeCategory : false, // 숙박업소 VOD 홈메뉴에서 삭제 여부
        bizpfThumbnail : false, // BIZ P/F 채널 매핑 API 사용 여부
        usePromotionHistory : false, // 채널 프로모션 영역에서 히스토리 사용 여부
        useMonthlyCoinShop : true, // 코인 정기 충전소 월정액 코인 상품 편성 여부
        usePairing : true, // 리모컨 페어링 사용 여부
        isKakaoi : false, //카카오i 페어링 설정 사용 여부
        cancelSVODContact : true, // 특정 월정액 해지시 고객센터 팝업 시나리오
        limitSVODPurchaseB2B : false, // B2B 사용자 월정액 구매 불가 여부
        tvpoint : false, // TV포인트 사용여부
        paynow : false, // paynow 사용여부
        kakaopay : true, // kakaopay 사용여부
        fixedChargeCoin : true // 코인상품 하드코딩 여부
    },
    ip : {
        serverIpLiveBiz : "http://10.10.78.66:18080/",
        "X-Client-App-Key" : "9CQQR9V1UHJF87PMRUOD6JSLG4",
        flagBiz : "CJHV",
        token : "",

        serverIpLiveUi : "http://10.10.78.66:18080/",
        flagUi : "CJHV",

        serverIpLiveData : "http://10.10.78.66:18080/",
        serverIpLiveSearch : "http://10.10.78.66:18080/",
        flagData : "CJHV",

        serverIpMGW : "http://10.10.69.140:2080/",
        flagMgw : "CJHV",

        serverIpMGWKakaoi : "http://10.10.69.140:20770/",
        svcCDMGWKakaoi : "770",
        authCodeMGWKakaoi : "353f27ac-d1ed-434d-8990-4159b9266de9",

        serverIpLiveCug: "http://10.10.113.50:18080/",
    
        serverIpAd: 'http://10.10.113.144:18080/'
    },
    stb : {
        ibcModel : ['SMTC3021X', 'SMTC5010X', 'SMTC5011X', 'SMTC5012X', 'UC1600X', 'UC2300X', 'UC1300X'],
        energyModel : ['SMTC5012X', 'UC1600X', 'UC2300X', 'GXCJ630CH', 'GXCJ545CL','UC3300','GX-CJ680CL','SX930CX'],
        uhdStb : ['GXCJ630CH',"GX-CJ680CL"],
        pvrStb : ['GXCJ545CL','GX-CJ680CL','UC3300','SX930CX'],
        pvrRedStb : ['GX-CJ680CL'],
        pvrSmartStb : ['SX930CX'],
        pvrOcapStb : ['GXCJ545CL','UC3300'],
        hyperStb : ['GXCJ630CH', 'GXCJ545CL','GX-CJ680CL','UC3300','SX930CX'],
        animationSettopBox : ["GX-CJ680CL"],
        smartStb : [],
        voiceStb : ['GX-CJ680CL'],
        watchAssistNotStb : [],
        voiceSearchStb : ['GX-CJ680CL','GXCJ545CL','UC3300'],
        uhdStb2 : []
    },
    channel : {
        channelDeleteList : ["181", "192", "193", "176", "349", "443"],
        channelJoinList : ["181", "443", "192", "193", "176", "349", "689", "492", "493", "214", "551"],
        channelHideList : ["177", "121"]
    },
    product : {
        limitProductB2B : ["BDCHSSNM100000011676","BDCHSSNM100000011679","BDCHSSNM100000011680","BDCHSSNM100000011681","BDCHSSNM100000011682","BDCHSSNM100000011683","BDCHSSNM100000005267","BDNNSSNM100000011669","BDNNSSNM100000000394","CHNMSSXX100000011675","CHNMSSXX100000011678","VDCTSSXX100000000369","VDCTSSXX100000000370","VDCTSSXX100000000372","VDCTSSXX100000003265","VDCTSSXX100000001065","VDCTSSXX100000000368","VDCTSSXX100000001075","VDCTSSXX100000000367","VDCTSSXX100000000373","VDCTSSXX100000000382","VDCTSSXX100000000383","VDCTSSXX100000000366","VDCTSSXX100000000374","VDCTSSXX100000000371","VDCTSSXX100000000365","VDCTSSXX100000000378","VDCTSSXX100000000379", "VDCTSSXX100000016965","BDCHSSNM100000020468","BDCHSSNM100000021467"],
        offlineAgreementPrd : [],
        tierUpSellingPrd : [],
        monthlyCoinPrd : ["EXCISSXX100000011688","EXCISSXX100000011689","EXCISSXX100000011690"],
        onceCoinPrd : ["EXCIOTXX100000011691","EXCIOTXX100000011692","EXCIOTXX100000011693","EXCIOTXX100000011694"],
        cancelContactPrd : ["VDCTSSXX100000000369","VDCTSSXX100000000372","VDCTSSXX100000000370","VDCTSSXX100000003265","VDCTSSXX100000001065","VDCTSSXX100000000368","VDCTSSXX100000001075","VDCTSSXX100000000367","VDCTSSXX100000000373","VDCTSSXX100000000382","VDCTSSXX100000000383","VDCTSSXX100000000366","VDCTSSXX100000011685","VDCTSSXX100000011668","VDCTSSXX100000000374","VDCTSSXX100000000371","VDCTSSXX100000000365","VDCTSSXX100000000378","VDCTSSXX100000000379","BDNNSSNM100000011669","BDNNSSNM100000000394", "VDCTSSXX100000016965", "VDCTSSXX100000021165","VDCTSSXX100000005466","BDNNSSNM100000041165"]
    },
    category : {
        baseId : {
            vodChannel : "1006339", //가상채널(vod채널)
            audioChannel: "1006340", //오디오채널
            defaultPromo : "1000235", // promoTrigger 스케쥴 안걸려있는경우 default
            defaultPromoKids : "1014981" // Kids promoTrigger 스케쥴 안걸려있는경우 default
        }
    },
    text : {
        sBiTxt : "NIB 남인천방송",
        sBiTel : "1544-0777",
        bMethodTxt : "청구서결제",
        appBiTxt : "NIB 남인천방송",
    },
    appId : {
        tvPointAppId : "800|016|VCS|0"
    },
    lodge : {
        cugId : ""  // 숙박업소전용관으로 개통된 CUG ID
    },
    image : {
        image : {
            serverImg : 'http://10.10.78.65:18080/',
            serverLogo : 'http://10.10.78.66:18080/',
            serverThumbnail : "http://10.10.78.66:18080/mnt/chthumb/"
        },
        srcPath : {
            srcPath : 'provider/img/b2b/'
        },
        defaultImage : {
            defaultPoster : 'img/common/default_img/img_default_poster_220_316.png',
            defaultPosterSquare : 'img/common/default_img/img_default_poster_220_220.png',
            defaultPromotion : '',
            defaultThumbnail : 'img/common/default_img/img_default_thumbnail_355_200.png',
            defaultThumbnailLine : 'img/common/default_img/img_default_thumbnail_line.png',
            defaultChannelLogo : 'img/common/hello_logo.png'
        }
    }
};



