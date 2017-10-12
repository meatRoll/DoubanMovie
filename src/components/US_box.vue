<template>
	<div>
		<scroller lock-x :height='heightData' ref="scrollerEvent">
			<panel :header="header" :list="dataList" type="5" @on-img-error="onImgError" class="movieList"></panel>
			<load-more tip="loading" v-if="isLoadMoreShow"></load-more>
		</scroller>
	</div>
</template>

<script>
import { jsonp } from '../assets/js/common.js';
import { Scroller, LoadMore, Panel } from 'vux'

export default {
	created() {
		this.getData();
	},
	data() {
		return {
			scrollTop: 0,
			bottomCount: 20,
			dataList: [],
			header: '',
			isLoadMoreShow: true
		}
	},
	methods: {
		// 获取渲染数据
		getData() {
			jsonp('/us_box').then(res => {
				this.isLoadMoreShow = false;
				this.header = `时间：${res.date}`;
				// 设置数据格式
				res.subjects.forEach((elem) => {
					elem.title = `<strong>${elem.rank}</strong>  ${elem.subject.title}`;
					elem.src = elem.subject.images.small;
					elem.fallbackSrc = '../assets/fallback.png';
					var directors = elem.subject.directors.map((elem) => {
						return elem.name;
					}).join(' '),
						casts = elem.subject.casts.map((elem) => {
							return elem.name;
						}).join(' ');
					elem.desc = `<p>类型：${elem.subject.genres.join(' ')}</p>
											 <p>导演：${directors}</p>
											 <p>主演：${casts}</p>
											 <p class='clearfix'><span class='pl'>已看人数：${elem.subject.collect_count}</span><span class='pr'>评分：${elem.subject.rating.average}</span></p>`;
					elem.url = `/moviedetail/${elem.subject.id}`
				}, this);
				this.dataList = this.dataList.concat(res.subjects);
			}).catch(ex => {
				console.error(ex);
			});
		},
		// 图像错误
		onImgError(item, $event) {
			console.log(item, $event)
		}
	},
	components: {
		Scroller,
		LoadMore,
		Panel
	},
	props: ['heightData']
}
</script>