<template>
    <view class="u-swiper-wrap" :style="{
		borderRadius: `${borderRadius}rpx`
	}">
        <swiper @change="change" @animationfinish="animationfinish" :interval="interval" :circular="circular" :duration="duration" :autoplay="autoplay"
                :previous-margin="effect3d ? effect3dPreviousMargin + 'rpx' : '0'" :next-margin="effect3d ? effect3dPreviousMargin + 'rpx' : '0'"
                :style="{
				height: height + 'rpx'
			}">
            <swiper-item class="u-swiper-item" v-for="(item, index) in list" :key="index">
                <!--  #ifdef MP-->
                <view class="u-list-image-wrap" @tap.stop.prevent="listClick(index)" :class="[current != index ? 'u-list-scale' : '']" :style="{
						borderRadius: `${cBorderTop}rpx ${cBorderTop}rpx ${cBorderBottom}rpx ${cBorderBottom}rpx`,
						transform: effect3d && current != index ? 'scaleY(0.7)' : 'scaleY(1)',
						margin: effect3d && current != index ? '0 0' : 0
					}">
                    <app-jump-button :open_type="item.open_type"
                                     :url="item.url ? item.url : item.page_url"
                                     :params="item.params">
                        <image class="u-swiper-image" :src="item[name]" :mode="imgMode"></image>
                        <view v-if="title" class="u-swiper-title u-line-1" :style="{
							'padding-bottom': titlePaddingBottom
						}">
                            {{ item.title }}
                        </view>
                    </app-jump-button>
                </view>
                <!--  #endif-->
                <!--#ifdef H5-->
                <view class="u-list-image-wrap" @tap.stop.prevent="listClick(index)" :class="[current != index ? 'u-list-scale' : '']" :style="{
						borderRadius: `${borderRadius}rpx`,
						transform: effect3d && current != index ? 'scaleY(0.7)' : 'scaleY(1)',
						margin: effect3d && current != index ? '0 0' : 0
					}">
                    <app-jump-button
                        v-if="item.open_type !== 'app'"
                        :open_type="item.open_type"
                                     :url="item.url ? item.url : item.page_url"
                                     :params="item.params">
                        <image class="u-swiper-image" :src="item[name]" :mode="imgMode"></image>
                        <view v-if="title" class="u-swiper-title u-line-1" :style="{
							'padding-bottom': titlePaddingBottom
						}">
                            {{ item.title }}
                        </view>
                    </app-jump-button>
                    <view :id="item.id" v-if="item.open_type === 'app'" style="height: 100%;">

                    </view>
                </view>
                <!--#endif-->
            </swiper-item>
        </swiper>
        <view class="u-swiper-indicator" :style="{
				top: indicatorPos == 'topLeft' || indicatorPos == 'topCenter' || indicatorPos == 'topRight' ? '12rpx' : 'auto',
				bottom: indicatorPos == 'bottomLeft' || indicatorPos == 'bottomCenter' || indicatorPos == 'bottomRight' ? '12rpx' : 'auto',
				justifyContent: justifyContent,
				padding: `0 ${effect3d ? '74rpx' : '24rpx'}`
			}">
            <block v-if="mode == 'rect'">
                <view class="u-indicator-item-rect" :class="{ 'u-indicator-item-rect-active': index == current }" v-for="(item, index) in list"
                      :key="index"></view>
            </block>
            <block v-if="mode == 'dot'">
                <view class="u-indicator-item-dot" :class="{ 'u-indicator-item-dot-active': index == current }" v-for="(item, index) in list"
                      :key="index"></view>
            </block>
            <block v-if="mode == 'round'">
                <view class="u-indicator-item-round" :class="{ 'u-indicator-item-round-active': index == current }" v-for="(item, index) in list"
                      :key="index"></view>
            </block>
            <block v-if="mode == 'number'">
                <view class="u-indicator-item-number">{{ current + 1 }}/{{ list.length }}</view>
            </block>
        </view>
    </view>
</template>

