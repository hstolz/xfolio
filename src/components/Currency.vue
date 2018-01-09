<template>
  <Col :span="span">
    <Card :bordered="false" :class="{ active: active }">
        <p slot="title">
          {{ name }} — ${{ parseFloat(price).toLocaleString(undefined,
            { maximumFractionDigits: 2, minimumFractionDigits: 2}) }}
        </p>
        <a href="#" slot="extra" @click.stop.prevent="edit_modal = true">
          Edit
          <Icon type="edit"></Icon>
        </a>
        <Spin size="small" v-if="spin" fix></Spin>
        <Row>
          <Col span="12">{{ balance }} {{ name }}</Col>
          <Col span="12" style="text-align:right">
            ${{ (balance * parseFloat(price)).toLocaleString(undefined,
              { maximumFractionDigits: 2, minimumFractionDigits: 2}) }}
          </Col>
        </Row>
    </Card>
    <Modal v-model="edit_modal" width="360">
        <p slot="header" style="text-align:center">
            <span>Update {{ name }} Balance</span>
            <Icon type="edit"></Icon>
        </p>
        <InputNumber autofocus
          :min="0"
          :step=".01"
          size="large"
          v-model="modal_balance"
          @keyup.enter.native="update"
          @keyup.esc.native="edit_modal=false">
        </InputNumber>
        <div slot="footer">
            <Button type="error" size="large" long :loading="modal_loading" @click="update">Update</Button>
        </div>
    </Modal>
  </Col>
</template>

<script>
export default {
  name: 'currency',
  props: ['name', 'price', 'balance', 'span', 'active'],
  data () {
    return {
      spin: true,
      edit_modal: false,
      modal_balance: this.balance,
      modal_loading: false
    }
  },
  watch: {
    balance: {
      handler: function (balance) {
        this.spin = false
        this.modal_balance = balance
      }
    }
  },
  mounted () {
  },
  methods: {
    update () {
      this.edit_modal = false
      this.spin = true
      this.$Loading.start()
      this.$emit('update', this.name, this.modal_balance)
    }
  }
}
</script>

<style lang="less" scoped>
.ivu-icon {
  padding-left:5px
}
.ivu-input-number {
  width:100%
}
.ivu-card {
  margin:5px;
}
.active {
  box-shadow: 0 0 3px #2b85e4;  // use less variable...
}
</style>
