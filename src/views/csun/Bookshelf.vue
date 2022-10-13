<template>
  <el-row :gutter="20">
    <el-col :span="6"><div>
      <el-input
        placeholder="Filter keyword"
        v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :data="data"
        @node-click="handleNodeClick"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree">
      </el-tree>
    </div>
    </el-col>
    <el-col :span="18">
      <div>
        <el-form :inline="true">
          <el-form-item>
            <el-input
              v-model="searchForm.bookshelfCode"
              placeholder="Shelf Code"
              clearable>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="getBookshelfList('serach')">Search</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="clickInsertButton()">Insert</el-button>
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
            prop="bookshelfCode"
            label="Bookshelf Code"
            width="130">
          </el-table-column>
          <el-table-column
            prop="bookshelfCapacity"
            label="Capacity"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="bookshelfColor"
            label="Color"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="bookshelfLayers"
            label="Layers"
            show-overflow-tooltip>
          </el-table-column>

          <el-table-column
            prop="room.roomNumber"
            label="Room"
            show-overflow-tooltip>
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
          title="Bookshelf Info"
          :visible.sync="dialogVisible"
          width="600px"
          :before-close="handleClose">

          <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

            <el-form-item label="Code" prop="bookshelfCode" label-width="100px">
              <el-input v-model="editForm.bookshelfCode" autocomplete="off" style="width: 400px"></el-input>
            </el-form-item>

            <el-form-item label="Capacity" prop="bookshelfCapacity" label-width="100px">
              <el-input v-model.number="editForm.bookshelfCapacity" autocomplete="off" style="width: 400px"></el-input>
            </el-form-item>

            <el-form-item label="Color" prop="bookshelfColor" label-width="100px">
              <el-input v-model="editForm.bookshelfColor" autocomplete="off" style="width: 400px"></el-input>
            </el-form-item>

            <el-form-item label="Layers" prop="bookshelfLayers" label-width="100px">
              <el-input v-model.number="editForm.bookshelfLayers" autocomplete="off" style="width: 400px"></el-input>
            </el-form-item>

            <el-form-item label="Room" prop="room" label-width="100px">
            <el-select v-model="value" placeholder="please select a room" style="width: 400px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('editForm')">Confirm</el-button>
              <el-button @click="resetForm('editForm')">Close</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
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
      tableData: [],
      treeId: '',
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      options: [],
      value: '',
      searchForm: {},
      delBtlStatue: true,
      total: 0,
      size: 10,
      current: 1,
      dialogVisible: false,
      editForm: {},
      editFormRules: {
        bookshelfCode: [
          {
            required: true,
            message: 'please input name',
            trigger: 'blur'
          }
        ],
        bookshelfCapacity: [
          {
            required: true,
            message: 'please input the number of bookshelf capacity',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: 'must be number'
          }
        ],
        bookshelfColor: [
          {
            required: true,
            message: 'please input bookshelf color',
            trigger: 'blur'
          }
        ],
        bookshelfLayers: [
          {
            required: true,
            message: 'please input the number of bookshelf layers',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: 'must be number'
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
    handleNodeClick (data) {
      this.treeId = data.id
      this.getBookshelfList(null, this.treeId)
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
      this.delBtlStatu = val.length === 0
    },
    handleSizeChange (val) {
      console.log(`${val} in page`)
      this.size = val
      this.getBookshelfList()
    },
    handleCurrentChange (val) {
      console.log(`current page: ${val}`)
      this.current = val
      this.getBookshelfList()
    },
    clickInsertButton () {
      this.dialogVisible = true
      this.$axios.get('/library/room/options/').then(res => {
        this.options = res.data.data
      })
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
    getBookshelfList (search, tree) {
      if (search) {
        this.treeId = ''
      }
      if (tree) {
        this.searchForm.bookshelfCode = ''
      }
      this.$axios.get('/library/bookshelf/list', {
        params: {
          treeId: this.treeId,
          code: this.searchForm.bookshelfCode,
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
          this.$axios.post('/library/bookshelf/' + (this.editForm.id ? 'update' : 'save'), this.editForm, {
            params: {
              roomId: this.value
            }
          })
            .then(res => {
              this.$message({
                showClose: true,
                message: 'success',
                type: 'success',
                onClose: () => {
                  this.getBookshelfList()
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
      this.$axios.get('/library/bookshelf/info/' + id).then(res => {
        this.editForm = res.data.data
        this.value = res.data.data.room.id
        this.dialogVisible = true
      })
      this.$axios.get('/library/room/options/').then(res => {
        this.options = res.data.data
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
      this.$axios.post('/library/bookshelf/delete', ids).then(res => {
        this.$message({
          showClose: true,
          message: 'success',
          type: 'success',
          onClose: () => {
            this.getBookshelfList()
          }
        })
      })
    },
    getRoomTree () {
      this.$axios.get('/library/room/tree').then(res => {
        this.data = res.data.data
      })
    }
  },
  created () {
    this.getRoomTree()
    this.getBookshelfList()
  }
}
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 22px;
}
</style>
