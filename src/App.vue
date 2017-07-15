<template>
  <div id="app">
    <div class="app-container">
      <h1>{{ $t('global.app_name') }}</h1>
      <span class="subtitle">{{ $t('global.app_desc') }}</span>

      <file-load @fileLoaded="readText"></file-load>

      <div class="words-container" v-if="totalWords > 0">
        <div class="tabs">
          <div :class="{active: wordsTabActived}"
               @click="tabActive = 'words'">
            <h2>{{ $t('global.words') }}</h2>
          </div>
          <div :class="{active: textTabActived}"
               @click="tabActive = 'text'">
            <h2>{{ $t('global.text') }}</h2>
          </div>
        </div>

        <div class="progress-bar-container" v-if="progress > 0 && progress < 100">
          <progress-bar :progress="progress"></progress-bar>
        </div>

        <div class="data-container">
          <div v-show="wordsTabActived"
               class="list">
               <table>
                 <tr>
                   <th width="50%">{{ $t('global.words_count', {count: totalWords}) }}</th>
                   <th width="25%">{{ $t('global.number_ocurrences') }}</th>
                   <th width="25%">{{ $t('global.is_prime') }}</th>
                 </tr>
                 <tr v-for="(ocurrences, word) in allWords">
                   <td>{{ word }}</td>
                   <td>{{ ocurrences }}</td>
                   <td>{{ ocurrences | isPrime }}</td>
                 </tr>
              </table>
          </div>

          <div v-show="textTabActived" class="original-text-container">
            <pre>{{ originalText }}</pre>
          </div>
        </div>
      </div>

      <div class="error-message" v-if="error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
  import FileLoad from './components/file-load/FileLoad'
  import ProgressBar from './components/progress-bar/ProgressBar'
  import LineNavigator from 'line-navigator'

  export default {
    name: 'app',

    data () {
      return {
        error: null,
        allWords: {},
        totalWords: 0,
        originalText: '',
        tabActive: 'words',
        progress: 0
      }
    },

    computed: {
      wordsTabActived () {
        return this.tabActive === 'words'
      },

      textTabActived () {
        return this.tabActive === 'text'
      }
    },

    methods: {
      readText (file) {
        this.resetStatus()

        let lineNavigator = new LineNavigator(file)
        let indexToStartWith = 0
        let countLines = 0
        let vm = this

        lineNavigator.readSomeLines(indexToStartWith, function linesReadHandler (err, index, lines, eof, progress) {
          if (err) {
            this.error = err
            return
          }

          vm.progress = progress

          vm.extractWords(lines)
          countLines += lines.length

          if (eof) {
            console.log('Total ' + countLines + ' lines readed')
            return
          }

          lineNavigator.readSomeLines(index + lines.length, linesReadHandler)
        })
      },

      extractWords (lines) {
        lines.forEach(this.extractWordsByLine)
      },

      extractWordsByLine (line) {
        this.originalText += line + '\n'
        // clean string puntuation and spaces
        line = this.cleanString(line)

        if (line.length > 0) {
          let words = line.toLowerCase().split(' ')

          words.forEach(word => {
            word = word.trim()
            if (word) {
              let currentWord = this.allWords[word]

              if (currentWord === undefined) {
                currentWord = 1
              } else {
                currentWord++
              }

              this.$set(this.allWords, word, currentWord)
              this.totalWords++
            }
          })
        }
      },

      cleanString (str) {
        // remove spaces
        str = str.trim()
        // remove punctuation
        str = this.removePunctuation(str)

        return str
      },

      removePunctuation (str) {
        // eslint-disable-next-line
        return str.replace(/[&\/\\#,+\(\)$~%\.!^"\;:*?\[\]<>{}]/g, '')
      },

      resetStatus () {
        this.originalText = ''
        this.totalWords = 0
        this.allWords = {}
      }
    },

    filters: {
      isPrime: function (number) {
        let isPrime = true

        if (number <= 1) isPrime = false

        for (var i = 2; i < number && isPrime; i++) {
          if (number % i === 0) {
            isPrime = false
          }
        }

        return isPrime
      }
    },

    components: {
      FileLoad,
      ProgressBar
    }
  }
</script>

<style lang="scss">
  @import "~styles";

  $border-light: 1px solid rgba(0, 0, 0, .1);

  #app {
    padding: 1em;

  }

  .app-container {
    background-color: white;
    padding: 1em;

    h1 {
      width: 100%;
      font-size: 1.5rem;
      margin-bottom: .5em;
    }

    .subtitle {
      color: color(grays, medium);
    }
  }

  .words-container {

    .tabs {
      display: flex;
      border: $border-light;

      div {
        width: 50%;
        height: 3em;
        display: flex;
        justify-content: center;
        align-items: center;

        &:first-child {
          border-right: $border-light;
        }
      }

      h2 {
        color: color(grays, medium);
        font-weight: lighter;
      }

      .active {
        h2 {
          color: color(primary);
          font-weight: bolder;
        }
      }
    }

    .data-container {
      max-height: 40em;
      overflow-y: scroll;
    }

    .progress-bar-container {
      width: 100%;
    }

    .list {
      border: $border-light;
      border-top: none;
      overflow-x:auto;

      table {
        width: 100%;
        min-width: 30em;
        margin: 0 auto;
        position: relative;
      }

      th, td {
        text-align: left;
        padding: .5em 1em;
      }

      tr:nth-child(even) {
        background-color: #f2f2f2
      }

      tr:hover {
        background-color: color(grays, medium)
      }

      th {
        background-color: color(grays, dark);
        color: white;
      }
    }

    .original-text-container {
      border: $border-light;
      border-top: none;
      padding: 1em;

      overflow: hidden;
      overflow-x: scroll;
    }
  }
</style>
