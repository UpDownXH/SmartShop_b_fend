<template>
    <el-dialog :title="type == 'add' ? '添加商品' : '修改商品'" v-model="visible" width="800px">
        <el-form :model="authorForm" ref="formRef" label-width="100px" class="good-form">
            <el-form-item label="权限名称：" prop="name">
                <el-input type="text" v-model="authorForm.name" autocomplete="off" size="small" class="input_width">
                </el-input>
            </el-form-item>
            <el-form-item label="权限识别名：" prop="codename">
                <el-input type="text" v-model="authorForm.codename" autocomplete="off" size="small" class="input_width">
                </el-input>
            </el-form-item>
            <el-form-item label="权限类型：" prop="content_type">
                <el-select v-model="authorForm.content_type" size="small">
                    <el-option v-for="item in content_type_list" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
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
            edit_id: '',
            content_type_list: [],
            authorForm: {
                name: '',
                codename: '',
                content_type: 1,

            }
        })
        //提交表单
        const submitForm = () => {
            console.log(111);
            if (props.type == 'add') {
                axios.post('/permission/perms/', {
                    "name": state.authorForm.name,
                    "codename": state.authorForm.codename,
                    "content_type": state.authorForm.content_type
                }).then(res => {
                    if (res.status == 201) {
                        ElMessage({
                            message: '添加权限成功!',
                            type: 'success'
                        })
                        state.visible = false;
                        if (props.reload) props.reload()
                    }
                }).catch(err => {
                    console.log(err.response);
                })
            } else {
                axios.put('/permission/perms/' + state.edit_id + '/', {
                    "name": state.authorForm.name,
                    "codename": state.authorForm.codename,
                    "content_type": state.authorForm.content_type
                }).then(res => {
                    if (res.status == 200) {
                        ElMessage({
                            message: '修改权限成功!',
                            type: 'success'
                        })
                        state.visible = false;
                        if (props.reload) props.reload()
                    }
                }).catch(err => {
                    console.log(err.response);
                })
            }
        }
        //获取权限详情
        const getDetail = (id) => {
            console.log(id);
            state.edit_id = id
            axios.get('/permission/perms/' + id + '/').then(res => {
                state.authorForm.name = res.data.name;
                state.authorForm.codename = res.data.codename;
                state.authorForm.content_type = res.data.content_type;
            }).catch(err => {
                console.log(err.response);
            });
        }
        //挂载气泡中的下拉框中的列表
        onMounted(() => {
            fnGetSkuList()
        })
        const fnGetSkuList = () => {
            axios.get('/permission/content_types/').then(res => {
                state.content_type_list = res.data
            }).catch(err => {
                console.log(err.response);
            })
        }
        //开启弹窗，此方法将在父组件，通过ref直接调用
        const open = (id) => {
            state.visible = true
            //如果带着id，则是编辑，否则为新增
            // console.log("id",id);
            // console.log("gid",gid);
            if (id) {
                state.id = id
                getDetail(id)
            } else {
                state.authorForm = {
                    name: '',
                    codename: '',
                    content_type: 1
                }
            }
        }
        //关闭弹窗
        const close = () => {
            state.visible = false
        }
        //取消时重置表格
        const cancel = () => {
            state.visible = false
            formRef.value.resetFields();
        }
        return {
            formRef,
            ...toRefs(state),
            cancel,
            submitForm,
            open
        }
    }
} 
</script>