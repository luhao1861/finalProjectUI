<template>
      <div>
        <el-form :inline="true">
          <el-form-item>
            <el-input
              v-model="searchForm.roomNumber"
              placeholder="Jar FileName"
              clearable>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="getRoomList">Search</el-button>
          </el-form-item>
          <el-form-item>
            <el-popconfirm title="Do you confirm this multiple deletion?" @confirm="delHandle(null)">
              <el-button type="danger" slot="reference" :disabled="delBtlStatue">Multi-del</el-button>
            </el-popconfirm>
          </el-form-item>
        </el-form>

        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          border
          stripe
          @selection-change="handleSelectionChange">

          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="fileName"
            label="File Name">
          </el-table-column>
          <el-table-column
            prop="path"
            label="Path"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="status"
            label="Status">
            <template slot-scope="scope">
              <el-tag size="small" v-if="scope.row.status === 1" type="success">Current Analysis</el-tag>
              <el-tag size="small" v-else-if="scope.row.status === 0" type="danger">Unanalysis</el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="icon"
            label="Operation">

            <template slot-scope="scope">
              <el-button type="text" @click="editHandle(scope.row.id)">Analysis</el-button>
              <el-divider direction="vertical"></el-divider>

              <template>
                <el-popconfirm title="Do you confirm this deletion?" @confirm="delHandle(scope.row.id)">
                  <el-button type="text" slot="reference">Delete</el-button>
                </el-popconfirm>
              </template>

            </template>
          </el-table-column>

        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :current-page="current"
          :page-size="size"
          :total="total">
        </el-pagination>
      </div>
</template>

<script>
export default {
  name: 'Room',
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  created () {
    this.getRoomList()
  },
  data () {
    return {
      tableData: [],
      searchForm: {},
      delBtlStatue: true,
      total: 0,
      size: 10,
      current: 1,
      dialogVisible: false,
      editForm: {},
      editFormRules: {
        roomNumber: [
          {
            required: true,
            message: 'please input room number',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: 'please input address',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: 'please select status',
            trigger: 'blur'
          }
        ]
      },

      multipleSelection: []
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.delBtlStatue = val.length === 0
    },

    handleSizeChange (val) {
      console.log(`${val} in page`)
      this.size = val
      this.getRoomList()
    },
    handleCurrentChange (val) {
      console.log(`current page: ${val}`)
      this.current = val
      this.getRoomList()
    },

    resetForm (formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
      this.dialogVisible = false
      this.editForm = {}
    },
    handleClose () {
      this.resetForm('editForm')
    },

    getRoomList () {
      this.$axios.get('/file/list', {
        params: {
          current: this.current,
          size: this.size
        }
      }).then(res => {
        this.tableData = res.data.data.content
        this.size = res.data.data.pageable.pageSize
        this.current = res.data.data.pageable.pageNumber + 1
        this.total = res.data.data.totalElements
      })
    },

    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/library/room/' + (this.editForm.id ? 'update' : 'save'), this.editForm)
            .then(res => {
              this.$message({
                showClose: true,
                message: 'success',
                type: 'success',
                onClose: () => {
                  this.getRoomList()
                }
              })

              this.dialogVisible = false
              this.resetForm(formName)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editHandle (id) {
      this.$axios.get('/file/analysis/' + id).then(res => {
        this.$message({
          showClose: true,
          message: 'success',
          type: 'success',
          onClose: () => {
            this.getRoomList()
          }
        })
      })
    },
    delHandle (id) {
      var ids = []
      if (id) {
        ids.push(id)
      } else {
        this.multipleSelection.forEach(row => {
          ids.push(row.id)
        })
      }
      console.log(ids)
      this.$axios.post('/library/room/delete', ids).then(res => {
        this.$message({
          showClose: true,
          message: 'success',
          type: 'success',
          onClose: () => {
            this.getRoomList()
          }
        })
      })
    }
  }

}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>
