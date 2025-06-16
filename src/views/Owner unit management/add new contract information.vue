<template>
  <div class="contract-info-root">
    <div class="title-bar">新增合同</div>
    <div class="form-card">
      <!-- 合同信息 -->
      <div class="section-title">合同信息</div>
      <el-form :model="form" :rules="rules" ref="form" label-width="112px" class="double-form-row">
        <el-row :gutter="48">
          <!-- 左栏 -->
          <el-col :span="12">
            <el-form-item label="委托单位名称" prop="entrustName" required>
              <el-input v-model="form.entrustName" placeholder="请输入委托单位名称" />
            </el-form-item>
            <el-form-item label="合同时间" required>
              <el-date-picker
                v-model="form.dateStart"
                type="date"
                placeholder="开始日期"
                style="width: 140px"
              />
              <span class="date-sep">-</span>
              <el-date-picker
                v-model="form.dateEnd"
                type="date"
                placeholder="结束日期"
                style="width: 140px"
              />
            </el-form-item>
            <el-form-item label="合同名称">
              <el-input v-model="form.contractName" placeholder="请输入合同名称" />
            </el-form-item>
            <el-form-item label="合同编号">
              <el-input v-model="form.contractNo" placeholder="请输入合同编号" />
            </el-form-item>
            <el-form-item label="付款周期">
              <el-select v-model="form.payCycle" placeholder="请选择付款周期" style="width: 100%">
                <el-option label="半年" value="半年" />
                <el-option label="一年" value="一年" />
              </el-select>
            </el-form-item>
            <el-form-item label="维保建筑类型">
              <el-select v-model="form.buildType" placeholder="请选择维保建筑类型" style="width: 100%">
                <el-option label="高层建筑" value="高层建筑" />
                <el-option label="大型商场" value="大型商场" />
              </el-select>
            </el-form-item>
            <el-form-item label="设计单位">
              <el-input v-model="form.designOrg" placeholder="请输入设计单位" />
            </el-form-item>
            <el-form-item label="备注说明">
              <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" placeholder="请输入备注说明" />
            </el-form-item>
          </el-col>
          <!-- 右栏 -->
          <el-col :span="12">
            <el-form-item label="统一社会信用代码" prop="creditCode" required>
              <el-input v-model="form.creditCode" placeholder="请输入统一社会信用代码" />
            </el-form-item>
            <el-form-item label="维保方式" prop="maintType" required>
              <el-select v-model="form.maintType" placeholder="请选择维保方式" style="width: 100%">
                <el-option label="系统维保" value="系统维保" />
                <el-option label="设备维保" value="设备维保" />
              </el-select>
            </el-form-item>
            <el-form-item label="维保面积">
              <el-input-number v-model="form.maintArea" :min="0" style="width: 130px" />
              <span class="unit-text">㎡</span>
            </el-form-item>
            <el-form-item label="合同金额">
              <el-input-number v-model="form.amount" :min="0" style="width: 130px" />
              <span class="unit-text">元</span>
            </el-form-item>
            <el-form-item label="收款提醒">
              <el-radio-group v-model="form.remind">
                <el-radio :label="1">开通</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
              <span class="remind-tip">(默认为收款提醒消息推送至维保项目负责人)</span>
            </el-form-item>
            <el-form-item label="调试单位">
              <el-input v-model="form.debugOrg" placeholder="请输入调试单位" />
            </el-form-item>
            <el-form-item label="验收备案">
              <el-input v-model="form.recordOrg" placeholder="请输入验收备案单位全称" />
            </el-form-item>
            <el-form-item label="合同文件">
              <el-upload
                action="#"
                :show-file-list="false"
                style="display:inline-block"
              >
                <el-button size="mini">+ 上传合同文件</el-button>
              </el-upload>
              <span class="upload-tips">上传支持: DOCX、PDF、PNG、JPG等格式文件</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 建筑信息 -->
      <div class="section-title" style="margin-top:32px;">
        <span style="color:#f56c6c;">*</span> 建筑信息
        <span class="tip">(注：建筑物面积请填写纯数字，例如:0.00)</span>
      </div>
      <el-table :data="buildingList" border style="width: 100%; margin-bottom: 12px;" class="building-table">
        <el-table-column prop="name" label="* 建筑信息" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" placeholder="请输入建筑名称" />
          </template>
        </el-table-column>
        <el-table-column prop="area" label="* 建筑面积(m²)" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.area" placeholder="请输入建筑面积" />
          </template>
        </el-table-column>
        <el-table-column prop="floor" label="* 建筑层数" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.floor" placeholder="请输入建筑层数" />
          </template>
        </el-table-column>
        <el-table-column prop="height" label="* 建筑高度(m)" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.height" placeholder="请输入建筑高度" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" placeholder="请输入备注" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button
              v-if="buildingList.length > 1"
              type="text"
              style="color:#f56c6c"
              @click="removeRow(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: left; margin-bottom: 18px;">
        <el-button type="text" style="font-size: 16px; color: #409EFF;" @click="addRow">
          <i class="el-icon-plus"></i> 新增内容
        </el-button>
      </div>

      <!-- 合同维保内容 -->
      <div class="section-title" style="margin-top:28px;">
        合同维保内容
      </div>
      <el-row :gutter="14">
        <!-- 左侧：勾选维保内容的树形列表 -->
        <el-col :span="6">
          <el-tabs v-model="activeTab" class="tab-tree">
            <el-tab-pane label="平台标准系统" name="standard">
              <el-tree
                :data="maintTree"
                show-checkbox
                node-key="id"
                :default-checked-keys="checkedKeys"
                @check="handleCheck"
                :expand-on-click-node="false"
              />
            </el-tab-pane>
            <el-tab-pane label="自建标准系统" name="custom">
              <div class="tab-empty">暂无内容</div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <!-- 右侧：已勾选维保内容（表格展示，无数据时空占位图）-->
        <el-col :span="18">
          <el-table :data="checkedMaintList" border style="width:100%;">
            <el-table-column prop="system" label="消防系统/设施" align="center" />
            <el-table-column prop="item" label="维保项目" align="center" />
            <el-table-column prop="content" label="检测内容" align="center" />
            <el-table-column prop="period" label="维保周期" align="center" />
            <el-table-column prop="standard" label="规范" align="center" />
          </el-table>
          <div v-if="checkedMaintList.length === 0" class="empty-box">
            <img :src="require('@/assets/无数据.jpg')" style="width:128px;opacity:0.7;margin-top:20px;">
            <div style="color:#888;margin-top:8px;">暂无数据</div>
          </div>
        </el-col>
      </el-row>

      <!-- 下一步 -->
      <div style="text-align: center; margin: 38px 0 12px 0;">
        <el-button type="primary" size="large" @click="nextStep" style="width: 160px;font-size:18px;">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddNewContractInfo",
  props: {
    formData: Object
  },
  data() {
    return {
      // 合同基本信息
      form: {
        entrustName: '',
        dateStart: '',
        dateEnd: '',
        contractName: '',
        contractNo: '',
        payCycle: '',
        buildType: '',
        creditCode: '',
        maintType: '',
        maintArea: '',
        amount: '',
        remind: 0,
        designOrg: '',
        remark: '',
        debugOrg: '',
        recordOrg: ''
      },
      rules: {
        entrustName: [{ required: true, message: '请输入委托单位名称', trigger: 'blur' }],
        creditCode: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
        maintType: [{ required: true, message: '请选择维保方式', trigger: 'change' }]
      },
      // 建筑信息表
      buildingList: [
        { name: '', area: '', floor: '', height: '', remark: '' }
      ],
      // 维保内容树&勾选
      activeTab: 'standard',
      maintTree: [
        {
          id: 1, label: '消防供配电设施',
          children: [
            { id: 2, label: '配电柜', data: { system: '消防供配电设施', item: '配电柜', content: '试验主电源', period: '月检', standard: 'GB50116' } }
          ]
        },
        {
          id: 3, label: '火灾自动报警系统',
          children: [
            { id: 4, label: '报警主机', data: { system: '火灾自动报警系统', item: '报警主机', content: '报警测试', period: '月检', standard: 'GB50116' } }
          ]
        }
      ],
      checkedKeys: [],
      checkedMaintList: []
    }
  },
  mounted() {
    if (this.formData) {
      this.form = Object.assign({}, this.form, this.formData)
    }
  },
  methods: {
    nextStep() {
      // 校验所有表单
      this.$refs.form.validate(valid => {
        if (!valid) return
        // 你也可以加其它校验，例如建筑信息至少有一条
        this.$emit('update', this.form)
        this.$emit('next')
      })
    },
    // 建筑表增删
    addRow() {
      this.buildingList.push({ name: '', area: '', floor: '', height: '', remark: '' })
    },
    removeRow(idx) {
      this.buildingList.splice(idx, 1)
    },
    handleCheck(checked, { checkedNodes }) {
      // 只收集叶子节点
      this.checkedMaintList = checkedNodes
        .filter(n => !n.children)
        .map(n => n.data && n.data.data ? n.data.data : {
          system: n.data.label,
          item: '',
          content: '',
          period: '',
          standard: ''
        })
    }
  }
}
</script>

