<template>
	<app-layout>
		<view class="no-list " v-if="list.length==0">
			<image  src="https://cashier.qicuo.com/app/static/image/order-empty.png"></image>
			<view >暂无红包记录</view>
		</view>
		<view class="log-list dir-top-nowrap main-center " v-for="(item,index) in list" :key="index">
			<view class="main-between cross-center log-item ">
				<view class="dir-left-nowrap cross-center ">
					<view class="name t-omit ">{{item.activity_name}}</view>
				</view>
				<view  v-if="item.type==1">已领取</view>
				<view class="dir-right-nowrap cross-center " v-else>
					<image class="arrow " src="https://cashier.qicuo.com/app/static/image/icon/red-arrow.png"></image>
					<view  style="color:#ff4544;">{{item.type==0?'未领取':'已过期'}}</view>
				</view>
			</view>
			<view class="dir-left-nowrap cross-center log-item reward ">
				<image class="status " :src="'./../image/'+item.status+'.png'"></image>
				<view class="name t-omit ">{{item.name}}</view>
			</view>
			<view class="log-time ">{{item.time}}</view>
			<view @click="toGet" class="click-space " v-if="item.type!=1">
			</view>
		</view>
		<view class="get-dialog main-center cross-center " v-if="clearView">
			<view class="get-item clear " v-if="clearItem">
				<image @click="clearView = false" class="close-btn " src="./../image/close.png"></image>
				<image class="get-bg " src="./../image/success.png"></image>
				<view
					:class="['clear-item dir-top-nowrap main-center ',clearItem.status=='goods'&&clearItem.exchange_type=='offline'?'goods':'']">
					<view class="clear-title ">添加客服兑换奖品</view>
					<view class="clear-content " v-if="clearItem.status=='goods'">获得以下赠品</view>
					<view class="clear-content " v-if="clearItem.status=='cash'">获得<text
							>{{clearItem.real_reward}}</text>元现金红包</view>
					<view  v-if="clearItem.status=='cash'">请添加客服兑现红包</view>
					<view class="clear-goods-item dir-left-nowrap cross-center " v-if="clearItem.status=='goods'">
						<view class="clear-goods-left main-center cross-center ">
							<image class="goods-img " :src="clearItem.cover_pic"></image>
						</view>
						<view class="dir-top-nowrap main-center clear-goods-right ">
							<view class="t-omit-two ">{{clearItem.name}}</view>
						</view>
					</view>
				</view>
				<view class="clear-qr-item dir-top-nowrap main-center cross-center ">
					<image class="clear-qr " :src="contact.qrcode"></image>
					<view  v-if="clearItem.status=='goods'">{{is_not_wechat?'添加客服兑换奖品':'长按识别联系人兑现红包'}}
					</view>
					<view  v-if="clearItem.end_at">{{'兑换期限：'+clearItem.end_at}}</view>
					<view class="main-between cross-center clear-btn ">
						<view @click="copy"  v-if="is_not_wechat">复制微信号</view>
						<view @click="saveImg" v-if="is_not_wechat">保存图片</view>
						<view @click="copy" class="alone " v-if="!is_not_wechat">复制微信号</view>
					</view>
				</view>
			</view>
		</view>
		<view class="error-dialog main-center cross-center " v-if="time">
			<view class="error-content ">
				<view class="error-msg dir-top-nowrap main-center cross-center ">
					<view class="error-time ">该奖品已超出兑换期限，无法领取</view>
					<view >{{'兑换期限:'+time}}</view>
				</view>
				<view @click="time = false" class="error-submit ">我知道了</view>
			</view>
		</view>
	</app-layout>
</template>

