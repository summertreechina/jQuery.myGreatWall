{
	class myGreatWall {
		constructor(img_box, json_data) {
			this.img_box                = img_box
			this.img_box.append(`<h1>我的照片墙啊</h1>
									<ul id ="vertical-imgs"></ul>
									<ul id="square-imgs"></ul>
									<ul id="horizontal-imgs"></ul>`)
			this.vertical_box           = $('#vertical-imgs')
			this.horizontal_box         = $('#horizontal-imgs')
			this.square_box             = $('#square-imgs')
			this.json                   = json_data
			this.img_margin

				// 进度条数据
			this.img_num = this.json.length
			this.complete_img = 0

			this.get_img_norm_size()
			this.progressbar = this.init_progress()
			this.load_imgs()
		}

			// 照片载入
		load_imgs() {
			for (let i in this.json) {
				let img = new Image()
				img.src = this.json[i].url
				img.onload = (e) => {
					let raw_width = img.width
					let raw_height = img.height
					let scale = this.xround((raw_width / raw_height), 2)

					img.id = i
					img.scale = scale

					this.cate_img(img)
				}
			}

		}

		// 对完成下载的照片分类，并创建dom结构
		cate_img(img) {
			let cvs_id = `cvs_${img.id}`
			let scale = img.scale
			let img_margin = `${this.img_margin}px`
			let cate;

			if (scale < 0.8) {
				cate = 'v'
				this.vertical_box.append( `<a class="vertical-img" style="margin: ${img_margin}" href="${img.src}" target="_blank"><canvas id=${cvs_id}></canvas></a>` )
			} else if (scale > 1.2) {
				cate = 'h'
				this.horizontal_box.append( `<a class="horizontal-img" style="margin: ${img_margin}" href="${img.src}" target="_blank"><canvas id=${cvs_id}></canvas></a>` )
			} else {
				cate = 's'
				this.square_box.append( `<a class="square-img" style="margin: ${img_margin}" href="${img.src}" target="_blank"><canvas id=${cvs_id}></canvas></a>` )
			}

			this.draw_img_by_canvas(img, cate)
		}

		// 用canvas描绘一张照片
		draw_img_by_canvas(img, cate) {
			let canvas = document.getElementById(`cvs_${img.id}`)
			let context = canvas.getContext('2d')
			let norm_short_size = this.norm_short_size
			let norm_long_size = this.norm_long_size
			let scale = img.scale
			let sx
			let sy

			switch (cate) {
				case 'v':
					canvas.width = norm_short_size
					canvas.height = norm_long_size
					img.raw_w = img.width
					img.raw_h = img.height

					if (scale < 0.67) {
						img.width = norm_short_size
						img.height = img.raw_h / (img.raw_w  / norm_short_size)
						sx = 0
						sy = (canvas.height - img.height) / 2
					} else {
						img.height = norm_long_size
						img.width = img.raw_w / (img.raw_h / norm_long_size)
						sx = (canvas.width - img.width) / 2
						sy = 0
					}
					break;
				case 'h':
					canvas.width = norm_long_size / 1.16
					canvas.height = norm_short_size / 1.16
					img.raw_w = img.width
					img.raw_h = img.height
					
					if (scale <= 1.5) {
						img.width = canvas.width
						img.height = img.raw_h / (img.raw_w / canvas.width)
						sx = 0
						sy = (canvas.height - img.height) / 2
					} else {
						img.height = canvas.height
						img.width = img.raw_w / (img.raw_h / canvas.height)
						sy = 0
						sx = (canvas.width - img.width) / 2

					}
					break;
				case 's':
					canvas.width = canvas.height = norm_short_size
					img.raw_w = img.width
					img.raw_h = img.height

					if (scale <= 1) {
						img.width = canvas.width
						img.height = img.raw_h / (img.raw_w / canvas.width)
						sx = 0
						sy = (canvas.width - img.height) / 2
					} else {
						img.height = canvas.width
						img.width = img.raw_w / (img.raw_h / canvas.width)
						sx = (canvas.width - img.width) / 2
						sy = 0
					}
					break;
			}

			context.drawImage(img, sx, sy, img.width, img.height);
			this.complete_img++
			this.progressbar.reach(this.complete_img)


				// context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
					// img：规定要使用的图像、画布或视频。
					// sx：可选。画布中被绘制的区域的左上角的点的 x 值。
					// sy：可选。同上的 y 值。
					// swidth：可选。画布中被绘制的区域的宽度。
					// sheight：可选。同上的高度。
					// x：图像中，被选取的区域的左上角的点的 x 值。
					// y：同上的 y 值。
					// width：可选。图像中，被截取的区域的宽度。
					// height：可选。同上的高度。
		}

		// 确定照片基准宽度--每行显示几张照片
		get_img_norm_size() {
			let total_width = this.img_box.width()
			let norm_short_size = Math.floor(total_width / 5.8)
			let norm_long_size = Math.floor(norm_short_size * 1.5)
			let img_margin = Math.floor((total_width - norm_short_size * 5) / 12)

			this.norm_short_size = norm_short_size
			this.norm_long_size = norm_long_size
			this.img_margin = img_margin

			// 要完善的事情：
				// 1、当页面宽度发生变化时重新渲染照片；
				// 2、当页面宽度过于窄的时候，每行显示多少照片；
				// 3、根据将来的效果确定是否给横版的照片单独设置margin
				// 4、添加简单的进度条 http://www.jq22.com/demo/NumberProgressBar-master/ http://www.jq22.com/jquery-info428
				// 5、是否开启多线程支持
		}

		init_progress() {
			$('#img-total-box').text(this.img_num)
			let options = {
				duration: 500,
				style: 'step',
				min: 0,
				max: this.img_num,
				current: this.complete_img
			}
			let progressbar = $('.number-pb').NumberProgressBar(options);
			$('#img-total-box').text(this.img_num)
			return progressbar;
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
	let json2 = [
		{"title":"白甜", "url":"http://img.mb.moko.cc/2017-08-31/fb53ba97-d0a6-44d8-9b60-974b7eacd566.jpg"}, 
		{"title":"白甜", "url":"http://img.mb.moko.cc/2017-08-31/313c307b-b165-4574-9675-6e38918ff4d0.jpg"},
		{"title":"白甜", "url":"http://img.mb.moko.cc/2017-08-31/4a85ca5b-f5fd-4522-88a3-2c8287dc5318.jpg"},
		{"title":"时尚cosmo", "url":"http://img1qn.moko.cc/2017-09-01/70f1527e-f9b7-44ad-b5c9-ad1ec3071211.jpg"},
		{"title":"时尚cosmo", "url":"http://img1qn.moko.cc/2017-09-01/bfc53dd3-661e-43cd-8fc7-ba3e5a09d025.jpg"},
		{"title":"时尚cosmo", "url":"http://img1qn.moko.cc/2017-09-01/046daa19-4b65-4a47-a510-a2e7335da710.jpg"},
		{"title":"时尚cosmo", "url":"http://img1qn.moko.cc/2017-09-01/aa838ba6-dc51-4236-8b5c-cf46637dc138.jpg"},
		{"title":"（ok精彩）马思纯", "url":"http://img1qn.moko.cc/2017-09-01/ca6be013-78d4-4f3e-adbe-36595f0f77be.jpg"},
		{"title":"（ok精彩）马思纯", "url":"http://img1qn.moko.cc/2017-09-01/8a46366b-9406-4cdf-907b-47bc5703482c.jpg"},
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
		{"title":"本地照片", "url":"./dest/images/e0f39278-f0f3-4e85-8eab-69ab725ac73d.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201501/5/A1224931484.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201608/31/2391726453.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201608/31/9A91726256.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201608/31/CF91726114.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201608/31/2D91726702.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201608/31/CE91726982.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201608/31/C791726811.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201608/31/4091726655.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201501/5/FA224931272.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201501/5/25224931924.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201608/31/FC91727815.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201609/15/22194554883.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201609/15/48194555752.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201609/15/84195228316.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201609/15/B2195228865.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201609/15/17195229395.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201608/31/AD91727585.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201608/31/2A91727990.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201608/31/1B91727736.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201607/10/F720444235.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201607/10/8420444528.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201608/9/7594334124.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201609/19/CE182150400.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201609/19/B6182150568.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201609/11/0B215358118.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201609/11/89215358933.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201709/3/51205942242.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201709/3/D4205943918.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201709/3/50205943631.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201709/3/5E205943209.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201709/3/45205943306.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201709/3/46205943658.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201709/3/7D205943150.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201709/3/A0205944423.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201709/3/82205944860.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201709/3/06205944450.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201709/3/1A205945319.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201708/22/7C03450933.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201708/22/0003451890.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201707/7/B8215443653.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201707/7/00215443258.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201706/13/5B214732629.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201706/13/CA214732458.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201706/13/C5214733378.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201706/13/4F214733744.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201706/13/34214733815.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201706/13/51214734711.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201706/13/A2214734303.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/23/95155024790.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/D321483693.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/5C21483410.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/0421483115.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/B021484720.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/0621484264.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/B621484152.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/BE21484825.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/EE21484784.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/8921484684.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/3221484332.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/DE21484220.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/B321484105.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/3321484781.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/4B21484908.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/F321485818.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/8821485706.jpg"},
		{"title":"本地照片", "url":"http://www.xgyw.cc/uploadfile/201704/8/4C21485957.jpg"},
		// {"title":"本地照片", "url":""},
		// {"title":"本地照片", "url":""},
		// {"title":"本地照片", "url":""},
		// {"title":"本地照片", "url":""},
	]
	let img_box = $('#imgs-box')
	greatWall = new myGreatWall(img_box, json2)

}