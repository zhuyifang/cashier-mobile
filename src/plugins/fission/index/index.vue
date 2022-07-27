<template>
	<app-layout>
		<view v-if="!getSuccess">
			<app-buy-prompt :height="height" :url="url"></app-buy-prompt>
			<view class="rule" @click="toRule" v-if="setting">活动规则</view>
			<image class="log-btn" @click="toLog" src="./../image/log.png" v-if="setting"></image>
			<image class="head-img"
				:src="setting.activity_bg_pic?setting.activity_bg_pic:setting.default_activity_bg_pic"></image>
			<view class="activity" :style="bgStype" v-if="setting">
				<view class="activity-name dir-top-nowrap main-center cross-center" v-if="detail&&detail.name||msg">
					<view class="activity-name-v">{{(detail.name?detail.name:'')+' '+(msg?msg:'正在进行中')}}</view>
					<view v-if="detail.start_time&&detail.end_time" class="activity-name-v">
						{{detail.start_time+'至'+detail.end_time}}
					</view>
					<view class="activity-name-v stage main-center" v-if="detail.style==2">
						<view class="hb dir-top-nowrap main-center cross-center" @click="handle(item)"
							v-for="(item,index) in rewards" :key="index">
							<image class="hb-image" :src="'./../image/hb-'+setting.style+'-active.png'" v-if="item.is_exchange>-1">
							</image>
							<image class="hb-image" :src="setting.style_pic" v-else></image>
							<view class="mask" v-if="item.people_number>0&&item.is_exchange==-2">
								<image class="lock-icon" src="./../image/lock.png"></image>
							</view>
							<image class="hb-image reward-user" :src="userInfo.avatar" v-if="item.is_exchange>-2&&item.type==0">
							</image>
							<view class="reward-text dir-top-nowrap cross-center main-center"
								v-if="(item.status=='balance'||item.status=='cash')&&item.is_exchange>-1">
								<view>{{item.real_reward+'元'}}</view>
								<view>{{item.status=='balance'?'商城余额':'现金红包'}}</view>
							</view>
							<view class="reward-text dir-top-nowrap cross-center main-center"
								v-if="item.status=='integral'&&item.is_exchange>-1">
								<view>{{item.real_reward+'积分'}}</view>
							</view>
							<view class="reward-text dir-top-nowrap cross-center main-center"
								v-if="(item.status=='card'||item.status=='coupon')&&item.is_exchange>-1">
								<image class="card-img" :src="item.card.pic_url" v-if="item.status=='card'">
								</image>
								<view v-if="item.status=='coupon'">
									{{''+(item.coupon.type==2?'￥':'')+''}}<text>{{item.coupon.type==2?item.coupon.sub_price:item.coupon.discount}}</text>{{''+(item.coupon.type==1?'折':'')+''}}
								</view>
								<view class="t-omit">{{item.status=='coupon'?item.coupon.name:item.card.name}}</view>
							</view>
							<view class="reward-text dir-top-nowrap cross-center main-center"
								v-if="item.status=='goods'&&item.is_exchange>-1">
								<image class="card-img" :src="item.goods.cover_pic"></image>
								<view class="t-omit">{{item.goods.name}}</view>
							</view>
							<view v-if="item.is_exchange==-2">{{item.people_number+'人解锁'}}</view>
							<block v-else>
								<view v-if="item.is_exchange==-1">可解锁</view>
								<view  v-else>已领取</view>
							</block>
						</view>
					</view>
				</view>
				<view class="hb-list dir-left-wrap">
					<view :style="'width:'+(item.list?item.number*134+'rpx':'')+';'" v-for="(item,index) in number"
						:key="index">
						<view class="dir-left-wrap" v-if="item.list">
							<view @click="handle(item)" v-for="(obj,index) in item.list" :key="index">
								<view class="hb">
									<image class="hb-bg" :src="'./../image/hb-'+setting.style+'-active.png'"
										v-if="obj.is_exchange>-1"></image>
									<image class="hb-bg" :src="setting.style_pic" v-else></image>
									<image class="reward-user" :src="obj.reward.avatar"
										v-if="obj.is_exchange!=-2&&obj.level=='small'"></image>
									<view class="reward-text t-omit" v-if="obj.is_exchange!=-2&&obj.level=='small'">
										{{obj.reward.nickname}}
									</view>
									<view class="send-text">
										{{obj.is_exchange==-2?'发送好友':obj.reward.status=='coupon'?obj.reward.coupon.type==2?'领到满减券':'领到打折券':'领到'+obj.reward.real_reward+'元'}}
									</view>
								</view>
							</view>
						</view>
						<view :class="['hb',detail.style==1&&item.level!='small'?'big':'']" @click="handle(item)"
							v-else>
							<image class="hb-bg" :src="'./../image/hb-'+setting.style+'-active.png'"
								v-if="item.is_exchange>-1"></image>
							<image class="hb-bg" :src="setting.style_pic"
								:style="'border-radius:'+(item.level!='small'?radius:'')+';'" v-else></image>
							<view class="mask" :style="'border-radius:'+radius+';'"
								v-if="detail.style==1&&item.level!='small'&&item.is_exchange==-2">
								<image class="lock-icon" src="./../image/lock.png"></image>
								<view class="need-people">{{'分享'+item.people_number+'人解锁'}}</view>
							</view>
							<image class="reward-user" :src="userInfo.avatar"
								v-if="item.is_exchange>-1&&item.type==0&&item.level!='small'"></image>
							<view class="need-people" v-if="item.is_exchange==-1&&item.type!=0">已达到解锁条件</view>
							<view class="reward-text dir-top-nowrap cross-center main-center"
								v-if="(item.status=='balance'||item.status=='cash')&&item.is_exchange>-1">
								<view> <text class="reward-text-t">{{item.real_reward}}</text>元</view>
								<view class="big-text" v-if="detail.style==1&&item.type!=0">
									{{item.status=='balance'?'商城余额':'现金红包'}}
								</view>
							</view>
							<view class="reward-text dir-top-nowrap cross-center main-center"
								v-if="item.status=='integral'&&item.is_exchange>-1">
								<view> <text class="reward-text-t">{{item.real_reward}}</text>积分</view>
							</view>
							<view class="reward-text pic dir-top-nowrap cross-center main-center"
								v-if="(item.status=='card'||item.status=='goods')&&item.is_exchange>-1">
								<image class="reward-card" :src="item.card.pic_url" v-if="item.status=='card'">
								</image>
								<image class="reward-goods" :src="item.goods.cover_pic" v-if="item.status=='goods'">
								</image>
								<view class="t-omit">{{item.status=='goods'?item.goods.name:item.card.name}}</view>
							</view>
							<view
								:class="['reward-text dir-top-nowrap cross-center main-center',detail.style==1?'t-omit':'']"
								v-if="item.status=='coupon'&&item.is_exchange>-1">
								<view v-if="detail.style==1">{{''+(item.coupon.type==2?'￥':'')+''}}<text class="reward-text-t">
										{{item.coupon.type==2?item.coupon.sub_price:item.coupon.discount}}</text>{{''+(item.coupon.type==1?'折':'')+''}}
								</view>
								<view class="t-omit">
									{{detail.style==2||item.type==0?item.coupon.type==2?'满减券':'打折券':item.coupon.name}}
								</view>
							</view>
							<image class="reward-user" :src="item.reward.avatar"
								v-if="item.is_exchange!=-2&&item.level=='small'"></image>
							<view class="reward-text t-omit" v-if="item.is_exchange!=-2&&item.level=='small'">
								{{item.reward.nickname}}
							</view>
							<view class="send-text" v-if="item.level=='small'">
								{{item.is_exchange==-2?'发送好友':item.reward.status=='coupon'?item.reward.coupon.type==2?'领到满减券':'领到打折券':'领到'+item.reward.real_reward+'元'}}
							</view>
							<block v-else>
								<view class="send-text" v-if="detail.style==2&&item.level!='small'">
									{{item.is_exchange>-1?'已领取':'点我领取'}}
								</view>
								<view class="send-text" v-else>
									{{item.is_exchange==-2?'我的红包':item.is_exchange==-1?'点我领取':'已领取'}}
								</view>
							</block>
						</view>
					</view>
				</view>
			</view>
			<view class="get-dialog main-center cross-center" v-if="getView">
				<view class="get-item" @click="toGet">
					<image @click="getView = false" class="close-btn" src="https://cashier.qicuo.com/app/static/image/icon/invalid.png"></image>
					<view class="get-text dir-top-nowrap main-center cross-center">
						<view class="invite_user dir-top-nowrap main-center cross-center" v-if="invite_user">
							<image :src="invite_user.avatar"></image>
							<view class="t-omit">{{invite_user.nickname}}</view>
						</view>
						<view class="main-text">{{invite_user?'送你一个红包':'点我领红包'}}</view>
						<view :style="'margin-top:'+(invite_user_id>0?'35rpx':'70rpx')+';'">恭喜发财，大吉大利！
						</view>
					</view>
					<image class="get-bg" src="./../image/get.png"></image>
				</view>
			</view>
			<view class="get-dialog main-center cross-center" v-if="shareView">
				<view class="get-item">
					<image @click="shareView = false" class="close-btn" src="https://cashier.qicuo.com/app/static/image/icon/invalid.png"></image>
					<view class="item-info dir-top-nowrap main-center">
						<view
							:class="['reward-lock-text',shareItem.coupon&&shareItem.coupon.total_count>0?'more-place':'']"
							v-if="shareItem.type!=0">解锁此关卡，即可获得</view>
						<view class="item-about" v-if="shareItem.status=='balance'||shareItem.status=='cash'">
							<text>{{shareItem.max_number>0?shareItem.max_number:shareItem.min_number}}</text>元
						</view>
						<view class="item-about" v-if="shareItem.status=='integral'">
							<text>{{shareItem.min_number}}</text>积分</view>
						<block v-else>
							<view class="item-about t-omit less-marging" v-if="shareItem.status=='coupon'">
								<view v-if="shareItem.coupon.type==2">
									￥<text>{{shareItem.coupon.sub_price}}</text>{{''+(shareItem.coupon.type==2?' 满减券':' 打折券')+''}}
								</view>
								<view v-else>
									<text>{{shareItem.coupon.discount}}</text>{{'折\n '+(shareItem.coupon.type==2?' 满减券':' 打折券')+''}}
								</view>
							</view>
							<block v-else>
								<view class="item-about t-omit card-name" v-if="shareItem.status=='card'">
									{{shareItem.card.name}}
								</view>
								<block v-else>
									<view class="item-about t-omit card-name" v-if="shareItem.status=='goods'">
										{{shareItem.goods.name}}
									</view>
								</block>
							</block>
						</block>
						<view v-if="shareItem.type==0">红包已包好，赶紧分享给好友吧！</view>
						<view v-if="shareItem.type!=0&&shareItem.goods&&shareItem.goods.stock>0">
							{{'剩余'+shareItem.goods.stock+'件'}}
						</view>
						<view v-if="shareItem.type!=0&&shareItem.card&&shareItem.card.total_count>0">
							{{'剩余'+shareItem.card.total_count+'件'}}
						</view>
						<view v-if="shareItem.type!=0&&shareItem.coupon&&shareItem.coupon.total_count>0">
							{{'剩余'+shareItem.coupon.total_count+'件'}}
						</view>
					</view>
					<view class="dir-top-nowrap button-item"> 
						<button class="to-share" openType="share">发给好友</button>
						<button @click="roPoster" class="to-share">生成海报</button> 
					</view>
					<image class="get-bg" src="./../image/share.png"></image>
				</view>
			</view>
			<view class="get-dialog main-center cross-center" v-if="clearView">
				<view class="get-item clear" v-if="clearItem">
					<image @click="clearItem = false" class="close-btn" src="./../image/close.png"></image>
					<image class="get-bg" src="./../image/success.png"></image>
					<view
						:class="['clear-item dir-top-nowrap main-center',clearItem.reward.status=='goods'&&clearItem.reward.exchange_type=='offline'?'goods':'']">
						<view class="clear-title">恭喜您解锁成功</view>
						<view class="clear-content no-text" v-if="clearItem.reward.status=='card'">获得1张卡券</view>
						<view class="clear-content no-text" v-if="clearItem.reward.status=='coupon'">获得1张优惠券
						</view>
						<view class="clear-content" v-if="clearItem.reward.status=='goods'">获得以下奖品</view>
						<view class="clear-content" v-if="clearItem.reward.status=='balance'">
							获得<text>{{clearItem.real_reward}}</text>元余额</view>
						<view class="clear-content" v-if="clearItem.reward.status=='cash'">
							获得<text>{{clearItem.real_reward}}</text>元现金红包</view>
						<view class="clear-content" v-if="clearItem.reward.status=='integral'">
							获得<text>{{clearItem.real_reward}}</text>积分</view>
						<view v-if="clearItem.reward.status=='cash'">请添加客服兑现红包</view>
						<view class="clear-goods-item dir-left-nowrap cross-center"
							v-if="clearItem.reward.status=='goods'&&clearItem.reward.exchange_type=='offline'">
							<view class="clear-goods-left main-center cross-center">
								<image class="goods-img" :src="clearItem.reward.goods.cover_pic"></image>
							</view>
							<view class="dir-top-nowrap main-center clear-goods-right">
								<view class="t-omit-two">{{clearItem.reward.goods.name}}</view>
							</view>
						</view>
						<view @click="toDetail(clearItem)" class="main-center" v-if="clearItem.reward.exchange_type!='offline'">
							<view class="clear-detail">
								{{clearItem.reward.status=='goods'?'立即兑换':clearItem.reward.status=='card'||clearItem.reward.status=='coupon'?'立即使用':'去看看'}}
							</view>
						</view>
					</view>
					<view class="clear-qr-item dir-top-nowrap main-center cross-center"
						v-if="clearItem.reward.exchange_type=='offline'&&(clearItem.reward.status=='goods'||clearItem.reward.status=='cash')">
						<image class="clear-qr" :src="setting.contact_list[contactIndex].qrcode"></image>
						<view v-if="clearItem.reward.status=='goods'">
							{{is_not_wechat?'添加客服兑换奖品':'长按识别联系人兑现红包'}}
						</view>
						<view v-if="clearItem.expire_at">{{'兑换期限：'+clearItem.expire_at}}</view>
						<view class="main-between cross-center clear-btn">
							<view @click="copy" v-if="is_not_wechat">复制微信号</view>
							<view @click="saveImg" v-if="is_not_wechat">保存图片</view>
							<view @click="copy" class="alone" v-if="!is_not_wechat">复制微信号</view>
						</view>
					</view>
					<block v-else>
						<view class="clear-gift-item dir-top-nowrap main-center cross-center"
							v-if="clearItem.reward.status=='balance'||clearItem.reward.status=='integral'">
							<image class="clear-gift" src="./../image/gift.png"></image>
						</view>
						<view class="clear-card-item dir-left-nowrap cross-center" v-else>
							<view class="clear-card-left main-center cross-center"
								v-if="clearItem.reward.status=='coupon'">
								<view v-if="clearItem.reward.coupon.type==2">
									￥<text>{{clearItem.reward.coupon.sub_price}}</text> </view>
								<view v-else> <text>{{clearItem.reward.coupon.discount}}</text>折</view>
							</view>
							<view class="clear-card-left main-center cross-center"
								v-if="clearItem.reward.status=='card'">
								<image class="card-img" :src="clearItem.reward.card.pic_url"></image>
							</view>
							<view class="clear-card-left main-center cross-center"
								v-if="clearItem.reward.status=='goods'">
								<image class="goods-img" :src="clearItem.reward.goods.cover_pic"></image>
							</view>
							<view class="dir-top-nowrap main-center clear-card-right"
								v-if="clearItem.reward.status=='coupon'">
								<view class="t-omit" v-if="clearItem.reward.coupon.min_price>0">
									{{'满'+clearItem.reward.coupon.min_price+'可用'}}
								</view>
								<view v-else>无门槛使用</view>
								<view class="coupon-type t-omit" v-if="clearItem.reward.coupon.appoint_type=='3'">
									全场通用</view>
								<block v-else>
									<view class="coupon-type t-omit" v-if="clearItem.reward.coupon.appoint_type=='4'">
										仅限当面付活动使用</view>
									<block v-else>
										<view class="coupon-type t-omit"
											v-if="clearItem.reward.coupon.appoint_type=='5'">仅限礼品卡使用</view>
										<view class="coupon-type t-omit " v-else>限品类</view>
									</block>
								</block>
							</view>
							<view class="dir-top-nowrap main-center clear-card-right "
								v-if="clearItem.reward.status=='card'">
								<view class="t-omit-two ">{{clearItem.reward.card.name}}</view>
							</view>
							<view class="dir-top-nowrap main-center clear-card-right "
								v-if="clearItem.reward.status=='goods'">
								<view class="t-omit-two ">{{clearItem.reward.goods.name}}</view>
							</view>
						</view>
					</block>
					<view class="clear-time "
						v-if="clearItem.reward.status=='goods'&&clearItem.reward.exchange_type!='offline'&&clearItem.expire_at">
						{{'兑换期限：'+clearItem.expire_at}}
					</view>
				</view>
			</view>
			<view class="error-dialog main-center cross-center " v-if="errorDialog">
				<view class="error-content ">
					<view class="error-msg dir-top-nowrap main-center cross-center ">
						<view class="error-time ">{{msg}}</view>
					</view>
					<view @click="errorDialog = false" class="error-submit ">我知道了</view>
				</view>
			</view>
			<app-share-qr-code :requestData="requestData" :shareView="!posterDialog" :theme="getTheme" :url="poster"
				:value="posterDialog" v-if="posterDialog"></app-share-qr-code>
		</view>
		<view  v-else>
			<view class="reward-item " v-if="first_rewards">
				<image class="reward-item-img" src="./../image/reward.png"></image>
				<view class="dir-top-nowrap main-center cross-center top-text ">
					<view >恭喜您获得<text  v-if="!invite_user">{{successType}}</text>
					</view>
					<view  v-if="invite_user"> <text
							class="invite ">{{invite_user.nickname}}</text>{{'分享的'+successType}}</view>
				</view>
				<view class="coupon " v-if="first_rewards.status=='coupon'">
					<view >{{first_rewards.coupon.name}}</view>
					<view class="coupon-detail ">
						<block v-if="first_rewards.coupon.type==2">￥<text
								>{{first_rewards.coupon.sub_price}}</text> </block>
						<block v-else> <text >{{first_rewards.coupon.discount}}</text>折</block>
					</view>
				</view>
				<view class="get-money " v-else> <text class="get-money-t">{{first_rewards.real_reward}}</text> </view>
				<view @click="toUse" class="use-btn ">
					{{first_rewards.status=='coupon'?'立即使用':first_rewards.status=='balance'?'余额记录':'去提现'}}
				</view>
				<view class="btn-item "> <button class="to-send " openType="share">我也要发红包给好友</button>
					<view @click="backMyself" class="go-back ">查看我的红包墙</view>
				</view>
			</view>
			<app-related-suggestion-product :commentStyle="comment_style" :list="recommendGoodsList" text="您或许会喜欢"
				:theme="getTheme" v-if="recommendGoodsList&&recommendGoodsList.length"></app-related-suggestion-product>
			<view class="get-dialog " v-if="qrView">
				<view class="get-item qr-view ">
					<image @click="qrView = false" class="close-btn " src="./../image/close.png"></image>
					<view class="get-content dir-top-nowrap main-center cross-center ">
						<image class="get-qr " :src="setting.contact_list[contactIndex].qrcode"></image>
						<view >长按识别联系人兑现红包</view>
						<view class="get-custom " :style="'color:'+setting.custom_color+';'">{{setting.custom}}
						</view>
						<view @click="copy" class="get-copy ">复制微信号</view>
					</view>
					<image class="get-bg " :src="setting.bg_pic"></image>
				</view>
			</view>
		</view>
	</app-layout> 
