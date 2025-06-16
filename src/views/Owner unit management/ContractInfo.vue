<template>
  <div class="contract-detail-root">
    <!-- 合同信息大卡片 -->
    <div class="card-block card-title">
      <div class="card-title-txt">合同信息</div>
    </div>
    <!-- 合同基础信息表单 -->
    <el-form :model="form" label-width="108px" class="form-grid">
      <div class="form-left">
        <el-form-item label="委托单位名称" required>
          <el-input v-model="form.entrustName" />
        </el-form-item>
        <el-form-item label="合同时间" required>
          <el-date-picker
            v-model="form.dateStart"
            type="date"
            placeholder="开始日期"
            style="width: 140px"
          />
          <span style="margin:0 12px;">-</span>
          <el-date-picker
            v-model="form.dateEnd"
            type="date"
            placeholder="结束日期"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input v-model="form.contractName" />
        </el-form-item>
        <el-form-item label="合同编号">
          <el-input v-model="form.contractNo" />
        </el-form-item>
        <el-form-item label="付款周期">
          <el-select v-model="form.payCycle" style="width: 100%">
            <el-option label="半年" value="半年" />
            <el-option label="一年" value="一年" />
          </el-select>
        </el-form-item>
        <el-form-item label="维保建筑类型" required>
          <el-select v-model="form.buildType" style="width: 100%">
            <el-option label="人员密集场所" value="人员密集场所" />
            <el-option label="高层建筑" value="高层建筑" />
          </el-select>
        </el-form-item>
      </div>
      <div class="form-right">
        <el-form-item label="统一社会信用代码" required>
          <el-input v-model="form.creditCode" />
        </el-form-item>
        <el-form-item label="维保方式" required>
          <el-select v-model="form.maintType" style="width: 100%">
            <el-option label="系统维保" value="系统维保" />
            <el-option label="设备维保" value="设备维保" />
          </el-select>
        </el-form-item>
        <el-form-item label="维保面积">
          <el-input-number v-model="form.maintArea" :min="0" style="width: 120px" />
          <span style="margin-left:8px;">㎡</span>
        </el-form-item>
        <el-form-item label="合同金额">
          <el-input-number v-model="form.amount" :min="0" style="width: 120px" />
          <span style="margin-left:8px;">元</span>
        </el-form-item>
        <el-form-item label="收款提醒">
          <el-radio-group v-model="form.remind" style="vertical-align: middle;">
            <el-radio :label="1">开通</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <div style="font-size:12px;color:#888;margin-left:10px;">
            (默认收款提醒消息推送至维保项目负责人)
          </div>
        </el-form-item>
      </div>
    </el-form>

    <!-- 设计单位、备注、调试、验收、上传 -->
    <div class="sub-form-row">
      <el-form label-width="108px">
        <el-row :gutter="38">
          <el-col :span="8">
            <el-form-item label="设计单位">
              <el-input v-model="form.designOrg" />
            </el-form-item>
            <el-form-item label="备注说明">
              <el-input type="textarea" v-model="form.remark" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="调试单位">
              <el-input v-model="form.debugOrg" />
            </el-form-item>
            <el-form-item label="验收备案">
              <el-input v-model="form.recordOrg" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合同文件">
              <el-upload action="#" :show-file-list="false">
                <el-button size="mini">上传合同文件</el-button>
              </el-upload>
              <div style="font-size: 13px;color: #888;line-height:1.2;margin-top:4px;">
                上传支持：DOCX、PDF、PNG、JPG等格式文件
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 建筑信息表格，高度还原样式 -->
    <div class="card-block card-building">
      <div class="building-title">
        <span style="color: #f56c6c;">*</span> 建筑信息
        <span class="desc-tip">（注：建筑物面积请填写纯数字，例如：0.00）</span>
      </div>
      <div class="building-table-wrap">
        <div class="building-table-head">
          <div>* 建筑信息</div>
          <div>* 建筑面积(m²)</div>
          <div>* 建筑层数</div>
          <div>* 建筑高度(m)</div>
          <div>备注</div>
          <div>操作</div>
        </div>
        <div
          class="building-table-row"
          v-for="(row, idx) in buildingData"
          :key="idx"
        >
          <el-input v-model="row.name" placeholder="请输入建筑名称" size="small" />
          <el-input-number
            v-model="row.area"
            :min="0"
            :controls="true"
            controls-position="right"
            size="small"
            style="width: 100px"
          />
          <el-input-number
            v-model="row.floor"
            :min="0"
            :controls="true"
            controls-position="right"
            size="small"
            style="width: 80px"
          />
          <el-input-number
            v-model="row.height"
            :min="0"
            :controls="true"
            controls-position="right"
            size="small"
            style="width: 80px"
          />
          <el-input v-model="row.remark" placeholder="请输入备注" size="small" />
          <el-button
            type="text"
            style="color: #f56c6c"
            @click="removeBuilding(idx)"
            >删除</el-button
          >
        </div>
        <div class="building-table-add">
          <el-button
            type="text"
            style="font-size: 16px; color: #409EFF;"
            @click="addBuilding"
          >
            <i class="el-icon-plus"></i> 新增内容
          </el-button>
        </div>
      </div>
    </div>

    <!-- 合同维保内容 -->
    <div class="card-block card-title">
      <div class="card-title-txt">合同维保内容</div>
    </div>
    <div class="content-flex">
      <!-- 左侧树 -->
      <el-tree
        class="maint-tree"
        :data="maintTree"
        show-checkbox
        node-key="id"
        :default-checked-keys="[2, 5]"
        :expand-on-click-node="false"
      ></el-tree>
      <!-- 右侧表 -->
      <el-table :data="maintTableData" border class="maint-table">
        <el-table-column prop="index" label="序号" width="60" align="center" />
        <el-table-column prop="system" label="消防系统设施" align="center" />
        <el-table-column prop="item" label="维保项目" align="center" />
        <el-table-column prop="content" label="检测内容" align="center" />
        <el-table-column prop="period" label="维保周期" align="center" />
      </el-table>
    </div>

    <!-- 底部保存 -->
    <div style="text-align: center;margin:40px 0 12px 0;">
      <el-button type="primary" size="large" style="width: 160px;font-size:18px;">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContractDetail",
  data() {
    return {
      form: {
        entrustName: "Cell C",
        dateStart: "2025-04-08",
        dateEnd: "2026-05-01",
        contractName: "VDS",
        contractNo: "BDR575",
        payCycle: "半年",
        buildType: "人员密集场所",
        creditCode: "91440101304662708A",
        maintType: "系统维保",
        maintArea: 3000,
        amount: 20000,
        remind: 0,
        designOrg: "",
        remark: "",
        debugOrg: "",
        recordOrg: ""
      },
      buildingData: [
        { name: "jk", area: 3000, floor: 6, height: 140, remark: "" }
      ],
      maintTree: [
        { id: 1, label: "消防供配电设施", children: [
          { id: 2, label: "配电柜" }
        ]},
        { id: 3, label: "火灾自动报警系统", children: [
          { id: 4, label: "报警主机" }
        ]}
      ],
      maintTableData: [
        { index: 1, system: "消防供配电设施", item: "配电柜", content: "试验主电源", period: "月检" },
        { index: 2, system: "消防供配电设施", item: "配电柜", content: "消防设备", period: "月检" }
      ]
    }
  },
  methods: {
    addBuilding() {
      this.buildingData.push({ name: "", area: "", floor: "", height: "", remark: "" });
    },
    removeBuilding(index) {
      this.buildingData.splice(index, 1);
    }
  }
}
</script>

