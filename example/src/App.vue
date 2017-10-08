<template>
    <div id="app">
        <cropper url="http://localhost:8082/" crop="local">
            <i class="fa fa-camera-retro fa-fw" aria-hidden="true"></i>
        </cropper>
    </div>
</template>

<script>
    import Cropper from '../../src/components/cropper';

    export default {
        name      : 'app',
        components: {
            Cropper,
        },
    };
</script>

<style lang="scss" scoped>
    #app {
        font-family             : 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing  : antialiased;
        -moz-osx-font-smoothing : grayscale;
        text-align              : center;
        color                   : #2c3e50;
        margin-top              : 60px;
    }
</style>
