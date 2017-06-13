<template>
  <div>
    <el-form :inline="schema.inline" :model="model" label-width="80px" class="form-gen">
      <!-- todo: vue :component="xx" -->
      <el-form-item v-for="f in schema.fields"
          :key="f.key"
          :label="f.label">
        <template v-if="f.input === 'text'">
          <el-input v-model="model[f.key]"
            :placeholder="f.placeholder"
            :class="f.cls"
            :size="schema.size"></el-input>
        </template>

        <template v-else-if="f.input === 'number'">
          <el-input type="number" v-model.number="model[f.key]"
            style="width: 100px"
            :placeholder="f.placeholder"
            :class="f.cls"
            :size="schema.size"></el-input>
        </template>

        <template v-else-if="f.input === 'textarea'">
          <el-input type="textarea" v-model="model[f.key]"
            :placeholder="f.placeholder"
            :class="f.cls"
            :size="schema.size"></el-input>
        </template>

        <template v-else-if="f.input === 'select'">
          <el-select v-model="model[f.key]"
              :placeholder="f.placeholder"
              :class="f.cls"
              :size="schema.size">
            <el-option
              v-for="o in getOptionsByField(f)"
              :key="o.value"
              :label="o.label"
              :value="o.value">
            </el-option>
          </el-select>
        </template>

        <template v-else-if="f.input === 'radio-group'">
          <el-radio-group v-model="model[f.key]"
              :class="f.cls"
              :size="schema.size">
            <el-radio v-for="option in f.options"
                :key="option.value"
                :label="option.value">
              {{option.label}}
            </el-radio>
          </el-radio-group>
        </template>

        <template v-else-if="f.input === 'image-upload'">
          <el-upload class="image-upload"
              accept="image/*"
              :action="uploadUrl"
              :file-list="model[f]"
              :on-preview="imagePreview"
              :on-remove="getMethodByField(f, 'imageRemove')"
              :on-success="getMethodByField(f, 'imageUploadSuccess')"
              :before-upload="getMethodByField(f, 'imageBeforeUpload')"
              :class="f.cls"
              :size="schema.size"
              list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
        </template>
      </el-form-item>

      <el-form-item>
        <el-button v-for="b in schema.buttons" :key="b.text"
            :type="b.type" @click="$emit(b.emit)"
            :class="b.cls"
            :size="schema.size">
          {{b.text}}
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
    schema: {
      // `schema` is required in `data` method
      // so it has to be specified before rendering an `FormGen`
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

    getOptionsByField (field) {
      let ret = [...field.options]
      if (field.allowEmpty) {
        ret.unshift({ value: '', label: '' })
      }
      return ret
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

.el-checkbox, .el-radio {
  margin-right: 15px;
  margin-left: 0 !important;
}
</style>
