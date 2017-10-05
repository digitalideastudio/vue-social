<template>
      <div class="user-ava-medallions">
            <a
                class  = "medallion__box"
                :class = "{'medallion__box--transition':transition}"
                v-for  = "(item, index) in volunteers"
                v-if   = "index < thisCount"
                :key   = "item.id"
                :href  = "item.name ? item.url : 'javascript:void(0)'"
            >
                <template v-if="item.name ">
                    <div class="medallion"
                         v-if="item.profile_photo"
                         :class="{'medallion--transition':transition}"
                         :style = "{'background-image': `url(${item.profile_photo})`}"
                    ></div>
                    <div v-else
                         class="medallion medallion__no-profile-photo"
                         :style = "{'background-color': randomBackgroundColor(item.name, backgroundColors)}"
                    >{{initial(item.name)}}</div>
                    <div class="medallion__tooltip">
                        {{item.name}}
                        <div class="tooltip-diamond"></div>
                    </div>
                </template>
                <template v-else>
                    <div class="medallion medallion__no-name"
                         :class="{'medallion--transition':transition}"
                         :style = "{'background-color': randomBackgroundColor(item.name, backgroundColors)}"
                    >@</div>
                    <div class="medallion__tooltip">
                        {{item.email}}
                        <div class="tooltip-diamond"></div>
                    </div>
                </template>
            </a>
            <div class="medallion__box">
                <div class="medallion medallion--last"
                   :class="[medallionClass, {'medallion--transition':transition}]"
                   v-if = "volunteers.length > thisCount"
                >+{{volunteers.length-thisCount}}</div>
                <div class="medallion__tooltip medallion-tooltip">
                    <a class="medallion-tooltip__item"
                       v-for  = "(item, index) in volunteers"
                       v-if   = "index >= thisCount"
                       :key   = "item.id"
                       :href  = "item.url"
                    >
                        {{item.name}}
                    </a>
                    <div class="tooltip-diamond"></div>
                </div>
            </div>
      </div>
</template>

<script>

    const UserAvaMedals = {
        props: {
            volunteers: {
//                type    : [],
//                required: true,
            },
            thisCount: {
                type   : Number,
                default: 8,
            },
            transition: {
                type   : Boolean,
                default: true,
            },
            theme: {
                type   : String,
                default: 'info',
            },
        },
        data() {
            return {
                medallionClass  : `medallion--${this.theme}`,
                backgroundColors: [
                    '#F44336',
                    '#FF4081',
                    '#9C27B0',
                    '#673AB7',
                    '#3F51B5',
                    '#2196F3',
                    '#03A9F4',
                    '#00BCD4',
                    '#009688',
                    '#4CAF50',
                    '#8BC34A',
                    '#CDDC39',
                    '#FFC107',
                    '#FF9800',
                    '#FF5722',
                    '#9E9E9E',
                    '#607D8B'],
            };
        },
        computed: {
            // background() {
            //    return this.backgroundColor ||
            //       this.randomBackgroundColor(this.username.length, this.backgroundColors);
            // },
        },
        methods: {
            randomBackgroundColor(seed, colors) {
                return colors[seed % (colors.length)];
            },
            initial(username) {
                const parts = username.split(/[ -]/);
                let initials = '';

                for (let i = 0; i < parts.length; i += 1) {
                    initials += parts[i].charAt(0);
                }

                if (initials.length > 3 && initials.search(/[A-Z]/) !== -1) {
                    initials = initials.replace(/[a-z]+/g, '');
                }

                initials = initials.substr(0, 3).toUpperCase();

                return initials;
            },
        },
    };
    export default UserAvaMedals;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import './scss/_theme.scss';

  .user-ava-medallions {
      align-items: center;
      display: flex;
      justify-content: center;
      padding: 8px 0;
      position: relative;
  }

  .medallion {
      background: center center no-repeat $grey-light;
      border: 2px solid $background-light;
      border-radius: 100%;
      height: 28px;
      // margin-left: -10px;
      transition: all .3s;
      width: 28px;
      &__box {
          align-items: center;
          cursor: pointer;
          display: flex;
          height: 32px;
          justify-content: center;
          margin-left: -10px;
          position: relative;
          transition: all .3s ease;
          &:first-child {
              margin-left: 0;
          }
      }
      &--last {
          @include fnt($text-invert, 10px, $weight-bold, center);
          align-items: center;
          background-color: $info;
          display: flex;
          justify-content: center;
          margin-left: -10px;
          transition: all .4s ease;
          z-index: 10;
      }

      @each $name, $pair in $colors {
          $color: nth($pair, 1);
          $color-invert: nth($pair, 2);
          &--#{$name} {
              background-color: $color;
              color: $color-invert;
          }

      }

      &__tooltip {
          @include fnt($text-invert, 9px, $weight-light, center);
          align-items: center;
          background-color: $grey-dark;
          border-radius: 3px;
          bottom: 36px;
          display: none;
          justify-content: center;
          padding: 4px 8px;
          position: absolute;
          white-space: nowrap;
          z-index: 2;
      }
      &__box:hover &__tooltip {
          display: flex;
          align-items: flex-start;
      }
      &__no-profile-photo {
          @include fnt($text-invert, $size-7, $weight-bold, center);
          align-items: center;
          display: flex;
          justify-content: center;
      }
      &__no-name {
          @include fnt($text-invert, $size-7, $weight-bold, center);
          align-items: center;
          display: flex;
          justify-content: center;
      }
  }
  .medallion-tooltip {
      //display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 14px 8px;

      &__item {
          @include fnt($text-invert, 9px, $weight-light, left);
          cursor: pointer;
      }
  }

  .tooltip-diamond {
      @include deg45;
      background-color: $grey-dark;
      bottom: -4px;
      height: 8px;
      left: 43%;
      position: absolute;
      width: 8px;
      z-index: 1;
  }

  .user-ava-medallions:hover .medallion--transition {
      margin-left: 0;
      transition: all .3s ease;
  }

  .user-ava-medallions:hover .medallion__box--transition {
      margin-left: 0;
      transition: all .4s ease;
  }
</style>