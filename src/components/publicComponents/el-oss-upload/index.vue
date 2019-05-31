<template>
	<div class="el-oss-upload">
		<slot name="view">
			<div class="el-oss-upload-view" v-if="imageUrl && !closeView">
				<img :src="imageUrl" alt="">
			</div>
		</slot>
		<el-upload :action="ossServerUrl"
		:data="uploadParams"
		:before-upload="elBeforeUpload"
		:headers="headers"
		:multiple="multiple"
		:name="name"
		:withCredentials="withCredentials"
		:showFileList="showFileList"
		:drag="drag" :accept="accept"
		:onPreview="onPreview"
		:onRemove="onRemove"
		:onError="onError"
		:onProgress="elOnProgress"
		 :onChange="onChange"
		 :listType="listType"
		 :autoUpload="autoUpload"
		 :fileList="fileList"
		 :httpRequest="httpRequest"
		 :disabled="disabled || isIE9">
			<slot>
				<el-button class="el-oss-upload-btn" size="small" type="primary">
					<span>点击上传</span>
				</el-button>
			</slot>
		</el-upload>
		<slot name="tip"></slot>
	</div>
</template>

<script>
	import props from './props';
	import getData from './getData';
	import methods from './methods';

	const isDev = process.env.NODE_EEN === 'development' ||
					(location.hostname !== 'scm.goujiawang.com' &&
					location.hostname !== 'hscm.goujiawang.com' &&
                    location.hostname !== 'yscm.goujiawang.com' &&
                    location.hostname !== 'fscm.goujiawang.com');

	export default {
		name: 'elOssUpload',
		data: getData,
		props,
		methods,
		mounted() {
			this.serverCallbackUrl = this.serverCallbackRequestUrl || '/ossUpload/pictureCallBack';
			if (isDev) {
				this.serverCallbackUrl = '/gjw-ges' + this.serverCallbackUrl;
			}

			this.$el.addEventListener('mousedown', e => {
				if(this.flag){
					console.log('mousedown eventListener');
					let _this = this;
					this.$confirm('确定清空当前弹窗中的图片，重新导入？', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
			        	_this.$emit('sendMessage',false);
			        }).catch(() => { 
			        	_this.$emit('sendMessage',true);       
			        });
				}
				
				if (this.isIE9) {
					this.$message({
			            message: '抱歉，ie9不支持文件上传功能，请升级至ie9以上版本或使用其他浏览器',
			            type: 'info',
			            duration: 2000
			        });
				}
			});
		},
		computed: {
			assetsOrigin() {
				if (isDev) {
					return 'https://htmlstoretest.goujiawang.com';
				} else {
					return 'https://htmlstore.goujiawang.com';
				}
			},
			flag(){
				return this.checkBeforeUploadFlag
			}
		}
	}
</script>

<style lang="less">
	.el-oss-upload-view {
		img {
			max-width: 200px;
		}
	}
	.el-oss-upload-btn {
		margin-top: 10px;
		display: block;
	}
</style>
