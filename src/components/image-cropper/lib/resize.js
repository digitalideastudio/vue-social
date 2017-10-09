import helper from './helper';

const isMobile = helper.isMobile;
const W = document.body.offsetWidth;

function resize(e, el, container, coor, ratio) {
    if (!el) {
        return {};
    }
    const H = document.body.offsetHeight;
    const ratioRemainder = 1 / ratio;
    const dotBoxW = parseInt(window.getComputedStyle(container).width, 0);
    const dotBoxH = parseInt(window.getComputedStyle(container).height, 0);
    const $topH = document.querySelector('.info-aside');
    const halfX = (W - dotBoxW) / 2;
    const topH = parseInt(window.getComputedStyle($topH).height, 0);
    const halfY = (H - dotBoxH - topH) / 2;
    const resetX = isMobile ? e.changedTouches[0].clientX : e.clientX;
    const resetY = isMobile ? e.changedTouches[0].clientY : e.clientY;
    const elOffsetWidth = parseInt(el.offsetWidth, 0);
    const elOffsetHeight = parseInt(el.offsetHeight, 0);
    const CSSObj = {};

    if (ratio >= 1 && resetX <= halfX + dotBoxW) {
        if (elOffsetWidth >= dotBoxW) {
            CSSObj.width = dotBoxW;
        }
        CSSObj.width = (coor.w + resetX) - coor.x;
        CSSObj.height = elOffsetWidth * ratioRemainder;
        if (dotBoxW > dotBoxH) {
            if (elOffsetWidth > dotBoxH) {
                CSSObj.height = dotBoxH;
                CSSObj.width = dotBoxH * ratio;
            }
        } else if (dotBoxW < dotBoxH) {
            if (elOffsetWidth > dotBoxW) {
                CSSObj.width = dotBoxW;
                CSSObj.height = dotBoxW * ratioRemainder;
            }
        } else if (elOffsetWidth >= dotBoxW) {
            CSSObj.width = dotBoxW;
            CSSObj.height = dotBoxW * ratioRemainder;
        }
    } else if (ratio < 1 && resetY < (halfY + dotBoxH + topH)) {
        CSSObj.height = (coor.h + resetY) - coor.y;
        CSSObj.width = parseInt(el.style.height, 0) * ratio;

        if (dotBoxW > dotBoxH) {
            if (elOffsetHeight > dotBoxH) {
                CSSObj.height = dotBoxH;
                CSSObj.width = dotBoxH * ratio;
            }
        } else if (dotBoxW < dotBoxH) {
            if (elOffsetWidth > dotBoxW) {
                CSSObj.width = dotBoxW;
                CSSObj.height = dotBoxW * ratioRemainder;
            }
        } else if (elOffsetWidth > dotBoxW) {
            CSSObj.width = dotBoxW;
            CSSObj.height = dotBoxW * ratioRemainder;
        }
    } else if (ratio === 'auto' && resetY <= (halfY + dotBoxH + topH) && resetX <= halfY + dotBoxW) {
        CSSObj.height = (coor.h + resetY) - coor.y;
        CSSObj.width = (coor.w + resetX) - coor.x;
    } else if (resetX <= halfX + dotBoxW) {
        CSSObj.width = (coor.w + resetX) - coor.x;
        CSSObj.height = el.style.width;
        // limit the crop box area
        if (dotBoxW > dotBoxH) {
            if (elOffsetHeight > dotBoxH) {
                CSSObj.height = dotBoxH;
                CSSObj.width = dotBoxH;
            }
        } else if (dotBoxW < dotBoxH) {
            if (elOffsetWidth > dotBoxW) {
                CSSObj.width = dotBoxW;
                CSSObj.height = dotBoxW;
            }
        } else if (elOffsetWidth > dotBoxW) {
            Object.assign(el.style, { height: dotBoxW });
            CSSObj.width = el.style.height;
        }
    }
    return CSSObj;
}

export default resize;
