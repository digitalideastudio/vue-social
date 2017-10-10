import Vue from 'vue';
import CoverImage from '@/components/CoverImage';

describe('CoverImage.vue', () => {
    it('should render correct contents', () => {
        const Constructor = Vue.extend(CoverImage);
        const vm = new Constructor().$mount();
        expect(vm.$el.querySelector('.hello h1').textContent)
            .to.equal('Welcome to Your Vue.js App');
    });
});
