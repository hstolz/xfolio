<template>
  <chart v-if="show" :options="line" ref="chart" auto-resize />
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
  props: ['symbol', 'timescale'],
  components: { chart: ECharts },
  data: function () {
    return {
      line: {},
      show: false
    }
  },
  watch: {
    symbol: {
      handler: function () {
        this.updateData(this.symbol, this.timescale)
      }
    },
    timescale: {
      handler: function () {
        this.updateData(this.symbol, this.timescale)
      }
    }
  },
  mounted () {
    this.updateData(this.symbol, this.timescale)
  },
  methods: {
    updateData (symbol, timescale) {
      this.$Loading.start()
      let self = this
      this.$nextTick(function () {
        var query
        var options
        switch (timescale) {
          case 'All':
            query = 'histoday?tsym=USD&allData=true&fsym=' + symbol
            options = { year: 'numeric', month: 'short', day: 'numeric' }
            break
          case 'Year':
            query = 'histoday?tsym=USD&limit=365&fsym=' + symbol
            options = { year: 'numeric', month: 'short', day: 'numeric' }
            break
          case 'Month':
            query = 'histohour?tsym=USD&limit=720&fsym=' + symbol
            options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
            break
          case 'Week':
            query = 'histohour?tsym=USD&fsym=' + symbol
            options = options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
            break
          case 'Day':
            query = 'histominute?tsym=USD&fsym=' + symbol
            options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }
            break
          case 'Hour':
            query = 'histominute?tsym=USD&limit=60&fsym=' + symbol
            options = { hour: 'numeric', minute: 'numeric' }
            break
        }

        axios.get('https://min-api.cryptocompare.com/data/' + query)
        .then(function (response) {
          self.$Loading.finish()
          let all = response.data.Data
          let fm = new Intl.DateTimeFormat('en-US', options)
          self.show = true

          self.line = {
            xAxis: {
              data: all.map(item => {
                let d = new Date(1000 * item.time)
                return fm.format(d)
              }),
              name: 'Time'
            },
            yAxis: {
              name: 'Value (USD)',
              min: 'dataMin',
              max: 'dataMax',
              splitLine: {
                show: false
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                snap: 'true',
                crossStyle: {
                  type: 'solid'
                }
              },
              transitionDuration: 0.2,
              backgroundColor: '#fff',
              padding: 10,
              textStyle: {
                color: '#495060',
                fontWeight: 'normal'
              }
            },
            smooth: true,
            series: [{
              name: self.symbol,
              type: 'line',
              data: all.map(item => item.close),
              hoverAnimation: false,
              symbolSize: 8,
              itemStyle: {
                normal: {
                  color: '#2b85e4'
                }
              },
              showSymbol: false
            }],
            animation: false
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
