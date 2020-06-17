// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';
const conn = 'conn';

const getUsers = function () {
    let ret = '';
    ret = uni.getStorageSync(USERS_KEY);
    if (!ret) {
        ret = '[]';
    }
    return JSON.parse(ret);
}

const addUser = function (userInfo) {
    let users = getUsers();
    users.push({
        account: userInfo.account,
        password: userInfo.password
    });
    uni.setStorageSync(USERS_KEY, JSON.stringify(users));
}
const setConn = function (conn2){
	uni.setStorageSync(conn, conn2);
}
const getConn = function (conn2){
	let ret = false;
	ret = uni.getStorageSync(conn);
	return ret;
}

export default {
    getUsers,
    addUser,
	getConn,
	setConn
}
