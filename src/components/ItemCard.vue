<template>
  <el-card class="box-card">
    <div class="card-title" slot="header">
      <i :class="'el-icon-' + icon"></i>
      <span>{{ title }}</span>
    </div>

    <item-form ref="itemForm"
        :schema="schema"
        :buttons="buttons"></item-form>
  </el-card>
</template>

<script>
import ItemForm from '@/components/ItemForm.vue'

export default {
  components: { ItemForm },

  props: {
    action: String,
    name: String,
    schema: {
      // `schema` is required in `data` method
      // so it has to be specified before rendering an `ItemForm`
      required: true,
      type: Object
    }
  },

  data () {
    return { uid: '' }
  },

  computed: {
    icon () {
      return {
        create: 'plus',
        edit: 'edit'
      }[this.action]
    },
    title () {
      return {
        create: `添加${this.name}`,
        edit: `修改${this.name} ${this.uidStr}`
      }[this.action]
    },
    uidStr () {
      return this.uid ? this.uid.substr(0, 9) : ''
    },
    buttons () {
      return {
        create: [
          { type: 'primary', text: '立即添加', handle: this.formSubmit }
        ],
        edit: [
          { type: 'primary', text: '立即修改', handle: this.formSubmit },
          { type: '', text: '关闭', handle: this.formCancel }
        ]
      }[this.action]
    }
  },

  methods: {
    reset (model) {
      this.uid = model ? model.uid : ''
      this.$refs.itemForm.reset(model)
    },
    formCancel () {
      this.$emit('cancel')
    },
    formSubmit () {
      let model = this.$refs.itemForm.getModel()
      this.$emit('submit', model)
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  display: inline-block;
  margin-right: 20px;
  margin-top: 20px;
  width: 470px;
}
</style>
