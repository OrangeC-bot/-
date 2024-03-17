<template>
  <div>
    <div>
      <div style="display: flex;justify-content: space-between;">
        <!-- 1、 -->
        <!-- 20、搜索 v-model="empName" <el-input @keydown.enter.native="initEmps" 回车键调用初始化会员方法
             21、@click="initEmps">搜索</el-button>
             22、清空 clearable @clear="initEmps" -->
        <!-- 28-8  :disabled="showAdvanceSearchVisible" -->
        <div style="margin-top: 10px;">
          <el-input v-model="empName"
                    :disabled="showAdvanceSearchVisible"
                    clearable
                    placeholder="请输入员工名进行搜索..."
                    prefix-icon="el-icon-search"
                    style="width: 300px;margin-right: 10px;"
                    @clear="initEmps"
                    @keydown.enter.native="initEmps"
          ></el-input>
          <el-button :disabled="showAdvanceSearchVisible" icon="el-icon-search" type="primary"
                     @click="initEmps">搜索
          </el-button>
          <!-- 28-3 @click="showAdvanceSearchVisible = !showAdvanceSearchVisible" -->
          <!-- 28-5 判断图标样式 :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'"-->
          <el-button type="primary" @click="showAdvanceSearchVisible = !showAdvanceSearchVisible">
            <i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'"
               aria-hidden="true"></i>高级搜索
          </el-button>
        </div>
        <div>
          <!-- 27-1、3 导入数据 上传组件 用自己的按钮 -->
          <!-- 27-5 on-success 文件上传成功时的钩子; on-error 文件上传失败时的钩子; -->
          <!-- 27-8 导入的时候禁用导入按钮 :disabled="importDataDisabled"  -->
          <!-- 27-11 :headers="headers" 设置上传的请求头部 -->
          <el-upload :before-upload="beforeUpload" :disabled="importDataDisabled"
                     :headers="headers"
                     :on-error="onError"
                     :on-success="onSuccess"
                     :show-file-list="false"
                     action="/employee/basic/import"
                     style="display: inline-flex;margin-right: 8px;"
          >
            <el-button :disabled="importDataDisabled" :icon="importDataBtnIcon" type="success">{{
                importDataBtnText
              }}
            </el-button>
          </el-upload>
          <!-- 26-1、导出数据 @click="exportData" -->
          <el-button type="success" @click="exportData"><i aria-hidden="true" class="el-icon-download"></i>&nbsp; 导出数据
          </el-button>
          <!-- 23-3、 @click="showAddEmpView" -->
          <el-button icon="el-icon-plus" type="primary" @click="showAddEmpView">添加员工</el-button>
        </div>
      </div>
      <!-- 28-1 高级搜索条件框 -->
      <!-- 28-4 高级搜索条件框 v-show="showAdvanceSearchVisible" -->
      <!-- 28-6 添加展开动画效果 <transition name="fade"> 包含整个搜索条件框 </transition> -->
      <!-- 30-2 绑定搜索条件数据 v-model="searchValue.xxxxx" -->
      <transition name="slide-fade">
        <div v-show="showAdvanceSearchVisible"
             style="border: 1px solid #379ff5;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0px">
          <el-row>
            <el-col :span="5">
              政治面貌：
              <el-select v-model="searchValue.politicId" placeholder="请选择政治面貌" size="mini" style="width: 130px;">
                <el-option
                    v-for="item in politicsstatus"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              民族：
              <el-select v-model="searchValue.nationId" placeholder="民族" size="mini" style="width: 130px;">
                <el-option
                    v-for="item in nations"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              职位：
              <el-select v-model="searchValue.posId" placeholder="职位" size="mini" style="width: 130px;">
                <el-option
                    v-for="item in positions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              职称：
              <el-select v-model="searchValue.jobLevelId" placeholder="职称" size="mini" style="width: 130px;">
                <el-option
                    v-for="item in joblevels"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              聘用形式：
              <el-radio-group v-model="searchValue.engageForm">
                <el-radio label="劳动合同">劳动合同</el-radio>
                <el-radio label="劳务合同">劳务合同</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px;">
            <!-- 30-4 处理部门 v-model="visible2" -->
            <el-col :span="5">
              所属部门：
              <el-popover
                  v-model="visible2"
                  placement="bottom"
                  title="请选择部门"
                  trigger="manual"
                  width="220">
                <!-- 23-20 添加树形控件 default-expand-all	是否默认展开所有节点 ，节点点击事件 @node-click="handleNodeClick" -->
                <el-tree :data="allDeps"
                         :props="defaultProps"
                         default-expand-all
                         @node-click="searchHandleNodeClick"></el-tree>
                <!-- 30-6 @node-click="searchHandleNodeClick" -->
                <!-- node-click	节点被点击时的回调 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。 -->
                <!-- 自定义点击事件 -->
                <!-- 30-7 @click="showDepView2" -->
                <div slot="reference"
                     style="width:130px;display: inline-flex;
                 border-radius: 5px;border: 1px solid #dedede;height: 28px;cursor: pointer;align-items: center;
                 font-size: 12px;padding-left: 8px;box-sizing: border-box;"
                     @click="showDepView2">{{ inputDepName }}
                </div><!-- 23-25 回显数据 {{inputDepName}} -->
              </el-popover>
            </el-col>
            <!-- 30-3 处理日期：v-model="searchValue.beginDateScope" value-format="yyyy-MM-dd" ;
                 两个面板各自独立切换当前年份 使用unlink-panels -->
            <el-col :span="10">
              入职日期：
              <el-date-picker
                  v-model="searchValue.beginDateScope"
                  end-placeholder="结束日期"
                  range-separator="至"
                  size="mini"
                  start-placeholder="开始日期"
                  type="datetimerange"
                  unlink-panels
                  value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-col>
            <el-col :offset="4" :span="5">
              <el-button size="mini">取消</el-button>
              <!-- 30-10 @click="initEmps('advanced')" -->
              <el-button icon="el-icon-search" size="mini" type="primary" @click="initEmps('advanced')">搜索</el-button>
            </el-col>
          </el-row>
        </div>
      </transition>
    </div>
    <div style="margin-top: 10px;">
      <!-- 2、表格；6、添加 loading -->
      <el-table
          v-loading="loading"
          :data="emps"
          border
          element-loading-background="rgba(0, 0, 0, 0.8)"
          element-loading-spinner="el-icon-loading"
          element-loading-text="拼命加载中" stripe style="width: 100%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            align="left"
            fixed
            label="姓名"
            prop="name"
            width="90">
        </el-table-column>
        <el-table-column
            align="left"
            label="性别"
            prop="gender"
            width="40">
        </el-table-column>
        <el-table-column
            align="left"
            label="工号"
            prop="workId"
            width="85">
        </el-table-column>
        <el-table-column
            align="left"
            label="出生日期"
            prop="birthday"
            width="95">
        </el-table-column>
        <el-table-column
            label="身份证号"
            prop="idCard"
            width="150">
        </el-table-column>
        <el-table-column
            align="center"
            label="婚姻状态"
            prop="wedlock"
            width="70">
        </el-table-column>
        <el-table-column
            align="left"
            label="民族"
            prop="nation.name"
            width="50">
        </el-table-column>
        <el-table-column
            align="center"
            label="籍贯"
            prop="nativePlace"
            width="80">
        </el-table-column>
        <el-table-column
            label="政治面貌"
            prop="politicsStatus.name"
            width="100">
        </el-table-column>
        <el-table-column
            align="left"
            label="电子邮件"
            prop="email"
            width="150">
        </el-table-column>
        <el-table-column
            align="left"
            label="电话号码"
            prop="phone"
            width="100">
        </el-table-column>
        <el-table-column
            align="center"
            label="联系地址"
            prop="address"
            width="220">
        </el-table-column>
        <el-table-column
            align="left"
            label="所属部门"
            prop="department.name"
            width="100">
        </el-table-column>
        <el-table-column
            label="职位"
            prop="position.name"
            width="100">
        </el-table-column>
        <el-table-column
            label="级别"
            prop="joblevel.name"
            width="100">
        </el-table-column>
        <el-table-column
            align="left"
            label="聘用形式"
            prop="engageForm"
            width="100">
        </el-table-column>
        <el-table-column
            align="center"
            label="最高学历"
            prop="tiptopDegree"
            width="80">
        </el-table-column>
        <el-table-column
            align="left"
            label="毕业学校"
            prop="school"
            width="150">
        </el-table-column>
        <el-table-column
            align="left"
            label="所属专业"
            prop="specialty"
            width="150">
        </el-table-column>
        <el-table-column
            align="center"
            label="在职状态"
            prop="workState"
            width="70">
        </el-table-column>
        <el-table-column
            align="left"
            label="入职日期"
            prop="beginDate"
            width="95">
        </el-table-column>
        <el-table-column
            align="left"
            label="转正日期"
            prop="conversionTime"
            width="95">
        </el-table-column>
        <el-table-column
            align="left"
            label="合同起始日期"
            prop="beginContract"
            width="95">
        </el-table-column>
        <el-table-column
            align="left"
            label="合同截止日期"
            prop="endContract"
            width="95">
        </el-table-column>
        <el-table-column
            align="left"
            label="合同期限"
            width="100">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.contractTerm }}</el-tag>
            年
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="300">
          <template slot-scope="scope">
            <!-- 25-4 给编辑按钮绑定点击事件 @click="showEmpView(scope.row)" -->
            <el-button size="mini" style="padding: 3px;" @click="showEmpView(scope.row)">编辑</el-button>
            <el-button plain size="mini" style="padding: 3px;" type="primary">查看高级资料</el-button>
            <!-- 24-1 删除员工 @click="deleteEmp(scope.row)" -->
            <el-button size="mini" style="padding: 3px;" type="danger" @click="deleteEmp(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 10、分页 -->
      <div style="display: flex;justify-content: flex-end;margin-top: 10px;">
        <!-- 13、@current-change="currentChange" 当前页
             14、@size-change="sizeChange" 每页显示多少条 -->
        <el-pagination
            :page-sizes="[10,20,30,50,100]"
            :total="total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            next-text="下一页"
            prev-text="上一页"
            @current-change="currentChange" @size-change="sizeChange">
        </el-pagination>
      </div>
    </div>
    <!-- 23-1、开始- 添加员工弹框 -->
    <!-- 25-1 编辑员工 将添加员工弹框标题改为变量 根据条件显示是添加还是编辑 :title="title"  -->
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="80%">
      <div>
        <!-- 23-6、<el-row  <el-form -->
        <!-- 23-28 数据校验对象 :rules="empRules" ，每项属性对应 prop="posId" -->
        <el-form ref="empRef" :model="emp" :rules="empRules">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名：" prop="name">
                <el-input v-model="emp.name" placeholder="请输入员工姓名" prefix-icon="el-icon-edit" size="mini"
                          style="width: 150px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="性别：" prop="gender">
                <el-radio-group v-model="emp.gender" style="margin-top: 8px;">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期：" prop="birthday">
                <el-date-picker
                    v-model="emp.birthday"
                    placeholder="出生日期"
                    size="mini"
                    style="width: 150px;"
                    type="date"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <!-- 23-10、 添加员工 给每项赋值 -->
              <el-form-item label="政治面貌：" prop="politicId">
                <el-select v-model="emp.politicId" placeholder="请选择政治面貌" size="mini" style="width: 200px;">
                  <el-option
                      v-for="item in politicsstatus"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="民族：" prop="nationId">
                <el-select v-model="emp.nationId" placeholder="民族" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="籍贯：" prop="nativePlace">
                <el-input v-model="emp.nativePlace" placeholder="籍贯" prefix-icon="el-icon-edit" size="small"
                          style="width: 120px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱：" prop="email">
                <el-input v-model="emp.email" placeholder="请输入电子邮箱" prefix-icon="el-icon-message" size="mini"
                          style="width: 150px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系地址：" prop="address">
                <el-input v-model="emp.address" placeholder="请输入联系地址" prefix-icon="el-icon-edit" size="mini"
                          style="width: 200px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="职位：" prop="posId">
                <el-select v-model="emp.posId" placeholder="职位" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="职称：" prop="jobLevelId">
                <el-select v-model="emp.jobLevelId" placeholder="职称" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in joblevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <!-- 23-15  -->
              <el-form-item label="所属部门：" prop="departmentId">
                <!-- 23-17 manual 手动弹出框 -->
                <el-popover
                    v-model="visible"
                    placement="bottom"
                    title="请选择部门"
                    trigger="manual"
                    width="200">
                  <!-- 23-20 添加树形控件 default-expand-all	是否默认展开所有节点 ，节点点击事件 @node-click="handleNodeClick" -->
                  <el-tree :data="allDeps"
                           :props="defaultProps"
                           default-expand-all
                           @node-click="handleNodeClick"></el-tree>
                  <!-- node-click	节点被点击时的回调 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。 -->
                  <!-- 自定义点击事件 -->
                  <div slot="reference"
                       style="width:150px;display: inline-flex;
                       border-radius: 5px;border: 1px solid #dedede;height: 28px;cursor: pointer;align-items: center;
                       font-size: 12px;padding-left: 8px;box-sizing: border-box;"
                       @click="showDepView">{{ inputDepName }}
                  </div><!-- 23-25 回显数据 {{inputDepName}} -->
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="电话号码：" prop="phone">
                <el-input v-model="emp.phone" placeholder="请输入电话号码" prefix-icon="el-icon-phone" size="mini"
                          style="width: 200px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="工号：" prop="workId">
                <el-input v-model="emp.workId" disabled placeholder="请输入工号" prefix-icon="el-icon-edit"
                          size="mini" style="width: 150px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <!-- 23-14 数据在 data 中写死的 -->
              <el-form-item label="学历：" prop="tiptopDegree">
                <el-select v-model="emp.tiptopDegree" placeholder="职称" size="mini" style="width: 150px;">
                  <el-option
                      v-for="item in tiptopDegrees"
                      :key="item"
                      :label="item"
                      :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毕业院校：" prop="school">
                <el-input v-model="emp.school" placeholder="请输入学校" prefix-icon="el-icon-edit" size="mini"
                          style="width: 150px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="专业名称：" prop="specialty">
                <el-input v-model="emp.specialty" placeholder="请输入专业名称" prefix-icon="el-icon-edit" size="mini"
                          style="width: 200px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="入职日期：" prop="beginDate">
                <el-date-picker
                    v-model="emp.beginDate"
                    placeholder="入职日期"
                    size="mini"
                    style="width: 120px;"
                    type="date"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="转正日期：" prop="conversionTime">
                <el-date-picker
                    v-model="emp.conversionTime"
                    placeholder="转正日期"
                    size="mini"
                    style="width: 120px;"
                    type="date"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同起始日期：" prop="beginContract">
                <el-date-picker
                    v-model="emp.beginContract"
                    placeholder="合同起始日期"
                    size="mini"
                    style="width: 135px;"
                    type="date"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="合同截止日期：" prop="endContract">
                <el-date-picker
                    v-model="emp.endContract"
                    placeholder="合同截止日期"
                    size="mini"
                    style="width: 170px;"
                    type="date"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号码：" prop="idCard">
                <el-input v-model="emp.idCard" placeholder="请输入身份证号码"
                          prefix-icon="el-icon-edit" size="mini" style="width: 180px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="聘用形式：" prop="engageForm">
                <el-radio-group v-model="emp.engageForm" style="margin-top: 8px;">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况：" prop="wedlock">
                <el-radio-group v-model="emp.wedlock" style="margin-top: 8px;">
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- 23-26 @click="doAddEmp"-->
        <el-button type="primary" @click="doAddEmp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data() {
    return {
      searchValue: { // 30-1 高级搜索 条件对象
        politicId: null, // 政治面貌
        nationId: null, // 民族
        posId: null, // 职位
        jobLevelId: null, // 职称
        engageForm: '', // 聘用形式
        departmentId: null, // 部门 id
        beginDateScope: null // 入职日期范围
      },
      showAdvanceSearchVisible: false, // 28-2 高级搜索框 动态效果
      headers: { // 27-12 定义请求头
        Authorization: window.sessionStorage.getItem('tokenStr')
      },
      importDataDisabled: false, // 27-9 导入按钮 默认不禁用
      importDataBtnText: '导入数据', // 27-2 导入数据
      importDataBtnIcon: 'el-icon-upload2', // 27-2 导入数据
      title: '', // 25-2 添加编辑员工弹框动态标题
      emps: [], // 3、获取所有员工（分页）
      loading: false, // 7、添加 loading
      total: 0, // 11 分页总条数
      currentPage: 1, // 14、默认显示第1页(currentPage 后端字段）
      size: 10, // 15、默认每页显示 10 条
      empName: '', // 18、搜索
      dialogVisible: false, // 23-2、添加员工弹框
      nations: [],   // 23-7 添加员工 民族
      joblevels: [], // 23-7 职称
      politicsstatus: [], // 23-7 政治面貌
      positions: [],  // 23-7 职位
      department: [], // 部门
      // 23-13、学历
      tiptopDegrees: ['博士', '硕士', '本科', '大专', '高中', '初中', '小学', '其它'],
      // 23-5、添加员工
      emp: {
        id: null,
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: null,
        nativePlace: '',
        politicId: null,
        email: '',
        phone: '',
        address: '',
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '在职',
        workId: '',
        contractTerm: null,
        conversionTime: '',
        notworkDate: null,
        beginContract: '',
        endContract: '',
        workAge: null,
        salaryId: null
      },
      visible: false, // 23-18 弹出框
      visible2: false, // 30-5 高级搜索 部门
      // 23-21 树形控件
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      allDeps: [], // 23-21 树形控件 绑定 所属部门 数据对象
      inputDepName: '',// 23-23 回显部门数据
      // 23-30 表单数据校验
      empRules: {
        name: [{required: true, message: '请输入员工名', trigger: 'blur'}],
        gender: [{required: true, message: '请输入员工性别', trigger: 'blur'}],
        birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
        idCard: [{required: true, message: '请输入身份证号码', trigger: 'blur'},
          {
            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '身份证号码不正确', trigger: 'blur'
          }],
        wedlock: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
        nationId: [{required: true, message: '请输入民族', trigger: 'blur'}],
        nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
        politicId: [{required: true, message: '请输入政治面貌', trigger: 'blur'}],
        email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '邮箱地址格式不正确', trigger: 'blur'}],
        phone: [{required: true, message: '请输入电话号码', trigger: 'blur'},
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '请输入合法手机号码', trigger: 'blur'
          }],
        address: [{required: true, message: '请输入地址', trigger: 'blur'}],
        departmentId: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
        jobLevelId: [{required: true, message: '请输入职称', trigger: 'blur'}],
        posId: [{required: true, message: '请输入职位', trigger: 'blur'}],
        engageForm: [{required: true, message: '请输入聘用形式', trigger: 'blur'}],
        tiptopDegree: [{required: true, message: '请输入学历', trigger: 'blur'}],
        specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
        school: [{required: true, message: '请输入毕业院校', trigger: 'blur'}],
        beginDate: [{required: true, message: '请输入入职日期', trigger: 'blur'}],
        workState: [{required: true, message: '请输入工作状态', trigger: 'blur'}],
        workId: [{required: true, message: '请输入工号', trigger: 'blur'}],
        contractTerm: [{required: true, message: '请输入合同期限', trigger: 'blur'}],
        conversionTime: [{required: true, message: '请输入转正日期', trigger: 'blur'}],
        notworkDate: [{required: true, message: '请输入离职日期', trigger: 'blur'}],
        beginContract: [{required: true, message: '请输入合同起始日期', trigger: 'blur'}],
        endContract: [{required: true, message: '请输入合同结束日期', trigger: 'blur'}],
        workAge: [{required: true, message: '请输入工龄', trigger: 'blur'}]
      }
    }
  },
  mounted() {
    this.initEmps() // 5、获取所有员工（分页）
    this.initData() // 23-9 添加员工
    this.initPositions() // 23-12 获取职位
  },
  methods: {
    // 27-6 数据导入成功 恢复原来的图标和状态
    onSuccess() {
      this.importDataBtnIcon = 'el-icon-upload2'
      this.importDataBtnText = '导入数据'
      this.importDataDisabled = false // 29-10 不禁用导入按钮
      this.initEmps()
    },
    // 27-7 数据导入失败 恢复原来的图标和状态
    onError() {
      this.importDataBtnIcon = 'el-icon-upload2'
      this.importDataBtnText = '导入数据'
      this.importDataDisabled = false // 29-10 不禁用导入按钮
    },
    // 27-4、导入数据 改变图标和添加 loading 状态
    beforeUpload() {
      this.importDataBtnIcon = 'el-icon-loading'
      this.importDataBtnText = '正在导入'
      this.importDataDisabled = true // 29-10 禁用导入按钮
    },
    // 26-2 下载请求
    exportData() {
      this.downloadRequest('/employee/basic/export')
    },
    // 25-5 编辑员工按钮 点击事件
    showEmpView(data) {
      this.title = '编辑员工信息'
      this.emp = data // 回显数据
      this.inputDepName = data.department.name // 25-7 回显部门信息
      this.initPositions() // 25-9 初始化职位信息
      this.dialogVisible = true
    },
    // 24-2 删除员工
    deleteEmp(data) {
      this.$confirm('此操作将永久删除该员工' + data.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/employee/basic/' + data.id).then(resp => {
          if (resp) {
            this.initEmps()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 23-27 确定添加员工
    // 25-10 添加或编辑员工 有id编辑员工 没有id添加员工
    // 添加和编辑这里就请求方式不一样 putRequest postRequest ，其它的都一样
    doAddEmp() {
      if (this.emp.id) {
        // 有 id 编辑员工
        this.$refs['empRef'].validate(valid => {
          if (valid) {
            this.putRequest('/employee/basic/', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false
                this.initEmps()
              }
            })
          }
        })
      } else {
        // 没有id 添加员工
        // empRef 表单中定义的引用对象 ref="empRef"
        this.$refs['empRef'].validate(valid => {
          if (valid) {
            this.postRequest('/employee/basic/', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false
                this.initEmps()
              }
            })
          }
        })
      }
    },
    // 30-7 高级搜索 部门点击事件
    searchHandleNodeClick(data) {
      this.inputDepName = data.name
      this.searchValue.departmentId = data.id
      this.visible2 = !this.visible2 // 弹框
    },
    // 23-22、24 树控件节点点击事件
    handleNodeClick(data) {
      this.inputDepName = data.name
      this.emp.departmentId = data.id
      this.visible = !this.visible // 弹框
    },
    // 30-9 高级搜索 部门弹框
    showDepView2() {
      this.visible2 = !this.visible2
    },
    // 23-16 添加员工 所属部门
    showDepView() {
      this.visible = !this.visible // 23-19 弹出框
    },
    // 23-13 添加员工 获取最大号
    getMaxWorkID() {
      this.getRequest('/employee/basic/maxWorkID').then(resp => {
        if (resp) {
          this.emp.workId = resp.obj
        }
      })
    },
    // 23-11、 添加员工 获取职位 有可能变动 打开对话框的时候调用此方法
    initPositions() {
      this.getRequest('/employee/basic/positions').then(resp => {
        if (resp) {
          this.positions = resp
        }
      })
    },
    // 23-8、添加员工 不怎么变动的数据。放 sessionStorage ，就不用怎么去查
    initData() {
      // 获取民族数据:先从 sessionStorage 里取，取不到再调用接口获取数据
      if (!window.sessionStorage.getItem("nations")) {
        this.getRequest('/employee/basic/nations').then(resp => {
          this.nations = resp
          // 存到 sessionStorage 里,把对象转字符串
          window.sessionStorage.setItem('nations', JSON.stringify(resp))
        })
      } else {
        // 从 sessionStorage 获取，字符串转对象
        this.nations = JSON.parse(window.sessionStorage.getItem('nations'))
      }
      // 获取职称
      if (!window.sessionStorage.getItem('joblevels')) {
        this.getRequest('/employee/basic/joblevels').then(resp => {
          if (resp) {
            this.joblevels = resp
            window.sessionStorage.setItem('joblevels', JSON.stringify(resp))
          }
        })
      } else {
        // 从 sessionStorage 获取，字符串转对象
        this.joblevels = JSON.parse(window.sessionStorage.getItem('joblevels'))
      }
      // 获取政治面貌
      if (!window.sessionStorage.getItem('politicsstatus')) {
        this.getRequest('/employee/basic/polticsstatus').then(resp => {
          if (resp) {
            this.politicsstatus = resp
            window.sessionStorage.setItem('politicsstatus', JSON.stringify(resp))
          }
        })
      } else {
        // 从 sessionStorage 获取，字符串转对象
        this.politicsstatus = JSON.parse(window.sessionStorage.getItem('politicsstatus'))
      }
      // 23-22 树形控件 绑定 所属部门 数据对象
      if (!window.sessionStorage.getItem('allDeps')) {
        this.getRequest('/employee/basic/deps').then(resp => {
          if (resp) {
            this.allDeps = resp
            window.sessionStorage.setItem('allDeps', JSON.parse(resp))
          }
        })
      } else {
        this.allDeps = window.sessionStorage.getItem('allDeps')
      }
    },
    // 23-4、添加员点击事件
    showAddEmpView() {
      // 25-6 清空表单
      this.emp = {
        id: null,
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: null,
        nativePlace: '',
        politicId: null,
        email: '',
        phone: '',
        address: '',
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '在职',
        workId: '',
        contractTerm: null,
        conversionTime: '',
        notworkDate: null,
        beginContract: '',
        endContract: '',
        workAge: null,
        salaryId: null
      }
      this.inputDepName = '' // 25-8 清空部门信息
      this.title = '添加员工' // 25-3 点击添加员工按钮时，弹出框标题为 添加员工
      this.getMaxWorkID() // 23-14 获取最大工号
      this.initPositions() // 23-12 获取职位
      this.dialogVisible = true
    },
    // 15、分页 每页显示多少条 默认会把 size 传进来
    sizeChange(size) {
      this.size = size
      this.initEmps()
    },
    // 13、分页-当前页-currentPage 点击的时候自己会带过来
    currentChange(currentPage) {
      this.currentPage = currentPage // 16
      this.initEmps() // 18、调用方法
    },
    // 4、获取所有员工（分页）
    initEmps(type) {
      this.loading = true // 8、添加 loading
      // 30-11 定义高级搜索 url
      let url = '/employee/basic/?currentPage=' + this.currentPage + '&size=' + this.size
      if (type && type === 'advanced') { // 说明是高级搜索
        if (this.searchValue.politicId) {
          url += '&politicId=' + this.searchValue.politicId;
        }
        if (this.searchValue.nationId) {
          url += '&nationId=' + this.searchValue.nationId;
        }
        if (this.searchValue.posId) {
          url += '&posId=' + this.searchValue.posId;
        }
        if (this.searchValue.jobLevelId) {
          url += '&jobLevelId=' + this.searchValue.jobLevelId;
        }
        if (this.searchValue.engageForm) {
          url += '&engageForm=' + this.searchValue.engageForm;
        }
        if (this.searchValue.departmentId) {
          url += '&departmentId=' + this.searchValue.departmentId;
        }
        if (this.searchValue.beginDateScope) {
          url += '&beginDateScope=' + this.searchValue.beginDateScope;
        }
      } else {
        url += '&name=' + this.empName;
      }
      // 17、添加分页参数 ?currentPage='+this.currentPage+'&size='+this.size
      // 19、添加用户名搜索参数 +'&name='+this.empName,传参 根据条件搜索，不传参查询所有
      this.getRequest(url).then(resp => {
        // this.getRequest('/employee/basic/').then(resp => {
        this.loading = false // 9、关闭 loading
        if (resp) {
          this.emps = resp.data
          this.total = resp.total // 12、分页
        }
      });
    }
  }
}
</script>

<style>
/*28-7 展开收起条件搜索框动画样式 */
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .8s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */
{
  transform: translateX(10px);
  opacity: 0;
}
</style>