<template>
    <div class="unit-detail-page">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">" class="breadcrumb-bar">
            <el-breadcrumb-item>业主单位管理</el-breadcrumb-item>
            <el-breadcrumb-item>单位项目管理</el-breadcrumb-item>
            <el-breadcrumb-item>项目详情</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 返回按钮 -->
        <el-button class="back-btn" icon="el-icon-back" @click="$router.back()">返回</el-button>

        <el-card>
            <el-table :data="tableData" border style="width: 100%; margin-top: 16px"
                :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }">
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="projectName" label="项目名称" align="center" />
                <el-table-column prop="projectId" label="项目ID" align="center" :show-overflow-tooltip="true" />
                <el-table-column prop="ownerName" label="业主单位名称" align="center" />
                <el-table-column prop="entrustName" label="委托单位" align="center" />
                <el-table-column prop="status" label="当前服务状态" align="center">
                    <template slot-scope="{ row }">
                        <span style="color:#409eff">{{ row.status }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="serviceDate" label="合同服务日期" align="center" />
                <el-table-column label="操作" width="80" align="center">
                    <template slot-scope="{ row }">
                        <el-link type="primary" @click="viewDetail(row)">详情</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 悬浮设置按钮 -->
        <el-button class="setting-btn" type="primary" icon="el-icon-setting" circle @click="onSetting" title="设置" />
    </div>
</template>

<script>
export default {
    name: 'UnitDetail',
    data() {
        return {
            tableData: [
                {
                    projectName: 'ue',
                    projectId: '669464893827833665',
                    ownerName: '小学',
                    entrustName: 'Cell C',
                    status: '服务中',
                    serviceDate: '2025-04-08至2026-05-01'
                }
            ]
        }
    },
    methods: {
        viewDetail(row) {
            this.$router.push({
                name: 'Detail',
                query: { id: row.projectId }
            })



        }
        ,
        onSetting() {
            this.$message.info('设置')
        }
    }
}
</script>

<style scoped>
.unit-detail-page {
    min-height: 100vh;
    background: #fff;
    padding: 24px 24px 0 24px;
    position: relative;
}

.breadcrumb-bar {
    margin-bottom: 18px;
}

.back-btn {
    position: absolute;
    right: 48px;
    top: 22px;
    z-index: 5;
}

.setting-btn {
    position: fixed;
    right: 32px;
    top: 320px;
    z-index: 10;
    box-shadow: 0 2px 8px #87b7fd33;
}
</style>
