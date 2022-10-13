<template>
  <el-row :gutter="20">
    <el-col :span="6"><div>
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        :file-list="fileList"
        :http-request="getFile"
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Drop Jar file here or <em>click to upload</em></div>
        <div class="el-upload__tip" slot="tip">Jar files with a size less than 500kb</div>
      </el-upload>
      <el-button size="small" type="success" @click="upload">upload</el-button>
      </div>
    </el-col>
  </el-row>

</template>

<script>
export default {

  name: 'Bookshelf',
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  data () {
    return {
      file: {},
      fileList: []
    }
  },
  methods: {
    getFile (item) {
      console.log(item.file)
      this.file = item.file
    },
    upload () {
      const fd = new FormData()
      fd.append('filename', this.file)
      const config = { headers: { 'Content-Type': 'multipart/form-data' } }
      this.$axios.post('/file/upload/', fd, config).then(res => {
        this.$message({
          showClose: true,
          message: 'success',
          type: 'success'
        })
      })
    }
  },
  created () {
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>
