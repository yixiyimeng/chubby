<template>
    <view class="content">
        <!-- <view v-if="hasLogin" class="hello">
            <view class="title">
                您好 {{userName}}，您已成功登录。
            </view>
            <view class="ul">
                <view>这是 uni-app 带登录模板的示例App首页。</view>
                <view>在 “我的” 中点击 “退出” 可以 “注销当前账户”</view>
            </view>
        </view>
        <view v-if="!hasLogin" class="hello">
            <view class="title">
                您好 游客。
            </view>
            <view class="ul">
                <view>这是 uni-app 带登录模板的示例App首页。</view>
                <view>在 “我的” 中点击 “登录” 可以 “登录您的账户”</view>
            </view>
        </view> -->
		<view class="btn-row">
			<view style="text-align: center;color: #FF6D89;font-weight: 600;">
				<text style="font-size: 64rpx;">小胖 | </text>
				<text style="font-size: 46rpx;margin-left: 16rpx;"> 关爱女性盆底健康</text>
			</view>
			<view class="btn-msg" style="color: #555555;font-size: 34rpx;">小胖会根据您选择的训练课程训练</view>
		</view>
		<view class="btn-row">
			<view class="btn2" @click="goTrain(0)">初级训练</view>
			<view class="btn-msg">收3秒放10秒，反复10min</view>
		</view>
		<view class="btn-row">
			<view class="btn2" @click="goTrain(1)">中级训练一</view>
			<view class="btn-msg">收3秒放10秒，反复15min</view>
		</view>
		<view class="btn-row">
			<view class="btn2" @click="goTrain(2)">中级训练二</view>
			<view class="btn-msg">收1秒放2秒，反复3min</view>
		</view>
		<view class="btn-row">
			<view class="btn2" @click="goTrain(3)">高级训练一</view>
			<view class="btn-msg">收10秒放10秒，反复5次休息10秒，反复20min</view>
		</view>
		<view class="btn-row">
			<view class="btn2" @click="goTrain(4)">高级训练二</view>
			<view class="btn-msg">收1秒放2秒，反复5次休息10秒，反复3min</view>
		</view>
    </view>
</template>

<script>
    import {
        mapState
    } from 'vuex'

    export default {
        computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
        onLoad() {
            if (!this.hasLogin) {
			//if (false) {
                uni.showModal({
                    title: '未登录',
                    content: '您未登录，需要登录后才能继续',
                    /**
                     * 如果需要强制登录，不显示取消按钮
                     */
                    showCancel: !this.forcedLogin,
                    success: (res) => {
                        if (res.confirm) {
							/**
							 * 如果需要强制登录，使用reLaunch方式
							 */
                            if (this.forcedLogin) {
                                uni.reLaunch({
                                    url: '../login/login'
                                });
                            } else {
                                uni.navigateTo({
                                    url: '../login/login'
                                });
                            }
                        }
                    }
                });
            }
        },
		methods: {
			goTrain(type) {
				uni.navigateTo({
				    url: 'train?type='+type
				});
			}
		},
    }
</script>

<style>
    .hello {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .title {
        color: #8f8f94;
        margin-top: 50upx;
    }

    .ul {
        font-size: 30upx;
        color: #8f8f94;
        margin-top: 50upx;
    }

    .ul>view {
        line-height: 50upx;
    }
	
	.btn2 {
		background-color: #FF6D89;
		padding: 26rpx;
		text-align: center;
		color: #ffffff;
		border-radius: 80rpx;
		width: 580rpx;
		margin: 0 auto;
	}
	.btn-row  {
		margin-top: 10rpx;
	}
	.btn-msg {
		text-align: center;margin: 16rpx 0 20rpx 0;color: #8F8F94;font-size: 32rpx;
	}
</style>
