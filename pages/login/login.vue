<template>
	<view class="content">
		<image src="../../static/img2/login_top_bg.png" style="width: 750rpx;position: absolute;top: 0;height: 554rpx;"></image>
		<image src="../../static/img2/login_bottom_bg.png" style="width: 750rpx;position: absolute;bottom: 0;height: 186rpx;"></image>
		<view class="" style="background-color: none;width: 600rpx;margin: 0 auto;margin-top: 440rpx;">

			<view style="font-size: 46rpx;margin-bottom: 60rpx;">欢迎登录</view>

			<view class="input-row">
				<image src="../../static/img2/phone.png" style="width: 26rpx;height: 40rpx;margin-right: 24rpx;margin-left: 40rpx;"></image>
				<m-input class="m-input" type="text" style="font-size: 36rpx;" focus v-model="account" placeholder="请输入手机号"></m-input>
			</view>

			<view class="input-row">
				<image src="../../static/img2/yzm.png" style="width: 70rpx;height: 40rpx;margin-right: 20rpx;margin-left: 30rpx;"></image>
				<m-input class="m-input" type="text" style="font-size: 36rpx;" focus v-model="password" placeholder="请输入验证码"></m-input>
				<view class="btn-yzm" @tap="getSms">{{codetxt}}</view>
			</view>

		</view>
		<view class="btn-row">
			<!-- <button class="primary" @tap="bindLogin">登录</button> -->
			<view class="btn-login" @tap="bindLogin">登录</view>
		</view>
	</view>
</template>

<script>
	let num = 60;
	import service from '../../service.js';
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import mInput from '../../components/m-input.vue'
	import {
		regPhone
	} from '@/utils/index';
	export default {
		components: {
			mInput
		},
		data() {
			return {
				providerList: [],
				hasProvider: false,
				account: '',
				password: '',
				positionTop: 0,
				timer: null,
				codetxt: '获取验证码'
			}
		},
		destroyed() {
			if (this.timer) {
				clearInterval(this.timer)
			}
		},
		computed: mapState(['forcedLogin']),
		methods: {
			...mapMutations(['login']),
			initProvider() {
				const filters = ['weixin', 'qq', 'sinaweibo'];
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						if (res.provider && res.provider.length) {
							for (let i = 0; i < res.provider.length; i++) {
								if (~filters.indexOf(res.provider[i])) {
									this.providerList.push({
										value: res.provider[i],
										image: '../../static/img/' + res.provider[i] + '.png'
									});
								}
							}
							this.hasProvider = true;
						}
					},
					fail: (err) => {
						console.error('获取服务供应商失败：' + JSON.stringify(err));
					}
				});
			},
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},
			bindLogin() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				if (this.account.length < 5) {
					uni.showToast({
						icon: 'none',
						title: '账号最短为 5 个字符'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}
				/**
				 * 下面简单模拟下服务端的处理
				 * 检测用户账号密码是否在已注册的用户列表中
				 * 实际开发中，使用 uni.request 将账号信息发送至服务端，客户端在回调函数中获取结果信息。
				 */
				const data = {
					account: this.account,
					password: this.password
				};
				this.$getajax('cgFormDataController.do?checkSms&mobile=' + this.account + '&code=' + this.password).then(da => {
					uni.showToast({
						icon: 'none',
						title: da.msg
					});
					if (da.success) {
						setTimeout(() => {
							this.toMain(this.account);
						}, 300)

					}
				})
				//             const validUser = service.getUsers().some(function (user) {
				//                 return data.account === user.account && data.password === user.password;
				//             });
				//             //if (validUser) {
				// if (true) {
				//                 this.toMain(this.account);
				//             } else {
				//                 uni.showToast({
				//                     icon: 'none',
				//                     title: '用户账号或密码不正确',
				//                 });
				//             }
			},
			oauth(value) {
				uni.login({
					provider: value,
					success: (res) => {
						uni.getUserInfo({
							provider: value,
							success: (infoRes) => {
								/**
								 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
								 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
								 */
								this.toMain(infoRes.userInfo.nickName);
							}
						});
					},
					fail: (err) => {
						console.error('授权登录失败：' + JSON.stringify(err));
					}
				});
			},
			toMain(userName) {
				this.login(userName);
				console.info(userName)
				console.info(this.forcedLogin)
				var user = {
					account: userName,
					password: this.password

				}
				service.addUser(user);
				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../main/conn',
					});
				} else {
					uni.navigateBack();
				}

			},
			getSms() {
				/* 获取验证码 */
				let $me = this;
				if (num < 60) {
					return false;
				}
				if (regPhone(this.account)) {
					/* 开始倒计时 */
					$me.codetxt = num + 's';
					$me.timer = setInterval(function() {
						if (num == 1) {
							clearInterval($me.timer);
							$me.codetxt = '获取验证码';
							num = 60;
						} else {
							num--;
							$me.codetxt = num + 's';
						}
					}, 1000);
					this.$getajax('cgFormDataController.do?getSms&mobile=' + this.account).then(da => {
						if (da.success) {
							uni.showToast({
								icon: 'none',
								title: '验证码发送成功'
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: da.msg
							});
						}
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号码'
					});
				}
			}
		},
		onReady() {
			this.initPosition();
			this.initProvider();
		}
	}
</script>

<style>
	.content {
		padding: 0;
	}

	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.action-row navigator {
		color: #007aff;
		padding: 0 20upx;
	}

	.oauth-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.oauth-image {
		width: 100upx;
		height: 100upx;
		border: 1upx solid #dddddd;
		border-radius: 100upx;
		margin: 0 40upx;
		background-color: #ffffff;
	}

	.oauth-image image {
		width: 60upx;
		height: 60upx;
		margin: 20upx;
	}

	.btn-login {
		background-color: #FF6D89;
		padding: 36rpx;
		text-align: center;
		color: #ffffff;
		border-radius: 80rpx;
		width: 520rpx;
		margin: 0 auto;
	}

	.input-row {
		border-bottom: #C8C7CC 1px solid;
		padding: 30rpx 0 20rpx 0;
	}

	.btn-yzm {
		border: 1px #FF6D89 solid;
		padding: 5rpx 0;
		text-align: center;
		color: #666666;
		border-radius: 10rpx;
		width: 300rpx;
		margin: 0 auto;
		font-size: 30rpx;
	}
</style>
