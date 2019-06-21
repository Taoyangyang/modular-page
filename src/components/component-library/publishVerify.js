import Vue from 'vue';
import { Message } from 'element-ui';

export default function verifyFun(cDatas, pageSetData){
    cDatas = cDatas && JSON.parse(cDatas)
    return new Promise((resolve, reject)=>{
        for(let i=0; i<cDatas.length; i++){
            if(cDatas[i].componentName=="imageComponent"){              // 图片组件
                if(!cDatas[i].data.imageUrl){
                    reject({state: false, msg: `第${i+1}个图片组件中未传入图片`})
                    return false;
                }
            }else if(cDatas[i].componentName=="carouselComponent"){     // 轮播组件
                let carouselImages = cDatas[i].data.carouselImages;
                let showTitle      = cDatas[i].data.showTitle;
                if(carouselImages){
                    for(let j=0; j<carouselImages.length; j++){
                        if(!carouselImages[j].imgUrl){
                            reject({state: false, msg: `第${i+1}个轮播组件中第${j+1}张轮播未传入图片`})
                            return false;
                        }
                        if(showTitle && carouselImages[j].itemTitle==''){
                            reject({state: false, msg: `第${i+1}个轮播组件中第${j+1}张轮播未输入标题`})
                            return false;
                        }
                    }
                }else{
                    reject({state: false, msg: `第${i+1}个轮播组件中无数据`})
                    return false;
                }
            }else if(cDatas[i].componentName=="videoComponent"){        //视频组件
                if(!cDatas[i].data.videoUrl){
                    reject({state: false, msg: `第${i+1}个视频组件中未传入视频`})
                    return false;
                }
            }else if(cDatas[i].componentName=="formComponent"){        //表单组件
                if(!cDatas[i].data.formName){
                    reject({state: false, msg: `第${i+1}个表单组件中未输入表单名称`})
                    return false;
                }else if(!cDatas[i].data.checkFormItem.length){
                    reject({state: false, msg: `第${i+1}个表单组件中未选择表单元素`})
                    return false;
                }else if(!cDatas[i].data.btnBg){
                    reject({state: false, msg: `第${i+1}个表单组件中未上传按钮图片`})
                    return false;
                }else if(!cDatas[i].data.bgImg){
                    reject({state: false, msg: `第${i+1}个表单组件中未上传背景图片`})
                    return false;
                }
            }else if(cDatas[i].componentName=="dialogComponent"){       //弹窗表单组件
                if(!cDatas[i].data.formName){
                    reject({state: false, msg: `第${i+1}个表单组件中未输入表单名称`})
                    return false;
                }else if(!cDatas[i].data.checkFormItem.length){
                    reject({state: false, msg: `第${i+1}个表单组件中未选择表单元素`})
                    return false;
                }else if(!cDatas[i].data.btnBg){
                    reject({state: false, msg: `第${i+1}个表单组件中未上传按钮图片`})
                    return false;
                }else if(!cDatas[i].data.bgImg){
                    reject({state: false, msg: `第${i+1}个表单组件中未上传背景图片`})
                    return false;
                }else if(!cDatas[i].data.enterImg){
                    reject({state: false, msg: `第${i+1}个表单组件中未上传入口切图片`})
                    return false;
                }
            }
        }
        if(!pageSetData.shareTitle){
            reject({state: false, msg: `未设置页面分享标题`})
            return false;
        }else if(!pageSetData.desc){
            reject({state: false, msg: `未设置页面分享描述`})
            return false;
        }else if(!pageSetData.dynamicTags.length){
            reject({state: false, msg: `未添加页面关键词`})
            return false;
        }else if(!pageSetData.shareImg){
            reject({state: false, msg: `未设置页面分享图片`})
            return false;
        }
        resolve({state: true, msg: "验证成功"})
    })
} 