<template>
	<div>
		<card class="movie-detail">
			<div slot="header">
				<h2>电影名：{{dataList.title}}</h2>
				<h4 class="anotherName">又名：{{dataList.anotherName}}</h4>
			</div>
			<div slot="content" class="content">
				<div class="left">
					<img class="previewer-demo-img" :src="dataList.images && dataList.images.medium" @click="show()">
				</div>
				<div class="right">
					<p>年份：{{dataList.year}}</p>
				</div>
				<div v-transfer-dom>
					<previewer :list="previewerList" ref="previewer" :options="options"></previewer>
				</div>
			</div>
			<div slot="footer" class="footer">
				尾部
			</div>
		</card>
	</div>
</template>

<script>
import { jsonp } from '../assets/js/common.js';
import { Card, Previewer, TransferDom } from 'vux';

export default {
	created() {
		jsonp(`/subject/${this.$route.params.id}`).then(res => {
			console.log(res);
			this.previewerList = [{
				w: 300,
				h: 419,
				src: res.images.large
			}];
			this.dataList = res;
			this.dataList.anotherName = this.dataList.aka.join('、');
		}).catch(ex => {
			console.error(ex);
		});
	},
	methods: {
		show() {
			this.$refs.previewer.show(0);
		}
	},
	data() {
		return {
			dataList: [],
			previewerList: [],
			options: {
				getThumbBoundsFn(index) {
					// find thumbnail element
					let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
					// get window scroll Y
					let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
					// optionally get horizontal scroll
					// get position of element relative to viewport
					let rect = thumbnail.getBoundingClientRect()
					// w = width
					return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
					// Good guide on how to get element coordinates:
					// http://javascript.info/tutorial/coordinates
				}
			}
		}
	},
	components: {
		Card,
		Previewer
	},
	directives: {
		TransferDom
	},
}
</script>

<style scoped lang="less">
@import '../assets/css/common.less';

.movie-detail {
	padding: 10rem /@param;
	.content, .footer{
		margin-top: 10rem / @param;
	}
	.content {
		display: flex;
		.left{
			padding-right: 10rem / @param;
		}
		.right{
			flex: 1;
		}
	}
}

.anotherName {
	color: #555;
}
</style>
