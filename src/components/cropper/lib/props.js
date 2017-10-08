const props = {
    classes: {
        type    : String,
        required: false,
        default : 'vsc-cropper',
    },
    url: {
        type    : String,
        required: true,
    },
    text: {
        type   : String,
        default: 'Upload Image',
    },
    extensions: {
        type   : String,
        default: 'png,jpg,jpeg,gif,svg,webp',
    },
    inputOfFile: {
        type   : String,
        default: 'files',
    },
    crop: {
        type   : [String, Boolean],
        default: '',
    },
    cropBtn: {
        type: Object,
        default() {
            return {
                ok    : 'Ok',
                cancel: 'Cancel',
            };
        },
    },
    cropRatio: {
        type   : String,
        default: '1:1',
    },
    resize: {
        type   : [String, Boolean],
        default: false,
    },
    rotate: {
        type   : Boolean,
        default: true,
    },
    ResizeBtn: {
        type: Object,
        default() {
            return {
                ok    : 'Ok',
                cancel: 'Cancel',
            };
        },
    },
    maxFileSize: {
        type   : Number,
        default: 1024 * 1024 * 100,
    },
    maxWidth: {
        type: Number,
    },
    maxHeight: {
        type: Number,
    },
    inputAccept: {
        type   : String,
        default: 'image/jpg,image/jpeg,image/png,image/gif',
    },
    isXhr: {
        type   : Boolean,
        default: true,
    },
    headers: {
        type: Object,
        default() {
            return {};
        },
    },
    data: {
        type: Object,
        default() {
            return {};
        },
    },
    multiple: {
        type   : Boolean,
        default: false,
    },
    multipleSize: {
        type   : Number,
        default: 0,
    },
    minWidth: {
        type   : Number,
        default: 50,
    },
    compress: {
        type   : [Number, String],
        default: 0,
    },
    credentials: {
        type   : [String, Boolean],
        default: true,
    },
};

export default props;
