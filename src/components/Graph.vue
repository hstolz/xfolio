<template>
  <chart v-if="show" :options="line" ref="chart" />
</template>

<script>

import ECharts from './../../node_modules/vue-echarts/components/ECharts.vue'
import './../../node_modules/echarts/lib/chart/line'
import './../../node_modules/echarts/lib/component/tooltip'
import './../../node_modules/echarts/lib/component/polar'
import './../../node_modules/echarts/lib/component/geo'
import './../../node_modules/echarts/lib/component/legend'
import './../../node_modules/echarts/lib/component/title'

const axios = require('axios')

export default {
  name: 'graph',
  // props: ['symbol', 'timescale'],
  components: { chart: ECharts },
  data: function () {
    return {
      line: {
        xAxis: {
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          data: []
        },
        yAxis: {},
        series: [{
          name: 'placeholder',
          type: 'line',
          data: []
        }]
      },
      show: false
    }
  },
  mounted () {
    let self = this
    this.$nextTick(function () {
      axios.get('https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&allData=true')
      .then(function (response) {
        // console.log(response.data.Data)
        let all = response.data.Data
        self.show = true

        self.line = {
          xAxis: {
            data: all.map(item => item.time)
          },
          yAxis: {
            min: 0,
            max: Math.max(...all.map(item => item.high))
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          series: [{ /*
            name: 'low',
            type: 'line',
            data: all.map(item => item.low),
            lineStyle: {
              normal: {
                opacity: 0
              }
            },
            stack: 'low-high',
            symbol: 'none'
          }, {
            name: 'high',
            type: 'line',
            data: all.map(item => item.high - item.low),
            lineStyle: {
              normal: {
                opacity: 0
              }
            },
            areaStyle: {
              normal: {
                color: '#ccc'
              }
            },
            stack: 'low-high',
            symbol: 'none'
          }, { */
            name: 'line',
            type: 'line',
            data: all.map(item => item.close),
            hoverAnimation: false,
            symbolSize: 6,
            itemStyle: {
              normal: {
                color: '#c23531'
              }
            },
            showSymbol: false
          }],
          animationDuration: 1000
        }
      })
      .catch(error => console.error(error))
    })
  },
  methods: {
    convertTimestamp (timestamp) {
      var d = new Date(timestamp * 1000)
      var yyyy = d.getFullYear()
      var mm = ('0' + (d.getMonth() + 1)).slice(-2)
      var dd = ('0' + d.getDate()).slice(-2)
      var hh = d.getHours()
      var h = hh
      var min = ('0' + d.getMinutes()).slice(-2)
      var ampm = 'AM'
      var time

      if (hh > 12) {
        h = hh - 12
        ampm = 'PM'
      } else if (hh === 12) {
        h = 12
        ampm = 'PM'
      } else if (hh === 0) {
        h = 12
      }

      time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm

      return time
    }
  }
}
</script>

<style lang="less" scoped>

.echarts {
  width: 100%;
  height: auto;
}

</style>
