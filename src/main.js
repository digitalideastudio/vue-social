import Cropper from './components/cropper/index';
import * as locale from './locale';

const components = [
    Cropper,
];

const install = function install(Vue, opts = {}) {
    /* istanbul ignore if */
    if (install.installed) return;
    locale.use(opts.locale);
    locale.i18n(opts.i18n);

    components.map(component => Vue.component(component.name, component));
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

module.exports = {
    version: '0.1.0',
    Cropper,
    install,
};
