<template>
    <div class="unit-manage-page">
        <!-- 查询栏 -->
        <div class="search-bar">
            <el-input v-model="filters.ownerName" placeholder="输入业主单位名称搜索" style="width:220px" clearable />
            <el-input v-model="filters.entrustName" placeholder="输入委托单位搜索" style="width:220px" clearable />
            <el-select v-model="filters.status" placeholder="选择服务状态" style="width:180px" clearable>
                <el-option label="服务中" value="服务中" />
                <el-option label="已到期" value="已到期" />
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
            <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="onAdd">新增</el-button>
        </div>

        <!-- 表格 -->
        <el-table :data="tableData" border style="width: 100%; margin-top: 16px"
            :header-cell-style="{ fontWeight: 'bold', fontSize: '15px' }" :empty-text="' '">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="ownerName" label="业主单位名称" align="center" />
            <el-table-column prop="entrustName" label="委托单位" align="center" />
            <el-table-column prop="status" label="当前服务状态" align="center">
                <template slot-scope="{ row }">
                    <span style="color:#409eff">{{ row.status }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="contractAmount" label="合同金额" align="center" /> <!-- 新增这一行 -->
            <el-table-column prop="days" label="当前合同时间" align="center">
                <template slot-scope="{ row }">
                    <span style="color:#409eff">剩余：{{ row.days }}天</span>
                </template>
            </el-table-column>
            <el-table-column prop="renewStatus" label="续签情况" align="center" />
            <el-table-column label="操作" width="180" align="center">
                <template slot-scope="{ row }">
                    <el-link type="primary" @click="viewDetail(row)">项目详情</el-link>
                    <el-link type="success" style="margin:0 8px" @click="onRenew(row)">续签</el-link>
                    <el-link type="danger" @click="onDelete(row)">删除</el-link>
                </template>
            </el-table-column>
        </el-table>

        <!-- 无数据时自定义内容 -->
        <div v-if="tableData.length === 0" class="table-empty">
            <img :src="require('@/assets/无数据.jpg')" alt="无数据" class="empty-img">
            <div class="empty-text">暂无数据</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UnitManagePage',
    data() {
        return {
            filters: {
                ownerName: '',
                entrustName: '',
                status: ''
            },
            allData: [
                {
                    ownerName: '小学',
                    entrustName: 'Cell C',
                    status: '服务中',
                    contractAmount: '￥100,000', // 合同金额
                    days: 323,
                    renewStatus: '未续签'
                },
                {
                    ownerName: '高坪汽车站',
                    entrustName: '四川南充汽车运输（…）',
                    status: '服务中',
                    contractAmount: '￥80,000', // 合同金额
                    days: 203,
                    renewStatus: '未续签'
                }
            ],

            tableData: []
        }
    },
    mounted() {
        this.onSearch()
    },
    methods: {
        onSearch() {
            // 实际开发应换成接口请求
            const { ownerName, entrustName, status } = this.filters
            this.tableData = this.allData.filter(item =>
                (!ownerName || item.ownerName.includes(ownerName)) &&
                (!entrustName || item.entrustName.includes(entrustName)) &&
                (!status || item.status === status)
            )
        },
        onReset() {
            this.filters = { ownerName: '', entrustName: '', status: '' }
            this.onSearch()
        },
        onAdd() {
            this.$router.push({ name: 'add' })
        },

        viewDetail(row) {
            // 推荐：通过 name 跳转，带 query 参数
            this.$router.push({
                name: 'UnitDetail',
                query: { ownerName: row.ownerName }
            })
        },

        onRenew(row) {
            this.$message.info('续签功能：' + row.ownerName)
        },
        onDelete(row) {
            this.$confirm(`确定删除「${row.ownerName}」吗？`, '提示', {
                type: 'warning'
            }).then(() => {
                this.allData = this.allData.filter(item => item !== row)
                this.onSearch()
                this.$message.success('删除成功')
            }).catch(() => { })
        }
    }
}
</script>

<style scoped>
.unit-manage-page {
    min-height: 100vh;
    background: #fff;
    padding: 10px 12px 0 10px;
    position: relative;
}

.search-bar {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    gap: 0 10px;
    flex-wrap: wrap;
}

.search-bar>* {
    margin-right: 0 !important;
    min-width: 120px;
}

.table-empty {
    position: absolute;
    top: 140px;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 2;
    user-select: none;
}

.empty-img {
    width: 120px;
    opacity: 0.7;
    margin-bottom: 8px;
}

.empty-text {
    color: #888;
    font-size: 16px;
}
</style>
