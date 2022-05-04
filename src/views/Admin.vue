<template>
    <el-card>
        <template #header>
            <div class="header">
                <el-button type="primary" icon="plus" @click="handleAdd">增加用户组</el-button>
            </div>
        </template>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
            @selection-change="handleSelectionChange">
            <el-table-column prop="id" label="id" min-width="10">
            </el-table-column>
            <el-table-column prop="username" label="用户名" min-width="25">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" min-width="25">
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" min-width="25">
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
    <DialogAddAdmin ref='addAdmin' :reload="fnGetData" :type="type" />
</template>


<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import axios from '@/utils/axios'
import DialogAddAdmin from '@/components/DialogAddAdmin.vue'
export default {
    name: 'Author',
    components: {
        DialogAddAdmin
    },
    setup() {
        const addAdmin = ref(null)
        const state = reactive({
            tableData: [],//数据列表
            currentPage: 1,//当前页
            pageSize: 10,//页容量
            type: 'add', // 操作类型,
            multipleSelection: [], // 选中项
            pages: 8,//总页数
            // total: 0, // 总条数
        })

        // 添加组按钮
        const handleAdd = () => {
            state.type = 'add'
            addAdmin.value.open()
        }
        // 修改组按钮
        const handleEdit = (id) => {
            state.type = 'edit'
            addAdmin.value.open(id)
        }
        // 删除组按钮
        const handleDeleteOne = (id) => {
            axios.delete('/permission/admins/' + id + '/').then(res => {
                ElMessage({
                    message: '权限删除成功!',
                    type: 'success'
                })
                fnGetData()
            }).catch(err => {
                ElMessage({
                    message: '权限未找到',
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
            axios.get('/permission/admins/', {
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
            addAdmin,
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