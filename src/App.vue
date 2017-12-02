<template>
  <div id="app">
    <landing v-if="! blockstack.isUserSignedIn()"></landing>
    <dashboard v-if="user" :user="user"></dashboard>

    <small class="creds">
      Source code on <a href="https://github.com/hstolz/xfolio" target="_blank">Github</a>
    </small>
  </div>
</template>

<script>

import Landing from './components/Landing.vue'
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'app',
  components: {Landing, Dashboard},
  mounted () {
    const blockstack = this.blockstack
    if (blockstack.isUserSignedIn()) {
      this.userData = blockstack.loadUserData()
      this.user = new blockstack.Person(this.userData.profile)
      this.user.username = this.userData.username
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn('http://localhost:6270/v1/names/')
      .then((userData) => {
        window.location = window.location.origin
      })
    }

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
        document.querySelector('#' + msg.product_id.split('-')[0] +
                               '-LI .currency-value').innerHTML = parseFloat(msg.price).toFixed(2)
      }
    })

    socket.addEventListener('error', function (event) { console.log('socket error') })
    socket.addEventListener('close', function (event) { console.log('socket close') })
  },
  data () {
    return {
      blockstack: window.blockstack,
      user: null
    }
  }
}

</script>

<style src="./assets/sass/app.scss" lang="scss"></style>
