import Vue from 'vue'

Vue.prototype.dataInterchange = function(arr, index1, index2){
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
}
Vue.prototype.IsEmptyObj = function(data){
    if(Object.prototype.toString.call(data).includes("Object")){
        return Object.keys(data).length==0 || false;
    }else{
        throw new Error("data is not Object !")
    }
}
Vue.prototype.deepCopy = function (origin, copyObj){
	copyObj = copyObj || {}; 
	for(let key in origin){
		if(origin.hasOwnProperty(key)){
			let keyIsObj = Object.prototype.toString.call(origin[key])=='[object Object]'
			if(keyIsObj){
				copyObj[key] = (origin[key].constructor===Array)?[]:{};
				deepCopy(origin[key], copyObj[key])
			}else{
				copyObj[key] = origin[key]
			}
		}
	}
	return copyObj
}