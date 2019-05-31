export default () => {
	return {
		ossServerUrl: '',
		dir: '',
		expire: 0,
		imageUrl: '',
		imgStyle: '',

		// formData: null,

		// 上传oss服务器请求的params字段
		uploadParams: {
        	key: '',
        	policy: '',
        	OSSAccessKeyId: '',
        	success_action_status: '200', //让服务端返回200,不然，默认会返回204
        	callback: ''
		},

		filePaths: [],
		isIE9: navigator.userAgent.toLowerCase().match(/msie(\s+)?9\.0/),
		//flag: false,
	};
};
