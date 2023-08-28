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

        <el-row :gutter="20">
          <div class="right-section-background">
            <el-col :span="6" v-for="(item, index) in tableData" :key="index">
                <el-button type="primary" @click="showDialog(item)">{{ item.name }}</el-button>
            </el-col>
          </div>
        </el-row>

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
          @close="clearScene"
          :visible.sync="dialogVisible"
          :width="'70%'"
          :title="dialogTitle"
          :before-close="handleClose">
          <div id="three-container" style="width: 1300px; height: 700px;"></div>
        </el-dialog>
      </div>
    </el-col>
  </el-row>

</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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
      treeId: 1,
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
      dialogTitle: '',
      editForm: {},
      multipleSelection: [],
      threeDialogVisible: false,
      renderer: null,
      scene: null,
      camera: null,
      cube: null,
      shouldRender: true
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
      this.$axios.get('/dictionary/options/').then(res => {
        this.options = res.data.data
      })
    },
    showDialog (item) {
      alert(item.id)
      this.$axios.get(`/classEntity/reflectClass/${item.id}`, {
        params: {}
      }).then(res => {
      })
      // 如果scene已经存在，先清理掉
      if (this.scene) {
        this.clearScene()
      }

      this.dialogTitle = item.name
      this.dialogVisible = true
      this.$nextTick(() => {
        this.initThreeScene()
      })
    },
    clearScene () {
      // 1. 删除场景中的所有对象
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0])
      }

      // 2. 如果渲染器存在，从DOM中删除渲染器的元素
      if (this.renderer) {
        const container = document.getElementById('three-container')
        container.removeChild(this.renderer.domElement)
        this.renderer.dispose() // 释放内存
        this.renderer = null
      }

      // 3. 设置其他相关属性为 null 或初始值
      this.scene = null
      this.camera = null
      this.cube = null

      // 4. 停止渲染循环
      this.shouldRender = false
    },
    initThreeScene () {
      if (this.scene) {
        console.warn('Scene already exists')
        return
      }
      const container = document.getElementById('three-container')
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
      // 创建场景
      this.scene = new THREE.Scene()

      // 添加环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      this.scene.add(ambientLight)

      // 添加点光源
      const pointLight = new THREE.PointLight(0xffffff, 0.5)
      pointLight.position.set(2, 3, 4)
      this.scene.add(pointLight)

      // 创建摄像机并设置位置
      const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
      camera.position.set(8, 8, 8) // 设置摄像机位置
      camera.lookAt(0, 0, 0) // 让摄像机看向房间的中心

      // 创建渲染器并添加到 DOM
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(container.offsetWidth, container.offsetHeight)
      container.appendChild(renderer.domElement)

      // 为房间每个面使用不同的颜色
      const roomMaterials = [
        new THREE.MeshBasicMaterial({ color: 0xffaaaa, side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: 0xaaffaa, side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: 0xaaaaff, side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: 0xffffaa, side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: 0xffaaff, side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ color: 0xaaffff, side: THREE.BackSide })
      ]

      // 创建灰色的大房间并使用上面定义的材料
      const roomGeometry = new THREE.BoxGeometry(10, 10, 10)
      const room = new THREE.Mesh(roomGeometry, roomMaterials)
      this.scene.add(room)

      // 为房间添加边缘线
      const edges = new THREE.EdgesGeometry(roomGeometry)
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }))
      this.scene.add(line)

      // 添加 OrbitControls 控制
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.update()

      this.shouldRender = true

      const animate = function () {
        if (this.shouldRender) {
          controls.update()
          requestAnimationFrame(animate)
          renderer.render(this.scene, camera)
        }
      }.bind(this)
      animate()
    },
    // removeCubeFromScene () {
    //   this.shouldRender = false
    //   if (this.cube && this.scene) {
    //     this.scene.remove(this.cube)
    //     this.cube = null
    //   }
    // },
    resetForm (formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
      this.dialogVisible = false
      this.editForm = {}
    },
    handleClose () {
      this.clearScene()
      this.resetForm('editForm')
    },
    getBookshelfList (search, tree) {
      if (search) {
        this.treeId = ''
      }
      if (tree) {
        this.searchForm.bookshelfCode = ''
      }
      this.$axios.get('/classEntity/findAllByDicId', {
        params: {
          treeId: this.treeId,
          code: this.searchForm.bookshelfCode,
          current: this.current,
          size: this.size
        }
      }).then(res => {
        this.tableData = res.data.data
        // if (res.data.data && res.data.data.pageable) {
        //   this.size = res.data.data.pageable.pageSize
        //   this.current = res.data.data.pageable.pageNumber + 1
        // }
        // this.total = res.data.data.totalElements
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/classEntity/' + (this.editForm.id ? 'update' : 'save'), this.editForm, {
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
      this.$axios.get('/classEntity/info/' + id).then(res => {
        this.editForm = res.data.data
        this.value = res.data.data.room.id
        this.dialogVisible = true
      })
      this.$axios.get('/dictionary/options/').then(res => {
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
      this.$axios.post('/classEntity/delete', ids).then(res => {
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
      this.$axios.get('/dictionary/tree').then(res => {
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
.el-row {
  display: flex;
}
.el-col {
  display: flex;
  flex-direction: column;
}
.right-section-background {
  width: 80%;
  background-color: #FFFFFF;
  border: 1px solid #d1d1d1;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 60vh;  /* 设置高度为视口的90% */
  overflow-y: auto;  /* 如果内容超出该高度，允许滚动 */
}
</style>
