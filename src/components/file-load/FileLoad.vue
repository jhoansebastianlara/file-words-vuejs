<template>
  <div class="upload-zone">
    <div v-if="!supportsFileAPI" class="error-message">
      <h2>The File APIs are not fully supported in this browser</h2>
    </div>
    <div v-else>
  		<div>
  			Select a text file:
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
          this.error = 'File not supported'
        }
      }
    },

    mounted () {
      // check that the browser fully supports the File API
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
        this.reader = new FileReader()
        this.reader.onerror = this.errorHandler
        this.reader.onprogress = this.updateProgress
        this.reader.onload = this.onloadHandler
        this.reader.onabort = (e) => {
          this.error = 'File read cancelled'
        }
      } else {
        this.supportsFileAPI = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import "~styles";

  .upload-zone {
    // border: 1px solid color(grays, medium);
    padding: 1em 0;
  }
</style>
