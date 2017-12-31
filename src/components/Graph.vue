<template>
  <chart :options="polar"></chart>
</template>

<script>

import ECharts from './../../node_modules/vue-echarts/components/ECharts.vue'
import './../../node_modules/echarts/lib/chart/line'
import './../../node_modules/echarts/lib/component/tooltip'
import './../../node_modules/echarts/lib/component/polar'
import './../../node_modules/echarts/lib/component/geo'
import './../../node_modules/echarts/lib/component/legend'
import './../../node_modules/echarts/lib/component/title'

export default {
  name: 'graph',
  components: { chart: ECharts },
  data: function () {
    var request = require('request')
    request('http://www.google.com', function (error, response, body) {
      console.log('error:', error) // Print the error if one occurred
      console.log('body:', body) // Print the HTML for the Google homepage.
    })

    let data = []

    for (let i = 0; i <= 360; i++) {
      let t = i / 180 * Math.PI
      let r = Math.sin(2 * t) * Math.cos(2 * t)
      data.push([r, i])
    }

    return {
      polar: {
        title: {
          text: '极坐标双数值轴'
        },
        legend: {
          data: ['line']
        },
        polar: {
          center: ['50%', '54%']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        angleAxis: {
          type: 'value',
          startAngle: 0
        },
        radiusAxis: {
          min: 0
        },
        series: [
          {
            coordinateSystem: 'polar',
            name: 'line',
            type: 'line',
            showSymbol: false,
            data: data
          }
        ],
        animationDuration: 2000
      }
    }
  }
}
</script>

<style lang="less" scoped>

.echarts {
  height: 300px;
}

</style>
