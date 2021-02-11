class History {
    constructor() {
        this.history = null;
    }
    
    init(params) {
        this.history = params;
    }
    
    push(path, state = {}) {
        //라우팅 요청에 대해 필요시 분기 처리
        switch (path) {
            case 'case1':
                break;
            case 'case2':
                break;
            default:
                this.history.push(path, state);
                break;
        }
    }
    
    get() {
        return this.history;
    }
    
    goBack() {
        this.history.goBack();
    }
    
    go(count) {
        this.history.go(count);
    }
}

export default new History();