<script>
	export default {
		data() {
			return {
				is_not_wechat: !0,
				clearView: !1,
				clearItem: null,
				first: !0,
				list: [],
				page: 1,
				time: null,
				contact: null,
				over: !0
			}
		},
		methods: {
			copy: function() {
				this.$utils.uniCopy({
					data: this.contact.name,
					success: function() {
						uni.showToast({
							title: "复制成功"
						})
					}
				})
			},
			saveImg: function() {
				this.$utils.batchSave(this.contact.qrcode).then(function(n) {
					uni.showToast({
						title: "保存成功",
						icon: "none"
					})
				})
			},
			toGet: function(n) {
				if (2 == n.type) this.time = n.end_at;
				else if ("online" == n.exchange_type) {
					var i = [{
							mch_id: 0,
							goods_list: [{
								id: n.id,
								attr: n.attr,
								num: 1,
								cat_id: 0,
								goods_attr_id: n.attr_id
							}],
							reward_log_id: n.reward_log_id
						}],
						o = "/pages/order-submit/order-submit?mch_list=".concat(JSON.stringify(i));
					o += "&preview_url=".concat(encodeURIComponent(this.$api.fission.order_preview), "&submit_url=")
						.concat(encodeURIComponent(this.$api.fission.order_submit), "&plugin=fission"), uni
					.navigateTo({
							url: o
						})
				} else this.clearView = !0, this.clearItem = n
			},
			getIndex: function() {
				var n = this,
					i = this;
				i.over = !0, i.$request({
					url: i.$api.fission.log,
					data: {
						page: this.page
					}
				}).then(function(o) {
					n.first = !1, i.$hideLoading(), uni.hideLoading(), 0 == o.code ? (i.contact = o.data
						.contact, i.list = 1 == n.page ? o.data.list : i.list.concat(o.data.list), 20 == o
						.data.list.length && (i.over = !1)) : uni.showToast({
						title: o.msg,
						icon: "none",
						duration: 1e3
					})
				}).catch(function(n) {
					uni.hideLoading(), i.$hideLoading()
				})
			}
		},
		onShow: function() {
			this.first || (uni.showLoading({
				title: "加载中..."
			}), this.page = 1, this.getIndex())
		},
		onLoad: function(t) {
			this.$commonLoad.onload(t), this.$showLoading({
				type: "global",
				text: "加载中..."
			}), this.getIndex()
		},
		onReachBottom: function() {
			this.over || (uni.showLoading({
				title: "加载中..."
			}), this.page++, this.getIndex())
		},
	}
</script>

