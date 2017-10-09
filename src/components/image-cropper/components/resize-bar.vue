<template>
    <div class="vsc-resize-bar">
        <div :style="{ width: left + '%' }" class="vsc-resize-highlight"></div>
        <button :style="{ left: left + '%' }"
                @mousedown.self="drag"
                @touchstart.self="drag"
                class="circle-btn"
                type="button"
        ></button>
    </div>
</template>

<script>
    import { isMobile } from '../lib/helper';
    import drag from '../lib/drag';

    const ResizeBar = {
        props: {
            minProgress: {
                type   : [Number, String],
                default: 0,
            },
        },
        data() {
            return {
                progress: 100,
                left    : 100,
            };
        },
        methods: {
            setProgress(num) {
                this.left = num;
            },

            drag(e) {
                e.preventDefault();
                e.stopPropagation();

                const $el = e.target;
                this.el = $el;
                const $container = this.$el.parentElement;
                const self = this;
                const width = 200;

                const coor = {
                    x      : (isMobile ? e.touches[0].clientX : e.clientX) - $el.offsetLeft,
                    y      : (isMobile ? e.touches[0].clientY : e.clientY) - $el.offsetTop,
                    maxLeft: width,
                    maxTop : parseInt($container.style.height, 2) - parseInt($el.style.height, 2),
                    minLeft: 0,
                    minTop : 0,
                };

                const move = function move(ev) {
                    const newCoor = drag(ev, self.el, coor);
                    if (newCoor) {
                        if ((newCoor.left / width) < self.minProgress) {
                            return;
                        }
                        self.progress = newCoor.left / width;
                        self.left = (newCoor.left / width) * 100;

                        self.$emit('resize', self.progress);
                    }
                };

                const stopMove = function stopMove() {
                    self.el = null;
                    if (isMobile) {
                        document.removeEventListener('touchmove', move, false);
                        document.removeEventListener('touchend', stopMove, false);
                        return;
                    }
                    document.removeEventListener('mousemove', move, false);
                    document.removeEventListener('mouseup', stopMove, false);
                };

                if (isMobile) {
                    document.addEventListener('touchmove', move, false);
                    document.addEventListener('touchend', stopMove, false);
                    return;
                }

                document.addEventListener('mousemove', move, false);
                document.addEventListener('mouseup', stopMove, false);
            },
        },
    };

    export default ResizeBar;
</script>

<style scoped>
    .vsc-resize-bar {
        position: absolute;
        bottom: 0px;
        height: 6px;
        border-radius: 3px;
        width: 200px;
        margin: 17px auto 17px -100px;
        left: 50%;
        background-color: #a8f9ca;
        box-shadow: 0 2px 3px -1px rgba(0, 0, 0, .3);
    }

    .vsc-resize-highlight {
        position: absolute;
        left: 0;
        top: 0;
        height: 6px;
        background-color: #27ae60;
        border-radius: 3px;
    }

    .circle-btn {
        display: block;
        position: absolute;
        left: 0;
        top: -5px;
        width: 14px;
        height: 14px;
        margin-left: -7px;
        background-color: #fff;
        border-radius: 7px;
        box-shadow: 0 2px 3px -2px rgba(0, 0, 0, .6), 0 -2px 3px -2px rgba(0, 0, 0, .55);
        border-width: 0;
        z-index: 99999;
    }
</style>
