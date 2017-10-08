import CoverImage from './main.vue';

/* istanbul ignore next */
CoverImage.install = function CoverImageInstall(Vue) {
    Vue.component(CoverImage.name, CoverImage);
};

export default CoverImage;
