<template>
  <div id="app">
    <file-load></file-load>
  </div>
</template>

<script>
import FileLoad from './components/file-load/FileLoad'

export default {
  name: 'app',
  components: {
    FileLoad
  }
}
</script>

<style lang="scss">
  #app {
    padding: 1em;
  }
</style>
