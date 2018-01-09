<template>
  <div class="layout">
    <Header>
      <Menu mode="horizontal" type="flex" justify="space-between">
        <div class="logo">
          <Icon type="cube"></Icon>
          XFolio
        </div>
        <MenuItem name="Logout">
          <a href="#" @click="signOut">
            <Icon type="log-out"></Icon>
            Logout
          </a>
        </MenuItem>
        <MenuItem name="Info">
          <a href="#" @click.prevent="info_modal = true">
            <Icon type="ios-information"></Icon>
            Info
          </a>
        </MenuItem>
        <Modal
          v-model="info_modal" title="Information" width="360">
          Exchange Data provided by
          <a href="https://www.cryptocompare.com/" target="blank">CryptoCompare</a>
      </Modal>
      </Menu>
    </Header>

    <Row type="flex" class="graph">
      <Graph :symbol="this.currency" :timescale="timescale"></Graph>
    </Row>

    <Row class="timescale-container">
      Time Scale
      <RadioGroup
        v-model="timescale"
        type="button">
        <Radio v-for"timescale in timescales">
        </Radio>
      </RadioGroup>
    </Row>

    <Row class="currency-container" type="flex" justify="space-between">
      <currency :span="8" @click.native="changeFocus(currency)"
        v-for="currency in currencies"
        :name="currency.name"
        :price="currency.price"
        :balance="currency.balance"
        :key="currency.id"
        :active="currency.active"
        :update="updateBalance">
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
        { id: 0, name: 'BTC', price: 0, balance: 0, active: true },
        { id: 1, name: 'ETH', price: 0, balance: 0, active: false },
        { id: 2, name: 'LTC', price: 0, balance: 0, active: false }
      ],
      currency: 'BTC',
      map: { 'BTC': 0, 'ETH': 1, 'LTC': 2 },
      uidCount: 0,
      timescales: ['All', 'Year', 'Month', 'Week', 'Day', 'Hour'],
      timescale: 'All',
      info_modal: false
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
      let currency = this.currencies[this.map[name]]
      this.writeData(this.currencies)
      .then((response) => {
        currency.balance = balance
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

    changeFocus (currency) {
      this.currencies[this.map[this.currency]].active = false
      this.currencies[this.map[currency.name]].active = true
      this.currency = currency.name
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
.logo {
  .ivu-icon {
    margin-right: 5px;
  }
  font-size: 135%;
  float: left;
  position: relative;
  left: 20px;
}
.ivu-menu-item {
  a {
    display: block;
  }
  float: right;
  right: 5px;
}
.graph {
  flex: auto;
}
.ivu-radio-group {
  margin-left: 5px;
}
.currency-container {
  background: #eee;
  padding: 0px 10px 10px 10px;
}
.timescale-container {
  background: #eee;
  padding: 8px 15px 3px 15px;
}
</style>
