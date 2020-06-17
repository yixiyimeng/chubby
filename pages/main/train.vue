<template>
	<view class="content">
		<view class="btn-row">
			<view style="text-align: center;color: #FF6D89;font-weight: 600;">
				<text style="font-size: 64rpx;">小胖 |</text>
				<text style="font-size: 46rpx;margin-left: 16rpx;">关爱女性盆底健康</text>
			</view>
			<view class="btn-msg" style="color: #555555;font-size: 34rpx;">小胖会根据您选择的训练课程训练</view>
		</view>
		<!-- <view class="btn-row" style="margin-bottom: 20rpx;">
			<view class="btn2">初级训练</view>
		</view> -->

		<view class="train-content">
			<view style="font-size: 50rpx;color: #FFFFFF;text-align: center;margin: 50rpx;">{{ datatitle }}</view>
			<view class="ms-text">{{num}}</view>
			<view>{{ mp3 }}</view>
		</view>

		<view class="btn-row" style="margin-bottom: 20rpx;margin-top: 40rpx;">
			<view style="width: 255rpx;display: inline-block;text-align: center;">
				<image src="../../static/img2/yinliang1.png" style="width: 60rpx;height: 60rpx;"></image>
				<view style="color: #666666;font-size: 38rpx;">静音</view>
			</view>
			<view style="width: 200rpx;display: inline-block;text-align: center;">
				<image @click="boFang()" :src="bofang ? onOff[0] : onOff[1]" style="width: 180rpx;height: 180rpx;"></image>
			</view>
			<view style="width: 255rpx;display: inline-block;text-align: center;">
				<image src="../../static/img2/guanji1.png" style="width: 60rpx;height: 60rpx;"></image>
				<view style="color: #666666;font-size: 38rpx;" @click="stopdl()">结束</view>
			</view>
		</view>

		<view v-show="close" style="position: absolute;top: 0;width: 750rpx;height: 100%;background-color: rgba(0,0,0,0.5);">
			<view style="width: 690rpx;height: 750rpx;background-color: #FFFFFF;border-radius: 20rpx;margin: auto;margin-top: 200rpx;">
				<view style="font-size: 60rpx;color: #FF6D89;text-align: center;margin: 50rpx;padding-top: 60rpx;font-weight: bold;">恭喜完成测试</view>
				<view class="ms-text" style="color: red;border-color: #FF6D89;">{{fs}}</view>
				<view style="font-size: 40rpx;color: #FF6D89;text-align: center;margin: 30rpx;">测试紧致度</view>
				<!-- <view style="font-size: 50rpx;color: #000000;text-align: center;margin: 30rpx;padding-top: 10rpx;margin-bottom: 40rpx;">较差，急需锻炼</view> -->
				<view>
					<view style="display: inline-block;width: 345rpx;">
						<view class="btn2 btn-white" @click="cxcs()">重新测试</view>
					</view>
					<view style="display: inline-block;width: 345rpx;">
						<view class="btn2 btn-red" @click="closedom()">关闭</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import service from '../../service.js';
	export default {
		computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		data() {
			return {
				close: false,
				option: {},
				mp3s: [
					'http://212.129.131.163:9000/temp-bucket/audio/zj_fa1.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=beliefLs%2F20200529%2F%2Fs3%2Faws4_request&X-Amz-Date=20200529T031957Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=27af2b18f8225e9cde25cccd6a859c53c7dead7552b8a46b5257f6c73e82f4af',
					'http://212.129.131.163:9000/temp-bucket/audio/cj_fa.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=beliefLs%2F20200529%2F%2Fs3%2Faws4_request&X-Amz-Date=20200529T032014Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=601863903bc2552de202b7e4a99bc751544ce8b00c07a7aeb09fb35829c16f82',
					'http://212.129.131.163:9000/temp-bucket/audio/zj_fa2_2.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=beliefLs%2F20200529%2F%2Fs3%2Faws4_request&X-Amz-Date=20200529T031927Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=9c2b7158d36a7111c4990a7ac85d6a6b286a742b3c3d2f75b7addb8e9b942e58',
					'http://212.129.131.163:9000/temp-bucket/audio/gj_fa1.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=beliefLs%2F20200529%2F%2Fs3%2Faws4_request&X-Amz-Date=20200529T032040Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=c812c3ba8f9d3554cee5a2a494c7d9d4ddf97a9cf7ccd800fbb9a5fe99584dc2',
					'http://212.129.131.163:9000/temp-bucket/audio/gj_fa2_2.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=beliefLs%2F20200529%2F%2Fs3%2Faws4_request&X-Amz-Date=20200529T032029Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=fae231ca5bd440dd8fa83e2fe2bb96d1c45c48a065dd92cc86df845ed4772563'
				],
				mp3: '',
				title: ['初级训练', '中级训练一', '中级训练二', '高级训练一', '高级训练二'],
				onOff: ['../../static/img2/bofang2.png', '../../static/img2/bofang1.png'],
				bofang: false,
				dataUrl: 'http://212.129.131.163:9000/temp-bucket/audio/zj_fa1.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=beliefLs%2F20200529%2F%2Fs3%2Faws4_request&X-Amz-Date=20200529T031957Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=27af2b18f8225e9cde25cccd6a859c53c7dead7552b8a46b5257f6c73e82f4af',
				innerAudioContext: null,
				datatitle: '',

				devices: [],
				discoveryStarted: false,
				connected: false,
				chs: [],
				deviceId: "",
				serviceId: "",
				characteristicId: "",
				name: "",
				canWrite: false,
				num: 0,

				countTime: 120,
				beginTime: 15,
				sjTime: 10,
				fsTime: 10,
				count: 1,
				count1: 0,
				count2: 0,
				nowTime: 0,
				H: 150,
				X: 2,
				fs: 0,
				timer: '',
				ffnum: 0,
				xxnum: 0,
				xxTime: 0,
			};
		},
		onLoad(option) {
			uni.request({
				url: 'http://10.0.0.22:8080/system/setting/getSetting/list',
				method: 'GET',
				success: (res) => {
					if (res.data.code == 200) {
						var row = res.data.rows;
						for (var i = 0; i < row.length; i++) {
							console.info(this.title[option.type] + "___" + row[i].setting)
							if (this.title[option.type] == row[i].setting) {
								this.countTime = 20;
								this.sjTime = row[i].sjtime;
								this.fsTime = row[i].fstime;
								this.H = parseInt(row[i].h);
								this.X = parseInt(row[i].x);
								this.xxnum = row[i].xxnum;
								this.ffnum = row[i].ffnum;
							}
						}
					}
					console.log(this.H + "____" + this.X);
				}
			});
			this.option = option;
			this.dataUrl = this.mp3s[option.type];
			this.datatitle = this.title[option.type];
			console.info(option);
			this.linkBluetooth();
			console.info(this.dataUrl)

			//if (!this.hasLogin) {
			if (false) {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: res => {
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
			cxcs() {
				this.close = false;

			},
			closedom() {
				this.stopdl();
			},

			inArray(arr, key, val) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i][key] === val) {
						return i;
					}
				}
				return -1;
			},
			ab2hex(buffer) {
				var hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function(bit) {
						return ('00' + bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('');
			},
			boFang() {
				if (this.bofang) {
					this.pause();
					this.bofang = false
				} else {
					this.play();
					this.bofang = true
				}
				this.begindl();
			},
			play: function(res) {
				console.log('bofang')
				if (!this.innerAudioContext) {
					this.innerAudioContext = uni.createInnerAudioContext();
					this.innerAudioContext.autoplay = true;
					this.innerAudioContext.src = this.dataUrl;
					this.innerAudioContext.onPlay(() => {
						console.log('开始播放');
					});
					this.innerAudioContext.onError((res) => {
						console.log(res.errMsg);
						console.log(res.errCode);
					});
				} else {
					this.begindl();
					this.innerAudioContext.play()
				}
			},
			pause: function() {
				if (this.innerAudioContext) {
					this.innerAudioContext.pause();
					this.ztdl();
				}
			},

			getsetting() {
				uni.request({
					url: 'http://10.0.0.22:8080/system/setting/getSetting/list',
					method: 'GET',
					success: (res) => {
						console.log(res.data);
					}
				});
			},
			getscore() {
				uni.request({
					url: 'http://10.0.0.22:8080/system/score/uniApp/getlist',
					method: 'GET',
					data: {
						userphone: "15951920943"
					},
					success: (res) => {
						console.log(res.data);
					}
				});
			},
			baocun() {
				uni.request({
					url: 'http://10.0.0.22:8080/system/score/uniApp/addScore',
					method: 'POST',
					data: {
						userphone: "15951920943",
						score: "80",
						type: "中级训练一"
					},
					success: (res) => {
						console.log(res.data);
					}
				});
			},
			linkBluetooth() {
				this.openBluetoothAdapter();
				console.info(this.devices);

			},
			ztdl() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
					this.writeBLECharacteristicValue3();
				}


			},
			stopdl() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
					this.count = 1;
					this.count1 = 0;
					this.count2 = 0;
					this.nowTime = 0;
					this.fs = 0;
					this.pause();
					this.writeBLECharacteristicValue3();
					uni.reLaunch({
						url: '../main/main'
					});
				}


			},
			begindl() {
				this.writeBLECharacteristicValue();

				this.timer = setInterval(() => {
					this.nowTime = this.nowTime + 1;
					if (this.nowTime < this.beginTime) {
						this.writeBLECharacteristicValue2();
						this.fs = 0;
					} else {
						console.info("count1:" + this.count1 + " ____ffnum:" + this.ffnum);
						console.info(this.count1 > 0 && this.count1 % this.ffnum == 0 % this.ffnum > 0);
						if (this.count1 > 0 && this.count1 % this.ffnum == 0) {
							this.xxTime = this.xxTime + 1;
							if (this.xxTime > 0 && this.xxTime % this.xxnum == 0) {
								this.count1 = 0;
								this.xxTime = 0;
							}
						} else {
							this.count1 = this.count - 1;
							let time1 = (this.sjTime + this.fsTime) * this.count1;
							let time2 = (this.sjTime + this.fsTime) * this.count;
							let time3 = this.beginTime + time2;
							let time4 = this.beginTime + time1;
							console.info("this.nowTime" + this.nowTime + "____time3" + time3 + "_____time4" + time4)
							if (this.nowTime < time3 && this.nowTime > time4) {
								console.info("this.num >this.H")
								console.info(this.num > this.H);
								if (this.num > this.H) {
									console.info("this.nowTime < time4 + this.X")
									console.info(this.nowTime < time4 + this.X);
									if (this.nowTime < time4 + this.X) {
										console.info("this.count > this.count2")
										console.info(this.count > this.count2);
										if (this.count > this.count2) {
											this.fs = this.fs + 1;
											this.count2 = this.count2 + this.count;
										}
									} else {
										if (this.count > this.count2) {
											this.fs = this.fs + 0.5;
											this.count2 = this.count2 + this.count;
										}
									}
								}
							} else {
								if (this.nowTime == time3) {
									this.count = this.count + 1;
								}
								this.count2 = 0;
							};
						}
					}

					if (this.nowTime == this.countTime) {
						let countNum = this.count;
						let jcf = this.fs / countNum;
						let endf = jcf * 100;
						this.fs = Math.round(endf);
						/* uni.showToast({
						    title: "最后得分："+realVal,
						    icon: 'none',
						    duration: 2000//提示的延迟时间，单位毫秒，默认：1500
						}); */
						console.info(this.fs);
						this.close = true;
						const user = service.getUsers();
						console.info(service.getUsers());
						uni.request({
							url: 'http://10.0.0.22:8080/system/score/uniApp/addScore',
							method: 'POST',
							data: {
								userphone: user[user.length - 1].account,
								score: this.fs,
								type: this.datatitle
							},
							success: (res) => {
								console.log(res.data);
							}
						});


						if (this.timer) {
							clearInterval(this.timer);
							this.timer = null;
							this.count = 1;
							this.count1 = 0;
							this.count2 = 0;
							this.nowTime = 0;
						}
						this.writeBLECharacteristicValue3();
					}
				}, 1000);
			}, // 初始化蓝牙模块
			openBluetoothAdapter() {
				let that = this;
				uni.openBluetoothAdapter({
					success: (res) => {
						console.log('openBluetoothAdapter success', res)
						//获取本机蓝牙适配器状态
						uni.getBluetoothAdapterState({ //蓝牙的匹配状态
							success(res1) {
								console.log(res1, "本机设备的的蓝牙已打开")
								that.startBluetoothDevicesDiscovery()
							},
							fail(error) {
								uni.showToast({
									icon: "none",
									title: "查看手机蓝牙是否打开",
									duration: 3000 //提示的延迟时间，单位毫秒，默认：1500
								});
							}
						})
					},
					fail: (res) => {
						if (res.errCode === 10001) {
							uni.showToast({
								icon: "none",
								title: "查看手机蓝牙是否打开",
								duration: 3000 //提示的延迟时间，单位毫秒，默认：1500
							});
							//监听蓝牙适配器状态变化事件
							uni.onBluetoothAdapterStateChange(function(res) {
								console.log('onBluetoothAdapterStateChange', res)
								if (res.available) { //手机蓝牙已经打开
									that.startBluetoothDevicesDiscovery()
								}
							})
						}
					}
				})
			},
			// 开始搜寻附近的蓝牙外围设备。此操作比较耗费系统资源，请在搜索并连接到设备后调用 wx.stopBluetoothDevicesDiscovery 方法停止搜
			startBluetoothDevicesDiscovery() {
				if (this.discoveryStarted) {
					return
				}
				this.discoveryStarted = true
				uni.startBluetoothDevicesDiscovery({
					allowDuplicatesKey: true,
					success: (res) => {
						console.log('startBluetoothDevicesDiscovery success', res)
						this.onBluetoothDeviceFound()
					},
				})
			},
			//停止搜寻附近的蓝牙外围设备。若已经找到需要的蓝牙设备并不需要继续搜索时，建议调用该接口停止蓝牙搜索
			stopBluetoothDevicesDiscovery() {
				wx.stopBluetoothDevicesDiscovery()
			},
			// 监听寻找到新设备的事件
			onBluetoothDeviceFound() {
				uni.onBluetoothDeviceFound((res) => {
					console.log(res, "onBluetoothDeviceFound")
					res.devices.forEach(device => {
						if (!device.name) {
							return
						}
						if (device.name == 'JDY-23') {
							const foundDevices = this.devices
							const idx = this.inArray(foundDevices, 'deviceId', device.deviceId)
							console.log(idx, "idx");
							const data = {}
							if (idx === -1) {
								this.devices.push(device);
							} else {
								this.devices[idx] = device
							}
							console.log(this.devices, "idx");
							this.createBLEConnection(device);
						}
					})
				})
			},
			// 连接低功耗蓝牙设备。deviceId用于区分设备的 id
			createBLEConnection(ds) {
				const deviceId = ds.deviceId
				const name = ds.name || ds.localName;
				uni.createBLEConnection({
					deviceId: deviceId,
					success: (res) => {
						this.connected = true;
						this.name = name;
						this.deviceId = deviceId;
						this.getBLEDeviceServices(deviceId);
						this.onfff = false;
						this.onNo = true;
						uni.showToast({
							title: "连接" + this.name + "成功",
							icon: 'none',
							duration: 2000 //提示的延迟时间，单位毫秒，默认：1500
						});
						this.conn = true;
					}
				})
				this.stopBluetoothDevicesDiscovery()
			},
			// 断开与低功耗蓝牙设备的连接。 deviceId用于区分设备的 id
			closeBLEConnection() {
				uni.closeBLEConnection({
					deviceId: this.deviceId
				})
				this.connected = false;
				this.chs = [];
				this.canWrite = false;
			},
			//获取蓝牙设备所有服务(service)。 deviceId蓝牙设备 id
			getBLEDeviceServices(deviceId) {
				uni.getBLEDeviceServices({
					deviceId,
					success: (res) => {
						for (let i = 0; i < res.services.length; i++) {
							if (res.services[i].isPrimary) {
								this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
								return
							}
						}
					}
				})
			},
			//获取蓝牙设备某个服务中所有特征值(characteristic)
			getBLEDeviceCharacteristics(deviceId, serviceId) {
				uni.getBLEDeviceCharacteristics({
					deviceId,
					serviceId,
					success: (res) => {
						console.log('getBLEDeviceCharacteristics success', res.characteristics)
						for (let i = 0; i < res.characteristics.length; i++) {
							let item = res.characteristics[i]
							if (item.properties.read) {
								uni.readBLECharacteristicValue({ //读取低功耗蓝牙设备的特征值的二进制数据值
									deviceId,
									serviceId,
									characteristicId: item.uuid,
								})
							}
							if (item.properties.write) { //向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用
								this.canWrite = true;
								this.deviceId = deviceId;
								this.serviceId = serviceId;
								this.characteristicId = item.uuid;
								this.writeBLECharacteristicValue();
							}
							if (item.properties.notify || item.properties.indicate) {
								console.info("启用低功耗蓝牙设备特征值变化时的 notify 功能s")
								uni.notifyBLECharacteristicValueChange({ //启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。
									deviceId,
									serviceId,
									characteristicId: item.uuid,
									state: true,
									success: (res) => {
										console.log(res)
										// console.log(this.characteristicId)
										console.log('notifyBLECharacteristicValueChange success', res.errMsg)

									},
									fail: (res) => {
										console.log('notifyBLECharacteristicValueChange success2', res.errMsg)
									}
								})
							}
						}
					},
					fail(res) {
						console.error('getBLEDeviceCharacteristics', res)
					}
				})
				// 操作之前先监听，保证第一时间获取数据
				uni.onBLECharacteristicValueChange((characteristic) => {
					let value = characteristic.value;
					const buffer = new Uint8Array(value)
					const num = buffer[3] * 100 + buffer[4];
					this.num = num;
					const idx = this.inArray(this.chs, 'uuid', characteristic.characteristicId)
					const data = {}
					if (idx === -1) {
						this.chs.push({
							uuid: characteristic.characteristicId,
							value: this.ab2hex(characteristic.value)
						});
					} else {
						this.chs[idx] = {
							uuid: characteristic.characteristicId,
							value: this.ab2hex(characteristic.value)
						}
					}
				})
			},
			writeBLECharacteristicValue() { //向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用
				// 向蓝牙设备发送一个0x00的16进制数据
				// let buffer =this.hexStringToArrayBuffer("AAAA20201015555");
				let buffer = this.hexStringToArrayBuffer("457a000100467b");
				uni.writeBLECharacteristicValue({
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					characteristicId: this.characteristicId,
					value: buffer,
					success: function(res) {
						console.log('writeBLECharacteristicValue success', res)
					},
					fail: function(err) {
						console.log(err, "errerrerrerrerr")
					}
				})
			},
			writeBLECharacteristicValue2() { //向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用
				// 向蓝牙设备发送一个0x00的16进制数据
				// let buffer =this.hexStringToArrayBuffer("AAAA20201015555");
				let buffer = this.hexStringToArrayBuffer("457a010100467b");
				uni.writeBLECharacteristicValue({
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					characteristicId: this.characteristicId,
					value: buffer,
					success: function(res) {
						console.log('writeBLECharacteristicValue success', res)
					},
					fail: function(err) {
						console.log(err, "errerrerrerrerr")
					}
				})
			},
			writeBLECharacteristicValue3() { //向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用
				// 向蓝牙设备发送一个0x00的16进制数据
				// let buffer =this.hexStringToArrayBuffer("AAAA20201015555");
				let buffer = this.hexStringToArrayBuffer("457a030100467b");
				uni.writeBLECharacteristicValue({
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					characteristicId: this.characteristicId,
					value: buffer,
					success: function(res) {
						console.log('writeBLECharacteristicValue success', res)
					},
					fail: function(err) {
						console.log(err, "errerrerrerrerr")
					}
				})
			},
			closeBluetoothAdapter() {
				uni.closeBluetoothAdapter()
				this.discoveryStarted = false
			},
			//向蓝牙设备发送一个0x00的16进制数据
			hexStringToArrayBuffer(str) {
				if (!str) {
					return new ArrayBuffer(0);
				}
				var buffer = new ArrayBuffer(str.length);
				let dataView = new DataView(buffer)
				let ind = 0;
				for (var i = 0, len = str.length; i < len; i += 2) {
					let code = parseInt(str.substr(i, 2), 16)
					dataView.setUint8(ind, code)
					ind++
				}
				return buffer;
			}


		},
	};
