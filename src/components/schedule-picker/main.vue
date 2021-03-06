<template>
    <div :class="classes">
        <div :key="shift.id"
             class="vsc-sp-shift-wrapper"
             :class="getShiftClasses(shift)"
             @click="toggleShift(shift)"
             v-for="shift in schedule">
            <div :class="progress-`${calculateProgress(shift)}`"
                 class="vsc-sp-shift-progress">
                <div class="vsc-sp-label">{{ shift.actual }}{{ divider }}{{ shift.max }}</div>
            </div>
            <div class="vsc-sp-date">{{ shift.date }}</div>
        </div>
    </div>
</template>

<script>
    const SchedulePicker = {
        name : 'schedule-picker',
        props: {
            classes: {
                type    : String,
                required: false,
                default : 'vsc-schedule-picker',
            },
            schedule: {
                type    : Array,
                required: false,
                default() {
                    return [];
                },
            },
            divider: {
                type    : String,
                required: false,
                default : '/',
            },
            incrementNumber: {
                type    : Number,
                required: false,
                default : 0,
            },
        },
        data() {
            return {
                shifts: [],
            };
        },
        methods: {
            getShiftClasses(shift) {
                const noPositions = (shift.max - shift.actual) <= 0 ? 'vsc-sp-no-positions' : '';
                const isSelected = this.shifts.filter(s => s.id === shift.id).length ? 'vsc-sp-selected' : '';

                return `${noPositions} ${isSelected}`;
            },
            calculateProgress(shift) {
                const percentage = (shift.max / 100) * shift.actual;
                // Round to the closest /5 divider
                return parseInt(percentage / 5, 0) * 5;
            },
            toggleShift(shift) {
                const idx = this.shifts.indexOf(shift);
                let incrementNumber = this.incrementNumber;

                if (idx === -1) {
                    this.shifts.push(shift);
                } else {
                    incrementNumber *= -1;
                    this.shifts.splice(idx, 1);
                }

                Object.assign(shift, {
                    actual: shift.actual + incrementNumber,
                });
            },
        },
    };
    export default SchedulePicker;
</script>

<style>
    .vsc-schedule-picker {
        padding : 10px 50px;
    }

    .vsc-sp-shift-wrapper {
        width        : 35px;
        display      : inline-block;
        cursor       : pointer;
        margin-right : 20px;
    }

    .vsc-sp-shift-wrapper.selected {
        width        : 35px;
        display      : inline-block;
        cursor       : pointer;
        margin-right : 20px;
    }

    .vsc-sp-shift-progress {
        width         : 34px;
        height        : 34px;
        text-align    : center;
        position      : relative;
        border-radius : 50%;
        border        : 1px solid #fff;
        transition    : background-color .5s;
    }

    .vsc-sp-shift-wrapper.vsc-sp-selected .vsc-sp-shift-progress {
        background-image: linear-gradient(90deg, #e6e7e8 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(168deg, #2196F3 50%, #FFEB3B 50%, #FFEB3B) !important;
    }

    .vsc-sp-label {
        position         : absolute;
        width            : 28px;
        height           : 28px;
        background-color : #fffde8;
        border-radius    : 50%;
        margin-left      : 2px;
        margin-top       : 2px;
        text-align       : center;
        line-height      : 30px;
        font-size        : 9px;
    }

    .vsc-sp-date {
        font-size: 10px;
        text-align: center;
        line-height: 12px;
        background: #e6e7e894;
        padding: 4px 2px 2px;
        margin-top: -4px;
        border: 1px solid #e6e7e8;
    }

    .vsc-sp-shift-wrapper.vsc-sp-selected .vsc-sp-date {
        background-color : #03A9F4;
        border-color     : #2196F3;
    }

    .vsc-sp-no-positions {
        color  : #cac8c8;
        cursor : not-allowed;
    }

    .progress-0 {
        background-image : linear-gradient(90deg, #2f3439 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(90deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-5 {
        background-image : linear-gradient(90deg, #2f3439 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(108deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-10 {
        background-image : linear-gradient(90deg, #2f3439 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(126deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-15 {
        background-image : linear-gradient(90deg, #2f3439 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(144deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-20 {
        background-image : linear-gradient(90deg, #2f3439 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(162deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-25 {
        background-image : linear-gradient(90deg, #2f3439 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(180deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-30 {
        background-image : linear-gradient(90deg, #2f3439 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(198deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-35 {
        background-image : linear-gradient(90deg, #2f3439 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(216deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-40 {
        background-image : linear-gradient(90deg, #2f3439 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(234deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-45 {
        background-image : linear-gradient(90deg, #2f3439 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(252deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-50 {
        background-image : linear-gradient(-90deg, #ff6347 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(270deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-55 {
        background-image : linear-gradient(-72deg, #ff6347 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(270deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-60 {
        background-image : linear-gradient(-54deg, #ff6347 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(270deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-65 {
        background-image : linear-gradient(-36deg, #ff6347 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(270deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-70 {
        background-image : linear-gradient(-18deg, #ff6347 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(270deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-75 {
        background-image : linear-gradient(0deg, #ff6347 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(270deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-80 {
        background-image : linear-gradient(18deg, #ff6347 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(270deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-85 {
        background-image : linear-gradient(36deg, #ff6347 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(270deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-90 {
        background-image : linear-gradient(54deg, #ff6347 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(270deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-95 {
        background-image : linear-gradient(72deg, #ff6347 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(270deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

    .progress-100 {
        background-image : linear-gradient(90deg, #ff6347 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(270deg, #ff6347 50%, #2f3439 50%, #2f3439);
    }

</style>