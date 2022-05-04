<template>
    <el-dialog :title="type == 'add' ? '添加商品' : '修改商品'" v-model="visible" width="800px">
        <el-form :model="skuForm" ref="formRef" :inline="true" label-width="100px" class="good-form">
            <el-form-item label="名称" prop="name">
                <el-input type="text" v-model="skuForm.name" autocomplete="off" size="small"></el-input>
            </el-form-item>
            <el-form-item label="副标题" prop="caption">
                <el-input type="text" v-model="skuForm.caption" autocomplete="off" size="small"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
                <el-input type="text" v-model="skuForm.price" autocomplete="off" size="small"></el-input>
            </el-form-item>
            <el-form-item label="进价" prop="cost_price">
                <el-input type="text" v-model="skuForm.cost_price" autocomplete="off" size="small"></el-input>
            </el-form-item>
            <el-form-item label="市场价" prop="market_price">
                <el-input type="text" v-model="skuForm.market_price" autocomplete="off" size="small"></el-input>
            </el-form-item>
            <el-form-item label="库存" prop="stock">
                <el-input type="text" v-model="skuForm.stock" autocomplete="off" size="small"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="category_id">
                <el-select v-model="skuForm.category_id" size="small">
                    <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上下架" prop="is_launched">
                <el-radio v-model="skuForm.is_launched" :label="true">是</el-radio>
                <el-radio v-model="skuForm.is_launched" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="SPU" prop="spu_id">
                <el-select v-model="skuForm.spu_id" size="small" @change="skuForm.specs = {}">
                    <el-option v-for="item in goods_list" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- SPU额外添加的 -->
            <el-form-item v-for="item in specs_list" :label="item.name" :key="item.id">
                <el-select v-model="skuForm.specs[item.id]" size="small">
                    <el-option v-for="opt in item.options" :key="opt.id" :label="opt.value" :value="opt.id">
                    </el-option>
                </el-select>
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
    name: 'DialogAddGoods',
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
            skuForm: {
                "name": '',
                "spu_id": '',
                "caption": '',
                "category_id": '',
                "price": '',
                "cost_price": '',
                "market_price": '',
                "stock": '',
                "is_launched": '',
                "specs": {}
            },
            category_list: [],
            goods_list: [],
            specs_list: [],
        })
        //预挂载数据
        onMounted(() => {
            fnGetCategory();
            fnGetGoods();
        })
        //获取分类
        const fnGetCategory = () => {
            axios.get('/skus/categories/').then(res => {
                state.category_list = res.data
            }).catch(err => {
                console.log(err.response);
            })
        }
        //获取spu表名称数据
        const fnGetGoods = () => {
            axios.get('/goods/simple/').then(res => {
                state.goods_list = res.data
            }).catch(err => {
                console.log(err.response);
            })
        }
        //获取spu商品规格信息
        const fnGetSpecs = () => {
            axios.get('/goods/' + state.skuForm.spu_id + '/specs/').then(res => {
                state.specs_list = res.data;
            }).catch(err => {
                console.log(err.response);
            })
        }
        //表单提交
        const submitForm = () => {
            if (props.type == 'add') {
                var specs_sub_list = [];
                for (var k in state.skuForm.specs) {
                    specs_sub_list.push({ 'spec_id': k, 'option_id': this.skuForm.specs[k] })
                }
                axios.post('/skus/', {
                    "name": state.skuForm.name,
                    "spu_id": state.skuForm.spu_id,
                    "caption": state.skuForm.caption,
                    "category_id": state.skuForm.category_id,
                    "price": state.skuForm.price,
                    "cost_price": state.skuForm.cost_price,
                    "market_price": state.skuForm.market_price,
                    "stock": state.skuForm.stock,
                    "is_launched": state.skuForm.is_launched,
                    "specs": specs_sub_list
                }).then(res => {
                    state.visible = false;
                    if (res.status == 201) {
                        ElMessage({
                            message: '商品添加成功!',
                            type: 'success'
                        })
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
                var specs_sub_list = [];
                for (var k in state.skuForm.specs) {
                    specs_sub_list.push({ 'spec_id': k, 'option_id': this.skuForm.specs[k] })
                }
                axios.put('/skus/' + state.edit_id+'/', {
                    "name": state.skuForm.name,
                    "spu_id": state.skuForm.spu_id,
                    "caption": state.skuForm.caption,
                    "category_id": state.skuForm.category_id,
                    "price": state.skuForm.price,
                    "cost_price": state.skuForm.cost_price,
                    "market_price": state.skuForm.market_price,
                    "stock": state.skuForm.stock,
                    "is_launched": state.skuForm.is_launched,
                    "specs": specs_sub_list
                }).then(res => {
                    state.visible = false;
                    ElMessage({
                        message: '商品修改成功!',
                        type: 'success'
                    })
                    if (props.reload) props.reload()
                }).catch(err => {
                    if (err.response.status == 400) {
                        ElMessage({
                            message: err.response.data.name[0],
                            type: 'info'
                        })
                    }
                })
            }

        }

        // //计算属性
        // const look_good_id = computed(() => {
        //     return state.skuForm.spu_id
        // })
        // //监听器
        // watch(look_good_id, (newValue, oldValue) => {
        //     fnGetSpecs()
        // })
        const getDetail = (id, gid) => {
            axios.get('/goods/' + gid + '/specs/').then(res => {
                state.specs_list = res.data;
                axios.get('/skus/' + id + '/').then(res => {
                    state.edit_id = res.data.id;
                    state.skuForm.name = res.data.name;
                    state.skuForm.spu_id = res.data.spu_id;
                    state.skuForm.caption = res.data.caption;
                    state.skuForm.category_id = res.data.category_id;
                    state.skuForm.price = res.data.price;
                    state.skuForm.cost_price = res.data.cost_price;
                    state.skuForm.market_price = res.data.market_price;
                    state.skuForm.stock = res.data.stock;
                    state.skuForm.is_launched = res.data.is_launched;

                    var specs_data_list = {};
                    for (var i = 0; i < res.data.specs.length; i++) {
                        specs_data_list[res.data.specs[i].spec_id] = res.data.specs[i].option_id;
                    }
                    state.skuForm.specs = specs_data_list;
                }).catch(err => {
                    console.log(err.response);
                })
            }).catch(err => {
                console.log(err.response);
            })
        }
        //开启弹窗，此方法将在父组件，通过ref直接调用
        const open = (id, gid) => {
            state.visible = true
            //如果带着id，则是编辑，否则为新增
            // console.log("id",id);
            // console.log("gid",gid);
            if (gid) {
                state.id = id
                getDetail(id, gid)
            } else {
                state.skuForm = {
                    "name": '',
                    "spu_id": '',
                    "caption": '',
                    "category_id": '',
                    "price": '',
                    "cost_price": '',
                    "market_price": '',
                    "stock": '',
                    "is_launched": '',
                    "specs": {}
                }
            }
        }
        //关闭弹窗
        const close = () => {
            state.visible = false
        }

        return {
            ...toRefs(state),
            submitForm,
            open,
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