<template>
    <el-card>
        <template #header>
            <div class="header">
                <el-button type="primary" icon="plus" @click="handleAdd">增加商品图片</el-button>
            </div>
        </template>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column prop="id" label="id" width="50">
            </el-table-column>
            <el-table-column prop="sku" label="SKU商品id">
            </el-table-column>
            <el-table-column label="商品图片">
                <template #default="scope">
                    <img :src="scope.row.image" width="100" height="100">
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="scope">
                    <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.id)">修改</a>
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
    <DialogAddPictures ref='addPictures' :reload="fnGetData" :type="type" />
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import axios from '@/utils/axios'
import DialogAddPictures from '@/components/DialogAddPictures.vue'
export default {
    name: 'Pictures',
    components: {
        DialogAddPictures
    },
    setup() {
        const addPictures = ref(null)
        const state = reactive({
            tableData: [],//数据列表
            currentPage: 1,//当前页
            pageSize: 10,//页容量
            type: 'add', // 操作类型,
            multipleSelection: [], // 选中项
            pages: 8,//总页数
            // total: 0, // 总条数
        })
        //添加商品图片按钮
        const handleAdd = () => {
            state.type = 'add'
            addPictures.value.open()
        }
        // 修改商品按钮
        const handleEdit = (id) => {
            state.type = 'edit'
            addPictures.value.open(id)
        }
        //删除商品按钮
        const handleDeleteOne = (id) => {
            axios.delete('/skus/images/' + id + '/').then(res => {
                ElMessage({
                    message: '图片删除成功!',
                    type: 'success'
                })
                fnGetData()
            }).catch(err => {
                ElMessage({
                    message: '图片未找到',
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
            axios.get('/skus/images/', {
                params: {
                    page: num,
                    pagesize: state.pageSize
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
            addPictures,
            ...toRefs(state),
            handleSelectionChange,
            changePage,
            handleAdd,
            handleEdit,
            handleDeleteOne,
            fnGetData
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