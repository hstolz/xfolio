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
  props: ['symbol'], // ['timescale'],
  components: { chart: ECharts },
  data: function () {
    return {
      // data: [
      //   { }
      // ]
      line: {
        xAxis: {
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
  watch: {
    symbol: {
      handler: function (symbol) {
        this.updateData(symbol)
      }
    }
  },
  mounted () {
    this.updateData(this.symbol)
  },
  methods: {
    updateData (symbol) {
      this.$Loading.start()
      let self = this
      this.$nextTick(function () {
        axios.get('https://min-api.cryptocompare.com/data/histoday?fsym=' + symbol + '&tsym=USD&allData=true')
        .then(function (response) {
          self.$Loading.finish()
          let all = response.data.Data
          self.show = true

          self.line = {
            xAxis: {
              data: all.map(item => item.time),
              axisTick: {
                show: false
              },
              axisLabel: {
                show: true
              }
            },
            yAxis: {
              min: 0,
              max: Math.max(...all.map(item => item.high)),
              splitLine: {
                show: false
              }
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
        .catch(error => {
          self.$Loading.error()
          console.error(error)
          self.$Message.error('Failed to fetch graph data.')
        })
      })
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
