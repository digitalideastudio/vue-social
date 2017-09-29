import Cropper from './main.vue';

/* istanbul ignore next */
Cropper.install = function CropperInstall(Vue) {
    Vue.component(Cropper.name, Cropper);
};

export default Cropper;
