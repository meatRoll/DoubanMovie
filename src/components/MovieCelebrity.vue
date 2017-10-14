<template>
	<div>
		<scroller lock-x :height='heightData' scrollbarY>
			<div class="box">
				<card class="movie-celebrity" v-if="!isLoadMoreShow">
					<div slot="header" class="header">
						<div class="left">
							<img class="previewer-demo-img" :src="dataList.avatars && dataList.avatars.medium" @click="show()">
						</div>
						<div class="right">
							<p>姓&nbsp;&nbsp;&nbsp;名：{{dataList.name}}</p>
							<p v-if="dataList.aka">曾用名：{{dataList.aka}}</p>
							<p v-if="dataList.name_en">英文名：{{dataList.name_en}}</p>
							<p v-if="dataList.aka_en">其&nbsp;&nbsp;&nbsp;它：{{dataList.aka_en}}</p>
							<p v-if="dataList.gender">性&nbsp;&nbsp;&nbsp;别：{{dataList.gender}}</p>
							<p v-if="dataList.born_place">出生地：{{dataList.born_place}}</p>
						</div>
						<div v-transfer-dom>
							<previewer :list="previewerList" ref="previewer" :options="options"></previewer>
						</div>
					</div>
					<div slot="content">
						<cell title="信息来源" :link="dataList.mobile_url" class="info-source"></cell>
					</div>
					<div slot="footer">
						<divider class="divider">作品</divider>
						<div @click="toRoute(item.subject.id)" v-for="item in dataList.works" :key="item.subject.id">
							<masker class="masker" color="F9C90C" :opacity="0.5" ref="masker">
								<div slot="content" class="img-box" ref="imgBox">
									<img :src="item.subject.images.small" alt="item.alt">
								</div>
								<div slot="content" class="right" ref="rightBox">
									<p>片名：{{item.subject.title}}</p>
									<p>年份：{{item.subject.year}}</p>
									<p>角色：{{item.roles.join('、')}}</p>
									<p v-if="item.subject.genres.join('、')">类型：{{item.subject.genres.join('、')}}</p>
									<p>评分：{{item.subject.rating.average}}</p>
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
import { Scroller, Card, LoadMore, TransferDom, Previewer, Divider, Cell, Masker } from 'vux';

export default {
	created() {
		jsonp(`/celebrity/${this.$route.params.id}`).then(res => {
			this.isLoadMoreShow = false;
			this.previewerList = [{
				w: 214,
				h: 306,
				src: res.avatars.large
			}];
			this.dataList = res;
			this.dataList.aka = res.aka.join('、');
			this.dataList.aka_en = res.aka_en.join(', ');
		}).catch(ex => {
			console.error(ex);
		});
	},
	updated() {
		document.querySelector('.movie-celebrity').style.paddingBottom = '1px';
		if (!this.isUpdatedWanted && this.$refs.rightBox) {
			this.isUpdatedWanted = true;
			var maskerWidth = this.$refs.masker[0].$el.offsetWidth,
				imgWidth = this.$refs.imgBox[0].offsetWidth;
			console.log(maskerWidth, imgWidth)
			this.$refs.rightBox.forEach((elem) => {
				elem.style.width = `${(maskerWidth - imgWidth - 20) / 15}rem`;
			}, this);
		}
	},
	data() {
		return {
			dataList: [],
			isLoadMoreShow: true,
			previewerList: [],
			isUpdatedWanted: false,
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
	methods: {
		// previwer方法
		show() {
			this.$refs.previewer.show(0);
		},
		// 跳转路由
		toRoute(id) {
			this.$router.push({ path: `/moviedetail/${id}` });
		}
	},
	components: {
		Scroller,
		Card,
		LoadMore,
		Previewer,
		Divider,
		Cell,
		Masker
	},
	directives: {
		TransferDom
	},
	props: ['heightData']
}
</script>

<style scoped lang="less">
@import '../assets/css/common.less';

.movie-celebrity {
	padding: 10rem /@param;
}

.header {
	display: flex;
	.left {
		border-radius: 5px;
		overflow: hidden;
		margin-right: 10rem / @param;
		img {
			display: block;
		}
	}
	.right {
		padding-top: 5px;
		flex: 1;
		font-weight: 700;
		font-size: 14px;
		color: #333;
	}
}

.info-source {
	background-color: #999;
	border-radius: 5px;
	color: #fff;
	font-size: 18px;
	margin: 10rem / @param 0;
}

.divider {
	color: #333;
	font-weight: 700;
	margin: 10rem / @param;
}

.masker {
	height: 125px;
	border-radius: 5rem / @param;
	margin-bottom: 5rem / @param;
	.img-box {
		padding-right: 20rem / @param;
		padding-left: 5rem / @param;
		overflow: hidden;
		display: flex;
		align-items: center;
		img {
			border-radius: 5px;
			width: 65px;
			height: 91px;
			display: block;
		}
	}
	.right {
		color: #222;
		font-weight: 700;
		font-size: 14px;
		p {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}
</style>