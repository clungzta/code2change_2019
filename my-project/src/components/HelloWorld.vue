<template lang="pug">
div
  h1(align="left") Project Feedback Mapper
  el-select.project-selection(id="projectSelect" v-model='selectValue', placeholder='Select')
    el-option(v-for='item in projectOptions', :key='item.value', :label='item.label', :value='item.value')

  el-menu.el-menu-demo(default-active='page', mode='horizontal', @select='handleSelect', background-color='#545c64', text-color='#fff', active-text-color='#ffd04b')
    el-menu-item(index='1') Public Demo Interface
    el-menu-item(index='2') Planner Interface

  div(id='mapid' v-show="isPlanningPage")

  div(v-if='isPublicPage')
  el-card.box-card(v-for='(document, count) in documentData' v-bind:key="count")
    .clearfix(slot='header')
      span Feedback Statement {{ count + 1 }}
      el-button(style='float: right; padding: 3px 0', type='text') Operation button

    div(v-if="document.mode === 'text' || document.mode === 'speech'")
      el-input(v-model="document.text" type='textarea', :autosize='{ minRows: 2, maxRows: 4}', placeholder='Input statement')
    div(v-if="document.mode === 'emoticon'")
      el-button.emoticonBtn(type='danger', @click="document.sentiment=-1", circle='') ☹️
      el-button.emoticonBtn(type='warning', @click="document.sentiment=0", circle='') 😐
      el-button.emoticonBtn(type='success', @click="document.sentiment=1", circle='') 🙂

    el-input.coordinateInput(v-model="document.lat" :disabled="true")
      template(slot='prepend') lat
    el-input.coordinateInput(v-model="document.lon" :disabled="true")
      template(slot='prepend') lon

    el-button(v-show="!document.is_submitted" type="info" @click="submitStatement(document)" plain) Submit

  br
  el-button(v-show="!anyUnsubmittedStatements", type='success', icon='el-icon-plus', circle='', @click='newDocumentDialogVisible = true')
  el-button.clr-button(type="danger" @click="clearStatements()" plain) Clear All Statements

  el-dialog(title='Add a statement', :visible.sync='newDocumentDialogVisible', width='30%')
    el-button(type='info', icon='el-icon-microphone', circle='', @click='addTextStatement') Text Input
    el-button(type='info', icon='el-icon-microphone', circle='', @click='addVoiceStatement') Voice Input
    el-button(type='info', icon='el-icon-microphone', circle='', @click='addEmoticonStatement') Emoticon Input

  el-dialog(title='Warning', :visible.sync='navigationDialogVisible', width='30%', center='')
    span Submit all statements before continuing
    span.dialog-footer(slot='footer')
      // el-button(@click='centerDialogVisible = false') Cancel

  loading(:active.sync='isLoading', :can-cancel='false', :is-full-page='true')

</template>

<script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"
  integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg=="
  crossorigin=""></script>

<script>

import {LMap, LTileLayer, LMarker} from 'vue2-leaflet'
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