<style scoped>
.contract-detail-root {
  background: #fff;
  padding: 18px 18px 32px 18px;
}
.card-block {
  background: #f8f9fb;
  border-radius: 8px;
  padding: 18px 16px 10px 16px;
  margin-bottom: 18px;
  margin-top: 10px;
}
.card-title {
  padding: 12px 18px 12px 18px;
  margin-bottom: 18px;
}
.card-title-txt {
  font-size: 22px;
  font-weight: bold;
  color: #222;
}
.form-grid {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #fff;
  padding: 10px 12px;
  margin-bottom: 6px;
}
.form-left, .form-right {
  flex: 1;
  min-width: 350px;
  max-width: 460px;
}
.form-left {
  margin-right: 36px;
}
.sub-form-row {
  background: #fff;
  margin: 0 0 18px 0;
}
.card-building {
  padding-bottom: 0 !important;
}
.building-title {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 18px;
}
.desc-tip {
  color: #888;
  font-size: 13px;
  margin-left: 8px;
}
.building-table-wrap {
  width: 100%;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 0;
  border: 1px solid #f2f2f2;
}
.building-table-head {
  display: grid;
  grid-template-columns: 180px 180px 120px 150px 1fr 80px;
  background: #f4f8fb;
  color: #222;
  font-weight: bold;
  font-size: 16px;
  align-items: center;
  padding: 0 10px;
  height: 48px;
  border-bottom: 1px solid #f2f2f2;
}
.building-table-row {
  display: grid;
  grid-template-columns: 180px 180px 120px 150px 1fr 80px;
  align-items: center;
  padding: 10px 10px;
  border-bottom: 1px solid #f2f2f2;
  background: #fff;
}
.building-table-row:last-child {
  border-bottom: none;
}
.building-table-add {
  text-align: center;
  padding: 16px 0 10px 0;
  background: #fff;
  border-radius: 0 0 6px 6px;
}
.content-flex {
  display: flex;
  margin-top: 18px;
  gap: 20px;
}
.maint-tree {
  min-width: 240px;
  max-width: 320px;
  background: #fff;
  border-radius: 10px;
  padding: 18px 0 12px 18px;
  box-shadow: 0 2px 8px #e0ebff22;
}
.maint-table {
  flex: 1;
  min-width: 400px;
  margin-left: 12px;
  background: #fff;
}
</style>