<script>

    export default {
        name: "u-swiper",

        props: {
            list: {
                type: Array,
                default () {
                    return [];
                }
            },
            // ????????????title??????
            title: {
                type: Boolean,
                default: false
            },
            // ????????????????????????????????????
            indicator: {
                type: Object,
                default () {
                    return {};
                }
            },
            // ?????????
            borderRadius: {
                type: [Number, String],
                default: 0
            },
            // ?????????????????????
            interval: {
                type: [String, Number],
                default: 3000
            },
            // ?????????????????????rect|dot|number|round
            mode: {
                type: String,
                default: 'round'
            },
            // list??????????????????rpx
            height: {
                type: [Number, String],
                default: 250
            },
            // ?????????????????????topLeft|topCenter|topRight|bottomLeft|bottomCenter|bottomRight
            indicatorPos: {
                type: String,
                default: 'bottomCenter'
            },
            // ????????????????????????
            effect3d: {
                type: Boolean,
                default: false
            },
            // 3D???????????????????????????item?????????item????????????????????????rpx
            effect3dPreviousMargin: {
                type: [Number, String],
                default: -10
            },
            // ??????????????????
            autoplay: {
                type: Boolean,
                default: true
            },
            // ?????????????????????????????????ms
            duration: {
                type: [Number, String],
                default: 500
            },
            // ???????????????????????????????????????????????????????????????????????????????????????
            circular: {
                type: Boolean,
                default: true
            },
            // ?????????????????????
            imgMode: {
                type: String,
                default: 'aspectFill'
            },
            // ???list????????????????????????????????????
            name: {
                type: String,
                default: 'image'
            },
            // ????????????
            bgColor: {
                type: String,
                default: '#f3f4f6'
            },
			cBorderTop: {
				type: String,
				default () {
					return `0rpx`;
				}
			},
			cBorderBottom: {
				type: String,
				default () {
					return `0rpx`;
				}
			},
        },
        watch: {
            // ???????????????list?????????????????????????????????????????????????????????????????????????????????current??????????????????
            list: {
                handler(nVal, oVal) {
                    oVal = oVal ? oVal: [];
                    if(nVal.length !== oVal.length) this.current = 0;
                    // #ifdef H5
                    for (let i = 0; i < nVal.length; i++) {
                        nVal[i].id = this.$utils.guid('app-swiper')
                        if (nVal[i].open_type === 'app') {
                            let height = uni.upx2px(this.height)+ 'px';
                            let username = this.getUrlParam(nVal[i].page_url, 'username');
                            let path = this.getUrlParam(nVal[i].page_url, 'path');
                            let text = `<img src="${nVal[i].pic_url}" width="100%" height="${height}" />`;
                            this.$utils.createWxOpenLaunchWeapp(nVal[i].id, username, path, text);
                        }
                    }
                    // #endif
                },
                immediate: true
            }
        },
        data() {
            return {
                current: 0 // ???????????????swiper-item???index
            };
        },
        // #ifdef H5
        mounted() {
            this.$jwx.config({});
        },
        // #endif
        computed: {
            justifyContent() {
                if (this.indicatorPos == 'topLeft' || this.indicatorPos == 'bottomLeft') return 'flex-start';
                if (this.indicatorPos == 'topCenter' || this.indicatorPos == 'bottomCenter') return 'center';
                if (this.indicatorPos == 'topRight' || this.indicatorPos == 'bottomRight') return 'flex-end';
            },
            titlePaddingBottom() {
                let tmp = 0;
                if (this.mode == 'none') return '12rpx';
                if (['bottomLeft', 'bottomCenter', 'bottomRight'].indexOf(this.indicatorPos) >= 0 && this.mode == 'number') {
                    tmp = '60rpx';
                } else if (['bottomLeft', 'bottomCenter', 'bottomRight'].indexOf(this.indicatorPos) >= 0 && this.mode != 'number') {
                    tmp = '40rpx';
                } else {
                    tmp = '12rpx';
                }
                return tmp;
            },
            // #ifdef H5
            isWechat: function() {
                return this.$jwx.isWechat();
            }
            // #endif
        },
        methods: {
            listClick(index) {
                this.$emit('click', index);
            },
            change(e) {
                let current = e.detail.current;
                this.current = current;
                // ??????change????????????????????????????????????index??????0??????
                this.$emit('change', current);
            },
            // ????????????????????????animationfinish???????????????change??????
            // ???????????????????????????????????????swiper??????current??????
            animationfinish(e) {
                // #ifndef MP-TOUTIAO
                // this.current = e.detail.current;
                // #endif
            },
            getUrlParam(url,name) {
                let search = url.split('?')[1];
                if (search) {
                    let r = search.substr(0).match(new RegExp('(^|&)' + name + '=([^&]*)(&|$)'))
                    console.log(r);
                    if (r !== null) {
                        console.log(unescape(r[2]));
                        return unescape(r[2])
                    }
                    return null
                } else {
                    return null
                }
            }
        },
        filters: {
            // getUrlParam(url, name) {
            //     let search = url.split('?')[1];
            //     if (search) {
            //         let r = search.substr(0).match(new RegExp('(^|&)' + name + '=([^&]*)(&|$)'))
            //         if (r !== null) return unescape(r[2])
            //         return null
            //     } else {
            //         return null
            //     }
            // }
        }
    };
</script>

<style lang="scss" scoped>

    .u-swiper-wrap {
        position: relative;
        overflow: hidden;
        transform: translateY(0);
    }

    .u-swiper-image {
        width: 100%;
        will-change: transform;
        height: 100%;
        display: block;
        /* #ifdef H5 */
        pointer-events: none;
        /* #endif */
    }

    .u-swiper-indicator {
        padding: 0 24rpx;
        position: absolute;
        display: flex;
        width: 100%;
        z-index: 1;
    }

    .u-indicator-item-rect {
        width: 26rpx;
        height: 8rpx;
        margin: 0 6rpx;
        transition: all 0.5s;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .u-indicator-item-rect-active {
        background-color: rgba(255, 255, 255, 0.8);
    }

    .u-indicator-item-dot {
        width: 14rpx;
        height: 14rpx;
        margin: 0 6rpx;
        border-radius: 20rpx;
        transition: all 0.5s;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .u-indicator-item-dot-active {
        background-color: rgba(255, 255, 255, 0.8);
    }

    .u-indicator-item-round {
        width: 14rpx;
        height: 14rpx;
        margin: 0 6rpx;
        border-radius: 20rpx;
        transition: all 0.5s;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .u-indicator-item-round-active {
        width: 34rpx;
        background-color: rgba(255, 255, 255, 0.8);
    }

    .u-indicator-item-number {
        padding: 6rpx 16rpx;
        line-height: 1;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 100rpx;
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.8);
    }

    .u-list-scale {
        transform-origin: center center;
    }

    .u-list-image-wrap {
        height: 100%;
        flex: 1;
        transition: all 0.5s;
        overflow: hidden;
        box-sizing: content-box;
        position: relative;
    }

    .u-swiper-title {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.3);
        bottom: 0;
        left: 0;
        width: 100%;
        font-size: 28rpx;
        padding: 12rpx 24rpx;
        color: rgba(255, 255, 255, 0.9);
    }

    .u-swiper-item {
        display: flex;
        overflow: hidden;
        align-items: center;
    }
</style>