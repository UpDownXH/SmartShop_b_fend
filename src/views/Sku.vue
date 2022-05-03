<template>
    <el-card>
        <template #header>
            <div class="header">
                <el-button type="primary" icon="plus" @click="handleAdd">增加商品</el-button>
                <!-- 查找功能后续添加 -->
                <!-- <el-input placeholder="Please input" class="input-with-select">
                    <template #prepend>
                        <el-button icon="Search" />
                    </template>
                </el-input> -->
            </div>
        </template>
        <!-- :load="loading" 有问题，暂时不设置 -->
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column prop="id" label="id" width="50">
            </el-table-column>
            <el-table-column prop="name" label="商品SKU名">
            </el-table-column>
            <el-table-column prop="category" label="分类">
            </el-table-column>
            <el-table-column prop="price" label="价格">
            </el-table-column>
            <el-table-column prop="stock" label="库存">
            </el-table-column>
            <el-table-column prop="sales" label="销量">
            </el-table-column>
            <el-table-column label="上下架">
                <template #default="scope">
                    <span>{{ scope.row.is_launched ? '上架' : '下架' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="scope">
                    <a style="cursor: pointer; margin-right: 10px"
                        @click="handleEdit(scope.row.id, scope.row.spu_id)">修改</a>
                    <el-popconfirm title="确定删除吗？" confirmButtonText='确定' cancelButtonText='取消'
                        @confirm="handleDeleteOne(scope.row.id)">
                        <template #reference>
                            <a style="cursor: pointer">删除</a>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :page-count="pages" :page-size="pageSize"
            :current-page="currentPage" @current-change="changePage" />
    </el-card>
    <DialogAddGoods ref='addGoods' :reload="fnGetData" :type="type" />
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import axios from '@/utils/axios'
import DialogAddGoods from '@/components/DialogAddGoods.vue'
import { Search } from '@element-plus/icons-vue'
export default {
    name: 'Sku',
    setup() {
        const addGoods = ref(null)
        const state = reactive({
            keyword: '',//搜索词

            tableData: [],//数据列表
            currentPage: 1,//当前页
            pageSize: 10,//页容量
            type: 'add', // 操作类型,
            multipleSelection: [], // 选中项
            pages: 8,//总页数
            // total: 0, // 总条数
        })
        //添加商品按钮
        const handleAdd = () => {
            state.type = 'add'
            addGoods.value.open()
        }
        // 修改商品按钮
        const handleEdit = (id, gid) => {
            state.type = 'edit'
            addGoods.value.open(id, gid)
        }
        //删除商品按钮
        const handleDeleteOne = (id) => {
            axios.delete('/skus/' + id + '/').then(res => {
                ElMessage({
                    message: '商品删除成功!',
                    type: 'success'
                })
                fnGetData()
            }).catch(err => {
                ElMessage({
                    message: '商品未找到',
                    type: 'info'
                })
            });
        }
        //挂载
        onMounted(() => {
            fnGetData(1)
        })
        //获取分页
        const fnGetData = (num) => {

            axios.get('/skus/', {
                params: {
                    page: num,
                    pagesize: state.pageSize,
                    keyword: state.keyword
                }
            }).then(res => {
                state.tableData = res.data.lists;
                state.currentPage = res.data.page;
                state.pages = res.data.pages;
            }).catch(err => {
                console.log(err);
            });
        }
        // 选中之后的change方法，一旦选项有变化，就会触发该方法。
        const handleSelectionChange = (val) => {
            state.multipleSelection = val
        }
        //分页按钮的方法
        const changePage = (dat) => {
            state.currentPage = dat;
            fnGetData(state.currentPage)
        }

        return {
            ...toRefs(state),
            handleSelectionChange,
            changePage,
            handleAdd,
            handleEdit,
            addGoods,
            fnGetData,
            handleDeleteOne
        }
    }
}
</script>

<style scoped>
.input-with-select {
    margin-left: 10px;
    width: 500px;
}
</style>