</script>

<style>
	image {
		width: 150upx;
		height: 150upx;
	}

	.page-body-text {
		padding: 0 30upx;
	}

	.page-body-wrapper {
		margin-top: 0;
	}

	.page-body-info {
		padding-bottom: 50upx;
	}

	.time-big {
		font-size: 60upx;
		margin: 20upx;
	}

	.slider {
		width: 630upx;
	}

	.play-time {
		font-size: 28upx;
		width: 100%;
		padding: 20upx 0;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.page-body-buttons {
		display: flex;
		justify-content: space-around;
		margin-top: 100upx;
	}

	.page-body-button {
		width: 250upx;
		text-align: center;
	}

	.content {
		padding: 0;
	}

	.btn2 {
		background-color: #ff6d89;
		padding: 26rpx;
		text-align: center;
		color: #ffffff;
		border-radius: 80rpx;
		width: 400rpx;
		margin: 0 auto;
		border: 1px solid #ff6d89;
	}

	.btn-red {
		width: 260rpx;
	}

	.btn-white {
		width: 260rpx;
		border: 1px solid #ff6d89;
		background-color: #ffffff;
		color: #ff6d89;
	}

	.btn-row {
		margin-top: 10rpx;
	}

	.btn-msg {
		text-align: center;
		margin: 16rpx 0 20rpx 0;
		color: #8f8f94;
		font-size: 32rpx;
	}

	.train-content {
		background-color: #ff6d89;
		width: 750rpx;
		height: 750rpx;
	}

	.ms-text {
		font-size: 100rpx;
		color: #ffffff;
		text-align: center;
		margin: 50rpx;
		border: 2px solid #ffffff;
		width: 180rpx;
		height: 180rpx;
		line-height: 180rpx;
		border-radius: 180rpx;
		margin: 0 auto;
	}
</style>
