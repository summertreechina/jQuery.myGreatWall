{
	class myGreatWall {
		constructor(img_box, json_data) {
			this.img_box = img_box
			this.img_box.append('<ul id="vertical-imgs"></ul><h1>我的照片墙啊</h1><ul id="horizontal-imgs"></ul>')
			this.vertical_box = $('#vertical-imgs')
			this.horizontal_box = $('#horizontal-imgs')
			this.json = json_data

			this.cons_page()
		}
	
		cons_page() {
			let tpl = ''
			for (let i in this.json) {
				tpl += `<li><canvas id="cvs_${i}"></canvas></li>`

				let img = new Image()
				img.src = this.json[i].url
				img.onload = function(e) {
					let raw_width = img.width
					let raw_height = img.height
					let scale = raw_width / raw_height
				}

			}
			this.vertical_box.append(tpl)
		}

		load_imgs() {

		}

		xround(num, bit) {
			return Math.round(num * Math.pow(10, bit)) / Math.pow(10, bit)
		}
		
	}



	let json = [
		{"title":"白甜", "url":"http://img.mb.moko.cc/2017-08-31/fb53ba97-d0a6-44d8-9b60-974b7eacd566.jpg"}, 
		{"title":"白甜", "url":"http://img.mb.moko.cc/2017-08-31/313c307b-b165-4574-9675-6e38918ff4d0.jpg"},
		{"title":"白甜", "url":"http://img.mb.moko.cc/2017-08-31/4a85ca5b-f5fd-4522-88a3-2c8287dc5318.jpg"},
		{"title":"时尚cosmo", "url":"http://img1qn.moko.cc/2017-09-01/70f1527e-f9b7-44ad-b5c9-ad1ec3071211.jpg"},
		{"title":"时尚cosmo", "url":"http://img1qn.moko.cc/2017-09-01/bfc53dd3-661e-43cd-8fc7-ba3e5a09d025.jpg"},
		{"title":"时尚cosmo", "url":"http://img1qn.moko.cc/2017-09-01/046daa19-4b65-4a47-a510-a2e7335da710.jpg"},
		{"title":"时尚cosmo", "url":"http://img1qn.moko.cc/2017-09-01/aa838ba6-dc51-4236-8b5c-cf46637dc138.jpg"},
		{"title":"(ok精彩)马思纯", "url":"http://img1qn.moko.cc/2017-09-01/ca6be013-78d4-4f3e-adbe-36595f0f77be.jpg"},
		{"title":"(ok精彩)马思纯", "url":"http://img1qn.moko.cc/2017-09-01/8a46366b-9406-4cdf-907b-47bc5703482c.jpg"},
		{"title":"广告杂志", "url":"http://img1qn.moko.cc/2017-09-08/c7508f27-57d6-4e91-b104-5e7b49b29269.jpg"},
		{"title":"广告杂志", "url":"http://img1qn.moko.cc/2017-09-08/34a1e599-f3fc-427f-b860-4c5d0b492922.jpg"},
		{"title":"广告杂志", "url":"http://img1qn.moko.cc/2017-09-08/4df02d0d-5995-4e53-8317-01f5fde52372.jpg"},
		{"title":"林依晨", "url":"http://img1qn.moko.cc/2017-09-06/f6f7a345-d6f8-4e75-8011-981c1a36404a.jpg"},
		{"title":"林依晨", "url":"http://img1qn.moko.cc/2017-09-06/f2d532d1-dbe7-44f2-95d0-86da7fddbbed.jpg"},
		{"title":"林依晨", "url":"http://img1qn.moko.cc/2017-09-06/7e675c02-1c34-4c55-aee7-44f418d49b36.jpg"},
		{"title":"九州梦", "url":"http://image17-c.poco.cn/mypoco/myphoto/20170825/09/6654656420170825092530040_640.jpg"},
		{"title":"九州梦", "url":"http://image17-c.poco.cn/mypoco/myphoto/20170825/09/6654656420170825092702063_640.jpg"},
		{"title":"九州梦", "url":"http://image17-c.poco.cn/mypoco/myphoto/20170825/09/6654656420170825092555013_640.jpg"},
		{"title":"Oneday", "url":"http://image13-c.poco.cn/mypoco/myphoto/20170815/21/5274901820170815210339032_640.jpg"},
		{"title":"Oneday", "url":"http://image13-c.poco.cn/mypoco/myphoto/20170815/21/5274901820170815211019066_640.jpg"},
		{"title":"Oneday", "url":"http://image13-c.poco.cn/mypoco/myphoto/20170815/21/5274901820170815210717039_640.jpg"},
		{"title":"Oneday", "url":"http://image13-c.poco.cn/mypoco/myphoto/20170815/21/5274901820170815210813067_640.jpg"},
		{"title":"小岛漫步", "url":"http://image17-c.poco.cn/mypoco/myphoto/20170831/17/17467238720170831170545043_640.jpg"},
		{"title":"小岛漫步", "url":"http://image17-c.poco.cn/mypoco/myphoto/20170831/17/17467238720170831170634016_640.jpg"},
		{"title":"小岛漫步", "url":"http://image17-c.poco.cn/mypoco/myphoto/20170831/17/17467238720170831170641083_640.jpg"},
		{"title":"小岛漫步", "url":"http://image17-c.poco.cn/mypoco/myphoto/20170831/17/17467238720170831170721021_640.jpg"},
		{"title":"｛夏光。｝", "url":"http://image17-c.poco.cn/mypoco/myphoto/20170907/11/17831018620170907113837085_640.jpg"},
		{"title":"｛夏光。｝", "url":"http://image17-c.poco.cn/mypoco/myphoto/20170907/11/17831018620170907113900074_640.jpg"},
		{"title":"#街拍", "url":"http://img.mb.moko.cc/2017-08-31/b85a8cc9-0766-4da8-a629-2406dd35e117.jpg"},
		{"title":"#街拍", "url":"http://img.mb.moko.cc/2017-08-31/9b41d810-c67b-4a90-a91b-395fd50be0c5.jpg"},
		{"title":"《楚乔传》淳儿公主 艺人拍摄-李沁", "url":"http://img1qn.moko.cc/2017-08-16/73f0ffae-8114-4a39-a0ee-f90ff6d1a157.jpg"},
		{"title":"《楚乔传》淳儿公主 艺人拍摄-李沁", "url":"http://img1qn.moko.cc/2017-08-16/5869ca57-8857-4f1b-8ae0-61eaab0e739a.jpg"},
		{"title":"新娘Brides 陈乔恩", "url":"http://img1qn.moko.cc/2017-09-12/33d22fb7-34e1-489c-93ba-ee94f97e120a.jpg"},
		{"title":"新娘Brides 陈乔恩", "url":"http://img1qn.moko.cc/2017-09-12/5fa56e28-a449-4ef1-ae24-f9fedd25acb7.jpg"},
		{"title":"新娘Brides 陈乔恩", "url":"http://img1qn.moko.cc/2017-09-12/7cd5ca6c-cec0-48b6-9251-b744bbd80f98.jpg"},
		{"title":"本地照片", "url":"./dest/images/1.jpg"},
		{"title":"本地照片", "url":"./dest/images/2.jpg"},
		{"title":"本地照片", "url":"./dest/images/4.jpg"},
		{"title":"本地照片", "url":"./dest/images/5.JPG"},
		{"title":"本地照片", "url":"./dest/images/e0f39278-f0f3-4e85-8eab-69ab725ac73d.jpg"}
	]
	let img_box = $('#imgs-box')
	let greatWall = new myGreatWall(img_box, json)
	// greatWall.cons_page()
	// console.log(greatWall.v_wrap)
}