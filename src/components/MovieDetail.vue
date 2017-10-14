<template>
	<div>
		<scroller lock-x :height='heightData' ref="scrollerEvent" scrollbarY>
			<div class="box">
				<card class="movie-detail" v-if="!isLoadMoreShow">
					<div slot="header">
						<h2>电影名：{{dataList.title}} ({{dataList.year}})</h2>
						<h4 class="head-style">原名：{{dataList.original_title}}</h4>
						<h4 class="head-style">又名：{{dataList.aka}}</h4>
						<p class="head-style">国家：{{dataList.countries}}</p>
						<p class="head-style">类型：{{dataList.genres}}</p>
						<flexbox class="text-center">
							<flexbox-item class="flexbox">
								<div class="flex-demo">
									<p class="bold">想看</p>
									<countup :start-val="0" :end-val="dataList.wish_count" :duration="3" class="count"></countup>
								</div>
							</flexbox-item>
							<flexbox-item class="flexbox">
								<div class="flex-demo">
									<p class="bold">已看</p>
									<countup :start-val="0" :end-val="dataList.collect_count" :duration="3" class="count"></countup>
								</div>
							</flexbox-item>
						</flexbox>
					</div>
					<div slot="content" class="content">
						<div class="up line">
							<h3>内容介绍</h3>
						</div>
						<div class="down">
							<div class="left">
								<img class="previewer-demo-img" :src="dataList.images && dataList.images.medium" @click="show()">
							</div>
							<div class="right" :class="{'hide-text': isTextHide}" @click="changeTextState">
								详情：{{dataList.summary}}
							</div>
							<div v-transfer-dom>
								<previewer :list="previewerList" ref="previewer" :options="options"></previewer>
							</div>
						</div>
					</div>
					<div slot="footer" class="footer">
						<div class="rating line">
							<h3>评分信息</h3>
							<div class="rating-style clearfix">
								<span>评价：</span>
								<span>{{dataList.average}} / {{dataList.stars}}分 / {{dataList.ratings_count}}人</span>
								<rater :value="dataList.star" disabled star="☻" class="pr"></rater>
							</div>
						</div>
						<cell title="信息来源" :link="dataList.mobile_url" class="info-source"></cell>
						<divider class="divider">导演</divider>
						<div @click="toRoute(item.id)" v-for="item in dataList.directors" :key="item.id">
							<masker class="masker" color="F9C90C" :opacity="0.5">
								<div slot="content" class="img-box">
									<img :src="item.avatars.small" alt="item.alt">
								</div>
								<div slot="content" class="right">
									<p>姓名：</p>
									<p>{{item.name}}</p>
								</div>
							</masker>
						</div>
						<divider class="divider">主演</divider>
						<div @click="toRoute(item.id)" v-for="item in dataList.casts" :key="item.id">
							<masker class="masker" color="09099C" :opacity="0.5">
								<div slot="content" class="img-box">
									<img :src="item.avatars.small" alt="item.alt">
								</div>
								<div slot="content" class="right">
									<p>姓名：</p>
									<p>{{item.name}}</p>
								</div>
							</masker>
						</div>
					</div>
				</card>
				<load-more tip="loading" v-if="isLoadMoreShow"></load-more>
			</div>
		</scroller>
	</div>
</template>

<script>
import { jsonp } from '../assets/js/common.js';
import { Card, Previewer, TransferDom, CellBox, Scroller, Rater, LoadMore, Flexbox, FlexboxItem, Countup, Masker, Divider, Cell } from 'vux';

export default {
	created() {
		jsonp(`/subject/${this.$route.params.id}`).then(res => {
			this.isLoadMoreShow = false;
			this.previewerList = [{
				w: 300,
				h: 419,
				src: res.images.large
			}];
			// 整理数据
			this.dataList = res;
			this.dataList.aka = res.aka.join('、');
			this.dataList.countries = res.countries.join('、');
			this.dataList.genres = res.genres.join('、');
			this.dataList.star = res.rating.stars / 20;
			this.dataList.average = res.rating.average;
			this.dataList.stars = res.rating.stars;
		}).catch(ex => {
			console.error(ex);
		});
	},
	updated() {
		document.querySelector('.movie-detail').style.paddingBottom = '1px';
	},
	methods: {
		// previwer方法
		show() {
			this.$refs.previewer.show(0);
		},
		// 改变描述信息的展示状态
		changeTextState() {
			this.isTextHide = !this.isTextHide;
		},
		// 跳转路由
		toRoute(id) {
			this.$router.push({ path: `/celebrity/${id}` });
		}
	},
	data() {
		return {
			dataList: [],
			previewerList: [],
			isTextHide: true,
			isLoadMoreShow: true,
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
		Previewer,
		CellBox,
		Scroller,
		Rater,
		LoadMore,
		Flexbox,
		FlexboxItem,
		Countup,
		Masker,
		Divider,
		Cell
	},
	directives: {
		TransferDom
	},
	props: ['heightData']
}
</script>

<style scoped lang="less">
@import '../assets/css/common.less';

.movie-detail {
	padding: 0 10rem /@param;
	.content,
	.footer {
		margin-top: 10rem / @param;
	}
	.content {
		.down {
			display: flex;
			.left {
				padding-right: 10rem / @param;
			}
			.right {
				flex: 1;
				font-size: 14px;
			}
		}
	}
}

.hide-text {
	overflow: hidden;
	text-overflow: ellipsis;
	height: 130px;
	display: -webkit-box;
	-webkit-line-clamp: 6;
	-webkit-box-orient: vertical;
}

.head-style,
.rating-style {
	color: #555;
	font-weight: 700;
	font-size: 14px;
}

.line {
	border-top: 1px solid @lineColor;
	padding-bottom: 8px;
}

.flexbox {
	margin-top: 5px;
	box-shadow: -1px -1px 5px #999 inset;
	background-color: #fefefe;
	border-radius: 10px;
	p {
		color: #123456;
		font-size: 20px;
	}
	.count {
		font-size: 24px;
		color: #666;
	}
}

.masker {
	height: 120px;
	border-radius: 5rem / @param;
	margin-bottom: 5rem / @param;
	.img-box {
		margin-right: 20rem / @param;
		margin-left: 5rem / @param;
		border-radius: 5px;
		overflow: hidden;
		img {
			display: block;
		}
	}
	.right {
		color: #222;
		font-weight: 700;
		font-size: 20px;
		p {
			margin: 5rem / @param;
		}
	}
}

.divider {
	color: #333;
	font-weight: 700;
}

.info-source {
	background-color: #555;
	border-radius: 5px;
	color: #fff;
	font-size: 18px;
	margin: 10rem / @param 0;
}
</style>
