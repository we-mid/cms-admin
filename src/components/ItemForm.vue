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

        <template v-else-if="field.input === 'image-upload'">
          <el-upload class="image-upload"
              accept="image/*"
              action="https://jsonplaceholder.typicode.com/posts/"
              :file-list="toFileList(field)"
              :on-remove="getMethodByField(field, 'imageRemove')"
              :on-success="getMethodByField(field, 'imageUploadSuccess')"
              :before-upload="getMethodByField(field, 'imageBeforeUpload')"
              list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
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
    imageBeforeUpload (field, file) {
      console.log('imageBeforeUpload', file)
      let { limitKB, extensions } = field
      limitKB = limitKB || 500
      extensions = extensions || ['jpg', 'png']
      let mimes = extensions.map(v => {
        v = v.toLowerCase()
        v = { jpg: 'jpeg' }[v] || v
        return `image/${v}`
      })
      let isType = _.contains(mimes, file.type)
      let isLimit = file.size / 1024 < limitKB
      let ret = isType && isLimit
      if (!ret) {
        this.$notify({
          type: 'warning',
          title: '图片上传失败',
          message: `图片应为${extensions.join('/')}格式，且小于${limitKB}KB`
        })
      }
      return ret
    },
    imageUploadSuccess (field, res, file) {
      console.log('imageUploadSuccess', res, file)
      let arr = this.model[field.key]
      arr = arr.concat(res.id)
      arr = _.uniq(arr)
      this.model[field.key] = arr
    },
    imageRemove (field, file) {
      let arr = this.model[field.key]
      arr = _.reject(arr, id => {
        return file.url === this.fileIdToURL(id)
      })
      this.model[field.key] = arr
    },
    getMethodByField (field, method) {
      return (...args) => {
        return this[method](field, ...args)
      }
    },
    fileIdToURL (id) {
      return `http://localhost/my/file/${id}`
    },
    toFileList (field) {
      return this.model[field.key].map(id => {
        return {
          url: this.fileIdToURL(id)
        }
      })
    },

    schemaToModel () {
      return this.schema.fields
        .reduce((acc, field) => {
          if (_.contains(['image-upload'], field.input)) {
            acc[field.key] = []
          } else {
            acc[field.key] = ''
          }
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

<style lang="scss">
$w: 100px;
.image-upload {
  .el-upload {
    width: $w;
    height: $w;
    line-height: $w + 8px;
  }
  .el-upload-list__item {
    width: $w !important;
    height: $w !important;
  }
}
</style>

<style lang="scss" scoped>
.box-card {
  display: inline-block;
  margin-right: 20px;
  margin-top: 20px;
  width: 460px;
}

.item-form {
  margin-bottom: -22px;
  padding-right: 10px;
}
</style>

<style lang="scss">
.item-form .el-form-item__content {
  margin-left: 90px !important;
}

.el-checkbox, .el-radio {
  margin-right: 15px;
  margin-left: 0 !important;
}
</style>
