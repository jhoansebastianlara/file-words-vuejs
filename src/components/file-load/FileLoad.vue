<template>
  <div class="upload-zone">
    <div v-if="!supportsFileAPI" class="error-message">
      <h2>{{ $('global.files_api_not_supported') }}</h2>
    </div>
    <div v-else>
  		<div>
  			{{ $t('global.select_file') }}
  			<input type="file" id="fileInput" @change="readText" accept=".txt">
  		</div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
  		<pre id="fileDisplayArea"></pre>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'file-load',

    data () {
      return {
        supportsFileAPI: true,
        error: null
      }
    },

    methods: {
      readText (e) {
        let files = e.target.files || e.dataTransfer.files
        let file = files[0]
        let textType = /text.*/

        if (file.type.match(textType)) {
          this.$emit('fileLoaded', file)
        } else {
          this.error = this.$t('global.file_not_supported')
        }
      }
    },

    mounted () {
      // check that the browser fully supports the File API
      if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        this.supportsFileAPI = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import "~styles";

  .upload-zone {
    padding: 1em 0;
  }
</style>
