<template>
	<div>
		<scroller lock-x :height='heightData' @on-scroll-bottom="onScrollBottom" ref="scrollerEvent" :scroll-bottom-offst="200">
			<div class="box">
				<panel :list="dataList" type="5" @on-img-error="onImgError" class="movieList"></panel>
				<load-more tip="loading" v-if="isLoadMoreShow"></load-more>
			</div>
		</scroller>
	</div>
</template>

<script>
import { jsonp } from '../assets/js/common.js';
import { Scroller, Spinner, LoadMore, Panel } from 'vux'

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
			total: Infinity,
			canGetData: true,
			isLoadMoreShow: true
		}
	},
	components: {
		Scroller,
		Spinner,
		LoadMore,
		Panel
	},
	methods: {
		// 获取渲染数据
		getData() {
			jsonp(`${this.$route.path}?start=${this.start}&count=10&q=${this.$route.query.q}&tag=${this.$route.query.tag}`).then(res => {
				if (this.$store.state.isSearch) {
					this.$store.commit('changeIsSearch');
					this.$emit('drawerVisibilityChange');
				};
				this.canGetData = true;
				if (this.total === Infinity) this.total = res.total;
				this.start += 10;
				// 设置数据格式
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
			}).catch(ex => {
				this.canGetData = true;
				console.error(ex);
			});
		},
		// 滑到底部
		onScrollBottom() {
			if (this.canGetData) {
				this.canGetData = false;
				// 停止加载
				if (this.start > this.total) {
					this.isLoadMoreShow = false;
					return;
				};

				//发送请求加载数据
				this.getData();
			}
		},
		// 图像错误
		onImgError(item, $event) {
			console.log(item, $event)
		}
	},
	watch: {
		$route() {
			this.dataList = [];
			this.start = 0;
			this.total = Infinity;
			this.isLoadMoreShow = true;
			this.getData();
			// 重置scroller
			this.$nextTick(() => {
				this.$refs.scrollerEvent.reset({ top: 0 })
			})
		}
	},
	props: ['heightData']
}
</script>