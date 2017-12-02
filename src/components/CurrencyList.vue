<template>
  <div class="row">
    <ul class="list-group">
      <li v-for="currency in currencies" :id="currency.name + '-LI'">
        <!-- class="list-group-item" -->
        <!-- :class="{completed: todo.completed}"
        :key="todo.id"> -->
        <label class="col-6 currency-name">
          {{ currency.name }} -
        </label>
        <label class="col-6 currency-value">
          {{ currency.value }}
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'currency-list',
  // data: {
  //   currencies: [
  //     { name: 'BTC', value: 8026.42 },
  //     { name: 'ETH', value: 356.81 },
  //     { name: 'LTC', value: 71.99 }
  //   ]
  // },
  data () {
    return {
      currencies: [
        { name: 'BTC', value: 8026.42 },
        { name: 'ETH', value: 356.81 },
        { name: 'LTC', value: 71.99 }
      ]
    }
  },
  watch: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
li {
  font-size: 2rem;
}

</style>
