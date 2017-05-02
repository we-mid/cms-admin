<template>
  <el-form :model="model" label-width="80px" class="item-form">
    <el-form-item v-for="field in schema.fields"
        :key="field.key"
        :label="field.label">
      <template v-if="field.input === 'text'">
        <el-input v-model="model[field.key]"></el-input>
      </template>

      <template v-else-if="field.input === 'textarea'">
        <el-input type="textarea" v-model="model[field.key]"></el-input>
      </template>

      <template v-else-if="field.input === 'radio-group'">
        <el-radio-group v-model="model[field.key]">
          <el-radio v-for="option in field.options"
              :key="option.value"
              :label="option.value">
            {{option.label}}
          </el-radio>
        </el-radio-group>
      </template>
    </el-form-item>

    <el-form-item>
      <el-button v-for="button in buttons" :key="button.text"
          :type="button.type" @click="button.handle">
        {{button.text}}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    action: String,
    schema: {
      // `schema` is required in `data` method
      // so it has to be specified before rendering an `ItemForm`
      required: true,
      type: Object
    }
  },

  data () {
    return {
      model: this.schemaToModel()
    }
  },

  computed: {
    buttons () {
      return {
        create: [
          { type: 'primary', text: '立即添加', handle: this.formSubmit }
        ],
        edit: [
          { type: 'primary', text: '立即修改', handle: this.formSubmit },
          { type: '', text: '取消', handle: this.formCancel }
        ]
      }[this.action]
    }
  },

  methods: {
    schemaToModel () {
      return this.schema.fields
        .reduce((acc, field) => {
          acc[field.key] = ''
          return acc
        }, {})
    },
    reset (model) {
      if (model) {
        this.model = _.clone(model)
      } else {
        this.model = this.schemaToModel()
      }
    },

    formCancel () {
      this.$emit('cancel')
    },
    formSubmit () {
      this.$emit('submit', this.model)
    }
  }
}
</script>

<style scoped>
.item-form {
  margin-bottom: -22px;
  padding-right: 10px;
}
</style>

<style>
.item-form .el-form-item__content {
  margin-left: 90px !important;
}

.el-checkbox, .el-radio {
  margin-right: 15px;
  margin-left: 0 !important;
}
</style>
