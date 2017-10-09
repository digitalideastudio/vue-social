<template>
    <div class="vsc-schedule-picker">
        <div class="shift-wrapper">
            <div class="shift-progress progress-10">
                <div class="label">2/13</div>
            </div>
            <div class="date">Oct 4</div>
        </div>
        <div class="shift-wrapper no-space">
            <div class="shift-progress progress-100">
                <div class="label">13/13</div>
            </div>
            <div class="date">Oct 11</div>
        </div>
        <div class="shift-wrapper">
            <div class="shift-progress progress-45">
                <div class="label">6/13</div>
            </div>
            <div class="date">Oct 18</div>
        </div>
        <div class="shift-wrapper">
            <div class="shift-progress progress-90">
                <div class="label">12/13</div>
            </div>
            <div class="date">Oct 25</div>
        </div>
        <div class="shift-wrapper">
            <div class="shift-progress progress-5">
                <div class="label">1/13</div>
            </div>
            <div class="date">Nov 1</div>
        </div>
        <div class="shift-wrapper no-space">
            <div class="shift-progress progress-100">
                <div class="label">13/13</div>
            </div>
            <div class="date">Nov 8</div>
        </div>
        <div class="shift-wrapper">
            <div class="shift-progress progress-10">
                <div class="label">10/13</div>
            </div>
            <div class="date">Oct 4</div>
        </div>
        <div class="shift-wrapper sample-shift selected">
            <div class="shift-progress progress-45" style="background-image: linear-gradient(90deg, #e6e7e8 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(168deg, #2196F3 50%, #e6e7e8 50%, #eaeae8);">
                <div class="label before">2/13</div>
                <div class="label after">6/13</div>
            </div>
            <div class="date">Oct 18</div>
        </div>
    </div>
</template>

<script>
    const SchedulePicker = {
        name: 'schedule-picker',
    };
    export default SchedulePicker;
</script>

<style>
    .vsc-schedule-picker {
        padding: 10px 50px;
    }
</style>