import ImageCropper from './components/image-cropper/index';
import AvatarMedals from './components/avatar-medals/index';
import CoverImage from './components/cover-image/index';
import SchedulePicker from './components/schedule-picker/index';
import * as locale from './locale';

const components = [
    ImageCropper,
    AvatarMedals,
    CoverImage,
    SchedulePicker,
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
    version: '0.1.2',
    ImageCropper,
    AvatarMedals,
    CoverImage,
    SchedulePicker,
    install,
};