const axios = require('axios')
const sampleDocumentDataItem = {
    text: "The quick brown fox",
    lat: -33.81,
    lon: 151.00,
    sentiment: null,
    is_submitted: false
  }

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    Loading
  },
  name: 'HelloWorld',
  data () {
    return {
      map: null,
      page: 2,
      inputMode: 'text',
      documentData: [],
      newDocumentDialogVisible: false,
      navigationDialogVisible: false,
      isLoading: false,
      projectOptions: [{
          value: 'Option1',
          label: 'Sydney Metro'
      },
      {
          value: 'Option2',
          label: 'NorthConnex'
      },
      {
        value: 'Option3',
        label: 'WestConnex'
      },
      {
        value: 'Option4',
        label: 'Alex Avenue Public School'
      },
      {
        value: 'Option5',
        label: 'Lake Cathie Public School Redevelopment'
      }
      ],
      selectValue: 'Option3'
    }
  },
  computed: {
    isPublicPage () {
      return this.page === 1
    },
    isPlanningPage () {
      return this.page === 2
    },
    isTextInputMode () {
      return this.inputMode === 'text'
    },
    isSpeechInputMode () {
      return this.inputMode === 'speech'
    },
    isEmoticonInputMode () {
      return this.inputMode === 'emoticon'
    },
    anyUnsubmittedStatements () {
      // Returns true if any of the statements are unsubmitted
      console.log(this.documentData.map(x => x.is_submitted))
      return this.documentData.map(x => x.is_submitted).some(function(x){ !x })
    }
  },
  methods: {
    generateRandomNumber (min, max) {
      return (Math.random() * (max - min) + min).toFixed(5);
    },
    generateSampleItem (mode) {
      let sample_item = Object.assign({}, sampleDocumentDataItem)
      sample_item.lat = this.generateRandomNumber(-34.0, -33.6)
      sample_item.lon = this.generateRandomNumber(150.6, 151.3)
      sample_item.mode = mode
      return sample_item
    },
    addVoiceStatement () {
      this.inputMode = 'speech'
      this.newDocumentDialogVisible = false
      // TODO: record using google speech api
    },
    addTextStatement () {
      this.newDocumentDialogVisible = false
      this.documentData.push(this.generateSampleItem('text'))
    },
    addEmoticonStatement () {
      this.newDocumentDialogVisible = false
      this.documentData.push(this.generateSampleItem('emoticon'))
    },
    statementToMarker (statement) {
      console.log('sentiment', statement.sentiment)
      let marker = {
        name: 'Sentiment: ' + statement.sentiment,
        // name: 'Sentiment: ' + statement.sentiment,
        type: 'marker',
        coords: [statement.lat, statement.lon]
      }
      console.log(marker)

      return marker
    },
    initMap () {
      this.map = L.map('mapid', { zoomControl:false }).setView([-33.81, 151.00], 11);
    },
    initLayers() {
      // this.tileLayer = L.tileLayer('https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey={apikey}', {
      //   attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      //   apikey: '4d7d8e7a90c145eb9275653ce469a796',
      //   maxZoom: 11
      // });

      this.tileLayer = L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
        {
          minZoom: 11,
          maxZoom: 11,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
        }
      );
      this.tileLayer.addTo(this.map)

      let instance = this
      axios.get('http://localhost:4444/api/statements/')
        .then(function (response) {
          console.log('Getting statements for map page')
          console.log(response.data)

          response.data.forEach((feature) => {
            console.log('Map feature', feature)
            if (feature.sentiment !== null) {
              console.log('adding')
              let marker = instance.statementToMarker(feature)

              if (feature.sentiment > 0.1) {
                var myIcon = L.icon({iconUrl: require('@/assets/geo_green.png')});
              }
              else if (feature.sentiment < 0.1) {
                var myIcon = L.icon({iconUrl: require('@/assets/geo_red.png')});
              }
              else {
                var myIcon = L.icon({iconUrl: require('@/assets/geo_outline.png')});
              }
              feature.leafletObject = L.marker(marker.coords, {icon:myIcon}).bindPopup(marker.name);
              feature.leafletObject.addTo(instance.map);
              // feature.leafletObject.removeFrom(this.map);
            }
            else {
              console.log('not adding')
            }
          })
        })
    },
    handleSelect (key, keyPath) {
      // Before moving page, raise a warning if there are any unsubmitted statements
      if (this.anyUnsubmittedStatements) {
        navigationDialogVisible = true
      }

      this.page = parseInt(key[0])
      console.log(key, keyPath)

      // this.initMap();
      this.initLayers();
      this.getStatements();
    },
    submitStatement (statement) {
      console.log(statement)

      // axios.defaults.withCredentials = true
      let instance = this
      instance.isLoading = true
      axios.post('http://localhost:4444/api/submit_statement/', {
          statement: statement
        })
        .then(function (response) {
          console.log(response)
          instance.getStatements()
          instance.isLoading = false
        })
        .catch(function (error) {
          console.error(error)
          instance.isLoading = false
        })
    },
    getStatements () {
      let instance = this
      console.log('Getting statements for public page')
      axios.get('http://localhost:4444/api/statements/')
        .then(function (response) {
          console.log(response.data)
          instance.documentData = response.data
        })
    },
    clearStatements () {
      let instance = this
      axios.delete('http://localhost:4444/api/statements/')
        .then(function (response) {
          instance.documentData = []
          console.log(response)
        })
    }
  },
  mounted () {
    this.initMap();
    this.initLayers();
  },
  created () {
    document.title = "Project Feedback Mapper";
  },
  meta: {title: 'Home'}
}
</script>

<style scoped>
#mapid {
  height: 800px;
}

#projectSelect {
  position: absolute; left: -500px;
}

.coordinateInput {
  display: inline-block;
  width: 130px;
}

.clr-button {
  height: 40px;
  position: fixed;
  bottom:0%;
  right: 0%
}

.emoticonBtn {
  /* font-weight: bold; */
  font-size: 50px;
}

</style>
