<!-- 续签项目信息 -->
 <template>
  <div class="renewal-project-info">
    <!-- 内容区 -->
    <div class="project-info-card">
      <!-- section1: 委托单位信息 -->
      <div class="section-title">委托单位信息</div>
      <el-row :gutter="10" style="margin-bottom:10px;">
        <el-col :span="8">
          <el-form :model="form" label-width="110px">
            <el-form-item label="委托单位名称">
              <el-input v-model="form.orgName" disabled />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <el-form :model="form" label-width="140px">
            <el-form-item label="统一社会信用代码">
              <el-input v-model="form.uscc" disabled />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- section2: 合同关联项目信息 -->
      <div class="section-title blue-bg">
        合同关联项目信息
        <span class="section-tip">(提示：请完整填写当前合同下的所有关联项目信息。)</span>
      </div>
      <el-table :data="tableData" border class="data-table">
        <el-table-column prop="index" label="序号" align="center" width="70"/>
        <el-table-column prop="owner" label="业主单位名称" align="center" width="120"/>
        <el-table-column prop="projectName" label="项目名称" align="center" width="120"/>
        <el-table-column prop="projectAddr" label="项目地址" align="center"/>
        <el-table-column prop="projectRegion" label="项目区域" align="center" width="140"/>
        <el-table-column prop="contact" label="项目单位联系人" align="center" width="120"/>
        <el-table-column prop="phone" label="联系人电话" align="center" width="130"/>
        <el-table-column label="操作" align="center" width="110">
          <template slot-scope="scope">
            <el-link type="primary" style="margin-right:6px;">详情</el-link>
            <el-link type="danger" style="color:#ff3a1f;">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="btn-row">
        <el-button class="add-btn" @click="addProject">添加项目</el-button>
      </div>
      <!-- 底部按钮 -->
      <div class="bottom-btns">
        <el-button @click="prevStep" class="prev-btn">上一步</el-button>
        <el-button type="primary" class="next-btn" @click="nextStep">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RenewalProjectInformation",
  data() {
    return {
      form: {
        orgName: 'Cell C',
        uscc: '91440101304662708A'
      },
      tableData: [
        {
          index: 1,
          owner: '小学',
          projectName: '1',
          projectAddr: '四川省南充市顺庆区...',
          projectRegion: '四川省南充市顺庆区',
          contact: '我算了',
          phone: '17683231030'
        }
      ]
    }
  },
  methods: {
    addProject() {
      // todo: 打开弹窗或表单添加项目
    },
    prevStep() {
      this.$emit('prev')
    },
    nextStep() {
      this.$emit('next')
    }
  }
}
</script>

<style scoped>
.renewal-project-info {
  background: #fafbfc;
  min-height: 100vh;
  padding-bottom: 32px;
}
.project-info-card {
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  max-width: 99%;
  padding: 20px 28px 28px 28px;
  box-shadow: 0 4px 24px #e3f2ff30;
}
.section-title {
  font-size: 22px;
  font-weight: bold;
  color: #222;
  padding: 12px 0 10px 16px;
  margin-bottom: 0;
}
.section-title.blue-bg {
  background: #e8f3fe;
  border-radius: 7px 7px 0 0;
  margin: 18px 0 0 0;
  padding-top: 13px;
  padding-bottom: 13px;
  display: flex;
  align-items: center;
}
.section-tip {
  color: #ff4a1a;
  font-size: 16px;
  margin-left: 12px;
  font-weight: 400;
}
.data-table {
  margin: 0 0 8px 0;
}
.btn-row {
  margin: 10px 0 0 0;
  text-align: left;
}
.add-btn {
  font-size: 17px;
  height: 40px;
  padding: 0 36px;
  background: #fff;
  border: 1.5px solid #e0e6ee;
  color: #222;
  border-radius: 8px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.bottom-btns {
  margin-top: 38px;
  display: flex;
  justify-content: center;
  gap: 20px;
}
.prev-btn {
  width: 160px;
  height: 44px;
  font-size: 20px;
  border-radius: 7px;
  background: #fff;
  border: 1.7px solid #e0e6ee;
  color: #222;
  letter-spacing: 6px;
}
.next-btn {
  width: 180px;
  height: 44px;
  font-size: 20px;
  background: #1888fe;
  border: none;
  border-radius: 7px;
  color: #fff;
  letter-spacing: 10px;
}
.next-btn:hover {
  background: #157de6;
}
</style>
