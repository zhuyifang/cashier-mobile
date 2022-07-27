<template>
	<view class="goods-list dir-top-nowrap">
		<view class="row dir-left-nowrap main-between box-grow-1" v-for="(item, key) in goodsList" :key="key">
			<view class="item box-grow-0" v-for="(good, index) in item" :key="index" @click="routeGo(good)">
				<view class="image-name dir-top-nowrap main-left">
					<view class="out-dialog" v-if="good.goods_stock == 0 && appSetting.is_show_stock == '1'">
						<image :src="appSetting.is_use_stock == '1' ? appImg.plugins_out : appSetting.sell_out_pic">
						</image>
					</view>
					<image :lazy-load="true" mode="aspectFill" class="cover_pic" :src="good.cover_pic"></image>
					<view class="name t-omit">{{good.name}}</view>
				</view>
				<view class="content dir-top-nowrap main-right">
					<view class="sales">
						{{good.sales}}
					</view>
					<view class="price-bottom" >
						{{good.price_content || good.price}}
					</view>
					<view class="price-btn dir-left-nowrap main-between cross-center">
						<view v-if="good.goods_stock != 0"
							 class="btn">购买</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex';

	export default {
		name: "app-product-list",
		computed: {
			...mapState({
				appImg: state => state.mallConfig.__wxapp_img.mall,
				appSetting: state => state.mallConfig.mall.setting,
			}),
			...mapGetters('mallConfig', {
				getVideo: 'getVideo'
			}),
		},

		data() {
			return {
				disable: 'disable'
			};
		},

		props: [`goodsList`, `theme`],

		methods: {
			routeGo(data) {
				this.$emit('routeGo', data);
			}
		},
	}
</script>

<style scoped lang="scss">
	.goods-list {
		width: calc(100% - 32upx);
		background-color: #f7f7f7;
		margin: #{0 16upx};
		margin-bottom: 20upx;
	}

	.row {
		margin-top: 16upx;
	}

	.item {
		width: 350upx;
		border-radius: 15upx;
		background-color: #ffffff;
	}

	.image-name {
		height: 396upx;
		margin-bottom: 10upx;
		position: relative;

		.out-dialog {
			width: 350upx;
			height: 350upx;
			position: absolute;
			top: 0;
			left: 0;
			background-color: rgba(0, 0, 0, .5);
			z-index: 10;

			image {
				width: 350upx;
				height: 350upx;
			}
		}
	}

	.content {
		margin: #{0 20upx};
		width: 310upx;
		height: calc(100% - 405upx);
	}

	.cover_pic {
		width: 350upx;
		height: 350upx;
		margin-bottom: 20upx;
		border-top-right-radius: 15upx;
		border-top-left-radius: 15upx;
	}

	.name {
		width: 310upx;
		margin: #{0 20upx};
		font-size: 28upx;
		color: #353535;
	}

	.btn {
		width: 110upx;
		height: 45upx;
		font-size: 26upx;
		line-height: 45upx;
		text-align: center;
		border: 1upx solid;
		background-color: rgb(221, 183, 102);
		color:#fff
	}

	.price-bottom {
		margin-bottom: 10upx;
	}

	.price {
		font-size: 25upx;
	}

	.price-btn {
		margin-top: #{-48upx};
		margin-bottom: 16upx;
		margin-left:195upx
	}

	.sales {
		width: 100%;
		padding: 0.16rem;
		font-size: 0.7rem;
		color: #999;
		margin-top: 0.8rem
	}

	.price-bottom {
		color: rgb(221, 183, 102);
		font-family: Alibaba;
		font-size: 1rem;
		font-weight: 500;
		margin-top: 0.8rem
	}
</style>
