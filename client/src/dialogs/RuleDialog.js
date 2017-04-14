/**
 * 玩法说明界面
 */
var RuleDialog = (function(_super) {
    function RuleDialog() {
        RuleDialog.super(this);

        this.init();
    }

    Laya.class(RuleDialog, "RuleDialog", _super);

    RuleDialog.prototype.init = function() {

    };

    RuleDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };

    return RuleDialog;
}(RuleDialogUI));