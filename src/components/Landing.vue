<template>
  <Modal
    v-model="modal"
    :title="XFolio"
    :closable="false"
    :mask-closable="false">
      <p slot="header">XFolio</p>
      <p>A decentralized cryptocurrency portfolio manager on <a href="https://blockstack.org" target="_blank">Blockstack</a></p>
      <Button slot="footer" @click.prevent="signIn">Sign In With Blockstack</Button>
  </Modal>
  <!--
  <div class="hello">
    <div>
      <h1>XFolio</h1>
      <p>A decentralized cryptocurrency portfolio manager on <a href="https://blockstack.org" target="_blank">Blockstack</a></p>
      <button class="btn btn-default" @click.prevent="signIn">Sign In With Blockstack</button>
    </div>
  </div> -->
</template>

<script>
export default {
  name: 'landing',
  data () {
    return {
      blockstack: window.blockstack,
      modal: true
    }
  },

  methods: {
    signIn () {
      const blockstack = this.blockstack
      blockstack.redirectToSignIn()
    }
  }
}
</script>

<style scoped>
.hello {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
