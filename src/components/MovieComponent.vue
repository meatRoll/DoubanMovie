<template>
	<div>
		<scroller lock-x :height='heightData' @on-scroll-bottom="onScrollBottom" :scroll-bottom-offst="200">
			<div class="box">
				<panel :list="dataList" type="1" @on-img-error="onImgError" class="movieList"></panel>
				<load-more tip="loading"></load-more>
			</div>
		</scroller>
	</div>
</template>

<script>
import { jsonp } from '../assets/js/common.js';
import { Scroller, Divider, Spinner, LoadMore, Panel } from 'vux'

export default {
	created() {
		this.getData();
	},
	data() {
		return {
			scrollTop: 0,
			bottomCount: 20,
			dataList: [],
			start: 0,
			total: Infinity
		}
	},
	components: {
		Scroller,
		Divider,
		Spinner,
		LoadMore,
		Panel
	},
	methods: {
		// 获取渲染数据
		getData() {
			jsonp(`${this.$route.path}?start=${this.start}&count=10`).then(res => {
				if(this.total === Infinity) this.total = res.total;
				this.start += 10;
				res.subjects.forEach(function(elem) {
					elem.title = `${elem.title} (${elem.year})`;
					elem.src = elem.images.small;
					elem.fallbackSrc = '../assets/fallback.png';
					var directors = elem.directors.map((elem) => {
						return elem.name;
					}).join(' '),
						casts = elem.casts.map((elem) => {
							return elem.name;
						}).join(' ');
					elem.desc = `<p>类型：${elem.genres.join(' ')}</p>
											 <p>导演：${directors}</p>
											 <p>主演：${casts}</p>
											 <p class='clearfix'><span class='pl'>已看人数：${elem.collect_count}</span><span class='pr'>评分：${elem.rating.average}</span></p>`;
					elem.url = `/moviedetail/${elem.id}`
				}, this);
				this.dataList = this.dataList.concat(res.subjects);
			});
		},
		// 滑动底部
		onScrollBottom() {
			// 停止加载
			if(this.start > this.total) return;


		},
		// 图像错误
		onImgError(item, $event) {
			console.log(item, $event)
		}
	},
	watch: {
		$route() {
			// this.dataList = 
			this.getData();
		}
	},
	props: ['heightData']
}
</script>

<style scoped lang="less">
@import '../assets/css/common.less';

.box2-wrap {
	overflow: hidden;
}
</style>