<style scoped>
.contract-info-root {
  width: 100%;
  padding: 0 16px 26px 16px;
  background: #f9fbfd;
}
.title-bar {
  font-size: 22px;
  font-weight: bold;
  color: #1976d2;
  text-align: center;
  margin: 28px 0 16px 0;
  letter-spacing: 2px;
}
.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 34px 28px 28px 28px;
  margin: 0 auto;
  max-width: 1520px;
  box-shadow: 0 4px 16px #e0ebff22;
}
.section-title {
  font-size: 19px;
  font-weight: bold;
  color: #222;
  margin-bottom: 16px;
  letter-spacing: 1.5px;
}
.double-form-row {
  margin-top: 10px;
}
.unit-text {
  margin-left: 8px;
  color: #666;
}
.date-sep {
  margin: 0 12px;
  color: #aaa;
  font-size: 16px;
}
.upload-tips {
  font-size: 13px;
  color: #888;
  margin-left: 14px;
}
.remind-tip {
  color: #888;
  margin-left: 10px;
  font-size: 13px;
}
.tip {
  font-size: 13px;
  color: #888;
  margin-left: 14px;
}
.building-table >>> th, .building-table >>> td {
  font-size: 15px;
}
.tab-tree {
  background: #fff;
  min-height: 320px;
}
.tab-empty {
  color: #888;
  text-align: center;
  padding: 30px 0;
}
.empty-box {
  text-align: center;
  margin-top: 38px;
}
</style>
