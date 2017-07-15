<template>
  <div class="upload-zone">
    <div v-if="!supportsFileAPI" class="error-message">
      <h1>The File APIs are not fully supported in this browser</h1>
    </div>
    <div v-else>
      <h1>Text File Reader</h1>
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
  import LineNavigator from 'line-navigator'

  export default {
    name: 'file-load',

    data () {
      return {
        supportsFileAPI: true,
        error: null,
        reader: null,
        filePercentLoaded: null
      }
    },

    methods: {
      readText (e) {
        console.log('readText!')
        let files = e.target.files || e.dataTransfer.files
        let file = files[0]
        let textType = /text.*/
        // var reader = new FileReader()

        if (file.type.match(textType)) {
          console.log('1')
          let lineNavigator = new LineNavigator(file)
          console.log('2')
          let indexToStartWith = 0
          let countLines = 0

          lineNavigator.readSomeLines(indexToStartWith, function linesReadHandler (err, index, lines, eof, progress) {
            if (err) {
              console.log('Error: ' + err)
              return
            }

            countLines += lines.length

            if (eof) {
              console.log('Total ' + countLines + ' lines readed')
              return
            }

            lineNavigator.readSomeLines(index + lines.length, linesReadHandler)
          })
          // this.reader.readAsText(file)
        } else {
          this.error = 'File not supported'
        }
      },

      errorHandler (evt) {
        switch (evt.target.error.code) {
          case evt.target.error.NOT_FOUND_ERR:
            this.error = 'File Not Found!'
            break
          case evt.target.error.NOT_READABLE_ERR:
            this.error = 'File is not readable'
            break
          default:
            this.error = 'An error occurred reading this file.'
        }
      },

      updateProgress (evt) {
        // evt is an ProgressEvent.
        if (evt.lengthComputable) {
          this.filePercentLoaded = Math.round((evt.loaded / evt.total) * 100)
        }
      },

      onloadHandler (e) {
        console.log('done!')
        console.log(this.reader.result)
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
    background: white;
    border: 1px solid color(grays, medium);
    padding: 1em;
  }
</style>