</template>

<script>
	import { mapGetters, mapState } from 'vuex';
	import appBuyPrompt from '@/components/page-component/app-buy-prompt/app-buy-prompt.vue';
	import appShareQrCode from '@/components/page-component/app-share-qr-code-poster/app-share-qr-code-poster.vue';
	import AppRelatedSuggestionProduct from '@/components/page-component/app-related-suggestion-product/app-related-suggestion-product.vue'
	export default {
		data() {
			return {
				getSuccess: !1,
				is_not_wechat: !0,
				qrView: !1,
				posterDialog: !1,
				poster: this.$api.fission.poster,
				errorDialog: !1,
				requestData: null,
				msg: "",
				url: this.$api.fission.purchase,
				clearItem: null,
				first: !0,
				invite_user: null,
				getView: !1,
				clearView: !1,
				shareView: !1,
				shareItem: null,
				first_rewards: null,
				detail: {
					style: 1,
					number: 100
				},
				activity_log_id: 0,
				setting: {},
				number: [],
				child_user: [],
				recommendGoodsList: [],
				comment_style: null,
				height: 854,
				rewards: [],
				contactIndex: 0,
				invite_user_id: 0,
				activity_id: 0,
				type: 2,
				radius: "22rpx",
				successType: "红包"
			}
		},
		computed: {
			...mapGetters('mallConfig', {
				getTheme: 'getTheme',
			}),
			...mapState({
				userInfo: state => state.user.info
			}),
			bgStype: function() {
				var e = "min-height:".concat(this.height, "rpx;");
				return "gradient" == this.setting.activity_bg_style ? e += "background:linear-gradient(to bottom, "
					.concat(this.setting.activity_bg_color, ", ").concat(this.setting.activity_bg_gradient_color,
					");") : e += "background: ".concat(this.setting.activity_bg_color)
			}
		},
		onShow: function() {
			!this.first && this.activity_id > 0 && !this.getSuccess && (uni.showLoading({
				mask: !0
			}), this.getIndex())
		},
		onShareAppMessage: function() {
			return this.hShareAppMessage()
		},
		onShareTimeline: function() {
			var e = "送你一个";
			"cash" != this.first_rewards.status && "cash" != this.first_rewards.status || (e += this
				.first_rewards.max_number > 0 ? this.first_rewards.max_number + "元" : this.first_rewards
				.min_number + "元"), e += "红包，速领！"
			return  this.$shareTimeline({
				title: this.detail.app_share_title ? this.detail.app_share_title : e,
				imageUrl: this.detail.app_share_pic,
				query: {
					activity_id: this.detail.id,
					invite_user_id: this.userInfo.options.user_id
				}
			})
		},
		onLoad: function(t) {
			this.$commonLoad.onload(t), this.$showLoading({
					type: "global",
					text: "加载中..."
				}), uni.showShareMenu({
					menus: ["shareAppMessage", "shareTimeline"]
				}), this.activity_id = t.activity_id ? t.activity_id : 0, this.invite_user_id = t.invite_user_id ? t
				.invite_user_id : 0, this.height = 2 * uni.getSystemInfoSync().windowHeight - 480, this.getSetting()
		},
		components: {
			appBuyPrompt,
			appShareQrCode,
			AppRelatedSuggestionProduct
		},
		methods: {
			hShareAppMessage: function() {
				var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
				this.shareView = !1;
				var t = "送你一个";
				"cash" != this.first_rewards.status && "cash" != this.first_rewards.status || (t += this
						.first_rewards.max_number > 0 ? this.first_rewards.max_number + "元" : this.first_rewards
						.min_number + "元"), t += "红包，速领！"
				return this.$shareAppMessage({
						title: this.detail.app_share_title ? this.detail.app_share_title : t,
						imageUrl: this.detail.app_share_pic,
						path: "/plugins/fission/index/index",
						params: {
							activity_id: this.detail.id,
							invite_user_id: this.userInfo.options.user_id
						}
					}, e)
			},
			toDetail: function(t) {
				if ("coupon" == t.reward.status) uni.navigateTo({
					url: "/pages/goods/list?coupon_id=".concat(t.reward.coupon.id)
				});
				else if ("card" == t.reward.status) uni.navigateTo({
					url: "/pages/card/details/details?id=".concat(t.reward.card.user_card_id)
				});
				else if ("balance" == t.reward.status) uni.navigateTo({
					url: "/pages/balance/balance"
				});
				else if ("integral" == t.reward.status) uni.navigateTo({
					url: "/pages/user-center/integral-detail/integral-detail"
				});
				else if ("goods" == t.reward.status) {
					var i = [{
							mch_id: 0,
							goods_list: [{
								id: t.reward.goods.id,
								attr: t.reward.goods.attr,
								num: 1,
								cat_id: 0,
								goods_attr_id: t.reward.goods.attr_id
							}],
							reward_log_id: t.id
						}],
						r = "/pages/order-submit/order-submit?mch_list=".concat(JSON.stringify(i));
					r += "&preview_url=".concat(encodeURIComponent(this.$api.fission.order_preview), "&submit_url=")
						.concat(encodeURIComponent(this.$api.fission.order_submit), "&plugin=fission"), uni
					.navigateTo({
							url: r
						})
				}
				this.clearView = !1
			},
			saveImg: function() {
				this.$utils.batchSave(this.setting.contact_list[this.contactIndex].qrcode).then(function(t) {
					uni.showToast({
						title: "保存成功",
						icon: "none"
					})
				})
			},
			copy: function() {
				this.$utils.uniCopy({
					data: this.setting.contact_list[this.contactIndex].name,
					success: function() {
						uni.showToast({
							title: "复制成功"
						})
					}
				})
			},
			handle: function(e) {
				if (this.msg) return this.errorDialog = !0, !1;
				this.shareView = !1, -2 == e.is_exchange ? ("small" != e.level ? this.shareItem = JSON.parse(JSON
						.stringify(e)) : this.shareItem = JSON.parse(JSON.stringify(this.first_rewards)), this
					.shareView = !0) : -1 == e.is_exchange && "small" != e.level && (0 == e.type ? this.toGet() :
					this.toUnite(e.reward_id))
			},
			toPoster: function() {
				this.requestData = {
					activity_id: this.activity_id
				}, this.posterDialog = !0, this.shareView = !1
			},
			toUnite: function(t) {
				var i = this,
					r = this;
				uni.showLoading({
					title: "领取中...",
					mask: !0
				}), r.$request({
					url: r.$api.fission.unite,
					data: {
						activity_log_id: this.activity_log_id,
						reward_id: t
					},
					method: "post"
				}).then(function(t) {
					uni.hideLoading(), 0 == t.code ? (i.clearView = !0, i.clearItem = t.data, i.getIndex()) :
						uni.showToast({
							title: t.msg,
							icon: "none",
							duration: 1e3
						})
				}).catch(function(t) {
					uni.hideLoading()
				})
			},
			toRule: function() {
				this.detail.id && uni.navigateTo({
					url: "/pages/rules/index?url=".concat(encodeURIComponent(this.$api.fission.activity),
						"&data=").concat(JSON.stringify({
						activity_id: this.detail.id,
						invite_user_id: this.invite_user_id
					}), "&keys=").concat(JSON.stringify(["activity", "rule_content"]), "&title=").concat(
						this.detail.rule_title)
				})
			},
			toLog: function() {
				uni.navigateTo({
					url: "/plugins/fission/log/log"
				})
			},
			toGet: function() {
				this.$showLoading({
					type: "global",
					text: "领取中..."
				}), this.getActivity(), this.loadRecommendGoodsList()
			},
			toUse: function() {
				"coupon" == this.first_rewards.status ? uni.navigateTo({
					url: "/pages/goods/list?coupon_id=".concat(this.first_rewards.coupon.id)
				}) : "balance" == this.first_rewards.status ? uni.navigateTo({
					url: "/pages/balance/balance"
				}) : this.qrView = !0
			},
			loadRecommendGoodsList: function() {
				var e = this;
				this.$request({
					url: this.$api.goods.new_recommend,
					method: "get",
					data: {
						type: "order_pay"
					}
				}).then(function(t) {
					0 === t.code && (e.recommendGoodsList = t.data.list, e.comment_style = t.data
						.comment_style)
				}).catch(function() {})
			},
			getActivity: function() {
				var t = this,
					i = this;
				i.$request({
					url: i.$api.fission.activity,
					data: {
						activity_id: i.activity_id,
						is_open: 1,
						invite_user_id: i.invite_user_id
					},
					method: "post"
				}).then(function(r) {
					i.$hideLoading(), 0 == r.code ? (t.getView = !1, t.getSuccess = !0, t.detail = r.data
						.activity, t.first_rewards = r.data.first_rewards, t.first_rewards.real_reward >
						1e4 && (t.first_rewards.real_reward = t.first_rewards.real_reward.replace(t
							.first_rewards.real_reward.slice(-3), "...")), t.invite_user = r.data
						.invite_user, t.successType = "coupon" == r.data.first_rewards.status ? "优惠券" :
						"红包") : uni.showToast({
						title: r.msg,
						icon: "none",
						duration: 1e3
					})
				}).catch(function(e) {
					i.$hideLoading()
				})
			},
			getList: function() {
				var e = this,
					t = +this.detail.number - 1;
				if (1 == this.detail.style) {
					var i = JSON.parse(JSON.stringify(this.rewards));
					this.number = [], this.number.unshift(this.first_rewards);
					var r = 2,
						a = 3,
						n = 0,
						s = 0,
						o = -1,
						l = {
							people_number: t,
							level: "small"
						};
					for (var u in i.push(l), i)
						if (n = 0 == u ? 0 : i[u - 1].people_number, s = i[u].people_number - n, 2 * a > s) {
							for (var d = {
									list: [],
									number: 0
								}, c = 0; c < s; c++) {
								var h = {
									index: ++o,
									is_exchange: -2,
									level: "small",
									reward: null
								};
								d.list.push(h)
							}
							d.number = (d.list.length + d.list.length % 2) / 2, 1 == d.number && 2 == a && (d.number =
									2), 2 == d.number && 3 == a && (d.number = 3), 4 == d.number && (d.number = 5), d
								.number > 0 && this.number.push(d), "small" != i[u].level && this.number.push(i[u]),
								r = 0;
							var f = !0,
								_ = !1,
								p = void 0;
							try {
								for (var g, m = this.number[Symbol.iterator](); !(f = (g = m.next()).done); f = !0) {
									var v = g.value;
									v.number > 0 ? r += v.number : r += 2
								}
							} catch (e) {
								_ = !0, p = e
							} finally {
								try {
									f || null == m.return || m.return()
								} finally {
									if (_) throw p
								}
							}
							a = 5 - r % 5
						} else {
							for (var b = (s - 2 * a) / 10, w = {
									list: [],
									number: 0
								}, y = 0; y < 2 * a; y++) {
								s--;
								var x = {
									index: ++o,
									is_exchange: -2,
									level: "small",
									reward: null
								};
								w.list.push(x)
							}
							w.number = (w.list.length + w.list.length % 2) / 2, w.number > 0 && this.number.push(w),
								r = 0;
							var S = !0,
								$ = !1,
								O = void 0;
							try {
								for (var T, I = this.number[Symbol.iterator](); !(S = (T = I.next()).done); S = !0) {
									var L = T.value;
									L.number > 0 ? r += L.number : r += 2
								}
							} catch (e) {
								$ = !0, O = e
							} finally {
								try {
									S || null == I.return || I.return()
								} finally {
									if ($) throw O
								}
							}
							if (a = 5 - r % 5, b > 1)
								for (var P = 1; P < b; P++) {
									for (var V = {
											list: [],
											number: 0
										}, q = 0; q < 10; q++) {
										s--;
										var D = {
											index: ++o,
											is_exchange: -2,
											level: "small",
											reward: null
										};
										V.list.push(D)
									}
									V.number = (V.list.length + V.list.length % 2) / 2, V.number > 0 && this.number
										.push(V), a = 0
								}
							for (var k = {
									list: [],
									number: 0
								}, j = 0; j < s; j++) {
								var J = {
									index: ++o,
									is_exchange: -2,
									level: "small",
									reward: null
								};
								k.list.push(J)
							}
							k.number = (k.list.length + k.list.length % 2) / 2, 2 == k.number && 3 == a && (k.number =
									3), 4 == k.number && (k.number = 5), k.number > 0 && this.number.push(k),
								"small" != i[u].level && this.number.push(i[u]), r = 0;
							var M = !0,
								N = !1,
								A = void 0;
							try {
								for (var U, G = this.number[Symbol.iterator](); !(M = (U = G.next()).done); M = !0) {
									var R = U.value;
									R.number > 0 ? r += R.number : r += 2
								}
							} catch (e) {
								N = !0, A = e
							} finally {
								try {
									M || null == G.return || G.return()
								} finally {
									if (N) throw A
								}
							}
							a = 5 - r % 5
						} setTimeout(function() {
						a > 0 && e.number[e.number.length - 1].number && (e.number[e.number.length - 1]
							.number += a)
					})
				} else {
					this.number = [], this.number.push(this.first_rewards);
					for (var C = 0; C < t; C++) {
						var E = {
							index: C,
							is_exchange: -2,
							level: "small",
							reward: null
						};
						this.number.push(E)
					}
				}
				if (this.child_user.length > 0)
					for (var B in this.child_user) {
						var H = !0,
							Q = !1,
							W = void 0;
						try {
							for (var z, F = this.number[Symbol.iterator](); !(H = (z = F.next()).done); H = !0) {
								var K = z.value;
								if (K.list) {
									var X = !0,
										Y = !1,
										Z = void 0;
									try {
										for (var ee, te = K.list[Symbol.iterator](); !(X = (ee = te.next())
											.done); X = !0) {
											var ie = ee.value;
											ie.index == B && (ie.is_exchange = 1, ie.reward = this.child_user[B])
										}
									} catch (e) {
										Y = !0, Z = e
									} finally {
										try {
											X || null == te.return || te.return()
										} finally {
											if (Y) throw Z
										}
									}
								} else K.index == B && (K.is_exchange = 1, K.reward = this.child_user[B])
							}
						} catch (e) {
							Q = !0, W = e
						} finally {
							try {
								H || null == F.return || F.return()
							} finally {
								if (Q) throw W
							}
						}
					}
			},
			backMyself: function() {
				this.getSuccess = !1, this.getIndex()
			},
			getIndex: function() {
				var t = this,
					i = this;
				i.$request({
					url: i.$api.fission.activity,
					data: {
						activity_id: this.activity_id ? this.activity_id : 0,
						invite_user_id: this.invite_user_id ? this.invite_user_id : 0
					},
					method: "post"
				}).then(function(r) {
					if (i.$hideLoading(), uni.hideLoading(), 0 == r.code) {
						if (t.first = !1, t.detail = r.data.activity, t.activity_id = r.data.activity.id, t
							.activity_log_id = r.data.activity_log_id, t.first_rewards = r.data.first_rewards,
							t.first_rewards.real_reward > 1e3 && (t.first_rewards.real_reward = t.first_rewards
								.real_reward.replace(t.first_rewards.real_reward.slice(4 - t.first_rewards
									.real_reward.length), "...")), t.invite_user = r.data.invite_user, r.data
							.child_user) {
							t.child_user = r.data.child_user;
							var a = !0,
								n = !1,
								s = void 0;
							try {
								for (var o, l = t.child_user[Symbol.iterator](); !(a = (o = l.next())
									.done); a = !0) {
									var u = o.value;
									u.real_reward > 1e3 && (u.real_reward = u.real_reward.replace(u.real_reward
										.slice(3 - u.real_reward.length), "..."))
								}
							} catch (e) {
								n = !0, s = e
							} finally {
								try {
									a || null == l.return || l.return()
								} finally {
									if (n) throw s
								}
							}
						}
						t.getView = 0 == t.activity_log_id, t.rewards = r.data.rewards;
						var d = !0,
							c = !1,
							h = void 0;
						try {
							for (var f, _ = t.rewards[Symbol.iterator](); !(d = (f = _.next()).done); d = !0) {
								var p = f.value;
								p.real_reward > 1e4 && (p.real_reward = p.real_reward.replace(p.real_reward
									.slice(4 - p.real_reward.length), "..."))
							}
						} catch (e) {
							c = !0, h = e
						} finally {
							try {
								d || null == _.return || _.return()
							} finally {
								if (c) throw h
							}
						}
						t.getList(), r.msg && "获取成功" != r.msg && (t.msg = r.msg, t.errorDialog = !0)
					} else t.msg = r.msg, t.detail.style = 2, t.errorDialog = !0, setTimeout(function() {
						t.getList()
					})
				}).catch(function(e) {
					i.$hideLoading()
				})
			},
			getSetting: function() {
				var t = this;
				t.$request({
					url: t.$api.fission.setting
				}).then(function(i) {
					if (0 == i.code) {
						switch (t.setting = i.data, i.data.style) {
							case "1":
								t.radius = "22rpx";
								break;
							case "2":
								t.radius = "16rpx";
								break;
							case "3":
								t.radius = "20rpx";
								break;
							case "4":
								t.radius = "28rpx"
						}
						t.contactIndex = Math.floor(Math.random() * +t.setting.contact_list.length), t
							.getIndex()
					} else uni.showToast({
						title: i.msg,
						icon: "none",
						duration: 1e3
					})
				}).catch(function(e) {
					t.$hideLoading()
				})
			},
			clickWechat: function() {
				var e = this;
				e.$request({
					url: e.$api.fission.wechat
				})
			}
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
		height: 294rpx;
		margin-top: -20%;
		background-color: #fff;
		border-radius: 16rpx;
		position: relative;
		z-index: 100
	}

	.error-dialog .error-content .error-msg {
		height: 206rpx;
		width: 630rpx;
		font-size: 28rpx;
		color: #666666;
		text-align: center
	}

	.error-dialog .error-content .error-msg .error-time {
		font-size: 32rpx;
		color: #353535
	}

	.error-dialog .error-content .error-submit {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 100;
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
		height: 690rpx;
		margin-top: -20%;
		z-index: 100
	}

	.get-dialog .get-item.qr-view {
		width: 527rpx;
		margin: 230rpx auto 0;
		position: relative;
		height: 700rpx;
		z-index: 100
	}

	.get-dialog .get-item.qr-view .close-btn {
		top: -70rpx;
		right: -70rpx
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
		top: 210rpx;
		left: 0;
		right: 0;
		width: 498rpx;
		margin: 0 auto;
		text-align: center;
		font-size: 24rpx;
		color: #999999;
		z-index: 100
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

	.get-dialog .get-item.clear .clear-item .clear-detail {
		height: 56rpx;
		border-radius: 28rpx;
		padding: 0 30rpx;
		background-color: #ff4544;
		color: #fff;
		font-size: 24rpx;
		display: inline-block;
		line-height: 56rpx;
		text-align: center
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

	.get-dialog .get-item.clear .clear-item .clear-goods-item .clear-goods-right wx-view {
		text-align: left
	}

	.get-dialog .get-item.clear .clear-time {
		position: absolute;
		z-index: 100;
		bottom: 110rpx;
		left: 0;
		width: 582rpx;
		text-align: center;
		color: #fff;
		font-size: 24rpx
	}

	.get-dialog .get-item.clear .clear-card-item {
		position: absolute;
		bottom: 163rpx;
		left: 0;
		right: 0;
		margin: 0 auto;
		background-color: #fff;
		color: #353535;
		width: 498rpx;
		height: 146rpx;
		border-radius: 16rpx;
		z-index: 100
	}

	.get-dialog .get-item.clear .clear-card-item .clear-card-left {
		width: 180rpx;
		height: 146rpx;
		color: #ff4544;
		font-size: 24rpx
	}

	.get-dialog .get-item.clear .clear-card-item .clear-card-left .card-img {
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx
	}

	.get-dialog .get-item.clear .clear-card-item .clear-card-left .goods-img {
		width: 90rpx;
		height: 90rpx;
		border-radius: 8rpx
	}

	.get-dialog .get-item.clear .clear-card-item .clear-card-left text {
		font-size: 42rpx
	}

	.get-dialog .get-item.clear .clear-card-item .clear-card-right {
		width: 318rpx;
		height: 146rpx;
		color: #353535;
		font-size: 28rpx
	}

	.get-dialog .get-item.clear .clear-card-item .clear-card-right .coupon-type {
		font-size: 24rpx;
		color: #999999;
		margin-top: 10rpx
	}

	.get-dialog .get-item.clear .clear-gift-item {
		position: absolute;
		bottom: 100rpx;
		left: 0;
		right: 0;
		margin: 0 auto;
		width: 310rpx;
		height: 277rpx;
		z-index: 100
	}

	.get-dialog .get-item.clear .clear-gift-item .clear-gift {
		width: 310rpx;
		height: 277rpx
	}

	.get-dialog .get-item.clear .clear-qr-item {
		z-index: 100;
		position: absolute;
		bottom: 34rpx;
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

	.get-dialog .get-item .get-content {
		position: absolute;
		top: 95rpx;
		left: 0;
		right: 0;
		margin: 0 auto;
		height: 565rpx;
		width: 454rpx;
		font-size: 20rpx;
		color: #353535;
		z-index: 100
	}

	.get-dialog .get-item .get-content .get-qr {
		width: 230rpx;
		height: 230rpx;
		margin: 40rpx auto 10rpx;
		display: block
	}

	.get-dialog .get-item .get-content .get-custom {
		color: #fff;
		width: 454rpx;
		height: 100rpx;
		font-size: 24rpx;
		margin-top: 50rpx
	}

	.get-dialog .get-item .get-content .get-copy {
		width: 424rpx;
		height: 77rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		color: #cb0908;
		text-align: center;
		font-weight: 500;
		line-height: 77rpx;
		background-color: #FDD88A;
		margin: 20rpx auto 0
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
		z-index: 31;
		z-index: 100
	}

	.get-dialog .get-item .item-info {
		position: absolute;
		top: 50rpx;
		left: 0;
		right: 0;
		margin: 0 auto;
		font-size: 28rpx;
		color: #ffebac;
		text-align: center;
		padding: 0 24rpx;
		z-index: 100
	}

	.get-dialog .get-item .item-info .reward-lock-text {
		margin-top: -20rpx;
		margin-bottom: 20rpx
	}

	.get-dialog .get-item .item-info .reward-lock-text.more-place {
		margin-bottom: 0
	}

	.get-dialog .get-item .item-info .item-about {
		font-size: 40rpx;
		margin-bottom: 24rpx
	}

	.get-dialog .get-item .item-info .item-about.card-name {
		font-size: 46rpx
	}

	.get-dialog .get-item .item-info .item-about.less-marging {
		margin-bottom: 14rpx
	}

	.get-dialog .get-item .item-info .item-about text {
		font-size: 80rpx;
		font-family: DIN
	}

	.get-dialog .get-item .button-item {
		position: absolute;
		bottom: 26rpx;
		left: 0;
		right: 0;
		width: 424rpx;
		margin: 0 auto;
		z-index: 100
	}

	.get-dialog .get-item .button-item button {
		width: 424rpx;
		line-height: 90rpx;
		text-align: center;
		margin-bottom: 24rpx;
		height: 90rpx;
		font-size: 32rpx;
		color: #cb0908;
		border-radius: 45rpx;
		background-color: #fce6a3;
		-webkit-box-shadow: 0 16rpx 16rpx rgba(159, 20, 63, 0.3);
		box-shadow: 0 16rpx 16rpx rgba(159, 20, 63, 0.3)
	}

	.get-dialog .get-item .get-text {
		position: absolute;
		top: 60rpx;
		left: 0;
		height: 270rpx;
		width: 528rpx;
		color: #ffebac;
		font-size: 32rpx;
		text-align: center;
		z-index: 100
	}

	.get-dialog .get-item .get-text .invite_user {
		font-size: 32rpx;
		width: 488rpx;
		margin-bottom: 20rpx;
		color: #ffffff
	}

	.get-dialog .get-item .get-text .invite_user image {
		width: 56rpx;
		height: 56rpx;
		border-radius: 28rpx;
		display: block
	}

	.get-dialog .get-item .get-text .invite_user>view {
		text-align: center;
		margin-top: 12rpx
	}

	.get-dialog .get-item .get-text .main-text {
		font-size: 46rpx;
		font-weight: 500
	}

	.rule {
		position: absolute;
		right: 24rpx;
		top: 38rpx;
		width: 125rpx;
		height: 48rpx;
		text-align: center;
		line-height: 48rpx;
		border-radius: 24rpx;
		color: #fff;
		font-size: 24rpx;
		z-index: 20;
		background-color: rgba(0, 0, 0, 0.3)
	}

	.log-btn {
		position: absolute;
		right: 24rpx;
		top: 118rpx;
		width: 90rpx;
		height: 90rpx;
		z-index: 20
	}

	.head-img {
		display: block;
		width: 100%;
		height: 480rpx
	}

	.activity {
		padding-top: 10rpx
	}

	.activity .activity-name {
		width: 702rpx;
		padding: 24rpx 0;
		border-radius: 16rpx;
		background-color: rgba(0, 0, 0, 0.3);
		color: #fff;
		font-size: 24rpx;
		margin: 0 auto 10rpx
	}

	.activity .activity-name>.activity-name-v {
		margin: 5rpx 0
	}

	.activity .activity-name .stage {
		margin-top: 28rpx
	}

	.activity .activity-name .stage .hb {
		margin: 0 18rpx;
		width: 98rpx;
		font-size: 20rpx;
		position: relative
	}

	.activity .activity-name .stage .hb .reward-text {
		position: absolute;
		bottom: 50rpx;
		left: 0;
		text-align: center;
		color: #fff;
		width: 98rpx;
		height: 68rpx
	}

	.activity .activity-name .stage .hb .reward-text .card-img {
		width: 34rpx;
		height: 34rpx;
		border-radius: 50%
	}

	.activity .activity-name .stage .hb .reward-user {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin: 0 auto
	}

	.activity .activity-name .stage .hb .mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 98rpx;
		height: 120rpx;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 9;
		border-radius: 10rpx
	}

	.activity .activity-name .stage .hb .mask .lock-icon {
		height: 42rpx;
		width: 35rpx;
		position: absolute;
		top: 40rpx;
		left: 50%;
		margin-left: -21rpx;
		z-index: 10
	}

	.activity .activity-name .stage .hb>.hb-image {
		width: 98rpx;
		height: 120rpx;
		margin-bottom: 10rpx;
		border-radius: 10rpx
	}

	.activity .hb-list {
		width: 100%;
		padding: 18rpx 40rpx
	}

	.activity .hb-list .hb {
		margin: 12rpx 8rpx;
		width: 116rpx;
		height: 145rpx;
		position: relative
	}

	.activity .hb-list .hb .reward-text {
		position: absolute;
		bottom: 45rpx;
		left: 0;
		text-align: center;
		color: #fff;
		width: 118rpx;
		font-size: 20rpx
	}

	.activity .hb-list .hb .reward-text .reward-text-t {
		font-size: 30rpx
	}

	.activity .hb-list .hb .reward-text.t-omit {
		bottom: 55rpx
	}

	.activity .hb-list .hb .reward-user {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		margin: 0 auto
	}

	.activity .hb-list .hb .send-text {
		position: absolute;
		width: 118rpx;
		text-align: center;
		bottom: 20rpx;
		left: 0;
		font-size: 19rpx;
		color: #fff;
		z-index: 10;
		white-space: nowrap
	}

	.activity .hb-list .hb.big {
		width: 252rpx;
		height: 314rpx
	}

	.activity .hb-list .hb.big .send-text {
		width: 252rpx;
		font-size: 24rpx;
		bottom: 40rpx;
		z-index: 10;
		white-space: nowrap
	}

	.activity .hb-list .hb.big .reward-user {
		width: 130rpx;
		height: 130rpx;
		border-radius: 65rpx
	}

	.activity .hb-list .hb.big .reward-text {
		position: absolute;
		bottom: 90rpx;
		left: 0;
		text-align: center;
		color: #fff;
		width: 252rpx;
		font-size: 24rpx;
		height: 110rpx
	}

	.activity .hb-list .hb.big .reward-text .big-text {
		font-size: 32rpx
	}

	.activity .hb-list .hb.big .reward-text.pic {
		height: 112rpx
	}

	.activity .hb-list .hb.big .reward-text .reward-card {
		width: 76rpx;
		height: 76rpx;
		border-radius: 50%;
		margin-bottom: 6rpx;
		-webkit-flex-shrink: 0;
		-ms-flex-negative: 0;
		flex-shrink: 0
	}

	.activity .hb-list .hb.big .reward-text .reward-goods {
		width: 76rpx;
		height: 76rpx;
		border-radius: 8rpx;
		margin-bottom: 6rpx;
		-webkit-flex-shrink: 0;
		-ms-flex-negative: 0;
		flex-shrink: 0
	}

	.activity .hb-list .hb.big .reward-text .reword-text-t {
		font-size: 52rpx
	}

	.activity .hb-list .hb.big .need-people {
		position: absolute;
		width: 252rpx;
		text-align: center;
		bottom: 75rpx;
		left: 0;
		font-size: 28rpx;
		color: #fff;
		z-index: 10
	}

	.activity .hb-list .hb.big .mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 9
	}

	.activity .hb-list .hb.big .mask .reward {
		position: absolute;
		left: 0;
		top: 128rpx;
		width: 100%;
		height: 40rpx;
		z-index: 11
	}

	.activity .hb-list .hb.big .mask .reward>view {
		display: inline-block;
		padding: 0 18rpx;
		height: 40rpx;
		line-height: 40rpx;
		background-color: #ff4544;
		color: #fff;
		border-radius: 20rpx;
		font-size: 20rpx
	}

	.activity .hb-list .hb.big .mask .lock-icon {
		height: 77rpx;
		width: 64rpx;
		position: absolute;
		top: 60rpx;
		left: 50%;
		margin-left: -32rpx;
		z-index: 10
	}

	.activity .hb-list .hb .hb-bg {
		width: 100%;
		height: 100%
	}

	.reward-item {
		width: 100%;
		height: 1230rpx;
		position: relative
	}

	.reward-item>.reward-item-img {
		width: 100%;
		height: 100%
	}

	.reward-item .top-text {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 200rpx;
		color: #353535;
		font-size: 50rpx
	}

	.reward-item .top-text .invite {
		color: #ff4544
	}

	.reward-item .get-money {
		position: absolute;
		bottom: 760rpx;
		left: 0;
		right: 0;
		width: 450rpx;
		margin: 0 auto;
		font-size: 28rpx;
		color: #666666;
		text-align: center
	}

	.reward-item .get-money .get-money-t {
		font-size: 98rpx;
		color: #ff4544
	}

	.reward-item .get-money:after {
		content: '\5143'
	}

	.reward-item .coupon {
		position: absolute;
		bottom: 770rpx;
		left: 0;
		right: 0;
		width: 450rpx;
		margin: 0 auto;
		font-size: 26rpx;
		color: #666;
		text-align: center
	}

	.reward-item .coupon .coupon-detail {
		margin-top: 20rpx;
		color: #353535;
		font-size: 66rpx
	}

	.reward-item .use-btn {
		position: absolute;
		top: 480rpx;
		left: 0;
		right: 0;
		width: 210rpx;
		height: 64rpx;
		line-height: 64rpx;
		text-align: center;
		background-color: #ff4544;
		border-radius: 32rpx;
		font-size: 32rpx;
		color: #fff;
		margin: 0 auto
	}

	.reward-item .btn-item {
		position: absolute;
		top: 670rpx;
		left: 0;
		right: 0;
		width: 490rpx;
		margin: 0 auto
	}

	.reward-item .btn-item .go-back,
	.reward-item .btn-item .to-send {
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		border-radius: 44rpx;
		font-size: 32rpx;
		color: #cb0908
	}

	.reward-item .btn-item .to-send {
		background-color: #fce5a0
	}

	.reward-item .btn-item .go-back {
		margin-top: 38rpx;
		background-color: #f6413f;
		color: #fce5a0;
		border: 3rpx solid #fce5a0
	}
</style>
