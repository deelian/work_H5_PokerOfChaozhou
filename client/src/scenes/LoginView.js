/**
 * 登录界面
 */
var LoginView = (function(_super) {
    function LoginView() {
        LoginView.super(this);

        this.revision.text = "版本号：" + App.config.version;

        this.init();
    }

    Laya.class(LoginView, "LoginView", _super);

    LoginView.prototype.init = function() {

        //window.alert(App.storageManager.getToken());
        // 如果已经获得微信授权码，则自动登录
        if (App._code) {
            Laya.timer.once(300, this, this.loginGame);
        }
        // 本地有Token
        else if (App.storageManager.getToken()) {
            Laya.timer.once(300, this, this.loginGame);
        }
        // 默认显示登录界面
        else {

        }

        this.initEvent();
    };

    LoginView.prototype.initEvent = function () {
        this.guestBtn.on(Laya.Event.CLICK, this, this.loginGame);
        this.wxAuthorizeBtn.on(Laya.Event.CLICK, this, this.authorize);
    };

    LoginView.prototype.authorize = function() {
        App.wxAuthorize();
    };

    LoginView.prototype.loginGame = function () {
        App.login();
    };

    LoginView.prototype.block = function() {
        this.guestBtn.disable = true;
        this.wxAuthorizeBtn.disable = true;
    };

    LoginView.prototype.unblock = function() {
        this.guestBtn.disable = false;
        this.wxAuthorizeBtn.disable = false;
    };

    return LoginView;
}(LoginViewUI));