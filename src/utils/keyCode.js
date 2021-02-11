// https://docs.google.com/spreadsheets/d/1ivCqG9eXYVm13QGWiJVoHfvCTh_nP49Y/edit#gid=571756305

const convertKeyCode = (keyCode) => {
    let keyName = keyCode;
    switch (keyCode) {
        case '19':
        case '103':
            keyName = "ArrowUp";
            break;
        case '20':
        case '108':
            keyName = "ArrowDown";
            break;
        case '21':
        case '105':
            keyName = "ArrowLeft";
            break;
        case '22':
        case '106':
            keyName = "ArrowRight";
            break;
        case '4':
        case '158':
            keyName = "Backspace";
            break;
        case '23':
        case '66':
            keyName = 'Enter'
            break
        case '67':
        case '1300001':
            keyName = 'Delete'
        case '82':
            keyName = 'SimpleMenu'
            break
        case '7':
        case '8':
        case '9':
        case '10':
        case '11':
        case '12':
        case '13':
        case '14':
        case '15':
        case '16':
            keyName = String(Number(keyCode-7))
            break
    }

    return keyName;
}

export default convertKeyCode;