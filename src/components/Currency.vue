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

<style lang="less" scoped>

li {
  font-size: 1rem;
  color: white;
  margin: 15px;
}

</style>
