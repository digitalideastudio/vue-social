<template>
    <div class="vsc-rotate-bar">
        <a @click="rotateLeft">
            <svg class="svg-icon" viewBox="0 0 481.95 481.95">
                <path :d="config.icons.rotateLeft" fill="#27ae60"></path>
            </svg>
        </a>
        <a @click="rotateRight">
            <svg class="svg-icon" viewBox="0 0 481.95 481.95">
                <path :d="config.icons.rotateRight" fill="#27ae60"></path>
            </svg>
        </a>
    </div>
</template>

<script>
    import config from '../lib/config';

    export default {
        data() {
            return {
                config      : config.resizeBar,
                rotateDegree: 0,
            };
        },

        methods: {
            rotateRight() {
                this.rotateDegree += 90;
                this.$emit('rotate', this.rotateDegree);
            },

            rotateLeft() {
                this.rotateDegree -= 90;
                this.$emit('rotate', this.rotateDegree);
            },
        },
    };
</script>

<style scoped>
    .vsc-rotate-bar {
        position: absolute;
        bottom: 30px;
        left: 0;
        right: 0;
        text-align: center;
        z-index: 99999;
    }

    .svg-icon {
        display: inline-block;
        width: 1.2em;
        height: 1.2em;
        margin: 0 2em;
    }
</style>
