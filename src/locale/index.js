import Vue from 'vue';
import deepmerge from 'deepmerge';
import defaultLang from './i18n/en';

let lang = defaultLang;
let merged = false;

function i18nHandler() { // eslint-disable-line
    const vuei18n = Object.getPrototypeOf(this || Vue).$t;
    if (typeof vuei18n === 'function' && !!Vue.locale) {
        if (!merged) {
            merged = true;
            Vue.locale(
                Vue.config.lang,
                deepmerge(lang, Vue.locale(Vue.config.lang) || {}, { clone: true })
            );
        }
        return vuei18n.apply(this, arguments); // eslint-disable-line
    }
}

export function use(l) {
    lang = l || lang;
}

export function i18n(fn) {
    i18nHandler = fn || i18nHandler; // eslint-disable-line
}
