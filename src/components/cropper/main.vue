<template>
    <div class="vsc-cropper">
        <slot>{{ text }}</slot>
        <form class="vsc-cropper-form"
              v-show="!hasImage"
              method="post"
              enctype="multipart/form-data"
        >
            <input :disabled="uploading" :id="'g-core-upload-input-' + formID" :name="name"
                   :multiple="multiple" type="file" :accept="inputAccept" @change="change"
                   style="width: 100%; height: 100%;">
        </form>
        <div class="g-core-image-corp-container" :id="'vciu-modal-' + formID" v-show="hasImage">
            <crop ref="cropBox" :is-resize="resize && !crop" :ratio="cropRatio" :is-rotate="rotate"></crop>
            <div class="info-aside">
                <p class="btn-groups" v-if="crop">
                    <button type="button" @click="doCrop" class="btn btn-upload">{{ cropBtn.ok }}</button>
                    <button type="button" @click="cancel" class="btn btn-cancel">{{ cropBtn.cancel }}</button>
                </p>
                <p class="btn-groups" v-if="resize && !crop">
                    <button type="button" @click="doResize" class="btn btn-upload">{{ ResizeBtn.ok }}</button>
                    <button type="button" @click="cancel" class="btn btn-cancel">{{ ResizeBtn.cancel }}</button>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import xhr from 'core-image-xhr';
    import GIF_LOADING_SRC from './lib/loading-gif';
    import canvasHelper from './lib/canvas-helper';
    import props from './props';
    import Crop from './crop.vue';
    import ResizeBar from './resize-bar.vue';

    let overflowVal = '';
    export default {
        name      : 'cropper',
        components: {
            Crop,
            ResizeBar,
        },
        props,
        data() {
            return {
                files    : [],
                hasImage : false,
                options  : this.props,
                uploading: false,
                formID   : (`${(Math.random() * 10000)}`).split('.')[0],
                image    : {
                    src        : GIF_LOADING_SRC,
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
                const dq = document.querySelector(`#vciu-modal-${this.formID}`);
                return dq.querySelector(str);
            },
            change(e) {
                this.dispatch('changing', e);
                const fileVal = document.querySelector(`#g-core-upload-input-${this.formID}`).value.replace(/C:\\fakepath\\/i, '');
                const fileExt = fileVal.substring(fileVal.lastIndexOf('.') + 1);
                const extensionsArr = this.extensions.split(',');
                if (extensionsArr.length > 1) {
                    const reg = new RegExp(`^[${extensionsArr.join('|')}]+$`, 'i');

                    if (!reg.test(fileExt)) {
                        return this.dispatch('errorhandle', {
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
                    return this.dispatch('errorhandle', {
                        code       : 'INVALID_SIZE',
                        description: `File is too large. Max file size is ${formatSize}`,
                    });
                }

                this.files = e.target.files;
                if (this.crop || this.resize) {
                    this.showImage();
                    return true;
                }

                this.dispatch('imagechanged', this.files.length > 1 ? this.files : this.files[0]);

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
                this.dispatch('filereading', { self });
                reader.onload = function readerOnload(e) {
                    const src = e.target.result;
                    this.dispatch('fileread', { src, self });
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
                this.dispatch('imageloading', { pic, self });
                pic.src = src;
                const cropBox = this.$refs.cropBox;
                pic.onload = function picOnload() {
                    self.image.minProgress = self.minWidth / pic.naturalWidth;
                    self.imgChangeRatio = cropBox.setImage(src, pic.naturalWidth, pic.naturalHeight);
                    this.dispatch('imageloaded', { pic, self });
                }.bind(this);
            },

            resizeImage(progress) {
                const cropBox = this.$refs.cropBox;
                cropBox.resizeImage(progress);
            },

            doCrop(e) {
                this.setData('crop');
                const cropBox = this.$refs.cropBox;
                const upload = this.setUpload(e.target);

                if (this.crop === 'local') {
                    const targetImage = cropBox.getCropImage();
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
                const cropBox = this.$refs.cropBox;
                const upload = this.setUpload(e.target);
                if (this.resize === 'local') {
                    const targetImage = cropBox.getCropImage();
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
                const cropBox = this.$refs.cropBox;
                const newCSSObj = cropBox.getCropData();

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
                document.querySelector(`#g-core-upload-input-${this.formID}`).value = '';
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
    };
</script>

<style scoped>
    .vsc-cropper {
        overflow : hidden;
        position : relative;
    }

    .vsc-cropper-form {
        bottom   : 0;
        cursor   : pointer;
        display  : block;
        height   : 61px;
        left     : 0;
        margin   : 0;
        opacity  : 0;
        overflow : hidden;
        padding  : 0;
        position : absolute;
        right    : 0;
        top      : 0;
        width    : 1242px;
    }
</style>
