<template>
    <div :class="classes" ref="coverImage" :style="{ height: `${height}px` }">
        <div class="pixelation" :style="{ height: `${height}px` }"></div>
        <slot name="start"></slot>
        <div class="title-wrapper">
            <slot name="before-subtitle"></slot>
            <div class="title" v-text="title"></div>
            <div class="subtitle" v-text="subtitle" v-if="subtitle"></div>
            <slot name="after-subtitle"></slot>
        </div>
        <div class="actions" v-if="actions.length">
            <button :key="action.name"
                    @click.prevent="$emit('click', action.name)"
                    @mouseover="$emit('mouseover', action.name)"
                    v-for="action in actions"
            >
                <i class="fa fa-fw" :class="action.icon" v-if="action.icon"></i>&nbsp;
                <span>{{ action.title }}</span>
            </button>
        </div>
        <slot name="end"></slot>
    </div>
</template>

<script>
    const CoverImage = {
        name : 'cover-image',
        props: {
            classes: {
                type    : String,
                required: false,
                default : 'vsc-cover-image',
            },
            background: {
                type    : String,
                required: false,
                default : '',
            },
            height: {
                type    : Number,
                required: false,
                default : 230,
            },
            title: {
                type    : String,
                required: false,
                default : 'Example Title',
            },
            subtitle: {
                type    : String,
                required: false,
                default : '',
            },
            actions: {
                type    : Array,
                required: false,
                default() {
                    return [];
                },
            },

        },
        data() {
            return {};
        },
    };
    export default CoverImage;
</script>

<style scoped>
    .vsc-cover-image {
        align-items     : center;
        background      : center center no-repeat;
        background-size : cover;
        display         : flex;
        position        : relative;
        width           : 100%;
    }

    .pixelation {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2r9//38gYGAEESAAEGAAasgJOgzOKCoAAAAASUVORK5CYII=);
        position        : absolute;
        width           : 100%;
    }

    .title-wrapper {
        align-items    : center;
        color          : #fff;
        display        : flex;
        flex-direction : column;
        z-index        : 1;
    }

    .title {
        font-size   : 52px;
        font-weight : 400;
        line-height : 50px;
    }

    .subtitle {
        font-size : 18px;
    }

    .actions {
        bottom   : 15px;
        position : absolute;
        right    : 15px;
    }

    .actions button {
        background-color : #ff9800;
        border-color     : #ff9800;
        border-radius    : 2px;
        color            : #fff;
        cursor           : pointer;
        margin-right     : 10px;
    }

    .actions button:last-child {
        margin-right: 0;
    }
</style>
