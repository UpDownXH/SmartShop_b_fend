<!--/src/views/Login.vue-->
<template>
    <div class="login-body">
        <!--登录框div-->
        <div class="login-container">
            <!--登录框头部logo部分-->
            <div class="head">
                <img src="@/assets/logo.png" class="logo">
                <div class="name">
                    <div class="title">智购商城</div>
                    <div class="tips">Vue3.0 后台管理系统</div>
                </div>
            </div>
            <!-- 表单部分 -->
            <el-form label-position="top" :rules="rules" :model="ruleForm" ref="loginForm" class="login-form">
                <el-form-item label="账号" prop="username">
                    <el-input type="text" v-model.trim="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model.trim="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="service-term">登录表示您已同意<a>《服务条款》</a></div>
                    <el-button class="button-login" type="info" @click="submitForm">登录</el-button>
                    <el-checkbox v-model="checked" @change="!checked">下次自动登录</el-checkbox>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { reactive, ref, toRefs } from '@vue/reactivity'
import axios from '@/utils/axios'
import { localSet, localGet } from '@/utils'
export default {
    name: 'Login',
    setup() {
        const loginForm = ref(null)
        const state = reactive({
            ruleForm: {
                username: '',
                password: ''
            },
            checked: true,
            rules: {
                username: [
                    { required: 'true', message: '账户不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: 'true', message: '密码不能为空', trigger: 'blur' }
                ]
            }
        })


        const submitForm = async () => {
            loginForm.value.validate((valid) => {
                if (valid) {
                    axios.post('/authorizations/', {
                        username: state.ruleForm.username || '',
                        password: state.ruleForm.password
                    }).then(res => {
                        ElMessage({
                            message: '恭喜，成功登录',
                            type: 'success'
                        })
                        localSet('user_id', res.data.id)
                        localSet('username', res.data.username)
                        localSet('token', res.data.token)
                        window.location.href = '/'
                        console.log(res);
                    }).catch(error => {
                        ElMessage({
                            message: '用户名或密码错误',
                            type: 'error'
                        })
                    });
                } else {
                    ElMessage({
                        message: '请输入账号和密码',
                        type: 'error'
                    })
                    console.log('error submit!!');
                    return false;
                }
            })
        }
        const resetForm = () => {
            loginForm.value.resetFields();
        }


        return {
            ...toRefs(state),
            loginForm,
            submitForm,
            resetForm
        }
    }
}
</script>

<style scoped>
/* 取消光标选中 */
* {
    user-select: none;
}

.login-body {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #61b498;
}

.login-container {
    width: 420px;
    height: 400px;
    background-color: #fff;
    border-radius: 40px;
    box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
}

.head {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0 20px 0;
}

.head img {
    width: 60px;
    height: 60px;
    margin-top: 10px;
    margin-right: 20px;
}

.head .title {
    font-size: 28px;
    color: #2c313c;
    font-weight: bold;
}

.head .tips {
    font-size: 12px;
    color: #2c313c;
}

.login-form {
    width: 70%;
    margin: 0 auto;
}

.button-login {
    width: 100%;
    height: 40px;
    border-radius: 15px;
}

.service-term {
    width: 100%
}

/* 
.login-form>>>.el-form--label-top .el-form-item__label {
    padding: 0;
}

.login-form>>>.el-form-item {
    margin-bottom: 0;
} */
</style>