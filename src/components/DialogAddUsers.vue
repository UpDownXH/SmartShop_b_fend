<template>
    <el-dialog :title="type == 'add' ? '添加商品' : '修改商品'" v-model="visible" width="800px">
        <el-form :model="userForm" :rules="rules" ref="formRef" label-width="100px" class="good-form">
            <el-form-item label="用户名:" prop="username">
                <el-input type="text" v-model="userForm.username" autocomplete="off" size="small" class="input_width">
                </el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
                <el-input type="password" v-model="userForm.password" autocomplete="off" size="small"
                    class="input_width"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="passcheck">
                <el-input type="password" v-model="userForm.passcheck" autocomplete="off" size="small"
                    class="input_width"></el-input>
            </el-form-item>
            <el-form-item label="手机号:" prop="mobile">
                <el-input type="text" v-model="userForm.mobile" autocomplete="off" size="small" class="input_width">
                </el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="email">
                <el-input type="text" v-model="userForm.email" autocomplete="off" size="small" class="input_width">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('userForm')">提交</el-button>
                <el-button @click="cancel()">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue'
import axios from '@/utils/axios'
export default {
    name: 'DialogAddUsers',
    props: {
        type: String,//add 为新增，edit为编辑
        reload: Function //table刷新的方法
    },
    setup(props) {
        //formRef用于表单校验控制
        const formRef = ref(null)
        const state = reactive({
            visible: false,//控制弹窗的显示隐藏
            edit_id: '',
            userForm: {
                username: '',
                password: '',
                passcheck: '',
                mobile: '',
                email: ''
            },
            rules: {
                username: [
                    { required: 'true', message: '账户不能为空', trigger: 'blur' },
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
                passcheck: [
                    {
                        validator: (rule, value, callback) => {
                            console.log(value);
                            if (value === '') {
                                callback(new Error('请再次输入密码'));
                            } else if (value !== state.userForm.password) {
                                callback(new Error('两次输入密码不一致!'));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'
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
            formRef.value.validate((valid) => {
                if (valid) {
                    axios.post('/users/', {
                        "username": state.userForm.username,
                        "mobile": state.userForm.mobile,
                        "password": state.userForm.password,
                        "email": state.userForm.email
                    }).then(res => {
                        if (res.status == 201) {
                            ElMessage({
                                message: '添加用户成功!',
                                type: 'success'
                            })
                            state.visible = false;
                        }
                        if (props.reload) props.reload()
                    }).catch(err => {
                        if (err.response.status == 400) {
                            ElMessage({
                                message: err.response.data.name[0],
                                type: 'info'
                            })
                        }
                    })
                } else {
                    console.log('error submit!!')
                    return false;
                }
            })
        }
        //开启弹窗，此方法将在父组件，通过ref直接调用
        const open = () => {
            state.visible = true
            state.userForm = {
                username: '',
                password: '',
                passcheck: '',
                mobile: '',
                email: ''
            }

        }
        //关闭弹窗
        const close = () => {
            state.visible = false
        }
        //取消时重置表格
        const cancel = () =>{
            state.visible = false
            formRef.value.resetFields();
        }
        return {
            formRef,
            ...toRefs(state),
            submitForm,
            open,
            cancel
        }
    }


}
</script>