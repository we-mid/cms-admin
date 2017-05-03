<template>
  <el-card class="box-card">
    <div class="card-title" slot="header">
      <i :class="'el-icon-' + icon"></i>
      <span>{{ title }}</span>
    </div>
    <el-form :model="model" label-width="80px" class="item-form">
      <el-form-item v-for="field in schema.fields"
          :key="field.key"
          :label="field.label">
        <template v-if="field.input === 'text'">
          <el-input v-model="model[field.key]"></el-input>
        </template>

        <template v-else-if="field.input === 'number'">
          <el-input type="number" v-model.number="model[field.key]"
            style="width: 100px"></el-input>
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
  </el-card>
</template>

<script>
import _ from 'lodash'

export default {
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
    return {
      model: this.schemaToModel()
    }
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
      let { uid } = this.model
      return uid ? uid.substr(0, 9) : ''
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
.box-card {
  display: inline-block;
  margin-right: 20px;
  margin-top: 20px;
  width: 450px;
}

.item-form {
  margin-bottom: -22px;
  padding-right: 10px;
}
</style>

<style lang="scss">
.card-title {
  i {
    margin-right: 0.3em;
  }
}

.item-form .el-form-item__content {
  margin-left: 90px !important;
}

.el-checkbox, .el-radio {
  margin-right: 15px;
  margin-left: 0 !important;
}
</style>
