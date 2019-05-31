import axios from 'axios';

/**
 *  阿里云oss文档：https://help.aliyun.com/document_detail/31926.html
 */

let timeoutId = null;

export default {
    getSignature() {
        // 无法保证服务器时间与本地时间的一致性，下面优化代码注释

        // 签名未过期，无须再次请求签名
        // if (this.expire) {
        //     const now = Date.now() / 1000;
        //     if (expire >= now + 3) {
        //         return false;
        //     }
        // }

        const promise = this.axios.get('/gjw-ges/presale/oss/getSignature');
        promise.then(res => {
            this.ossServerUrl = res.data.host;
            this.dir = res.data.dir;
            this.expire = res.data.expire;

            this.uploadParams.policy = res.data.policy;
            this.uploadParams.OSSAccessKeyId = res.data.accessid;
            this.uploadParams.signature = res.data.signature;
            this.uploadParams.callback = res.data.callback || '';
        });

        promise.catch(() => {
            this.msg('文件上传失败'); // 获取签名失败
        });

        return promise;
    },

    elBeforeUpload(file) {
        if (this.beforeUpload) {
            const result = this.beforeUpload(file);
            if (result !== undefined) {
                return result;
            }
        }

        const suffix = this.getSuffix(file.name);
        const key = this.randomString(10) + suffix;

        return ((key, file) => {
            return new Promise((resolve, reject) => {
                const p = this.getSignature();
                p.then(() => {
                    this.uploadParams.key = this.dir + key;

                    this.filePaths.push({
                        fileName: file.name,
                        size: file.size,
                        key: this.uploadParams.key,
                        ifCallback: false
                    });
                    resolve();
                });
                p.catch(() => {
                    reject();
                });
            });
        })(key, file);
    },

    elOnProgress(event, file, fileList) {
        if (event.percent >= 100) {
            setTimeout(()=>{
                this.filePaths.forEach((item, i) => {
                    if (file.name === item.fileName && file.size === item.size && !item.ifCallback) {
                        item.ifCallback = true;
                        this.requestServerCallback(this.filePaths[i].key, file, fileList);
                    }
                });
            },500);    
        }
        this.onProgress && this.onProgress(event, file, fileList);
    },

    requestServerCallback(filePath, file, fileList) {
        const formData = new FormData();
        formData.append('filePath', filePath);
        console.log(filePath,file.name);
        Object.keys(this.customUploadParams).forEach(key => {
            formData.append(key, this.customUploadParams[key]);
        });
        if(this.needFileName){
            formData.append('fileName', file.name);
        }
        const promise = this.axios.post(this.serverCallbackUrl, formData);

        promise.then(res => {
            if (Number(res.data.ret) === 0) {
                let imgPath = res.data.result.path || res.data.result.filePath;
                if (!imgPath.match(/^http/)) {
                    imgPath = '/' + imgPath;
                    imgPath = imgPath.replace(/\/\//, '/');
                    this.imageUrl = this.assetsOrigin + imgPath;
                }

                if (this.onSuccess) {
                    this.onSuccess(Object.assign(res.data.result, {
                        fullPath: this.imageUrl
                    }), file, fileList);
                }
                if (this.multiple) {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        this.msg('文件上传成功');
                    }, 300);
                } else {
                    this.msg('文件上传成功');
                }
            } else {
                if(this.needFileName){
                    this.$emit('input',true);
                }

                this.msg(res.data.msg || '文件上传失败');
            }
        });
        promise.catch(() => {
            this.msg('文件上传成功');
        });
    },

    getSuffix(filename) {
        const pos = filename.lastIndexOf('.')
        let suffix = ''
        if (pos !== -1) {
            suffix = filename.substring(pos)
        }
        return suffix;
    },

    randomString(len) {
        len = len || 32;
        const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        const maxPos = chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },

    msg(msg) {
        this.$message({
            message: msg,
            type: 'info',
            customClass: 'global-center-layout',
            duration: 2000
        });
    }
};
