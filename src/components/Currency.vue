<template>
  <Col :span="span">
    <Card :bordered="false">
        <p slot="title">{{ name }}</p>
        <a href="#" slot="extra" @click.prevent="edit_modal = true">
          Edit
          <Icon type="edit"></Icon>
        </a>
        <Row>
          <Col>{{ parseFloat(price).toFixed(2) }}</Col>
          <Col>{{ balance }}</Col>
        </Row>
    </Card>
    <Modal v-model="edit_modal" width="360">
        <p slot="header" style="color:#f60;text-align:center">
            <span>Update {{ name }} Balance</span>
            <Icon type="edit"></Icon>
        </p>
        <InputNumber :min="0" :step=".01" size="large" v-model="modal_balance"></InputNumber>
        <div slot="footer">
            <Button type="error" size="large" long :loading="modal_loading" v-on:click="update">Update</Button>
        </div>
    </Modal>
  </Col>
</template>

<script>
export default {
  name: 'currency',
  props: ['name', 'price', 'balance', 'span'],
  data () {
    return {
      edit_modal: false,
      modal_balance: this.balance,
      modal_loading: false
    }
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    update () {
      this.$emit('update', this.name, this.modal_balance)
      this.edit_modal = false
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

</style>
