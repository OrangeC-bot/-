<template>
  <div>
    <!-- 1-1 绘制表格 -->
    <div style="display: flex;justify-content: space-between;">
      <!-- 2-3 @click="showAddSalaryView" 点击打开 添加工资账套对话框 -->
      <el-button icon="el-icon-plus" size="mini" type="primary" @click="showAddSalaryView">添加工资账套</el-button>
      <!-- 5-3 刷新功能 直接绑定点击事件 调用获取所有数据方法 -->
      <el-button icon="el-icon-refresh" size="mini" type="success" @click="initSalaries"></el-button>
    </div>
    <div style="margin-top: 10px;">
      <el-table
          :data="salaries"
          border
          stripe>
        <!-- 多选框 type="selection" -->
        <el-table-column
            type="selection"
            width="40">
        </el-table-column>
        <el-table-column
            label="账套名称"
            prop="name"
            width="120">
        </el-table-column>
        <el-table-column
            label="基本工资"
            prop="basicSalary"
            width="70">
        </el-table-column>
        <el-table-column
            label="交通补助"
            prop="trafficSalary"
            width="70">
        </el-table-column>
        <el-table-column
            label="午餐补助"
            prop="lunchSalary"
            width="70">
        </el-table-column>
        <el-table-column
            label="奖金"
            prop="bonus"
            width="70">
        </el-table-column>
        <el-table-column
            label="启用时间"
            prop="createDate"
            width="100">
        </el-table-column>
        <!-- 多级表头：el-table-column 里面嵌套 el-table-column，就可以实现多级表头  -->
        <el-table-column
            align="center"
            label="养老金">
          <el-table-column
              label="比率"
              prop="pensionPer"
              width="70">
          </el-table-column>
          <el-table-column
              label="基数"
              prop="pensionBase"
              width="70">
          </el-table-column>
        </el-table-column>
        <!-- 多级表头 -->
        <el-table-column
            align="center"
            label="医疗保险">
          <el-table-column
              label="比率"
              prop="medicalPer"
              width="70">
          </el-table-column>
          <el-table-column
              label="基数"
              prop="medicalBase"
              width="70">
          </el-table-column>
        </el-table-column>
        <!-- 多级表头 -->
        <el-table-column
            align="center"
            label="公积金">
          <el-table-column
              label="比率"
              prop="accumulationFundPer"
              width="70">
          </el-table-column>
          <el-table-column
              label="基数"
              prop="accumulationFundBase"
              width="70">
          </el-table-column>
        </el-table-column>
        <el-table-column
            label="操作">
          <!-- 5-1 删除工资账套 拿到当前行数据 绑定点击事件 传行数据-->
          <template slot-scope="scope">
            <!-- 6-4 @click="showEditSalaryView(scope.row)">编辑  -->
            <el-button size="mini" type="primary" @click="showEditSalaryView(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteSalary(scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <!-- 2-1 添加工资账套对话框 -->
    <!-- 6-2 把标题变成属性 -->
    <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="50%">
      <!-- 3-8 调整样式 -->
      <div style="display: flex;justify-content: space-around;align-items: center;">
        <!-- 3-1 添加步骤条 -->
        <!-- 3-5  :active="activeItemIndex" -->
        <el-steps :active="activeItemIndex" direction="vertical">
          <!-- 3-3 循环遍历数据 -->
          <el-step v-for="(itemName,index) in salaryItemName" :key="index" :title="itemName"></el-step>
        </el-steps>
        <!-- 3-4 循环遍历数据 -->
        <!-- 3-7 v-show="activeItemIndex = index" 与下标相等才展示 -->
        <!-- 4-2 修改各项的值 绑定和遍历-->
        <el-input v-for="(value,title,index) in salary" v-show="activeItemIndex === index"
                  :key="index"
                  v-model="salary[title]" :placeholder="'请输入'+salaryItemName[index]+'...'"
                  style="width: 200px;"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- 3-10 按钮判断根据索引显示 文字提示 -->
        <el-button @click="preStep">{{ activeItemIndex === 10 ? '取消' : '上一步' }}</el-button>
        <el-button type="primary" @click="nextStep">{{ activeItemIndex === 10 ? '完成' : '下一步' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "SalSob",
  data() {
    return {
      dialogTitle: '添加工资账套', // 6-1 标题
      dialogVisible: false, // 2-2 添加工资账套对话框
      salaries: [], // 1-2 定义数组
      activeItemIndex: 0, // 3-6 步骤条激活索引
      salaryItemName: [ // 3-2 步骤条数据对象
        '账套名称',
        '基本工资',
        '交通补助',
        '午餐补助',
        '奖金',
        '养老金比率',
        '养老金基数',
        '医疗保险比率',
        '医疗保险基数',
        '公积金比率',
        '公积金基数'
      ],
      // 4-1 定义工资账套数据
      salary: {
        name: '',
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        pensionPer: 0.0,
        pensionBase: 0,
        medicalPer: 0.0,
        medicalBase: 0,
        accumulationFundPer: 0.0,
        accumulationFundBase: 0
      }
    }
  },
  mounted() {
    this.initSalaries()
  },
  methods: {
    // 6-5 点击编辑显示对话框
    showEditSalaryView(data) {
      this.dialogTitle = '编辑工资账套' // 设置标题
      this.activeItemIndex = 0 // 默认激活的索引
      this.salary.id = data.id
      this.salary.name = data.name
      this.salary.basicSalary = data.basicSalary
      this.salary.trafficSalary = data.trafficSalary
      this.salary.lunchSalary = data.lunchSalary
      this.salary.bonus = data.bonus
      this.salary.pensionPer = data.pensionPer
      this.salary.pensionBase = data.pensionBase
      this.salary.medicalPer = data.medicalPer
      this.salary.medicalBase = data.medicalBase
      this.salary.accumulationFundPer = data.accumulationFundPer
      this.salary.accumulationFundBase = data.accumulationFundBase
      this.dialogVisible = true // 打开对话框
    },
    // 5-2 删除工资账套
    deleteSalary(data) {
      this.$confirm('此操作将永久删除该[' + data.name + ']工资账套, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/salary/sob/' + data.id).then(resp => {
          if (resp) {
            this.initSalaries()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    preStep() { // 3-13 上一步 取消
      if (this.activeItemIndex === 0) {
        return
      } else if (this.activeItemIndex === 10) {
        this.dialogVisible = false;
        return;
      }
      this.activeItemIndex--
    },
    nextStep() { // 3-12 下一步 完成
      if (this.activeItemIndex === 10) {
        // alert("ok")
        // console.log(this.salary)
        // 4-4 添加工资账套
        if (this.salary.id) { // 6-6 有 id 调用编辑接口，没有 id 执行添加
          this.putRequest('/salary/sob/', this.salary).then(resp => {
            if (resp) {
              this.initSalaries()
              this.dialogVisible = false // 关闭弹框
            }
          })
        } else {
          this.postRequest('/salary/sob/', this.salary).then(resp => {
            if (resp) {
              this.initSalaries()
              this.dialogVisible = false
            }
          })
        }
        return
      }
      this.activeItemIndex++
    },
    // 2-4 点击打开添加工资账套对话框
    showAddSalaryView() {
      this.dialogTitle = '添加工资账套' // 6-3 添加的时候显示此标题
      this.salary = { // 4-3 清空表单
        name: '',
        basicSalary: 0,
        trafficSalary: 0,
        lunchSalary: 0,
        bonus: 0,
        pensionPer: 0.0,
        pensionBase: 0,
        medicalPer: 0.0,
        medicalBase: 0,
        accumulationFundPer: 0.0,
        accumulationFundBase: 0
      }
      this.activeItemIndex = 0 // 3-14 步骤条索引从0开始
      this.dialogVisible = true;
    },
    // 1-3 初始化数据
    initSalaries() {
      this.getRequest('/salary/sob/').then(resp => {
        if (resp) {
          this.salaries = resp
        }
      })
    }
  }
}
</script>

<style scoped>
</style>