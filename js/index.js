//作用：需要将所有的DOM元素对象以及相关的资源全部都加载完毕之后，再来实现的事件函数
window.onload = function () {
	// 记录点击的搜略图的下标
	let bigImageIndex = 0;

	// 路径导航的数据渲染
	function bindNavPathData() {
		/**
		 * 思路：
		 * 1、先获取路径导航的页面元素（navPath）
		 * 2、再来获取所需要的数据（data.js->goodData.path）
		 * 3、由于数据是需要动态产生的，那么相应的DOM元素也应该是动态产生的，含义需要根据数据的数量来进行创建DOM元素
		 * 4、在遍历数据创建DOM元素的最后一条，只创建a标签，而不创建i标签
		 */

		//1.获取页面导航的元素对象
		const navPath = document.querySelector("#navPath");

		//2.获取数据
		const path = goodData.path;

		//3.遍历数据
		for (let i = 0; i < path.length; i++) {
			if (i == path.length - 1) {
				//只需要创建a且没有href属性
				const aNode = document.createElement("a");
				aNode.innerText = path[i].title;
				navPath.appendChild(aNode);
			} else {
				//4.创建a标签
				const aNode = document.createElement("a");
				aNode.href = path[i].url;
				aNode.innerText = path[i].title;

				//5.创建i标签
				const iNode = document.createElement("i");
				iNode.innerText = "/";

				//6.让navPath元素来追加a和i
				navPath.appendChild(aNode);
				navPath.appendChild(iNode);
			}
		}
	}
	bindNavPathData();

	// 放大镜的移入移出效果
	function bindBigClass() {
		/**
		 * 思路:
		 * 1. 获取小图框元素对象, 并且设置移入事件(onmouseenter没有冒泡)
		 * 2. 动态创建蒙版元素以及大图框和大图片元素
		 * 3. 移出时需要移除蒙版元素和大图框以及大图片
		 */

		// 1.获取小图框元素
		const smallPic = document.querySelector("#smallPic");
		// 获取leftTop元素
		const leftTop = document.querySelector("#leftTop");
		// 获取数据
		const imagessrc = goodData.imagessrc;

		// 2. 设置移入事件
		smallPic.onmouseenter = function () {
			// 3. 创建蒙版元素
			const maskDiv = document.createElement("div");
			maskDiv.className = "mask";

			// 4. 创建大图标元素
			const bigPic = document.createElement("div");
			bigPic.id = "bigPic";

			// 5. 创建大图片元素
			const bigImg = document.createElement("img");
			// 动态更新大图的图片
			bigImg.src = imagessrc[bigImageIndex].b;

			// 6. 小图框追加蒙版
			smallPic.appendChild(maskDiv);

			// 7. 大图框追加大图片
			bigPic.appendChild(bigImg);

			// 8.lefTop追加大图框
			leftTop.appendChild(bigPic);

			// 设置移动事件
			smallPic.onmousemove = function (event) {
				// event.clientX: 鼠标点距离浏览器左侧X轴的值
				// getBoundingClientRect().left: 小图框元素距离浏览器左侧可视left值
				// offsetWidth: 为元素的占位宽度
				let left =
					event.clientX -
					smallPic.getBoundingClientRect().left -
					maskDiv.offsetWidth / 2;
				let top =
					event.clientY -
					smallPic.getBoundingClientRect().top -
					maskDiv.offsetHeight / 2;

				// 防止蒙版跑出边界外
				if (left < 0) {
					left = 0;
				} else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
					left = smallPic.clientWidth - maskDiv.offsetWidth;
				}

				if (top < 0) {
					top = 0;
				} else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
					top = smallPic.clientHeight - maskDiv.offsetHeight;
				}

				// 设置mask的left和top值
				maskDiv.style.left = left + "px";
				maskDiv.style.top = top + "px";

				// 移动的比例关系 = 蒙版元素移动的距离 / 大图片元素移动的距离
				// 蒙版元素移动的距离 = 小图框宽度 - 蒙版元素的宽度
				// 大图片元素移动的距离 = 大图片宽度 - 大图框元素的宽度
				const scale =
					(smallPic.clientWidth - maskDiv.offsetWidth) /
					(bigImg.offsetWidth - bigPic.clientWidth);
				// 小图框鼠标从左到右, 大图片实际上是从右到左
				bigImg.style.left = -left / scale + "px";
				bigImg.style.top = -top / scale + "px";
			};

			// 设置移出事件
			smallPic.onmouseleave = function () {
				//让小图框移除蒙版元素
				smallPic.removeChild(maskDiv);
				// 让leftTop元素移除大图框
				leftTop.removeChild(bigPic);
			};
		};
	}
	bindBigClass();

	// 动态渲染放大镜缩略图的数据
	function bindThumbnailData() {
		/**
		 * 1. 先获取piclist元素下的ul
		 * 2. 再来获取所需要的数据（data.js->imagessrc)
		 * 3. 遍历数组, 根据数组的长度来创建li元素
		 * 4. 让ul元素遍历追加li元素
		 */

		// 1. 获取piclist下的ul元素
		const ul = document.querySelector("#piclist ul");

		// 2. 获取imagessrc数据
		const imagessrc = goodData.imagessrc;

		// 3. 遍历数组
		for (let i = 0; i < imagessrc.length; i++) {
			// 4. 创建li元素
			const newLi = document.createElement("li");

			// 5. 创建img元素
			const newImg = document.createElement("img");
			newImg.src = imagessrc[i].s;

			// 6. 让li追加img元素
			newLi.appendChild(newImg);

			// 7. ul追加li
			ul.appendChild(newLi);
		}
	}
	bindThumbnailData();

	// 点击缩略图的效果
	function clickThumbnail() {
		/**
		 * 思路:
		 * 1. 获取所有的li元素, 并且循环发生点击事件
		 * 2. 点击缩略图要确定其下标位置来找到对应的小图路径和大图路径替换现有src的值
		 */

		// 1. 获取所有的li元素
		const liNodes = document.querySelectorAll("#piclist ul li");

		const smallPicImg = document.querySelector("#smallPic img");

		const imagessrc = goodData.imagessrc;
		// 小图的默认值
		smallPicImg.src = imagessrc[0].s;

		// 2.循环点击这些li元素
		for (let i = 0; i < liNodes.length; i++) {
			// 添加点击事件的监听
			liNodes[i].onclick = function () {
				// 记录点击的图片下标
				bigImageIndex = i;

				// 更改小图路径
				smallPicImg.src = imagessrc[i].s;
			};
		}
	}
	clickThumbnail();

	// 点击缩略图左右箭头的效果
	function clickThumbnailLeftRight() {
		/**
		 * 思路:
		 * 1. 先获取左右两端的箭头按钮
		 * 2. 再获取可视的div以及ul元素和所有的li元素
		 * 3. 计算(发生起点, 步长, 总体与懂得距离值)
		 * 4.. 然后再发生点击事件
		 */

		// 1. 获取左右两端的箭头按钮
		const prev = document.querySelector("#leftBottom a.prev");
		const next = document.querySelector("#leftBottom a.next");

		// 2.获取可视的div以及ul元素和所有的li元素
		const ul = document.querySelector("#piclist ul");
		const liNodes = document.querySelectorAll("#piclist ul li");

		// 3. 计算
		// 发生起点
		let start = 0;
		// 步长
		const step = (liNodes[0].offsetWidth + 20) * 2;
		// 总体运动的距离值 = ul的宽度 - div框的宽度 = (图片总数 - div中显示图片的数量) * (li的宽度 + 20)
		const endPosition = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20);

		// 绑定监听事件
		prev.onclick = function () {
			start -= step;
			if (start < 0) {
				start = 0;
			}
			ul.style.left = -start + "px";
		};

		next.onclick = function () {
			start += step;
			if (start > endPosition) {
				start = endPosition;
			}
			ul.style.left = -start + "px";
		};
	}
	clickThumbnailLeftRight();

	// 商品详情数据的动态渲染
	function bindRightTopData() {
		/**
		 * 思路:
		 * 1. 查找rightTop元素
		 * 2. 查找data.js ->goodData->goodsDetail
		 * 3. 建立一个字符串变量, 将原来的布局结构贴进去, 将所对应的数据放在对应的位置上重新渲染rightTop元素
		 */

		// 1. 查找rightTop元素
		const rightTop = document.querySelector("#right .rightTop");

		// 2. 查找数据
		const goodsDetail = goodData.goodsDetail;

		// 3. 创建字符串变量
		const s = `	<h3>
									${goodsDetail.title}
								</h3>
								<p>
									${goodsDetail.recommend}
								</p>
								<div class="priceWrapper">
									<div class="priceTop">
										<span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
										<div class="price">
											<span>¥</span>
											<p>${goodsDetail.price}</p>
											<i>降价通知</i>
										</div>
										<p>
											<span>累计评价</span>
											<span>${goodsDetail.evaluateNum}</span>
										</p>
									</div>
									<div class="priceBottom">
										<span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
										<p>
											<span>${goodsDetail.promoteSales.type}</span>
											<span
												>${goodsDetail.promoteSales.content}</span
											>
										</p>
									</div>
								</div>
								<div class="support">
									<span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
									<p>${goodsDetail.support}</p>
								</div>
								<div class="address">
									<span>配&nbsp;&nbsp;送&nbsp;&nbsp;至</span>
									<p>${goodsDetail.address}</p>
								</div>`;

		// 4. 重新渲染rightTop元素
		rightTop.innerHTML = s;
	}
	bindRightTopData();

	// 商品参数数据的动态渲染
	function bindRightBottomData() {
		/**
		 * 思路
		 * 1. 找rightBottom元素
		 * 2. 查找data.js->goodData.goodsDetail.crumbData
		 * 3. 动态创建dl元素对象(dt, dd)
		 */

		// 1. 找rightBottom元素
		const chooseWrapper = document.querySelector(
			"#right .rightBottom .chooseWrapper"
		);

		// 2. 查找数据
		const crumbData = goodData.goodsDetail.crumbData;

		// 3. 循环数据
		for (let i = 0; i < crumbData.length; i++) {
			// 4. 创建dl元素
			const dlNode = document.createElement("dl");

			// 5.创建dt元素
			const dtNode = document.createElement("dt");
			dtNode.innerText = crumbData[i].title;

			// 6. dl追加dt
			dlNode.appendChild(dtNode);

			// 7. 遍历crumbData->data元素
			for (let j = 0; j < crumbData[i].data.length; j++) {
				// 创建dd元素
				const ddNode = document.createElement("dd");
				ddNode.innerText = crumbData[i].data[j].type;
				ddNode.setAttribute("price", crumbData[i].data[j].changePrice);

				// dl追加dd
				dlNode.appendChild(ddNode);
			}

			// 8. chooseWrapper追加dl
			chooseWrapper.appendChild(dlNode);
		}
	}
	bindRightBottomData();

	// 点击商品参数之后的颜色排他效果
	function clickDD() {
		/**
		 * dd文字颜色排他思路:
		 * 1. 获取所有的dl元素, 取其中第一个dl元素下的所有dd
		 * 2. 循环所有dd元素并且添加点击事件
		 * 3. 确定实际发生事件的目标源对象设置其文字颜色为红色, 然后给其他所有的元素颜色都重置为基础颜色(#666)
		 *
		 * 点击dd之后产生的mark标记思路
		 * 1. 首先创建一个可以容纳点击的dd元素值的容器(数组), 确定数组的起始长度
		 * 2. 然后再点击dd元素的值按照对应的下标来写入到数组的元素身上
		 * 3.
		 */
		// 1. 找第一个dl下的所有的dd元素
		const dlNodes = document.querySelectorAll(
			"#right .rightBottom .chooseWrapper dl"
		);

		const chooseNode = document.querySelector("#right .rightBottom .choose");

		const arr = new Array(dlNodes.length).fill(0);

		for (let i = 0; i < dlNodes.length; i++) {
			const ddNodes = dlNodes[i].querySelectorAll("dd");

			// 2. 循环所有dd元素并且添加点击事件
			for (let j = 0; j < ddNodes.length; j++) {
				ddNodes[j].onclick = function () {
					// 清空chooseNode
					chooseNode.innerHTML = "";

					for (let k = 0; k < ddNodes.length; k++) {
						ddNodes[k].style.color = "#666";
					}
					// 覆盖颜色
					this.style.color = "red";

					// 点击哪个dd元素动态产生一个新的mark标记元素
					arr[i] = this;

					// 改变价格
					changePrice(arr);

					// 元素为真, 就动态创建mark标签
					arr.forEach((value, index) => {
						if (value) {
							// 创建div元素
							const markDiv = document.createElement("div");
							// 设置class属性
							markDiv.className = "mark";
							//设置文本值
							markDiv.innerText = value.innerText;

							// 创建a元素
							const aNode = document.createElement("a");
							// 设置文本值
							aNode.innerText = "X";
							// 设置下标
							aNode.setAttribute("index", index);

							// 让div追加a
							markDiv.appendChild(aNode);

							// 让choose元素追加div
							chooseNode.appendChild(markDiv);
						}
					});

					// 获取所有的a标签元素, 并且循环发生点击事件
					const aNodes = document.querySelectorAll(
						"#right .rightBottom .choose .mark a"
					);
					for (let n = 0; n < aNodes.length; n++) {
						aNodes[n].onclick = function () {
							//获取点击的a标签身上的index属性值
							const index1 = this.getAttribute("index");

							// 恢复数组中对应下标元素的值
							arr[index1] = 0;

							// 查找对应下标的那个dl行中的所有dd元素
							const ddlist = dlNodes[index1].querySelectorAll("dd");

							// 遍历所有的dd元素
							for (let m = 0; m < ddlist.length; m++) {
								// 其余所有dd的文字颜色为灰色
								ddlist[m].style.color = "#666";
							}

							// 默认的第一个dd文字颜色恢复为红色
							ddlist[0].style.color = "red";

							// 删除对应下标的mark标记
							chooseNode.removeChild(this.parentNode);

							// 调用价格函数
							changePrice(arr);
						};
					}
				};
			}
		}
	}
	clickDD();

	// 价格变动的函数
	// 点击dd或者删除mark标记的时候才会调用
	function changePrice(arr) {
		/**
		 * 思路
		 * 1. 获取价格的标签元素
		 * 2. 给每一个dd标签身上默认都设置一个自定义的属性, 用来记录变化的价格
		 * 3. 遍历arr数组, 将dd元素身上的新变化的价格和已有的价格(5299)相加
		 * 4. 将最后计算的结果渲染到价格的p标签中
		 */

		// 1. 获取原来的价格
		const oldPrice = document.querySelector(
			"#right .rightTop .priceWrapper .priceTop .price p"
		);

		// 取出默认的价格
		let price = goodData.goodsDetail.price;

		// 2. 遍历arr数组
		for (let i = 0; i < arr.length; i++) {
			if (arr[i]) {
				// 数据类型的强制转化
				const changeprice = Number(arr[i].getAttribute("price"));

				// 最终的价格
				price += changeprice;
			}
		}

		// 3. 更改价格
		oldPrice.innerText = price;

		// 4. 修改下方左侧的价格
		const leftPrice = document.querySelector(
			"#goodsDetailWrapper .rightDetail .chooseBox .listWrapper .left p"
		);
		leftPrice.innerText = "¥" + price;

		// 5. 遍历选择搭配中所有复选框元素, 看是否有选中的
		const ipts = document.querySelectorAll(
			"#goodsDetailWrapper .rightDetail .chooseBox .listWrapper .middle li input"
		);

		const newPrice = document.querySelector(
			"#goodsDetailWrapper .rightDetail .chooseBox .listWrapper .right i"
		);

		for (let i = 0; i < ipts.length; i++) {
			if (ipts[i].checked) {
				price += Number(ipts[i].value);
			}
		}

		// 修改右侧最新的价格
		newPrice.innerText = "¥" + price;
	}

	// 选择搭配中间区域复选框选中套餐价变动效果
	function chooseprice() {
		/**
		 * 思路
		 * 1. 先获取中间区域所有的复选框元素
		 * 2. 遍历这些元素取出他们的价格, 和左侧的基础价格进行累加, 累加之后重新协会套餐价标签里面
		 * 3.
		 */
		// 1. 先获取复选框元素
		const ipts = document.querySelectorAll(
			"#goodsDetailWrapper .rightDetail .chooseBox .listWrapper .middle li input"
		);

		// 获取左侧价格
		const leftPrice = document.querySelector(
			"#goodsDetailWrapper .rightDetail .chooseBox .listWrapper .left p"
		);

		// 获取新价格的标签
		const newPrice = document.querySelector(
			"#goodsDetailWrapper .rightDetail .chooseBox .listWrapper .right i"
		);

		// 2. 遍历复选框
		for (let i = 0; i < ipts.length; i++) {
			ipts[i].onclick = function () {
				let currentPrice = Number(leftPrice.innerText.slice(1));

				// 遍历所有的复选框
				for (let j = 0; j < ipts.length; j++) {
					if (ipts[j].checked) {
						// 新的价格 = 左侧价格 + 选中复选框附加价格
						currentPrice = currentPrice + Number(ipts[j].value);
					}
				}

				// 修改右侧最新的价格
				newPrice.innerText = "¥" + currentPrice;
			};
		}
	}
	chooseprice();

	// 封装一个公共的选项卡函数
	// tabBtns - 被点击的元素
	// tabContents - 被切换显示的元素
	function changeTab(tabBtns, tabContents) {
		for (let i = 0; i < tabBtns.length; i++) {
			tabBtns[i].onclick = function () {
				// 清空所有的className
				for (let j = 0; j < tabBtns.length; j++) {
					tabBtns[j].className = "";
					tabContents[j].className = "";
				}
				// 设置当前活动的class
				this.className = "active";
				tabContents[i].className = "active";
			};
		}
	}

	// 点击左侧选项卡
	function controlLeftTab() {
		// 被点击的元素
		const h4s = document.querySelectorAll(
			"#goodsDetailWrapper .leftAside .asideTop h4"
		);
		// 被切换显示的元素
		const divs = document.querySelectorAll(
			"#goodsDetailWrapper .leftAside .asideContent>div"
		);

		// 调用函数
		changeTab(h4s, divs);
	}
	controlLeftTab();

	// 点击右侧选项卡
	function controlRightTab() {
		// 被点击的元素
		const lis = document.querySelectorAll(
			"#goodsDetailWrapper .rightDetail .bottomDetail .tabBtns li"
		);
		// 被切换显示的元素
		const divs = document.querySelectorAll(
			"#goodsDetailWrapper .rightDetail .bottomDetail .tabContents div"
		);
		// 调用函数
		changeTab(lis, divs);
	}
	controlRightTab();

	// 右边侧边栏的点击效果
	function clickRightAside() {
		/**
		 * 思路:
		 * 1. 找到按钮元素, 发生点击事件
		 * 2. 记录一个初始的状态, 再点击事件的内容进行判断, 如果为关闭则展开, 反之如此
		 * 3. 如果为展开, 则设置按钮和侧边栏对应的class效果, 反之如此
		 *
		 */

		// 获取按钮元素,
		const btns = document.querySelector("#wrapper .rightAside .btns");

		// 记录初始状态
		let flag = true; // 关闭

		const rightAside = document.querySelector("#wrapper .rightAside");

		// 绑定点击事件
		btns.onclick = function () {
			// 判断
			if (flag) {
				// 展开
				this.className = "btns btnsOpen";
				rightAside.className = "rightAside asideOpen";
			} else {
				// 关闭
				this.className = "btns btnsClose";
				rightAside.className = "rightAside asideClose";
			}
			flag = !flag;
		};
	}
	clickRightAside();
};
