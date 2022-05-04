<template>
    <el-card>
        <template #header>
            <div class="header">
                <el-button type="primary" icon="plus" @click="handleAdd">增加用户</el-button>
            </div>
        </template>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column prop="id" label="id" width="100">
            </el-table-column>
            <el-table-column prop="username" label="用户名">
            </el-table-column>
            <el-table-column prop="mobile" label="手机号">
            </el-table-column>
            <el-table-column prop="email" label="邮箱">
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :page-count="pages" :page-size="pageSize"
            :current-page="currentPage" @current-change="changePage" />
    </el-card>
    <DialogAddUsers ref='addUsers' :reload="fnGetData" :type="type" />
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import axios from '@/utils/axios'
import DialogAddUsers from '@/components/DialogAddUsers.vue'
export default {
    name: 'User',
    components: {
        DialogAddUsers
    },
    setup() {
        const addUsers = ref(null)
        const state = reactive({
            tableData: [],//数据列表
            currentPage: 1,//当前页
            pageSize: 10,//页容量
            type: 'add', // 操作类型,
            multipleSelection: [], // 选中项
            pages: 8,//总页数
            // total: 0, // 总条数
        })

        //添加用户按钮
        const handleAdd = () => {
            state.type = 'add'
            addUsers.value.open()
        }

        //挂载
        onMounted(() => {
            fnGetData(1)
        })
        //获取分页
        const fnGetData = (num) => {
            axios.get('/users/', {
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
            addUsers,
            ...toRefs(state),
            fnGetData,
            changePage,
            handleSelectionChange,
            handleAdd
        }
    }

}
</script>