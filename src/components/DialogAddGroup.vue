<template>
    <el-dialog :title="type == 'add' ? '新增组' : '修改组'" v-model="visible" width="800px">
        <el-form :model="groupForm" ref="formRef" label-width="100px" class="good-form">
            <el-form-item label="名称：" prop="name">
                <el-input type="text" v-model="groupForm.name" autocomplete="off" size="small" class="input_width">
                </el-input>
            </el-form-item>
            <el-form-item label="权限：">
                <el-transfer v-model="groupForm.listval" :data="groupForm.list"></el-transfer>
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
            groupForm: {
                name: '',
                list: [],
                listval: []
            },
        })
        //提交表单
        const submitForm = () => {
            if (props.type == 'add') {
                axios.post('/permission/groups/', {
                    "name": state.groupForm.name,
                    "permissions": state.groupForm.listval,
                }).then(res => {
                    if (res.status == 201) {
                        ElMessage({
                            message: '添加组成功!',
                            type: 'success'
                        })
                        state.visible = false;
                        if (props.reload) props.reload()
                    }
                }).catch(err => {
                    console.log(err.response);
                })
            } else {
                axios.put('/permission/groups/' + state.edit_id + '/', {
                    "name": state.groupForm.name,
                    "permissions": state.groupForm.listval,
                }).then(res => {
                    if (res.status == 200) {
                        ElMessage({
                            message: '修改权限成功!',
                            type: 'success'
                        })
                        state.visible = false;
                        if (props.reload) props.reload()
                        formRef.value.resetFields();
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
            axios.get('/permission/groups/' + id + '/').then(res => {
                state.groupForm.name = res.data.name;
                state.groupForm.listval = res.data.permissions;
            }).catch(err => {
                console.log(err.response);
            });
        }
        //挂载气泡中的下拉框中的列表
        onMounted(() => {
            fnGetPowerList()
        })
        const fnGetPowerList = () => {
            axios.get('/permission/simple/').then(res => {

                var aList = res.data;
                var aList2 = [];
                for (var i = 0; i < aList.length; i++) {
                    aList2.push({ key: aList[i].id, label: aList[i].name })
                }
                state.groupForm.list = aList2
            }).catch(err => {
                console.log(err.response);
            })
        }
        //开启弹窗，此方法将在父组件，通过ref直接调用
        const open = (id) => {
            state.visible = true
            if (id) {
                state.id = id
                getDetail(id)
            }
        }
        //监听，暂不做，有问题
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
            state.groupForm.listval = []
            formRef.value.resetFields();
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