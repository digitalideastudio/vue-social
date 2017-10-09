import ImageCropper from './main.vue';

/* istanbul ignore next */
ImageCropper.install = function ImageCropperInstall(Vue) {
    Vue.component(ImageCropper.name, ImageCropper);
};

export default ImageCropper;