<style lang="scss" scoped>
	.text-center {
		text-align: center
	}

	.font-weight {
		font-weight: bold
	}

	.page-width {
		width: 100%
	}

	.goods-hover-class {
		opacity: .9;
		background-color: #f7f7f7
	}

	.background-image {
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-position: center
	}

	.page-width {
		width: 100%
	}

	.u-hover-class {
		opacity: .9;
		background-color: #f7f7f7
	}

	.safe-area-inset-bottom {
		padding-bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom)
	}

	.no-list {
		text-align: center;
		margin-top: 200rpx;
		font-size: 24rpx;
		color: #666666
	}

	.no-list image {
		width: 240rpx;
		height: 240rpx;
		margin-bottom: 20rpx
	}

	.log-list {
		height: 228rpx;
		border-bottom: 2rpx solid #e2e2e2;
		background-color: #fff;
		padding: 0 26rpx;
		position: relative
	}

	.log-list .click-space {
		position: absolute;
		right: 0;
		z-index: 10;
		width: 200rpx;
		top: 0;
		height: 100%
	}

	.log-list .log-item {
		font-size: 28rpx;
		color: #353535
	}

	.log-list .log-item.reward {
		height: 90rpx
	}

	.log-list .log-item .status {
		width: 30rpx;
		height: 30rpx;
		margin-right: 22rpx
	}

	.log-list .log-item .name {
		width: 385rpx
	}

	.log-list .log-item .arrow {
		width: 12rpx;
		height: 22rpx;
		margin-left: 10rpx
	}

	.log-list .log-time {
		color: #666666;
		font-size: 24rpx
	}

	.error-dialog {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 30
	}

	.error-dialog .error-content {
		width: 630rpx;
		height: 362rpx;
		margin-top: -20%;
		background-color: #fff;
		border-radius: 16rpx;
		position: relative;
		z-index: 100
	}

	.error-dialog .error-content .error-msg {
		height: 274rpx;
		width: 630rpx;
		font-size: 28rpx;
		color: #666666;
		text-align: center
	}

	.error-dialog .error-content .error-msg .error-time {
		font-size: 32rpx;
		color: #353535;
		margin-bottom: 24rpx
	}

	.error-dialog .error-content .error-submit {
		position: absolute;
		z-index: 100;
		bottom: 0;
		left: 0;
		width: 100%;
		border-top: 2rpx solid #e2e2e2;
		line-height: 88rpx;
		height: 88rpx;
		color: #ff4544;
		font-size: 34rpx;
		text-align: center
	}

	.get-dialog {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 30
	}

	.get-dialog .get-item {
		width: 528rpx;
		position: relative;
		z-index: 100;
		height: 690rpx;
		margin-top: -20%
	}

	.get-dialog .get-item.clear {
		width: 582rpx;
		height: 869rpx
	}

	.get-dialog .get-item.clear .close-btn {
		top: 38rpx
	}

	.get-dialog .get-item.clear .clear-item {
		position: absolute;
		z-index: 100;
		top: 210rpx;
		left: 0;
		right: 0;
		width: 498rpx;
		margin: 0 auto;
		text-align: center;
		font-size: 24rpx;
		color: #999999
	}

	.get-dialog .get-item.clear .clear-item.goods {
		top: 190rpx
	}

	.get-dialog .get-item.clear .clear-item .clear-title {
		color: #353535;
		font-size: 40rpx;
		font-weight: 600
	}

	.get-dialog .get-item.clear .clear-item .clear-content {
		color: #353535;
		font-size: 26rpx;
		margin: 20rpx 0 16rpx
	}

	.get-dialog .get-item.clear .clear-item .clear-content.no-text {
		margin: 26rpx 0
	}

	.get-dialog .get-item.clear .clear-item .clear-content text {
		font-size: 46rpx;
		font-family: DIN;
		font-weight: 600;
		color: #ff4544
	}

	.get-dialog .get-item.clear .clear-item .clear-goods-item {
		margin: 0 auto;
		background-color: #f7f7f7;
		width: 286rpx;
		height: 96rpx;
		border-radius: 16rpx
	}

	.get-dialog .get-item.clear .clear-item .clear-goods-item .clear-goods-left {
		width: 96rpx;
		height: 96rpx
	}

	.get-dialog .get-item.clear .clear-item .clear-goods-item .clear-goods-left .goods-img {
		width: 76rpx;
		height: 76rpx;
		border-radius: 8rpx
	}

	.get-dialog .get-item.clear .clear-item .clear-goods-item .clear-goods-right {
		width: 190rpx;
		height: 96rpx;
		color: #353535;
		font-size: 24rpx
	}

	.get-dialog .get-item.clear .clear-item .clear-goods-item .clear-goods-right view {
		text-align: left
	}

	.get-dialog .get-item.clear .clear-qr-item {
		position: absolute;
		bottom: 34rpx;
		z-index: 100;
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 520rpx;
		height: 354rpx;
		color: #fff;
		font-size: 24rpx
	}

	.get-dialog .get-item.clear .clear-qr-item .clear-qr {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
		-webkit-flex-shrink: 0;
		-ms-flex-negative: 0;
		flex-shrink: 0
	}

	.get-dialog .get-item.clear .clear-qr-item .clear-tip {
		margin-top: -15rpx
	}

	.get-dialog .get-item.clear .clear-qr-item .clear-btn {
		margin-top: 25rpx;
		height: 78rpx;
		width: 100%
	}

	.get-dialog .get-item.clear .clear-qr-item .clear-btn .alone {
		width: 500rpx
	}

	.get-dialog .get-item.clear .clear-qr-item .clear-btn view {
		text-align: center;
		line-height: 78rpx;
		background-color: #fce5a1;
		color: #cb0908;
		margin: 0 20rpx;
		width: 240rpx;
		height: 78rpx;
		border-radius: 39rpx
	}

	.get-dialog .get-item .get-bg {
		width: 100%;
		height: 100%
	}

	.get-dialog .get-item .close-btn {
		width: 55rpx;
		height: 55rpx;
		position: absolute;
		top: -55rpx;
		right: -55rpx;
		z-index: 31
	}
</style>
