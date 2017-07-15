<template>
  <div class="progress-bar">
    <div class="string-indicator">
      <span>{{ progress }}%</span>
    </div>
    <div class="progress-percent" :style="{ width: progress + '%' }">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'progress-bar',

    props: {
      progress: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style lang="scss">
  @import "~styles";

  .progress-bar {
    border: 1px solid color(primary-light);
    box-sizing:border-box;
    width: 100%;
    height: 2em;
    position: relative;

    .string-indicator {
      position: absolute;
      left: 0;
      color: white;
      height: 100%;
      display: flex;
      align-items: center;
      margin: 0 .5em;

      span {
        text-shadow: 0px 0px 4px rgba(0, 0, 0, 1);
      }
    }

    .progress-percent {
      // width: 50%;
      height: 100%;
      background-color: color(primary);
    }
  }
</style>
