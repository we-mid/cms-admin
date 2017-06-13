<template>
  <el-card class="box-card">
    <div class="card-title" slot="header">
      <i :class="'el-icon-' + icon"></i>
      <span>{{ title }}</span>
    </div>

    <form-gen ref="itemForm"
        :schema="formSchema"
        @submit="formSubmit"
        @cancel="formCancel"></form-gen>
  </el-card>
</template>

<script>
import FormGen from '@/components/FormGen.vue'

export default {
  components: { FormGen },

  props: {
    action: String,
    name: String,
    schema: {
      // `schema` is required in `data` method
      // so it has to be specified before rendering an `FormGen`
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
          { type: 'primary', text: '立即添加', emit: 'submit' }
        ],
        edit: [
          { type: 'primary', text: '立即修改', emit: 'submit' },
          { type: '', text: '关闭', emit: 'cancel' }
        ]
      }[this.action]
    },
    formSchema () {
      return {
        ...this.schema,
        buttons: this.buttons
      }
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
