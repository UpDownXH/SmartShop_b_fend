<template>
    <el-card>
        <template #header>
            <div class="header">
                <el-button type="primary" icon="plus" @click="handleAdd">增加权限</el-button>
            </div>
        </template>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column prop="id" label="id" width="100">
            </el-table-column>
            <el-table-column prop="name" label="权限名称">
            </el-table-column>
            <el-table-column prop="codename" label="权限识别名">
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
    <DialogAddAuthor ref='addAuthor' :reload="fnGetData" :type="type" />
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import axios from '@/utils/axios'
import DialogAddAuthor from '@/components/DialogAddUsers.vue'
export default {
    name: 'Author',
    components: {
        DialogAddAuthor
    },
    setup() {
        const addAuthor = ref(null)
        const state = reactive({
            tableData: [],//数据列表
            currentPage: 1,//当前页
            pageSize: 10,//页容量
            type: 'add', // 操作类型,
            multipleSelection: [], // 选中项
            pages: 8,//总页数
            // total: 0, // 总条数
        })

        // 添加权限按钮
        const handleAdd = () => {
            state.type = 'add'
            addAuthor.value.open()
        }
        // 修改权限按钮
        const handleEdit = (id) => {
            state.type = 'edit'
            addAuthor.value.open(id)
        }
        // 删除权限按钮
        const handleDeleteOne = (id) => {
            axios.delete('/permission/perms/' + id + '/').then(res => {
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
            axios.get('/permission/perms/', {
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
            addAuthor,
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