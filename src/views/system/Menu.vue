<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true">Insert</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      stripe
      default-expand-all>
      <el-table-column
        prop="name"
        label="name"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="perm"
        label="perm"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="icon"
        label="icon"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="type"
        sortable
        width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1">Category</el-tag>
          <el-tag v-else-if="scope.row.type === 2" type="success">Menu</el-tag>
          <el-tag v-else-if="scope.row.type === 3" type="info">Button</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="path"
        label="URL"
        sortable
        width="180">
      </el-table-column>

      <el-table-column
        prop="component"
        label="component"
        sortable
        width="180">
      </el-table-column>

      <el-table-column
        prop="sequence"
        label="sequence"
        sortable
        width="180">
      </el-table-column>

      <el-table-column
        prop="status"
        label="status"
        sortable
        width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">Enable</el-tag>
          <el-tag v-else-if="scope.row.status === 0" type="danger">Disable</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="operation"
        label="operation"
        sortable
        width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="editHandle(scope.row.id)">Edit</el-button>
          <el-divider direction="vertical"></el-divider>
          <template>
            <el-popconfirm title="Are you sure to delete this?" @confirm="delHandle(scope.row.id)">
              <el-button slot="reference">Delete</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog
      title="Tips"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

        <el-form-item label="Parent Menu" prop="parentId">
          <el-select v-model="ruleForm.parentId" placeholder="please select parent Menu">
            <template v-for="item in tableData">
              <el-option :label="item.name" :value="item.id" :key="item.id"></el-option>
              <template v-for="child in item.children">
                <el-option :label="child.name" :value="child.id" :key="child.id">
                  <span>{{ '-' + child.name }}</span>
                </el-option>
              </template>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="Menu Name" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="Perm" prop="perms" label-width="100px">
          <el-input v-model="ruleForm.perms" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Icon" prop="icon" label-width="100px">
          <el-input v-model="ruleForm.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="path" label-width="100px">
          <el-input v-model="ruleForm.path" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Component" prop="component" label-width="100px">
          <el-input v-model="ruleForm.component" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="Type" prop="type" label-width="100px">
          <el-radio-group v-model="ruleForm.type">
            <el-radio :label=0>Category</el-radio>
            <el-radio :label=1>Menu</el-radio>
            <el-radio :label=2>Button</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Status" prop="statue" label-width="100px">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label=0>Disable</el-radio>
            <el-radio :label=1>Enable</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Sequences" prop="orderNum" label-width="100px">
          <el-input-number v-model="ruleForm.orderNum" :min="1" label="Sequences No">1</el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">Create</el-button>
          <el-button @click="resetForm('ruleForm')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        parentId: [
          {
            required: true,
            message: '请选择上级菜单',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }
        ],
        perms: [
          {
            required: true,
            message: '请输入权限编码',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择状态',
            trigger: 'blur'
          }
        ],
        orderNum: [
          {
            required: true,
            message: '请填入排序号',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '请选择状态',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getMenuTree () {
      this.$axios.get('/sys/menu/list').then(res => {
        this.tableData = res.data.data
      })
    },
    delHandle (id) {
      this.$axios.post('/sys/menu/delete/' + id).then(res => {
        this.$message({
          showClose: true,
          message: 'delete success',
          type: 'success',
          onClose: () => {
            this.getMenuTree()
          }
        })
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.ruleForm = {}
    },
    handleClose () {
      this.dialogVisible = false
      this.resetForm('ruleForm')
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/sys/menu/' + (this.ruleForm.id ? 'update' : 'save'), this.ruleForm).then(res => {
            this.$message({
              showClose: true,
              message: 'Success',
              type: 'success',
              onClose: () => {
                this.getMenuTree()
              }
            })
            this.dialogVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editHandle (id) {
      this.$axios.get('/sys/menu/info/' + id).then(res => {
        this.ruleForm = res.data.data
        this.dialogVisible = true
      })
    }
  },
  created () {
    this.getMenuTree()
  }
}
</script>

<style scoped>

</style>
