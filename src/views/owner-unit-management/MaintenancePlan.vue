<template>
  <div class="plan-list-page">
    <!-- 顶部筛选栏 -->
    <div class="search-bar">
      <el-input
        v-model="filters.name"
        placeholder="项目名称搜索"
        clearable
        class="search-input"
      />
      <el-select
        v-model="filters.makingStatus"
        placeholder="制定情况"
        clearable
        class="search-input"
      >
        <el-option label="已制定" value="已制定" />
        <el-option label="未制定" value="未制定" />
      </el-select>
      <el-select
        v-model="filters.planType"
        placeholder="计划类型"
        clearable
        class="search-input"
      >
        <el-option label="月" value="月" />
        <el-option label="季度" value="季度" />
      </el-select>
      <el-select
        v-model="filters.planStatus"
        placeholder="计划状态"
        clearable
        class="search-input"
      >
        <el-option label="未开始" value="未开始" />
        <el-option label="进行中" value="进行中" />
        <el-option label="已完成" value="已完成" />
      </el-select>

      <el-button type="primary" icon="el-icon-search" @click="handleSearch">
        查询
      </el-button>
      <el-button icon="el-icon-refresh" @click="handleReset"> 重置 </el-button>

      <el-button
        type="success"
        icon="el-icon-check"
        class="green-btn"
        :disabled="multipleSelection.length === 0"
        @click="handleBatchCreate"
      >
        一键制定所选计划 ({{ multipleSelection.length }})
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }"
      v-loading="loading"
      element-loading-text="加载中..."
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        type="index"
        label="序号"
        width="60"
        align="center"
        :index="indexMethod"
      />
      <el-table-column prop="projectName" label="项目名称" align="center" />
      <el-table-column prop="ownerName" label="业主单位名称" align="center" />
      <el-table-column prop="planType" label="计划类型" align="center">
        <template slot-scope="{ row }">
          <el-tag
            :type="row.planType === '月' ? 'primary' : 'warning'"
            size="small"
            style="font-weight: bold"
          >
            {{ row.planType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="maintenanceMethod" label="维保方式" align="center">
        <template slot-scope="{ row }">
          <el-tag
            :type="getMaintenanceMethodType(row.maintenanceMethod)"
            size="small"
            style="font-weight: bold"
          >
            {{ row.maintenanceMethod }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="planDefinedStatus" label="制定情况" align="center">
        <template slot-scope="{ row }">
          <el-tag
            :type="row.planDefinedStatus === '已制定' ? 'success' : 'danger'"
            size="small"
            style="font-weight: bold"
          >
            {{ row.planDefinedStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="planStatus" label="计划状态" align="center">
        <template slot-scope="{ row }">
          <el-tag
            :type="getStatusType(row.planStatus)"
            size="small"
            style="font-weight: bold"
          >
            {{ row.planStatus }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="260">
        <template slot-scope="{ row }">
          <!-- 未制定：直接调用 settask 生成本月任务 -->
          <template v-if="row.planDefinedStatus === '未制定'">
            <el-link type="success" @click="handleCreate(row)">
              制定本月任务
            </el-link>
            <el-link
              type="danger"
              style="margin-left: 8px"
              @click="handleDelete(row)"
            >
              删除
            </el-link>
          </template>

          <!-- 已制定：查看详情 / 任务列表 -->
          <template v-else>
            <el-link type="primary" @click="handleShowProject(row)">
              项目详情
            </el-link>
            <el-link
              type="info"
              style="margin: 0 8px"
              @click="handleShowPlan(row)"
            >
              任务详情
            </el-link>
            <el-link type="danger" @click="handleDelete(row)">删除</el-link>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 右下角设置按钮 -->
    <el-button
      class="setting-btn"
      type="primary"
      icon="el-icon-setting"
      circle
    />

    <!-- 底部分页与统计 -->
    <div class="table-footer">
      <div class="total">共查询到 {{ total }} 条</div>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import {
  getMaintainPlans,
  deleteMaintenancePlan, // 🔥 使用真实 settask API
} from "@/api/maintainPlan";
import { generateTasksFromPlan } from "@/api/maintainTask";

export default {
  name: "PlanListPage",
  data() {
    return {
      filters: {
        name: "",
        makingStatus: "",
        planType: "",
        planStatus: "",
      },
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    // 当前月份 YYYY-MM
    getCurrentTaskMonth() {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      return `${y}-${m}`;
    },

    async fetchData() {
      this.loading = true;
      try {
        const { name, makingStatus, planType, planStatus } = this.filters;
        const res = await getMaintainPlans({
          page: this.currentPage,
          limit: this.pageSize,
          projectName: name,
          planDefinedStatus: makingStatus,
          planType,
          planStatus,
        });
        this.tableData = res.data || [];
        this.total = res.total || 0;
      } catch (err) {
        this.$message.error(`数据加载失败：${err.message || "请重试"}`);
      } finally {
        this.loading = false;
      }
    },

    // 序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },

    // 查询 & 重置
    handleSearch() {
      this.currentPage = 1;
      this.fetchData();
    },
    handleReset() {
      this.filters = {
        name: "",
        makingStatus: "",
        planType: "",
        planStatus: "",
      };
      this.currentPage = 1;
      this.fetchData();
    },

    // 分页
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchData();
    },

    // 选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // Tag 类型
    getStatusType(status) {
      if (status === "未开始") return "info";
      if (status === "进行中") return "warning";
      if (status === "已完成") return "success";
      return "info";
    },
    getMaintenanceMethodType(method) {
      if (method === "点位维保") return "success";
      if (method === "系统维保") return "primary";
      if (method === "第三方维保") return "warning";
      return "info";
    },

    // 跳转：任务 / 项目
    handleShowPlan(row) {
      this.$router.push({
        name: "OwnerTaskDetail",
        query: {
          planId: row._id,
          projectId: row.projectId || row._id,
          projectName: row.projectName,
        },
      });
    },
    handleShowProject(row) {
      const targetId = row.contractId || row.projectId;
      if (!targetId) {
        this.$message.error("无法获取项目详情：缺少项目ID或合同ID");
        return;
      }
      this.$router.push({
        name: "UnitDetail",
        query: {
          id: targetId,
          contractId: row.contractId,
          projectId: row.projectId,
        },
      });
    },

    // 🔥 单个制定：直接调用 settask 生成本月任务（仅当该月份无任务时）
    async handleCreate(row) {
      try {
        const taskMonth = this.getCurrentTaskMonth();

        await this.$confirm(
          `确定要为项目 "${row.projectName}" 根据该计划生成 ${taskMonth} 的维保任务吗？\n\n注意：如果该月份已有任务，将不会重复生成。`,
          "制定计划并生成任务",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info",
          }
        );

        this.loading = true;
        const res = await generateTasksFromPlan({
          planId: row._id,
          taskMonth,
        });

        if (res && res.success) {
          this.$message.success("任务生成成功");
          // 后端已经更新了 plan 的状态，这里直接刷新列表更安全
          await this.fetchData();
        } else if (res && res.skipGeneration) {
          // 已有任务，跳过生成
          this.$message.warning(
            res.message || `${taskMonth} 月份已有任务，无需重复生成`
          );
          await this.fetchData(); // 刷新列表以更新状态
        } else {
          this.$message.error(res.message || "任务生成失败");
        }
      } catch (e) {
        if (e !== "cancel") {
          console.error("生成任务失败:", e);
          this.$message.error(e.message || "生成任务时发生错误");
        }
      } finally {
        this.loading = false;
      }
    },

    // 删除
    handleDelete(row) {
      this.$confirm("确定要删除这条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deleteMaintenancePlan(row._id);
          this.$message.success("删除成功");
          this.fetchData();
        })
        .catch(() => {});
    },

    // 🔥 批量制定：对选中的“未制定”计划批量调用 settask
    async handleBatchCreate() {
      const targets = this.multipleSelection.filter(
        (item) => item.planDefinedStatus === "未制定"
      );
      if (targets.length === 0) {
        this.$message.warning("请选择至少一条『未制定』的计划");
        return;
      }

      const taskMonth = this.getCurrentTaskMonth();

      const countByMethod = targets.reduce((acc, cur) => {
        const key = cur.maintenanceMethod || "未设置";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const text = Object.entries(countByMethod)
        .map(([k, v]) => `${k}: ${v} 条`)
        .join("，");

      try {
        await this.$confirm(
          `本次将为 ${targets.length} 条『未制定』计划生成 ${taskMonth} 的任务。\n\n按维保方式统计：\n${text}\n\n是否继续？`,
          "批量制定计划并生成任务",
          {
            confirmButtonText: "继续",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
      } catch {
        // 取消
        return;
      }

      this.loading = true;
      let successCount = 0;
      let failCount = 0;
      const failedNames = [];

      try {
        for (const plan of targets) {
          try {
            const res = await generateTasksFromPlan({
              planId: plan._id,
              taskMonth,
            });
            if (res && res.success) {
              successCount++;
            } else if (res && res.skipGeneration) {
              // 已有任务，跳过生成，不算失败也不算成功
              // 可以选择不计入统计，或者单独统计
              successCount++; // 视为"已处理"，因为已有任务也是正常状态
            } else {
              failCount++;
              failedNames.push(plan.projectName || plan._id);
            }
          } catch (err) {
            failCount++;
            failedNames.push(plan.projectName || plan._id);
            console.error("批量生成任务失败，plan:", plan._id, err);
          }
        }

        await this.fetchData();

        this.$message.success(
          `批量制定完成：成功 ${successCount} 条，失败 ${failCount} 条${
            failedNames.length
              ? "（失败项目：" + failedNames.join("，") + "）"
              : ""
          }`
        );
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.plan-list-page {
  min-height: 100vh;
  background: #fafbfc;
  padding: 16px 16px 0 16px;
  position: relative;
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.search-input {
  width: 240px;
}
.green-btn {
  background: #50b94e !important;
  color: #fff !important;
  border: none !important;
}
.setting-btn {
  position: fixed;
  right: 42px;
  bottom: 120px;
  z-index: 20;
  width: 56px;
  height: 56px;
  font-size: 26px;
  background: #1d8cff;
  border: none;
  box-shadow: 0 4px 24px #b7dfff44;
}
.table-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 8px;
  margin-bottom: 0;
  position: relative;
}
.total {
  position: absolute;
  left: 0;
  bottom: 0;
  font-size: 18px;
  color: #333;
  margin-left: 16px;
  margin-top: 4px;
}
</style>
