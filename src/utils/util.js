const hasOwnProperty = Object.prototype.hasOwnProperty;

export function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}

function extend(to, _from) {
    return Object.assign(_from, to);
}

export function toObject(arr) {
    const res = {};
    for (let i = 0; i < arr.length; i += 1) {
        if (arr[i]) {
            extend(res, arr[i]);
        }
    }
    return res;
}

export function getValueByPath(object, prop) {
    const localProp = prop || '';
    const paths = localProp.split('.');
    let current = object;
    let result = null;
    for (let i = 0, j = paths.length; i < j; i += 1) {
        const path = paths[i];
        if (!current) break;

        if (i === j - 1) {
            result = current[path];
            break;
        }
        current = current[path];
    }
    return result;
}
