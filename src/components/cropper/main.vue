<template>
    <div :class="classes">
        <span class="vsc-cropper-label">
            <slot>{{ text }}</slot>
        </span>
        <form class="vsc-cropper-form"
              enctype="multipart/form-data"
              method="post"
              v-show="!hasImage"
        >
            <input :disabled="uploading"
                   :accept="inputAccept"
                   :multiple="multiple"
                   :name="name"
                   @change="change"
                   class="vsc-cropper-input"
                   :style="{ width: `${100 + inputWidth}px` }"
                   ref="input"
                   type="file"
            >
        </form>
        <div class="vsc-cropper-container"
             ref="container"
             v-show="hasImage"
        >
            <crop :is-resize="resize && !crop"
                  :is-rotate="rotate"
                  :ratio="cropRatio"
                  ref="crop"
            ></crop>
            <div class="btn-wrapper">
                <p class="btn-group"
                   v-if="crop">
                    <button @click="doCrop"
                            class="btn btn-upload"
                            type="button">{{ cropBtn.ok }}
                    </button>
                    <button type="button" @click="cancel" class="btn btn-cancel">{{ cropBtn.cancel }}</button>
                </p>
                <p class="btn-group" v-if="resize && !crop">
                    <button type="button" @click="doResize" class="btn btn-upload">{{ ResizeBtn.ok }}</button>
                    <button type="button" @click="cancel" class="btn btn-cancel">{{ ResizeBtn.cancel }}</button>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import xhr from 'core-image-xhr';
    import config from './lib/config';
    import canvasHelper from './lib/canvas-helper';
    import props from './lib/props';
    import Crop from './components/crop.vue';

    let overflowVal = '';
    export default {
        name      : 'cropper',
        components: {
            Crop,
        },
        props,
        data() {
            return {
                inputWidth: 0,
                files     : [],
                hasImage  : false,
                options   : this.props,
                uploading : false,
                image     : {
                    src        : config.loadingGif,
                    width      : 24,
                    height     : 24,
                    minProgress: 0.05,
                },
            };
        },

        computed: {
            name() {
                if (this.multiple) {
                    return `${this.inputOfFile}[]`;
                }
                return this.inputOfFile;
            },
        },

        methods: {
            dispatch(name, res) {
                if (this.$emit) {
                    this.$emit(name, res);
                }
            },
            find(str) {
                return this.$refs.container.querySelector(str);
            },
            change(e) {
                this.dispatch('changing', e);
                const fileVal = this.$refs.input.value.replace(/C:\\fakepath\\/i, '');
                const fileExt = fileVal.substring(fileVal.lastIndexOf('.') + 1);
                const extensionsArr = this.extensions.split(',');
                if (extensionsArr.length > 1) {
                    const reg = new RegExp(`^[${extensionsArr.join('|')}]+$`, 'i');

                    if (!reg.test(fileExt)) {
                        return this.dispatch('error', {
                            code       : 'INVALID_TYPE',
                            description: 'Invalid file type',
                        });
                    }
                }

                if (e.target.files[0].size > this.maxFileSize) {
                    let formatSize;
                    if (parseInt(this.maxFileSize / 1024 / 1024, 0) > 0) {
                        formatSize = `${(this.maxFileSize / 1024 / 1024).toFixed(2)}MB`;
                    } else if (parseInt(this.maxFileSize / 1024, 0) > 0) {
                        formatSize = `${(this.maxFileSize / 1024).toFixed(2)}kB`;
                    } else {
                        formatSize = `${this.options.maxFileSize.toFixed(2)}Byte`;
                    }
                    return this.dispatch('error', {
                        code       : 'INVALID_SIZE',
                        description: `File is too large. Max file size is ${formatSize}`,
                    });
                }

                this.files = e.target.files;
                if (this.crop || this.resize) {
                    this.showImage();
                    return true;
                }

                this.dispatch('changed', this.files.length > 1 ? this.files : this.files[0]);

                if (this.compress && this.files[0].type !== 'image/png' && this.files[0].type !== 'image/gif') {
                    canvasHelper.compress(this.files[0], 100 - this.compress, (code) => {
                        this.tryAjaxUpload('', true, code);
                    });
                } else {
                    this.tryAjaxUpload();
                }

                return true;
            },
            showImage() {
                this.hasImage = true;
                this.readFiles();
            },

            readFiles() {
                const reader = new FileReader();
                const self = this;
                this.dispatch('file_reading', { self });
                reader.onload = function readerOnload(e) {
                    const src = e.target.result;
                    this.dispatch('file_read', { src, self });
                    overflowVal = document.body.style.overflow;
                    document.body.style.overflow = 'hidden';
                    self.initImage(src);
                }.bind(this);
                reader.readAsDataURL(this.files[0]);
            },

            // set the image size
            initImage(src) {
                const pic = new Image();
                const self = this;
                this.dispatch('image_loading', { pic, self });
                pic.src = src;
                const crop = this.$refs.crop;
                pic.onload = function picOnload() {
                    self.image.minProgress = self.minWidth / pic.naturalWidth;
                    self.imgChangeRatio = crop.setImage(src, pic.naturalWidth, pic.naturalHeight);
                    this.dispatch('image_loaded', { pic, self });
                }.bind(this);
            },

            resizeImage(progress) {
                const crop = this.$refs.crop;
                crop.resizeImage(progress);
            },

            doCrop(e) {
                this.setData('crop');
                const crop = this.$refs.crop;
                const upload = this.setUpload(e.target);

                if (this.crop === 'local') {
                    const targetImage = crop.getCropImage();
                    this.data.comprose = 100 - this.compress;
                    return canvasHelper.crop(targetImage, this.data, (code) => {
                        upload(code);
                        this.dispatch('imagechanged', code);
                    });
                }
                return upload();
            },

            doResize(e) {
                this.setData('resize');
                const crop = this.$refs.crop;
                const upload = this.setUpload(e.target);
                if (this.resize === 'local') {
                    const targetImage = crop.getCropImage();
                    this.data.comprose = 100 - this.compress;
                    return canvasHelper.resize(targetImage, this.data, (code) => {
                        upload(code);
                        this.dispatch('imagechanged', code);
                    });
                }
                return upload();
            },

            setData(type) {
                if (typeof this.data !== 'object') {
                    this.data = {};
                }
                this.data.request = type;
                const crop = this.$refs.crop;
                const newCSSObj = crop.getCropData();

                Object.keys(newCSSObj).forEach((k) => {
                    this.data[k] = newCSSObj[k];
                });

                if (this.maxWidth) {
                    this.data.maxWidth = this.maxWidth;
                }
                if (this.maxHeight) {
                    this.data.maxHeight = this.maxHeight;
                }
                if (this.minWidth) {
                    this.data.minWidth = this.minWidth;
                }

                console.log(this.data);
                console.log(newCSSObj);
            },

            setUpload(btn) {
                Object.assign(btn, {
                    value   : `${btn.value}...`,
                    disabled: true,
                });
                return (code) => {
                    this.tryAjaxUpload(() => {
                        Object.assign(btn, {
                            value   : btn.value.replace('...', ''),
                            disabled: false,
                        });
                    }, !!code, code);
                };
            },

            cancel() {
                this.dispatch('cancelled');
                this.hasImage = false;
                document.body.style.overflow = overflowVal;
                this.files = '';
                this.$refs.input.value = '';
            },

            // use ajax upload  IE10+
            tryAjaxUpload(callback, isBinary, base64Code) {
                const self = this;
                this.dispatch('imageuploading', this.files[0]);
                const done = function done(res) {
                    if (typeof callback === 'function') {
                        callback();
                    }
                    self.uploading = false;
                    self.cancel();
                    self.dispatch('imageuploaded', res);
                };
                const errorUpload = function errorUpload(err) {
                    self.dispatch('errorhandle', err);
                };

                if (!this.isXhr) {
                    if (this.crop) {
                        this.hasImage = false;
                    }
                    return typeof callback === 'function' && callback();
                }

                let data;
                if (isBinary) {
                    data = {
                        type    : this.files[0].type,
                        filename: this.files[0].name,
                        filed   : this.inputOfFile,
                        base64Code,
                    };

                    if (typeof this.data === 'object') {
                        data = Object.assign(this.data, data);
                    }
                } else {
                    data = new FormData();
                    for (let i = 0; i < this.files.length; i += 1) {
                        data.append(this.name, this.files[i]);
                    }
                    if (typeof this.data === 'object') {
                        Object.keys(this.data).forEach((k) => {
                            if (this.data[k] !== undefined) {
                                data.append(k, this.data[k]);
                            }
                        });
                    }
                }

                return xhr('POST', this.url, this.headers, data, done, errorUpload, isBinary, this.credentials);
            },
        },
        mounted() {
            this.inputWidth = this.$el.clientWidth;
        },
    };
