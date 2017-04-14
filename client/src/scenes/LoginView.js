/**
 * 登录界面
 */
var LoginView = (function(_super) {
    function LoginView() {
        LoginView.super(this);

        this.init();
    }

    Laya.class(LoginView, "LoginView", _super);

    //*登录游戏
    LoginView.prototype.loginGame = function () {
        //*要提示正在登录

        App.login();
    };

    LoginView.prototype.initEvent = function () {
        //*登录按钮
        this.loginBtn.on(Laya.Event.CLICK, this, this.loginGame);
    };

    LoginView.prototype.init = function() {
        this.initEvent();
    };

    return LoginView;
}(LoginViewUI));