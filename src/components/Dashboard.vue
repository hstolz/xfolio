<template>
  <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
    <Row type="flex">
      <Col :span="spanLeft" class="layout-menu-left">
        <Menu active-name="1" theme="dark" width="auto">
          <Row type="flex">
            <Col :span="12" class="layout-header"></Col>
            <Col :span="12" class="layout-header">
              <Button type="text" @click="toggleClick">
                <Icon type="plus" size="32" class="expand-toggle"></Icon>
              </Button>
            </Col>
          </Row>
          <!-- <MenuItem name="1">
            <Icon type="ios-navigate" :size="iconSize"></Icon>
            <span class="layout-text">Option 1</span>
          </MenuItem>
          <MenuItem name="2">
            <Icon type="ios-keypad" :size="iconSize"></Icon>
            <span class="layout-text">Option 2</span>
          </MenuItem>
          <MenuItem name="3">
            <Icon type="ios-analytics" :size="iconSize"></Icon>
            <span class="layout-text">Option 3</span>
          </MenuItem> -->
          <currency
            v-for="currency in currencies"
            v-bind:name="currency.name"
            v-bind:price="currency.price"
            v-bind:key="currency.id">
          </currency>
        </Menu>
      </Col>
      <Col :span="spanMiddle" class="options">
      </Col>
      <Col :span="spanRight">
        <div class="layout-content">
          <!-- <graph></graph> -->
          <div class="layout-content-main">
            <Input v-model="test" style="width: 300px"></Input>
            <Button type="primary" @click="testWrite(test)">Write</Button>
            <Button type="default" @click="testRead">Read</Button>
          </div>
        </div>
      </Col>
    </Row>
  </div>
  <!-- <row>
    <col span="24">
      Nav
    </col>


    <nav class="navbar navbar-inverse bg-inverse">
      <a class="navbar-brand" href="#">XFolio</a>
    </nav>
    <ul class="col-md-3">
      <currency
        v-for="currency in currencies"
        v-bind:name="currency.name"
        v-bind:price="currency.price"
        v-bind:key="currency.id">
      </currency>
    </ul>
    put chart here
  </row> -->
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
        { id: 0, name: 'BTC', price: 0 },
        { id: 1, name: 'ETH', price: 0 },
        { id: 2, name: 'LTC', price: 0 }
      ],
      map: { 'BTC-USD': 0, 'ETH-USD': 1, 'LTC-USD': 2 },
      currency: '',
      test: 0,
      uidCount: 0,
      spanLeft: 6,
      spanMiddle: 0,
      spanRight: 18
    }
  },
  watch: {
    // todos: {
    //   handler: function (todos) {
    //     const blockstack = this.blockstack
    //     const encrypt = true
    //     return blockstack.putFile(STORAGE_FILE, JSON.stringify(todos), encrypt)
    //   },
    //   deep: true
    // }

  },
  computed: {
    iconSize () {
      return this.spanLeft === 5 ? 14 : 24
    }
  },
  mounted () {
    this.fetchData()
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
        self.updatePrice(msg.product_id, msg.price)
      }
    })

    socket.addEventListener('error', function (event) { console.log('socket error') })
    socket.addEventListener('close', function (event) { console.log('socket close') })
  },
  methods: {
    updatePrice (name, price) {
      this.currencies[this.map[name]].price = price
    },

    toggleClick () {
      if (this.spanLeft === 6) {
        this.spanLeft = 2
        this.spanRight = 22
      } else {
        this.spanLeft = 6
        this.spanRight = 18
      }
    },

    testWrite (test) {
      console.log('testWrite: ' + test)
      const blockstack = this.blockstack
      const encrypt = true
      return blockstack.putFile(STORAGE_FILE, JSON.stringify(test), encrypt)
    },

    testRead () {
      const blockstack = this.blockstack
      const decrypt = true
      blockstack.getFile(STORAGE_FILE, decrypt)
      .then((response) => {
        console.log('testRead: ')
        var data = JSON.parse(response || '[]')
        console.log('data: ' + data)
        data.forEach(function (data) {
          console.log(data)
        })
      })
    },

    // addTodo () {
    //   if (!this.todo.trim()) {
    //     return
    //   }
    //   this.todos.unshift({
    //     id: this.uidCount++,
    //     text: this.todo.trim(),
    //     completed: false
    //   })
    //   this.todo = ''
    // },

    fetchData () {
      const blockstack = this.blockstack
      const decrypt = true
      blockstack.getFile(STORAGE_FILE, decrypt)
      .then((todosText) => {
        var todos = JSON.parse(todosText || '[]')
        todos.forEach(function (todo, index) {
          todo.id = index
        })
        this.uidCount = todos.length
        this.todos = todos
      })
    },

    signOut () {
      this.blockstack.signUserOut(window.location.href)
    }
  }
}
</script>

<style lang="less" scoped>
.expand-toggle{
    position: absolute;
    right: 20px;
}
.layout{
    background: #f5f7f9;
    position: relative;
    overflow: hidden;
    height: 100%;
}
.layout-content{
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
}
.layout-content-main{
    padding: 10px;
}
.layout-menu-left{
    background: #464c5b;
}
.layout-header{
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
}
.layout-ceiling-main a{
    color: #9ba7b5;
}
.layout-hide-text .layout-text{
    display: none;
}
.ivu-col{
    transition: width .2s ease-in-out;
}
.ivu-row-flex{
    height: 100%;
}
</style>