</script>

<style scoped>
    .vsc-cropper {
        overflow : hidden;
        position : relative;
        display  : inline-block;
    }

    .vsc-cropper-form {
        bottom   : 0;
        cursor   : pointer;
        display  : block;
        left     : 0;
        margin   : 0;
        opacity  : 0;
        overflow : hidden;
        padding  : 0;
        position : absolute;
        right    : 0;
        top      : 0;
    }

    .vsc-cropper-input {
        bottom   : 0;
        cursor   : pointer;
        left     : -100px;
        position : absolute;
        right    : 0;
        top      : 0;
    }

    .vsc-cropper-container {
        background : rgba(0, 0, 0, .9);
        bottom     : 0;
        color      : #f1f1f1;
        left       : 0;
        position   : fixed;
        right      : 0;
        top        : 0;
        z-index    : 1900;
    }

    .btn-wrapper {
        background    : #fefefe;
        color         : #777;
        height        : 40px;
        left          : 0;
        padding-left  : 10px;
        padding-right : 10px;
        position      : absolute;
        right         : 0;
        top           : 0;
    }

    .btn-group {
        text-align : right;
        margin     : 5px 0 0;
    }

    .btn {
        background    : #fff;
        border        : 1px solid #ccc;
        border-radius : 2px;
        color         : #222;
        display       : inline-block;
        font-size     : 13px;
        height        : 32px;
        line-height   : 32px;
        margin-left   : 15px;
        padding       : 0 15px;
        transition    : all .1s ease-in;
    }

    .btn:active {
        background : #ddd;
    }

    .btn:hover {
        border     : 1px solid #777;
        box-shadow : 0 1px 3px rgba(0, 0, 0, .05);
    }

    .btn:disabled {
        background   : #eee !important;
        border-color : #ccc;
        cursor       : not-allowed;
    }

    .btn-upload {
        background   : #27ae60;
        border-color : #27ae60;
        color        : #fff;
    }

    .btn-upload:hover {
        background   : #2dc26c;
        border-color : #27ae60;
        box-shadow   : 0 1px 3px rgba(0, 0, 0, .05);
    }
</style>
