<template>
	<view class="u-mask" :style="[maskStyle]" :class="[show ? 'u-mask-show' : '']" @tap="click" @touchmove.stop.prevent>
		<slot />
	</view>
</template>

<script>
	export default {
		props: {
			// 是否显示遮罩
			show: {
				type: [Boolean, Number],
				default: false
			},
			// 层级z-index
			zIndex: {
				type: [Number, String],
				default: 1001
			},
			// 用户自定义样式
			customStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			// 遮罩的动画样式， 是否使用使用zoom进行scale进行缩放
			zoom: {
				type: Boolean,
				default: true
			},
			// 遮罩的过渡时间，单位为ms
			duration: {
				type: [Number, String],
				default: 300
			},
			// 是否可以通过点击遮罩进行关闭
			maskClickAble: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			maskStyle() {
				let style = {};
				style.backgroundColor = "rgba(0, 0, 0, 0.6)";
				style.zIndex = this.zIndex;
				style.transition = `all ${this.duration / 1000}s ease-in-out`;
				// 缩放
				if (this.zoom == true) style.transform = 'scale(1.2, 1.2)';
				// 判断用户传递的对象是否为空
				if (Object.keys(this.customStyle).length) style = { ...style,
					...this.customStyle
				};
				// 合并自定义的样式
				//Object.assign(style, customStyle);
				return style;
			}
		},
		methods: {
			click() {
				if(!this.maskClickAble) return ;
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		visibility: hidden;
	}

	.u-mask-show {
		opacity: 1;
		visibility: visible;
		transform: scale(1);
	}
</style>
