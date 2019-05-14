import Vue from 'vue'

Vue.directive('dragMove', {
    inserted: function (el, bindings, vnode) {
        el.onmousedown = function (e) {
            e.stopPropagation()
            let boxWidth  = el.offsetWidth;
            let boxHeight = el.offsetHeight;

            let disX = e.pageX - el.offsetLeft;
            let disY = e.pageY - el.offsetTop;
            document.onmousemove = function (e) {
                e.preventDefault();
                if(e.pageY-disY>=0 && e.pageY-disY<=bindings.value.outBoxSize.h-boxHeight){
                    el.style.top  = e.pageY - disY + 'px';
                }
                if(e.pageX-disX>=0 && e.pageX-disX<=bindings.value.outBoxSize.w-boxWidth){
                    el.style.left = e.pageX - disX + 'px';
                }
                bindings.value.setPosition({
                    left  : parseFloat(el.style.left), 
                    top   : parseFloat(el.style.top),
                    index : bindings.value.outBoxSize.index,
                    cId   : bindings.value.outBoxSize.cId,
                })
                // el.style.top  = e.pageY - disY + 'px';
                // el.style.left = e.pageX - disX + 'px';
                // 通过传参的形式，将methods中的函数传进来，以此来改变data中的值
                // bindings.value.setPosition(el.style.left, e.pageY-disY)
            }
            document.onmouseup = function () {
                document.onmousemove = document.onmouseup = null;
            }
        }
    }
})
Vue.directive('dragEagle', {
    inserted: function (el, bindings, vnode) {
        el.onmousedown = function (e) {
            e.stopPropagation()
            let PNode = el.parentNode;
            //得到点击时该容器的宽高：
            let targetDivWidth  = PNode.offsetWidth;
            let targetDivHeight = PNode.offsetHeight;
            let targetDivLeft   = PNode.offsetLeft;
            let targetDivTop    = PNode.offsetTop;
            
            let startX = e.clientX;
            let startY = e.clientY;

            document.onmousemove = function(e) {
                e.preventDefault();
                //得到鼠标拖动的宽高距离：取绝对值
                let distX = Math.abs(e.clientX - startX);
                let distY = Math.abs(e.clientY - startY);
                
                if (e.clientX >= startX && e.clientY >= startY && 
                    targetDivWidth+distX+targetDivLeft <= bindings.value.outBoxSize.w &&
                    targetDivHeight+distY+targetDivTop <= bindings.value.outBoxSize.h
                ) {       //往右下方拖动(处理不超出)：
                    PNode.style.width = targetDivWidth + distX + "px";
                    PNode.style.height = targetDivHeight + distY + "px";
                }else if (e.clientX < startX && e.clientY < startY) {   //往左上方拖动：
                    PNode.style.width = targetDivWidth - distX + "px";
                    PNode.style.height = targetDivHeight - distY + "px";
                }
        
                //设置最大最小范围：不能无限制缩放，影响体验
                if (parseInt(PNode.style.width) >= 500) {
                    PNode.style.width = 500 + "px";
                }
                if (parseInt(PNode.style.width) <= 50) {
                    PNode.style.width = 50 + "px";
                }
        
                if (parseInt(PNode.style.height) >= 500) {
                    PNode.style.height = 500 + "px";
                }
                if (parseInt(PNode.style.height) <= 50) {
                    PNode.style.height = 50 + "px";
                }
                // console.log(that.$refs.dragBox.getBoundingClientRect(), "数据")   
                bindings.value.setPosition({
                    left  : parseFloat(PNode.style.left), 
                    top   : parseFloat(PNode.style.top),
                    index : bindings.value.outBoxSize.index,
                    cId   : bindings.value.outBoxSize.cId,
                })
            };
        
            document.onmouseup = function() {
                document.onmousemove = null;
            };
        }
    }
})
//自定义focus
Vue.directive('focus', {
    inserted: function (el) {
        el.focus();
    }
})
//自定义scrollerUpdate
Vue.directive('scrollUpdate', {
    inserted: function (el, binding, vnode, oldVnode) {
        let touchStarY = 0, touchEndY = 0, touchDistance = 0,
            pageDownTimer = null, newLiEle = null, updateState = 0;
        el.addEventListener('touchstart', async (e) => {
            touchStarY = e.touches[0].clientY;
            clearInterval(pageDownTimer);
        })
        el.addEventListener('touchmove', async (e) => {
            touchEndY = e.touches[0].clientY;
            touchDistance = touchEndY - touchStarY;
            //console.log("touch滑动了", touchDistance);

            let UpdateEle = document.getElementById("downUpdateEle");
            if (touchDistance < 0) {		//上拉
                if (UpdateEle) el.removeChild(newLiEle)
            } else {
                if (el.scrollTop == 0) {
                    e.preventDefault();
                    if (!UpdateEle) {
                        //添加 li
                        newLiEle = document.createElement("li");
                        // 设置 li 属性： id、style；
                        newLiEle.setAttribute("id", "downUpdateEle");
                        newLiEle.setAttribute('style', 'list-style: none; background: #fefefe; color: #999999; font-size: 16px; opacity: 1;');
                        newLiEle.innerHTML = "下拉刷新";
                        el.insertBefore(newLiEle, el.firstChild);
                    }
                    newLiEle.style.lineHeight = touchDistance + 'px';
                    if (touchDistance > 40) {
                        newLiEle.innerHTML = "松开刷新";
                        newLiEle.style.lineHeight = '40px';
                        updateState = 1;
                    }
                }

            }
        })
        el.addEventListener('touchend', async () => {
            if (updateState == 1) {			//刷新数据；
                let expression_name = binding.expression;
                let expression_fun = vnode.context[expression_name];
                expression_fun && await expression_fun();

                updateState = 0;
                resetNewTopEle();
            } else {						//不触发刷新数据
                resetNewTopEle()
            }
            function resetNewTopEle() {
                pageDownTimer = setInterval(() => {
                    if (document.getElementById("downUpdateEle")) {
                        //样式获取
                        let newLiLineheight = parseInt(newLiEle.style.lineHeight);
                        let newLiFontSize = parseInt(newLiEle.style.fontSize);
                        let newLiOpacity = newLiEle.style.opacity;
                        if (newLiLineheight < 1) {
                            el.removeChild(newLiEle)
                            clearInterval(pageDownTimer)
                        } else {
                            newLiEle.style.lineHeight = newLiLineheight / 2 + 'px';
                            newLiEle.style.fontSize = newLiFontSize / 2 + 'px';
                            newLiEle.style.opacity = newLiOpacity / 2;
                        }
                    }
                }, 70)
            }
        })
    }
})
//自定义scrollMore
Vue.directive('scrollMore', {
    inserted: function (el, binding, vnode, oldVnode) {
        //console.log(el, binding, vnode)
        let scrollHeight = el.offsetHeight,
            expression_name = binding.expression,
            expression_fun = vnode.context[expression_name];
        let scrollTop_old = 0, scrollTop_new = 0;
        el.addEventListener('scroll', async () => {
            scrollTop_old = scrollTop_new;
            scrollTop_new = el.scrollTop;
            //向下滑动的时候阻止触发加载；
            if (scrollTop_old > scrollTop_new) return false;

            if (scrollHeight + el.scrollTop + 10 >= el.firstChild.clientHeight) {
                try {
                    console.log("加载了.....")
                    expression_fun && await expression_fun();
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }
})
//自定义title
Vue.directive('title', {
    inserted: function (el, binding) {
        console.log("binding:", binding); //binding.name是指令的名称不包含v-
        el.innerHTML = binding.value;
    }
});