const state = {
    inputVal  : '',
    formDatas : {
        inputName   : "",
        inputPlshd  : "",
    },
}

const mutations = {
	updateData(state, payload) {
		Object.assign(state, payload);
	}
}

const actions = {

}

export default {
	state,
	mutations,
	actions
}