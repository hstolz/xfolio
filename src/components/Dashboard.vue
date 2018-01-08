<template>
  <div class="layout">
    <Menu mode="horizontal">
      <MenuItem name="1">
        <Icon type="cube"></Icon>
        XFolio
      </MenuItem>
      <Col>
        <Button @click="signOut">
          <Icon type="log-out"></Icon>
          Logout
        </Button>
      </Col>
    </Menu>

    <Row type="flex" class="graph">
      <Graph :symbol="this.currency"></Graph>
    </Row>

    <!-- <Row style="background:#eee;padding:10px 20px" type="flex">
      <RadioGroup v-model="timeScale" type="button" size="large" justify="space-between">
        <Col span="5">
          <Radio label="One"></Radio>
        </Col>
        <Col span="5">
          <Radio label="Two"></Radio>
        </Col>
        <Col span="5">
          <Radio label="Three"></Radio>
        </Col>
        <Col span="5">
          <Radio label="Four"></Radio>
        </Col>
      </RadioGroup>
    </Row> -->

    <Row style="background:#eee;padding:10px" type="flex" justify="space-between">
      <currency :span="8" @click.native="changeFocus(currency.name)"
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
      button: '',
      // timeScale: [
      //   { id: 0, name: 'All Time', }
      // ],
      blockstack: window.blockstack,
      currencies: [
        { id: 0, name: 'BTC', price: 0, balance: 0 },
        { id: 1, name: 'ETH', price: 0, balance: 0 },
        { id: 2, name: 'LTC', price: 0, balance: 0 }
      ],
      currency: 'BTC',
      map: { 'BTC': 0, 'ETH': 1, 'LTC': 2 },
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
      this.writeData(this.currencies)
      .then((response) => {
        this.currencies[this.map[name]].balance = balance
        this.$Loading.finish()
      })
      .catch(error => {
        this.$Loading.error()
        console.error(error)
        this.$Message.error('Failed to update balance.')
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

    changeFocus (name) {
      this.currency = name
    },

    signOut () {
      this.blockstack.signUserOut(window.location.href)
    }
  }
}
</script>

<style lang="less" scoped>
.layout {
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
.ivu-radio-group {
  flex: auto;
  width: 100%;
}
.ivu-radio-group-item {
    width: 100%;
}
</style>
