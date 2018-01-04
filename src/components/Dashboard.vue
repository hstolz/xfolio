<template>
  <div class="layout">
    <Row type="flex" class="graph">
      <Graph></Graph>
    </Row>
    <Row style="background:#eee;padding:20px" type="flex" justify="space-between">
      <currency :span="7"
        v-for="currency in currencies"
        v-bind:name="currency.name"
        v-bind:price="currency.price"
        v-bind:balance="currency.balance"
        v-bind:key="currency.id"
        v-on:update="updateBalance">
      </currency>
    </Row>
  </div>
</template>

<script>
var STORAGE_FILE = 'xfolio.json'

import Currency from './Currency.vue'
import Graph from './Graph.vue'

export default {
  name: 'dashboard',
  props: ['user'],
  components: { Currency, Graph },
  data () {
    return {
      blockstack: window.blockstack,
      currencies: [
        { id: 0, name: 'BTC', price: 0, balance: 0 },
        { id: 1, name: 'ETH', price: 0, balance: 0 },
        { id: 2, name: 'LTC', price: 0, balance: 0 }
      ],
      map: { 'BTC': 0, 'ETH': 1, 'LTC': 2 },
      currency: '',
      test: 0,
      uidCount: 0
    }
  },
  watch: {
  },
  computed: {
  },
  mounted () {
    this.readData()
    var self = this
    const socket = new WebSocket('wss://ws-feed.gdax.com')

    socket.addEventListener('open', function (event) {
      var msg = {
        'type': 'subscribe',
        'product_ids': ['BTC-USD', 'ETH-USD', 'LTC-USD'],
        'channels': ['ticker']
      }
      socket.send(JSON.stringify(msg))
    })

    // probably should make this only happen when focus goes on some element
    socket.addEventListener('message', function (event) {
      var msg = JSON.parse(event.data)
      if (msg.type === 'ticker') {
        self.updatePrice((msg.product_id).split('-')[0], msg.price)
      }
    })

    socket.addEventListener('error', function (event) { console.log('socket error') })
    socket.addEventListener('close', function (event) { console.log('socket close') })
  },
  methods: {
    updatePrice (name, price) {
      this.currencies[this.map[name]].price = price
    },

    updateBalance: function (name, balance) {
      this.currencies[this.map[name]].balance = balance
      this.writeData(this.currencies)
      .then((response) => {
        if (!response) {
          // modal/alert instead?
          console.error('failed to write data')
        }
      })
    },

    writeData (data) {
      const blockstack = this.blockstack
      const encrypt = true
      return blockstack.putFile(STORAGE_FILE, JSON.stringify(data), encrypt)
    },

    readData () {
      const blockstack = this.blockstack
      const decrypt = true
      blockstack.getFile(STORAGE_FILE, decrypt)
      .then((response) => {
        var currencies = JSON.parse(response || '[]')
        currencies.forEach(function (currency, index) {
          currency.id = index // might not need...
        })
        this.uidCount = currencies.length
        this.currencies = currencies
      })
    },

    signOut () {
      this.blockstack.signUserOut(window.location.href)
    }
  }
}
</script>

<style lang="less" scoped>
.layout{
    background: #f5f7f9;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    position: relative;
}
.graph {
  flex: auto;
}
</style>
