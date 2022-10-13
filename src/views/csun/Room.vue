<template>
      <div>
        <el-form :inline="true">
          <el-form-item>
            <el-input
              v-model="searchForm.roomNumber"
              placeholder="Room Number"
              clearable>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="getRoomList">Search</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="dialogVisible = true">Insert</el-button>
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
            prop="roomNumber"
            label="Room Number">
          </el-table-column>
          <el-table-column
            prop="address"
            label="Address"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="status"
            label="Status">
            <template slot-scope="scope">
              <el-tag size="small" v-if="scope.row.status === 1" type="success">Enable</el-tag>
              <el-tag size="small" v-else-if="scope.row.status === 0" type="danger">Disable</el-tag>
            </template>

          </el-table-column>
          <el-table-column
            prop="icon"
            label="Operation">

            <template slot-scope="scope">
              <el-button type="text" @click="editHandle(scope.row.id)">Edit</el-button>
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

        <el-dialog
          title="Room Info"
          :visible.sync="dialogVisible"
          width="600px"
          :before-close="handleClose">

          <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="120px" class="demo-editForm">

            <el-form-item label="Room Number" prop="roomNumber" label-width="120px">
              <el-input v-model="editForm.roomNumber" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="Address" prop="address" label-width="120px">
              <el-input v-model="editForm.address" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="Remark" prop="remark" label-width="120px">
              <el-input v-model="editForm.remark" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="Status" prop="status" label-width="120px">
              <el-radio-group v-model="editForm.status">
                <el-radio :label=0>Disable</el-radio>
                <el-radio :label=1>Enable</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('editForm')">Confirm</el-button>
              <el-button @click="resetForm('editForm')">Close</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog
          title="Set Role"
          :visible.sync="permDialogVisible"
          width="600px">
          <span slot="footer" class="dialog-footer">
        <el-button @click="permDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitPermFormHandle('permForm')">Confirm</el-button>
      </span>
        </el-dialog>

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
      this.$axios.get('/library/room/list', {
        params: {
          roomNumber: this.searchForm.roomNumber,
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
      this.$axios.get('/library/room/info/' + id).then(res => {
        this.editForm = res.data.data
        this.dialogVisible = true
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
