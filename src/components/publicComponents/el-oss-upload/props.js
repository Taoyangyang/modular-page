export default {
	// 关闭action入口
	// action: {
	// 	type: String,
	// 	default: ''
	// },
	headers: {
		type: Object,
		default: () => {
			return {};
		}
	},
	multiple: {
		type: Boolean,
		default: false
	},
	needFileName: {
		type: Boolean,
		default: false
	},
	data: {
		type: Object,
		default: () => {
			return {};
		}
	},
    refName: {
        type: String,
        default: ''
    },
	name: {
		type: String,
		default: 'file'
	},
	withCredentials: {
		type: Boolean,
		default: false
	},
	showFileList: {
		type: Boolean,
		default: true
	},
	drag: {
		type: Boolean,
		default: false
	},
	accept: {
		type: String,
		default: ''
	},
	onPreview: {
		type: Function
	},
	onRemove: {
		type: Function
	},
	onSuccess: {
		type: Function
	},
	onError: {
		type: Function
	},
	onProgress: {
		type: Function
	},
	onChange: {
		type: Function
	},
	beforeUpload: {
		type: Function
	},
	listType: {
		type: String,
		default: 'text'
	},
	autoUpload: {
		type: Boolean,
		default: true
	},
	fileList: {
		type: Array,
		default: () => {
			return [];
		}
	},
	httpRequest: {
		type: Function
	},
	disabled: {
		type: Boolean,
		default: false
	},

	closeView: {
		type: Boolean,
		default: false
	},
	customUploadParams: {
		type: Object,
		default: () => {
			return {}
		}
	},
	serverCallbackRequestUrl: {
		type: String,
		default: ''
	},
	checkBeforeUploadFlag: {
		type: Boolean,
		default: false
	}
};
