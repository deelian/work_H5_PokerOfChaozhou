var StorageManager = (function(_super) {
    function StorageManager() {
        this.storage = Laya.LocalStorage || window.localStorage || {};
        this.aesKey = CryptoJS.enc.Utf8.parse("EdSIlrzBmUE2I4XPBVACUWN9v0JVzrjqWu7Y");

        this.init();
    }

    Laya.class(StorageManager, "StorageManager", _super);

    StorageManager.prototype.init = function() {
    };

    StorageManager.prototype.encrypt = function(value) {
        return CryptoJS.AES.encrypt(value, this.aesKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
    };

    StorageManager.prototype.decrypt = function(value) {
        return CryptoJS.AES.decrypt(value, this.aesKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
    };

    StorageManager.prototype.getItem = function(key, decode) {
        var value = this.storage.getItem(key);
        if (value == undefined) {
            return undefined;
        }

        return decode? this.decrypt(value) : value;
    };

    StorageManager.prototype.setItem = function(key, value, encode) {
        this.storage.setItem(key, encode ? this.encrypt(value) : value);
    };

    StorageManager.prototype.removeItem = function(key) {
        this.storage.removeItem(key);
    };

    StorageManager.prototype.getDeviceId = function() {
        var key = StorageManager.KEY_DEVICE_ID;
        var deviceId = this.getItem(key, true);
        if (deviceId === undefined || deviceId == "") {
            deviceId = uuid.v4();
            this.setItem(key, deviceId, true);
        }

        return deviceId;
    };

    StorageManager.prototype.removeToken = function() {
        this.removeItem(StorageManager.KEY_ACCESS_TOKEN);
    };

    StorageManager.prototype.getToken = function() {
        var key = StorageManager.KEY_ACCESS_TOKEN;
        var token = this.getItem(key, true);
        if (token == undefined || token == "") {
            return null;
        }

        return token;
    };

    StorageManager.prototype.setToken = function(token) {
        var key = StorageManager.KEY_ACCESS_TOKEN;
        this.setItem(key, token, true);
    };

    StorageManager.KEY_DEVICE_ID = "deviceId";
    StorageManager.KEY_ACCESS_TOKEN = "token";

    return StorageManager;
}(laya.events.EventDispatcher));