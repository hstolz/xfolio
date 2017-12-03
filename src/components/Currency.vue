<template>
  <li>
    {{ name }} - {{ parseFloat(price).toFixed(2) }}
    <!-- <label class="col-6 currency-name">
      {{ currency.name }} -
    </label>
    <label class="col-6 currency-value">
      {{ currency.value }}
    </label> -->
  </li>
</template>

<script>
export default {
  name: 'currency',
  props: ['name', 'price'],
  data () {
    return {
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
