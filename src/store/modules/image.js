const state = {
    hotSpotsPosition: [],
    boxInfoOutput   : [],
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