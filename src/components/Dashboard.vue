<template>
  <div>
    <div class="container-fluid">
      <div class="row">
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
        <!-- put chart here  -->

        <!-- <div class="col-md-8 col-md-offset-2">
          <h1 class="page-header">Blockstack Todo App
            <img :src="user.avatarUrl() ? user.avatarUrl() : '/avatar-placeholder.png'" class="avatar">
            <small><span class="sign-out">(<a href="#" @click.prevent="signOut">Sign Out</a>)</span></small>
          </h1>
          <h2 class="user-info">
            <small>
              {{ user.name() ? user.name() : 'Nameless Person'}}'s Todos
            </small>
            <small class="pull-right">
            {{ user.username ? user.username : user.identityAddress }}
            </small>

          </h2>
          <form @submit.prevent="addTodo" :disabled="! todo">
            <div class="input-group">
              <input v-model="todo" type="text" class="form-control" placeholder="Write a todo..." autofocus>
              <span class="input-group-btn">
                <button class="btn btn-default" type="submit" :disabled="! todo">Add</button>
              </span>
            </div>
          </form>

          <ul class="list-group">
            <li v-for="todo in todos"
              class="list-group-item"
              :class="{completed: todo.completed}"
              :key="todo.id">
              <label>
                <input type="checkbox" v-model="todo.completed">{{ todo.text }}
              </label>
              <a @click.prevent="todos.splice(todos.indexOf(todo), 1)"
                class="delete pull-right"
                href="#">X</a>
            </li>
          </ul>

        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
var STORAGE_FILE = 'xfolio.json'

import Currency from './Currency.vue'

export default {
  name: 'dashboard',
  props: ['user'],
  components: { Currency },
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
      uidCount: 0
    }
  },
  watch: {
    todos: {
      handler: function (todos) {
        const blockstack = this.blockstack
        const encrypt = true
        return blockstack.putFile(STORAGE_FILE, JSON.stringify(todos), encrypt)
      },
      deep: true
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

input::placeholder {
  color: grey;
}

label {
  margin-bottom: 0;
  // width: 100%;
  cursor: pointer;
  input[type="checkbox"] {
    margin-right: 5px;
  }
}

ul {
  list-style: none;
}

.list-group-item {
  &.completed label {
    text-decoration: line-through;
  }

  .delete {
    display: none;
  }

  &:hover .delete {
    display: inline;
    color: grey;
    &:hover {
      text-decoration: none;
      color: red;
    }
  }
}

</style>
