<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="searchForm.name"
          placeholder="name"
          clearable
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="getRoleList">Search</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true">Insert</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="Do you confirm this multiple deletion?" @confirm="delHandle(null)">
          <el-button type="danger" slot="reference" :disabled="delBtlStatu">Multi-del</el-button>
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
        prop="name"
        label="name"
        width="120">
      </el-table-column>
      <el-table-column
        prop="code"
        label="code"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="remark"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        prop="status"
        label="status">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === 1" type="success">Enable</el-tag>
          <el-tag size="small" v-else-if="scope.row.status === 0" type="danger">Disable</el-tag>
        </template>

      </el-table-column>
      <el-table-column
        prop="icon"
        label="Operation">

        <template slot-scope="scope">
          <el-button type="text" @click="permHandle(scope.row.id)">Role</el-button>
          <el-divider direction="vertical"></el-divider>

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
      title="Notification"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose">

      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

        <el-form-item label="name" prop="name" label-width="100px">
          <el-input v-model="editForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="code" prop="code" label-width="100px">
          <el-input v-model="editForm.code" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="remark" prop="remark" label-width="100px">
          <el-input v-model="editForm.remark" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="status" prop="status" label-width="100px">
          <el-radio-group v-model="editForm.status">
            <el-radio :label=0>Disable</el-radio>
            <el-radio :label=1>Enable</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')">Confirm</el-button>
          <el-button @click="resetForm('editForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="Set Role"
      :visible.sync="permDialogVisible"
      width="600px">
      <el-form :model="permForm">
        <el-tree
          :data="permTreeData"
          show-checkbox
          ref="permTree"
          :default-expand-all=true
          node-key="id"
          :check-strictly=true
          :props="defaultProps">
        </el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitPermFormHandle('permForm')">Confirm</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Role',
  data () {
    return {
      searchForm: {},
      delBtlStatu: true,
      total: 0,
      size: 10,
      current: 1,
      dialogVisible: false,
      editForm: {},

      tableData: [],

      editFormRules: {
        name: [
          {
            required: true,
            message: 'please input name',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: 'please input only code',
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

      multipleSelection: [],

      permDialogVisible: false,
      permForm: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      permTreeData: []
    }
  },
  created () {
    this.getRoleList()
    this.$axios.get('/sys/menu/list').then(res => {
      this.permTreeData = res.data.data
    })
  },
  methods: {
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

      this.delBtlStatu = val.length === 0
    },

    handleSizeChange (val) {
      console.log(`${val} in page`)
      this.size = val
      this.getRoleList()
    },
    handleCurrentChange (val) {
      console.log(`current page: ${val}`)
      this.current = val
      this.getRoleList()
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

    getRoleList () {
      this.$axios.get('/sys/role/list', {
        params: {
          name: this.searchForm.name,
          current: this.current,
          size: this.size
        }
      }).then(res => {
        this.tableData = res.data.data
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },

    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/sys/role/' + (this.editForm.id ? 'update' : 'save'), this.editForm)
            .then(res => {
              this.$message({
                showClose: true,
                message: 'success',
                type: 'success',
                onClose: () => {
                  this.getRoleList()
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
      this.$axios.get('/sys/role/info/' + id).then(res => {
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

      this.$axios.post('/sys/role/delete', ids).then(res => {
        this.$message({
          showClose: true,
          message: 'success',
          type: 'success',
          onClose: () => {
            this.getRoleList()
          }
        })
      })
    },
    permHandle (id) {
      this.permDialogVisible = true

      this.$axios.get('/sys/role/info/' + id).then(res => {
        this.$refs.permTree.setCheckedKeys(res.data.data.menuIds)
        this.permForm = res.data.data
      })
    },

    submitPermFormHandle (formName) {
      var menuIds = this.$refs.permTree.getCheckedKeys()

      console.log(menuIds)

      this.$axios.post('/sys/role/perm/' + this.permForm.id, menuIds).then(res => {
        this.$message({
          showClose: true,
          message: 'success',
          type: 'success',
          onClose: () => {
            this.getRoleList()
          }
        })
        this.permDialogVisible = false
        this.resetForm(formName)
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
