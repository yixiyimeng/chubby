<template>
    <view class="content">
		<view class="btn-row">
			<view style="text-align: center;color: #FFFFFF;padding-top: 40rpx;">
				<text style="font-size: 60rpx;">Hi~女神！欢迎使用小胖</text>
			</view>
		</view>
		
		<view class="train-content">
			<view class="ms-text">
				<image src="../../static/img2/yuan.png" style="width: 200rpx;height: 200rpx;"></image>
			</view>
			<view v-show="!conn && first" style="font-size: 60rpx;color: #FFFFFF;text-align: center;margin: 50rpx;margin-bottom: 0;" >
				暂未链接
			</view>
			<view v-show="!conn && first" style="font-size: 38rpx;color: #FFFFFF;text-align: center;margin: 50rpx;margin-top: 0;">
				首次使用请链接蓝牙配对设备哦~
			</view>
			<view v-show="!conn" style="font-size: 60rpx;color: #FFFFFF;text-align: center;margin: 50rpx;margin-bottom: 0;" >
				努力搜索设备中
			</view>
			<view v-show="!conn" style="font-size: 38rpx;color: #FFFFFF;text-align: center;margin: 50rpx;margin-top: 0;">
				幸福生活，从这里开始哦~
			</view>
			<view v-show="conn" style="font-size: 60rpx;color: #FFFFFF;text-align: center;margin: 50rpx;margin-bottom: 0;" >
				小胖链接成功
			</view>
			<view v-show="conn" style="font-size: 38rpx;color: #FFFFFF;text-align: center;margin: 50rpx;margin-top: 0;">
				点击“开始”马上体验
			</view>
		</view>
		
		<view class="btn-row" style="margin-bottom: 20rpx;">
			<view v-show="!conn" class="btn2" @click="connun">链接设备</view>
			<view v-show="conn" class="btn2" @click="kaishi">开始</view>
		</view>
		
    </view>
</template>

