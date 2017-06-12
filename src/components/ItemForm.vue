<template>
  <div>
    <el-form :model="model" label-width="80px" class="item-form">
      <!-- todo: vue :component="xx" -->
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
              :data="{ a: 1, b: 2 }"
              :action="uploadUrl"
              :file-list="model[field]"
              :on-preview="imagePreview"
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

    <el-dialog v-model="showPreview" size="small">
      <img width="100%" :src="previewUrl">
    </el-dialog>
  </div>
</template>

<script>
import { uploadDir, uploadUrl } from '@/../config'
import _ from 'lodash'

export default {
  props: {
    buttons: Array,
    schema: {
      // `schema` is required in `data` method
      // so it has to be specified before rendering an `ItemForm`
      required: true,
      type: Object
    }
  },

  data () {
    return {
      showPreview: false,
      previewUrl: '',
      uploadUrl,
      model: this.schemaToModel()
    }
  },

  methods: {
    imagePreview (file) {
      this.previewUrl = file.url
      this.showPreview = true
    },
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
      let isType = _.includes(mimes, file.type)
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
      arr = arr.concat({ url: this.fileIdToURL(res.id) })
      arr = _.uniqBy(arr, 'url')
      this.model[field.key] = arr
    },
    imageRemove (field, file) {
      let arr = this.model[field.key]
      arr = _.reject(arr, item => {
        return item.url === file.url
      })
      this.model[field.key] = arr
    },
    getMethodByField (field, method) {
      return (...args) => {
        return this[method](field, ...args)
      }
    },
    fileIdToURL (id) {
      return `${uploadDir}/${id}`
    },

    schemaToModel () {
      return this.schema.fields
        .reduce((acc, field) => {
          if (_.includes(['image-upload'], field.input)) {
            acc[field.key] = []
          } else {
            acc[field.key] = ''
          }
          return acc
        }, {})
    },
    getModel () {
      return this.model
    },
    reset (model) {
      if (model) {
        this.model = _.clone(model)
      } else {
        this.model = this.schemaToModel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.item-form {
  margin-bottom: -22px;
  padding-right: 10px;
}
</style>

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

.item-form .el-form-item__content {
  margin-left: 90px !important;
}

.el-checkbox, .el-radio {
  margin-right: 15px;
  margin-left: 0 !important;
}
</style>
