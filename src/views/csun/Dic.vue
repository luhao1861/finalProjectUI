<template>
  <el-row :gutter="20">
    <el-col :span="10"><div>
      <el-input
        placeholder="Filter keyword"
        v-model="filterText">
      </el-input>
      <svg id="circlePacking" width="650" height="700"></svg>
    </div>
    </el-col>
    <el-col :span="14">
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
import * as d3 from 'd3'
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
    createCirclePacking () {
      var flareData = {
        name: 'flare',
        children: [
          {
            name: 'analytics',
            children: [
              {
                name: 'cluster',
                children: [
                  { name: 'AgglomerativeCluster', size: 3938 },
                  { name: 'CommunityStructure', size: 3812 },
                  { name: 'HierarchicalCluster', size: 6714 },
                  { name: 'MergeEdge', size: 743 }
                ]
              },
              {
                name: 'graph',
                children: [
                  { name: 'BetweennessCentrality', size: 3534 },
                  { name: 'LinkDistance', size: 5731 },
                  { name: 'MaxFlowMinCut', size: 7840 },
                  { name: 'ShortestPaths', size: 5914 },
                  { name: 'SpanningTree', size: 3416 }
                ]
              },
              {
                name: 'optimization',
                children: [
                  { name: 'AspectRatioBanker', size: 7074 }
                ]
              }
            ]
          },
          {
            name: 'animate',
            children: [
              { name: 'Easing', size: 17010 },
              { name: 'FunctionSequence', size: 5842 },
              {
                name: 'interpolate',
                children: [
                  { name: 'ArrayInterpolator', size: 1983 },
                  { name: 'ColorInterpolator', size: 2047 },
                  { name: 'DateInterpolator', size: 1375 },
                  { name: 'Interpolator', size: 8746 },
                  { name: 'MatrixInterpolator', size: 2202 },
                  { name: 'NumberInterpolator', size: 1382 },
                  { name: 'ObjectInterpolator', size: 1629 },
                  { name: 'PointInterpolator', size: 1675 },
                  { name: 'RectangleInterpolator', size: 2042 }
                ]
              },
              { name: 'ISchedulable', size: 1041 },
              { name: 'Parallel', size: 5176 },
              { name: 'Pause', size: 449 },
              { name: 'Scheduler', size: 5593 },
              { name: 'Sequence', size: 5534 },
              { name: 'Transition', size: 9201 },
              { name: 'Transitioner', size: 19975 },
              { name: 'TransitionEvent', size: 1116 },
              { name: 'Tween', size: 6006 }
            ]
          },
          {
            name: 'data',
            children: [
              {
                name: 'converters',
                children: [
                  { name: 'Converters', size: 721 },
                  { name: 'DelimitedTextConverter', size: 4294 },
                  { name: 'GraphMLConverter', size: 9800 },
                  { name: 'IDataConverter', size: 1314 },
                  { name: 'JSONConverter', size: 2220 }
                ]
              },
              { name: 'DataField', size: 1759 },
              { name: 'DataSchema', size: 2165 },
              { name: 'DataSet', size: 586 },
              { name: 'DataSource', size: 3331 },
              { name: 'DataTable', size: 772 },
              { name: 'DataUtil', size: 3322 }
            ]
          },
          {
            name: 'display',
            children: [
              { name: 'DirtySprite', size: 8833 },
              { name: 'LineSprite', size: 1732 },
              { name: 'RectSprite', size: 3623 },
              { name: 'TextSprite', size: 10066 }
            ]
          },
          {
            name: 'flex',
            children: [
              { name: 'FlareVis', size: 4116 }
            ]
          },
          {
            name: 'physics',
            children: [
              { name: 'DragForce', size: 1082 },
              { name: 'GravityForce', size: 1336 },
              { name: 'IForce', size: 319 },
              { name: 'NBodyForce', size: 10498 },
              { name: 'Particle', size: 2822 },
              { name: 'Simulation', size: 9983 },
              { name: 'Spring', size: 2213 },
              { name: 'SpringForce', size: 1681 }
            ]
          },
          {
            name: 'query',
            children: [
              { name: 'AggregateExpression', size: 1616 },
              { name: 'And', size: 1027 },
              { name: 'Arithmetic', size: 3891 },
              { name: 'Average', size: 891 },
              { name: 'BinaryExpression', size: 2893 },
              { name: 'Comparison', size: 5103 },
              { name: 'CompositeExpression', size: 3677 },
              { name: 'Count', size: 781 },
              { name: 'DateUtil', size: 4141 },
              { name: 'Distinct', size: 933 },
              { name: 'Expression', size: 5130 },
              { name: 'ExpressionIterator', size: 3617 },
              { name: 'Fn', size: 3240 },
              { name: 'If', size: 2732 },
              { name: 'IsA', size: 2039 },
              { name: 'Literal', size: 1214 },
              { name: 'Match', size: 3748 },
              { name: 'Maximum', size: 843 },
              {
                name: 'methods',
                children: [
                  { name: 'add', size: 593 },
                  { name: 'and', size: 330 },
                  { name: 'average', size: 287 },
                  { name: 'count', size: 277 },
                  { name: 'distinct', size: 292 },
                  { name: 'div', size: 595 },
                  { name: 'eq', size: 594 },
                  { name: 'fn', size: 460 },
                  { name: 'gt', size: 603 },
                  { name: 'gte', size: 625 },
                  { name: 'iff', size: 748 },
                  { name: 'isa', size: 461 },
                  { name: 'lt', size: 597 },
                  { name: 'lte', size: 619 },
                  { name: 'max', size: 283 },
                  { name: 'min', size: 283 },
                  { name: 'mod', size: 591 },
                  { name: 'mul', size: 603 },
                  { name: 'neq', size: 599 },
                  { name: 'not', size: 386 },
                  { name: 'or', size: 323 },
                  { name: 'orderby', size: 307 },
                  { name: 'range', size: 772 },
                  { name: 'select', size: 296 },
                  { name: 'stddev', size: 363 },
                  { name: 'sub', size: 600 },
                  { name: 'sum', size: 280 },
                  { name: 'update', size: 307 },
                  { name: 'variance', size: 335 },
                  { name: 'where', size: 299 },
                  { name: 'xor', size: 354 },
                  { name: '_', size: 264 }
                ]
              },
              { name: 'Minimum', size: 843 },
              { name: 'Not', size: 1554 },
              { name: 'Or', size: 970 },
              { name: 'Query', size: 13896 },
              { name: 'Range', size: 1594 },
              { name: 'StringUtil', size: 4130 },
              { name: 'Sum', size: 791 },
              { name: 'Variable', size: 1124 },
              { name: 'Variance', size: 1876 },
              { name: 'Xor', size: 1101 }
            ]
          },
          {
            name: 'scale',
            children: [
              { name: 'IScaleMap', size: 2105 },
              { name: 'LinearScale', size: 1316 },
              { name: 'LogScale', size: 3151 },
              { name: 'OrdinalScale', size: 3770 },
              { name: 'QuantileScale', size: 2435 },
              { name: 'QuantitativeScale', size: 4839 },
              { name: 'RootScale', size: 1756 },
              { name: 'Scale', size: 4268 },
              { name: 'ScaleType', size: 1821 },
              { name: 'TimeScale', size: 5833 }
            ]
          },
          {
            name: 'util',
            children: [
              { name: 'Arrays', size: 8258 },
              { name: 'Colors', size: 10001 },
              { name: 'Dates', size: 8217 },
              { name: 'Displays', size: 12555 },
              { name: 'Filter', size: 2324 },
              { name: 'Geometry', size: 10993 },
              {
                name: 'heap',
                children: [
                  { name: 'FibonacciHeap', size: 9354 },
                  { name: 'HeapNode', size: 1233 }
                ]
              },
              { name: 'IEvaluable', size: 335 },
              { name: 'IPredicate', size: 383 },
              { name: 'IValueProxy', size: 874 },
              {
                name: 'math',
                children: [
                  { name: 'DenseMatrix', size: 3165 },
                  { name: 'IMatrix', size: 2815 },
                  { name: 'SparseMatrix', size: 3366 }
                ]
              },
              { name: 'Maths', size: 17705 },
              { name: 'Orientation', size: 1486 },
              {
                name: 'palette',
                children: [
                  { name: 'ColorPalette', size: 6367 },
                  { name: 'Palette', size: 1229 },
                  { name: 'ShapePalette', size: 2059 },
                  { name: 'SizePalette', size: 2291 }
                ]
              },
              { name: 'Property', size: 5559 },
              { name: 'Shapes', size: 19118 },
              { name: 'Sort', size: 6887 },
              { name: 'Stats', size: 6557 },
              { name: 'Strings', size: 22026 }
            ]
          },
          {
            name: 'vis',
            children: [
              {
                name: 'axis',
                children: [
                  { name: 'Axes', size: 1302 },
                  { name: 'Axis', size: 24593 },
                  { name: 'AxisGridLine', size: 652 },
                  { name: 'AxisLabel', size: 636 },
                  { name: 'CartesianAxes', size: 6703 }
                ]
              },
              {
                name: 'controls',
                children: [
                  { name: 'AnchorControl', size: 2138 },
                  { name: 'ClickControl', size: 3824 },
                  { name: 'Control', size: 1353 },
                  { name: 'ControlList', size: 4665 },
                  { name: 'DragControl', size: 2649 },
                  { name: 'ExpandControl', size: 2832 },
                  { name: 'HoverControl', size: 4896 },
                  { name: 'IControl', size: 763 },
                  { name: 'PanZoomControl', size: 5222 },
                  { name: 'SelectionControl', size: 7862 },
                  { name: 'TooltipControl', size: 8435 }
                ]
              },
              {
                name: 'data',
                children: [
                  { name: 'Data', size: 20544 },
                  { name: 'DataList', size: 19788 },
                  { name: 'DataSprite', size: 10349 },
                  { name: 'EdgeSprite', size: 3301 },
                  { name: 'NodeSprite', size: 19382 },
                  {
                    name: 'render',
                    children: [
                      { name: 'ArrowType', size: 698 },
                      { name: 'EdgeRenderer', size: 5569 },
                      { name: 'IRenderer', size: 353 },
                      { name: 'ShapeRenderer', size: 2247 }
                    ]
                  },
                  { name: 'ScaleBinding', size: 11275 },
                  { name: 'Tree', size: 7147 },
                  { name: 'TreeBuilder', size: 9930 }
                ]
              },
              {
                name: 'events',
                children: [
                  { name: 'DataEvent', size: 2313 },
                  { name: 'SelectionEvent', size: 1880 },
                  { name: 'TooltipEvent', size: 1701 },
                  { name: 'VisualizationEvent', size: 1117 }
                ]
              },
              {
                name: 'legend',
                children: [
                  { name: 'Legend', size: 20859 },
                  { name: 'LegendItem', size: 4614 },
                  { name: 'LegendRange', size: 10530 }
                ]
              },
              {
                name: 'operator',
                children: [
                  {
                    name: 'distortion',
                    children: [
                      { name: 'BifocalDistortion', size: 4461 },
                      { name: 'Distortion', size: 6314 },
                      { name: 'FisheyeDistortion', size: 3444 }
                    ]
                  },
                  {
                    name: 'encoder',
                    children: [
                      { name: 'ColorEncoder', size: 3179 },
                      { name: 'Encoder', size: 4060 },
                      { name: 'PropertyEncoder', size: 4138 },
                      { name: 'ShapeEncoder', size: 1690 },
                      { name: 'SizeEncoder', size: 1830 }
                    ]
                  },
                  {
                    name: 'filter',
                    children: [
                      { name: 'FisheyeTreeFilter', size: 5219 },
                      { name: 'GraphDistanceFilter', size: 3165 },
                      { name: 'VisibilityFilter', size: 3509 }
                    ]
                  },
                  { name: 'IOperator', size: 1286 },
                  {
                    name: 'label',
                    children: [
                      { name: 'Labeler', size: 9956 },
                      { name: 'RadialLabeler', size: 3899 },
                      { name: 'StackedAreaLabeler', size: 3202 }
                    ]
                  },
                  {
                    name: 'layout',
                    children: [
                      { name: 'AxisLayout', size: 6725 },
                      { name: 'BundledEdgeRouter', size: 3727 },
                      { name: 'CircleLayout', size: 9317 },
                      { name: 'CirclePackingLayout', size: 12003 },
                      { name: 'DendrogramLayout', size: 4853 },
                      { name: 'ForceDirectedLayout', size: 8411 },
                      { name: 'IcicleTreeLayout', size: 4864 },
                      { name: 'IndentedTreeLayout', size: 3174 },
                      { name: 'Layout', size: 7881 },
                      { name: 'NodeLinkTreeLayout', size: 12870 },
                      { name: 'PieLayout', size: 2728 },
                      { name: 'RadialTreeLayout', size: 12348 },
                      { name: 'RandomLayout', size: 870 },
                      { name: 'StackedAreaLayout', size: 9121 },
                      { name: 'TreeMapLayout', size: 9191 }
                    ]
                  },
                  { name: 'Operator', size: 2490 },
                  { name: 'OperatorList', size: 5248 },
                  { name: 'OperatorSequence', size: 4190 },
                  { name: 'OperatorSwitch', size: 2581 },
                  { name: 'SortOperator', size: 2023 }
                ]
              },
              { name: 'Visualization', size: 16540 }
            ]
          }
        ]
      }

      var svg = d3.select('#circlePacking')
      var margin = 20
      var diameter = +svg.attr('width')
      var g = svg.append('g').attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')')

      var color = d3.scaleLinear()
        .domain([-1, 5])
        .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
        .interpolate(d3.interpolateHcl)

      var pack = d3.pack()
        .size([diameter - margin, diameter - margin])
        .padding(2)

      // 使用嵌入的flareData作为数据源
      var root = d3.hierarchy(flareData)
        .sum(function (d) { return d.size })
        .sort(function (a, b) { return b.value - a.value })

      var focus = root
      var nodes = pack(root).descendants()
      var view

      var circle = g.selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('class', function (d) { return d.parent ? d.children ? 'node' : 'node node--leaf' : 'node node--root' })
        .style('fill', function (d) { return d.children ? color(d.depth) : 'white' })
        .on('click', function (event, d) {
          if (focus !== d) {
            zoom(event, d)
            event.stopPropagation()
          }
        })

      // eslint-disable-next-line no-unused-vars
      var text = g.selectAll('text')
        .data(nodes)
        .enter().append('text')
        .attr('class', 'label')
        .style('fill-opacity', function (d) { return d.parent === root ? 1 : 0 })
        .style('display', function (d) { return d.parent === root ? 'inline' : 'none' })
        .text(function (d) { return d.data.name })

      var node = g.selectAll('circle,text')

      svg
        .style('background', color(-1))
        .on('click', function (event, d) {
          zoom(event, root)
        })

      zoomTo([root.x, root.y, root.r * 2 + margin])

      function zoom (event, d) {
        // eslint-disable-next-line no-unused-vars
        var focus0 = focus; focus = d

        var transition = d3.transition()
          .duration(event && event.altKey ? 7500 : 750)
          .tween('zoom', function (d) {
            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin])
            return function (t) { zoomTo(i(t)) }
          })

        transition.selectAll('text')
          .filter(function (d) { return d.parent === focus || this.style.display === 'inline' })
          .style('fill-opacity', function (d) { return d.parent === focus ? 1 : 0 })
          .on('start', function (d) { if (d.parent === focus) this.style.display = 'inline' })
          .on('end', function (d) { if (d.parent !== focus) this.style.display = 'none' })
      }

      function zoomTo (v) {
        var k = diameter / v[2]; view = v
        node.attr('transform', function (d) { return 'translate(' + (d.x - v[0]) * k + ',' + (d.y - v[1]) * k + ')' })
        circle.attr('r', function (d) { return d.r * k })
      }
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
  mounted () {
    this.createCirclePacking()
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

.node {
  cursor: pointer;
}

.node:hover {
  stroke: #000;
  stroke-width: 1.5px;
}

.node--leaf {
  fill: white;
}

.label {
  font: 11px "Helvetica Neue", Helvetica, Arial, sans-serif;
  text-anchor: middle;
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff;
}

.label,
.node--root,
.node--leaf {
  pointer-events: none;
}

</style>
