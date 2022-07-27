<template>
		<view>
			<view class="banner">
				<image :src="bannerUrl"></image>
			</view>
			
			<view class="dir-left-nowrap" style="margin-top:75px">
				<view class="box-grow-1" style="width:90%" >
					<app-search-for  v-bind:value="search"></app-search-for>
				</view>
				<!-- <view class="box-grow-0">
					<image style="width:100px;height:100px" src="https://cashier.qicuo.com/app/static/image/icon/delete.png"
					       ></image>
				</view> -->
			</view>
			<view>
				<view class="page-width"  v-if="goods_list.length > 0">
				    <app-product-list  v-bind:goodsList="goods_list"
				                      @routeGo="routeGo"></app-product-list>
				</view>
				
				<view class="page-width no-goods" v-else>
				    <app-no-goods background="#f7f7f7"></app-no-goods>
				</view>
			</view>
			
		</view>
</template>

<script>
	import appSearchFor from '../../../components/page-component/app-search-for/app-search-for.vue';
	import appProductList from '../components/app-product-list.vue';
	import appNoGoods from '../../../components/page-component/app-no-goods/app-no-goods.vue';
	export default {
		components:{
			'app-search-for': appSearchFor,
			'app-product-list': appProductList,
			'app-no-goods': appNoGoods,
		},
		data() {
			return {
				bannerUrl:"",
				search:{
                    // background: `#efeff4`,
                    color: '#ffffff',
                    placeholder: '请输入商品名称搜索',
                    radius: 28,
                    textColor: '#999999',
                    textPosition: `left`,
                },
				goods_list:[]
			}
		},
		
		onLoad(){
			this.getConfig()
		},
		methods: {
			routeGo(data){
            let _this = this;
            // #ifndef MP-BAIDU
            if (data.video_url && this.getVideo == 1) {
                // #ifdef MP
                uni.navigateTo({
                    url: `/pages/weekly_buy/video?goods_id=${data.id}&sign=booking`
                });
                // #endif

                // #ifdef H5
                if (this.$jwx.isWechat()) {
                    this.$jwx.getLocation({
                        success: function() {
                            uni.navigateTo({
                                url: `/plugins/weekly_buy/goods/goods?goods_id=${data.id}`,
                            });
                        },
                        fail: function() {
                            uni.showToast({
                                title: '请开启位置权限',
                                icon: 'none',
                                duration: 1000,
                                success: function () {

                                }
                            });
                        }
                    })
                } else {
                    uni.getLocation({
                        type: 'wgs84',
                        success: function () {
                            uni.navigateTo({
                                url: `/plugins/weekly_buy/goods/goods?goods_id=${data.id}`,
                            });
                        },
                        fail: function (res) {
                            uni.showToast({
                                title: '请开启位置权限',
                                icon: 'none',
                                duration: 1000,
                                success: function () {

                                }
                            });
                        },
                    });
                }
                // #endif


            } else {
                // #ifndef H5
                uni.getLocation({
                    type: 'wgs84',
                    success: function () {
                        uni.navigateTo({
                            url: `/plugins/weekly_buy/goods/goods?goods_id=${data.id}`,
                        });
                    },
                    fail: function () {
                        uni.showToast({
                            title: '请开启位置权限',
                            icon: 'none',
                            duration: 1000,
                            success: function () {

                            }
                        });
                    },
                });
                // #endif

                // #ifdef H5
                if (this.$jwx.isWechat()) {
                    this.$jwx.getLocation({
                        success: function() {
                            uni.navigateTo({
                                url: `/plugins/weekly_buy/goods/goods?goods_id=${data.id}`,
                            });
                        },
                        fail: function() {
                            uni.showToast({
                                title: '请开启位置权限',
                                icon: 'none',
                                duration: 1000,
                                success: function () {

                                }
                            });
                        }
                    })
                } else {
                    uni.navigateTo({
                        url: `/plugins/weekly_buy/goods/goods?goods_id=${data.id}`,
                    });
                }
                // #endif
            }
            // #endif

            // #ifdef MP-BAIDU
            uni.getLocation({
                type: 'wgs84',
                success: function () {
                    uni.navigateTo({
                        url: `/plugins/weekly_buy/goods/goods?goods_id=${data.id}`,
                    });
                },
                fail: function () {
                    uni.showToast({
                        title: '请开启位置权限',
                        icon: 'none',
                        duration: 1000,
                        success: function () {

                        }
                    });
                },
            });
            // #endif

        },
			getConfig(){
				let that = this;
				that.$request({
				    url: that.$api.community.activity_list.replace("community","weekly_buy"),
				}).then(response=>{
				    if(response.code == 0) {
					   that.bannerUrl=response.data.banner
					   that.dataProcessing(response.data)
				    }else {
				    	
				    }
				}).catch(response => {
				    that.$hideLoading();
				});
			},
			dataProcessing(data) {
			    for (let i = 0; i < data.list.length; i += 2) {
			        if (i + 1 !== data.list.length) {
			            this.goods_list.push([data.list[i], data.list[i + 1]]);
			        } else {
			            this.goods_list.push([data.list[i]]);
			        }
			    }
				console.log(this.goods_list)
			},
		}
	}
</script>

<style scoped lang="scss">
.banner{
	position: relative;
	    width: 100%;
	    height: 2.74rem;
	    padding: 0.24rem;
	    border-radius: 0.16rem;
		box-sizing: border-box;
}
.banner image{
	    width: 23.02rem;
	    height: 7.26rem;
	    border-radius: 0.16rem;
		background-size: 100% 100%;
		margin-left:5%
}
.app-view{
	width:#{600rpx}
}
</style>