<script>
    import {
        mapState
    } from 'vuex'
	import service from '../../service.js';
	function inArray(arr, key, val) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i][key] === val) {
				return i;
			}
		}
		return -1;
	}
	// ArrayBuffer转16进度字符串示例
	function ab2hex(buffer) {
		var hexArr = Array.prototype.map.call(
			new Uint8Array(buffer),
			function(bit) {
				return ('00' + bit.toString(16)).slice(-2)
			}
		)
		return hexArr.join('');
	}
    export default {
        computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		data() {
			return {
				conn: false,
				first: false,
				devices: [],
				discoveryStarted: false,
				connected: false,
				chs: [],
				deviceId: "",
				serviceId: "",
				characteristicId: "",
				name: "",
				canWrite: false,
				num:0,
				onfff:true,
				onNo:false,
				
				countTime : 120,
				beginTime : 15,
				sjTime : 10,
				fsTime: 10,
				count : 1,
				count1 :0,
				count2 : 0,
				nowTime: 0,
				H:150,
				X:2,
				fs:0,
				timer:'',
				ffnum:0,
				xxnum:0,
				xxTime:0,
			}
		},
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
            }else{
				// this.conn = service.getConn();
				this.conn=true
			}
        },
		methods: {
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
			connun() {
				this.linkBluetooth();
				
			},
			kaishi(){
				uni.reLaunch({
				    url: '../main/calendar',
				});
			},
			getsetting(){
				uni.request({
					url: 'http://10.0.0.22:8080/system/setting/getSetting/list',
					method:'GET',
					success: (res) => {
						console.log(res.data);
					}
				});
			},
			getscore(){
				uni.request({
					url: 'http://10.0.0.22:8080/system/score/uniApp/getlist',
					method:'GET',
					data: {
						userphone:"15951920943"
					},
					success: (res) => {
						console.log(res.data);
					}
				});
			},
			baocun(){
				uni.request({
					url: 'http://10.0.0.22:8080/system/score/uniApp/addScore',
					method:'POST',
					data: {
						userphone:"15951920943",
						score:"80",
						type:"中级训练一"
					},
					success: (res) => {
						console.log(res.data);
					}
				});
			},
			linkBluetooth(){
				this.openBluetoothAdapter();
				console.info(this.devices);
				
			},
			ztdl(){
				if(this.timer) {
					clearInterval(this.timer);  
					this.timer = null; 
					
					this.writeBLECharacteristicValue3();
				}  
				
				
			},
			stopdl(){
				if(this.timer) {
					clearInterval(this.timer);  
					this.timer = null; 
					this.count =1;
					this.count1 =0;
					this.count2 =0;
					this.nowTime =0;
					this.fs=0;
					this.writeBLECharacteristicValue3();
				}  
				
				
			},
			begindl(){
				this.writeBLECharacteristicValue();
				
				this.timer = setInterval(() => {
					this.nowTime = this.nowTime+1;
					if(this.nowTime < this.beginTime){
						this.writeBLECharacteristicValue2();
					}
					console.info("count1:"+this.count1+" ____ffnum:"+this.ffnum);
					console.info(this.count1>0 && this.count1%this.ffnum==0%this.ffnum>0);
					if(this.count1>0 && this.count1%this.ffnum==0){
						this.xxTime = this.xxTime+1;
						if(this.xxTime>0 && this.xxTime%this.xxnum==0){
							this.count1 = 0;
							this.xxTime = 0;
						}
					}else{
						this.count1 = this.count-1;
						let time1= (this.sjTime + this.fsTime)*this.count1;
						let time2= (this.sjTime + this.fsTime)*this.count;
						let time3 = this.beginTime+time2;
						let time4 = this.beginTime+time1;
						if(this.nowTime < time3 && this.nowTime > time4){
							console.info("this.num >this.H")
							console.info(this.num > this.H);
							if(this.num > this.H){
								console.info("this.nowTime < time4 + this.X")
								console.info(this.nowTime < time4 + this.X);
								if(this.nowTime < time4 + this.X){
									console.info("this.count > this.count2")
									console.info(this.count > this.count2);
									if(this.count > this.count2){
										this.fs = this.fs+1;
										this.count2 = this.count2 + this.count;
									}
								}else{
									if(this.count > this.count2){
										this.fs = this.fs+0.5;
										this.count2 = this.count2 + this.count;
									}
								}
							}
						}else{
							if(this.nowTime == time3){
								this.count = this.count+1;
							}
							this.count2 = 0;
						};
					}
					if(this.nowTime == this.countTime){
						let countNum = this.count;
						let jcf = this.fs / countNum;
						let endf = jcf*100;
						console.info("最后得分："+endf);
						uni.showToast({
						    title: "最后得分："+endf,
						    icon: 'none',
						    duration: 2000//提示的延迟时间，单位毫秒，默认：1500
						});
						if(this.timer) {
							clearInterval(this.timer);  
							this.timer = null; 
							this.count =1;
							this.count1 =0;
							this.count2 =0;
							this.nowTime =0;
							this.fs=0;
						}  
						this.writeBLECharacteristicValue3();
					}
				}, 1000);
			},
			// 初始化蓝牙模块
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
								    duration: 3000//提示的延迟时间，单位毫秒，默认：1500
								});
							}
						})
					},
					fail: (res) => {
						if (res.errCode === 10001) {
							uni.showToast({
							    icon: "none",
							    title: "查看手机蓝牙是否打开",
							    duration: 3000//提示的延迟时间，单位毫秒，默认：1500
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
						if(device.name == 'JDY-23'){
							uni.showToast({
							    title: "连接"+device.name+"成功",
							    icon: 'none',
							    duration: 2000//提示的延迟时间，单位毫秒，默认：1500
							});
							this.conn = true;
							service.setConn(this.conn);
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
					console.info("开始监听："+characteristic)
					let value = characteristic.value;
					const buffer = new Uint8Array(value)
					const num = buffer[3]*100+buffer[4];
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
				console.info(this.deviceId);
				console.info(this.serviceId);
				console.info(this.characteristicId);
				uni.writeBLECharacteristicValue({
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					characteristicId: this.characteristicId,
					value: buffer,
					success: function(res) {
						console.log("成功链接");
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
				console.info(buffer);
				console.info(this.deviceId);
				console.info(this.serviceId);
				console.info(this.characteristicId);
				uni.writeBLECharacteristicValue({
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					characteristicId: this.characteristicId,
					value: buffer,
					success: function(res) {
						console.log("成功接收");
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
						console.log("成功结束");
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
					console.info(code)
					dataView.setUint8(ind, code)
					ind++
				}
				return buffer;
			}
		},
    }
</script>

<style>
	.content {
		padding: 0;
		background-image: url("../../static/img2/bg.png");
		background-size: 100% 100%;
	}
	.btn2 {
		background-color: #ffffff;
		padding: 30rpx;
		text-align: center;
		color: #FF6D89;
		border-radius: 80rpx;
		width: 500rpx;
		margin: 0 auto;
	}
	.btn-row  {
		margin-top: 10rpx;
	}
	.btn-msg {
		text-align: center;margin: 16rpx 0 20rpx 0;color: #8F8F94;font-size: 32rpx;
	}
	
	.train-content {
		width: 750rpx;
		height: 460rpx;
		padding-top: 230rpx;
	}
	.ms-text {
		margin: 0 auto;width: 200rpx;
	}
</style>
