<template>
    <el-dialog :title="type == 'add' ? '新增组' : '修改组'" v-model="visible" width="800px">
        <el-form :model="adminForm" ref="formRef" :rules="rules" :inline="true" label-width="100px" class="good-form">
            <el-form-item label="用户名：" prop="username">
                <el-input type="text" v-model="adminForm.username" autocomplete="off" size="small"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input type="test" v-model="adminForm.password" autocomplete="off" size="small"></el-input>
            </el-form-item>
            <el-form-item label="手机：" prop="mobile">
                <el-input type="text" v-model="adminForm.mobile" autocomplete="off" size="small"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
                <el-input type="text" v-model="adminForm.email" autocomplete="off" size="small"></el-input>
            </el-form-item>
            <el-form-item label="用户组：">
                <el-transfer v-model="adminForm.listval" :data="adminForm.list" size="mini"></el-transfer>
            </el-form-item>
            <el-form-item label="权限：">
                <el-transfer v-model="adminForm.listval2" :data="adminForm.list2" size="mini"></el-transfer>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="cancel()">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>


<script>
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue'
import axios from '@/utils/axios'
export default {
    name: 'DialogAddAuthor',
    props: {
        type: String,//add 为新增，edit为编辑
        reload: Function //table刷新的方法
    },
    setup(props) {
        //formRef用于表单校验控制
        const formRef = ref(null)
        const state = reactive({
            visible: false,//控制弹窗的显示隐藏
            edit_id: 0,
            // content_type_list: [],
            adminForm: {
                username: '',
                password: '',
                mobile: '',
                email: '',
                list: [],
                listval: [],
                list2: [],
                listval2: []
            },
            rules: {
                username: [
                    { required: 'true', message: '用户名不能为空', trigger: 'blur' },
                    {
                        pattern: /^\w{5,20}$/,
                        message: '用户名是5到20位数字、字母或下划线',
                        trigger: 'blur'
                    }
                ],
                password: [
                    { required: 'true', message: '密码不能为空', trigger: 'blur' },
                    {
                        pattern: /^[\w!@#$%^&*]{8,20}$/,
                        message: '密码是8到20位数字、字母或下划线以及特殊!@#$%^&*符号',
                        trigger: 'blur'
                    }
                ],
                mobile: [
                    { required: 'true', message: '手机号不能为空', trigger: 'blur' },
                    {
                        pattern: /^1[34578]\d{9}$/,
                        message: '手机格式不正确',
                        trigger: 'blur'
                    }
                ],
            }
        })
        //提交表单
        const submitForm = () => {
            if (props.type == 'add') {
                axios.post('/permission/admins/', {
                    "username": state.adminForm.username,
                    "password": state.adminForm.password,
                    "mobile": state.adminForm.mobile,
                    "email": state.adminForm.email,
                    "groups": state.adminForm.listval,
                    "user_permissions": state.adminForm.listval2,
                }).then(res => {
                    if (res.status == 201) {
                        ElMessage({
                            message: '添加组成功!',
                            type: 'success'
                        })
                        state.visible = false;
                        state.adminForm.name = '';
                        state.adminForm.listval = [];
                        state.adminForm.listval2 = [];
                        formRef.value.resetFields();
                        if (props.reload) props.reload()
                    }
                }).catch(err => {
                    console.log(err.response);
                })
            } else {
                axios.put('/permission/admins/' + state.edit_id + '/', {
                    "username": state.adminForm.username,
                    "password": state.adminForm.password,
                    "mobile": state.adminForm.mobile,
                    "email": state.adminForm.email,
                    "groups": state.adminForm.listval,
                    "user_permissions": state.adminForm.listval2
                }).then(res => {
                    // if (res.status == 200) {
                    ElMessage({
                        message: '修改权限成功!',
                        type: 'success'
                    })
                    state.visible = false;
                    state.adminForm.name = '';
                    state.adminForm.listval = [];
                    state.adminForm.listval2 = [];
                    if (props.reload) props.reload()
                    formRef.value.resetFields();
                    // }
                }).catch(err => {
                    console.log(err.response);
                })
            }
        }
        // //获取权限详情
        // const getDetail = (id) => {
        //     console.log(id);
        //     state.edit_id = id
        //     axios.get('/permission/groups/' + id + '/').then(res => {
        //         state.adminForm.name = res.data.name;
        //         state.adminForm.listval = res.data.permissions;
        //     }).catch(err => {
        //         console.log(err.response);
        //     });
        // }
        //挂载气泡中的下拉框中的列表
        onMounted(() => {
            // fnGetPowerList()
            addGetPower()
            addGetGroup()
        })
        // const fnGetPowerList = () => {
        //     axios.get('/permission/simple/').then(res => {

        //         var aList = res.data;
        //         var aList2 = [];
        //         for (var i = 0; i < aList.length; i++) {
        //             aList2.push({ key: aList[i].id, label: aList[i].name })
        //         }
        //         state.adminForm.list = aList2
        //     }).catch(err => {
        //         console.log(err.response);
        //     })
        // }
        //开启弹窗，此方法将在父组件，通过ref直接调用
        const open = (id) => {
            state.visible = true
            if (id) {
                //修改方法
                state.id = id

                putAdminGroup(id)
            }

        }
        //监听，暂不做，有问题，已有其他方式替代
        // watch(() => state.visible, (newValue, oldValue) => {
        //     // console.log(formRef);
        //     // console.log(newValue)
        //     // console.log(formRef);
        //     formRef.value.resetFields();
        // }, { deep: true })
        //关闭弹窗
        const close = () => {
            state.visible = false
            formRef.value.resetFields();
        }
        //取消时重置表格
        const cancel = () => {
            state.visible = false
            state.adminForm.name = '';
            state.adminForm.listval = [];
            state.adminForm.listval2 = [];
            formRef.value.resetFields();
        }

        // 挂载添加表单权限数据
        const addGetPower = () => {
            axios.get('/permission/simple/').then(res => {
                var aList = res.data;
                var aList2 = [];
                for (var i = 0; i < aList.length; i++) {
                    aList2.push({ key: aList[i].id, label: aList[i].name })
                }
                console.log(aList2);
                state.adminForm.list2 = aList2
            }).catch(err => {
                console.log(err)
            })
        }
        // 挂载添加表单组数据
        const addGetGroup = () => {
            axios.get('/permission/groups/simple/').then(res => {
                var aList = res.data;
                var aList2 = [];
                for (var i = 0; i < aList.length; i++) {
                    aList2.push({ key: aList[i].id, label: aList[i].name })
                }
                state.adminForm.list = aList2;
            }).catch(err => {
                console.log(err)
            })
        }

        // 挂载修改表单权限数据
        const putAdminGroup = (id) => {
            axios.get('/permission/admins/' + id + '/').then(res => {
                state.edit_id = id;
                state.adminForm.username = res.data.username;
                state.adminForm.password = res.data.password;
                state.adminForm.mobile = res.data.mobile;
                state.adminForm.email = res.data.email;
                state.adminForm.listval = res.data.groups;
                state.adminForm.listval2 = res.data.user_permissions;
            }).catch(err => {
                console.log(err.response)
            })
        }


        return {
            formRef,
            ...toRefs(state),
            cancel,
            submitForm,
            open,

        }
    }
} 
</script>