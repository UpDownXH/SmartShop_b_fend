<template>
    <el-dialog :title="type == 'add' ? '添加商品图片' : '修改商品图片'" v-model="visible" width="800px">
        <el-form :model="PicturesForm" ref="formRef" :rules="rulesBrandsForm" label-width="100px" class="good-form">
            <el-form-item label="SKU 商品 id" prop="content_type">
                <el-select v-model="PicturesForm.sku" size="small">
                    <el-option v-for="item in sku_list" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="type != 'add' ? true : false" label="商品图片" prop="image">
                <!-- <template #default="scope"> -->
                <img :src="PicturesForm.image" width="100" height="100">
                <!-- </template> -->
            </el-form-item>
            <el-form-item label="上传图片" prop="logo">
                <el-upload action="" :auto-upload="false">
                    <el-button size="small" type="primary">点击选择图片</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </el-form-item>

        </el-form>
    </el-dialog>
</template>

<script>
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue'
import axios from '@/utils/axios'
import { localGet } from '@/utils'
export default {
    name: 'DialogAddPictures',
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
            sku_list: [],
            PicturesForm: {
                sku: '',
                image: '',
            },
            rulesBrandsForm: {
            }
        })
        //提交表单
        const submitForm = () => {
            if (props.type == 'add') {
                let fileValue = document.querySelector('.el-upload .el-upload__input');
                let fd = new FormData();
                fd.append('sku', state.PicturesForm.sku);
                fd.append('image', fileValue.files[0], fileValue.files[0].name);
                axios.post('/skus/images/', fd, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    if (res.status == 201) {
                        ElMessage({
                            message: '商品图片添加成功!',
                            type: 'success'
                        })
                        state.visible = false;
                        if (props.reload) props.reload()
                    }
                }).catch(err => {
                    console.log(err.response);
                })
            } else {
                let fileValue = document.querySelector('.el-upload .el-upload__input');
                let fd = new FormData();
                fd.append('sku', state.PicturesForm.sku);
                fd.append('image', fileValue.files[0], fileValue.files[0].name);
                axios.put('/skus/images/' + state.edit_id + '/', fd).then(res => {
                    if (res.status == 201) {
                        ElMessage({
                            message: '商品图片修改成功!',
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

        //获取详情
        const getDetail = (id) => {
            state.edit_id = id
            axios.get('/skus/images/' + id + '/').then(res => {
                state.PicturesForm.sku = res.data.sku;
                state.PicturesForm.image = res.data.image;

                // console.log(state.PicturesForm.image);
            }).catch(err => {
                console.log(err.response);
            });
        }
        //mounted
        onMounted(() => {
            fnGetSkuList()
        })
        const fnGetSkuList = () => {
            axios.get('/skus/simple/').then(res => {
                state.sku_list = res.data
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
                state.PicturesForm = {
                    sku: '',
                    image: '',
                }
            }
        }
        //关闭弹窗
        const close = () => {
            state.visible = false
        }

        return {
            ...toRefs(state),
            open,
            submitForm
        }
    }
}
</script>

<style scoped>
/* .avatar-uploader {
    width: 100px;
    height: 100px;
    color: #ddd;
    font-size: 30px;
}

.avatar-uploader-icon {
    display: block;
    width: 100%;
    height: 100%;
    border: 1px solid #e9e9e9;
    padding: 32px 17px;
} */

/* .el-button+.el-button {
    margin-left: 0px;
    margin-top: 10px;
} */
</style>