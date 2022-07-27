<template>
    <view class='app-switch-tab dir-left-nowrap'
          :class="isborderBottom ? 'tab-bottom-border' : ''"
          :style="{'background-color':bgColor,'height': tabHeight + 'rpx'}">
        <view v-for="(item, index) in list" :key="index" @click='tabClick(index)' class='box-grow-1 main-center'>
            <view class="item cross-center" :class="dIndex == index ? theme + '-m-text active-item ' + theme : 'no-active-item'">
                {{item.name}}
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            bgColor: {
                type: String,
                default: '#fff'
            },
            list: {
                type: Array,
                default: []
            },
            tabHeight: {
                // 高度
                type: Number,
                default: 80
            },
            currentIndex: {
                // 当前点击的元素索引
                type: Number,
                default: 0,
            },
            isborderBottom: {
                type: Boolean,
                default: true
            },
            theme: {
                type: String,
                default: 'default'
            }
        },
        data() {
            return {}
        },
        computed: {
            dIndex: function () {
                return this.currentIndex;
            }
        },
        methods: {
            tabClick(index) {
                this.$emit('tabEvent', {
                    currentIndex: index
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .item {
        height: 100%;
    }
   
    .tab-bottom-border {
        border-bottom: #{1rpx} solid $uni-weak-color-one;
    }

    .no-active-item {
        border-bottom: #{4rpx} solid trasparent;
    }
    .active-item {
        border-bottom: #{4rpx} solid;
    }
    .default-m-text {
        color: #ff4544;
    }
    .blue-m-text {
        color: #446dfd;
    }
</style>