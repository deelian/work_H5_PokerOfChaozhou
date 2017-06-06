/**
 *聊天item
 */
var ChatItemBox = (function(_super){
    function ChatItemBox(){
        ChatItemBox.super(this);

        this._chatImg = null;
    }
    Laya.class(ChatItemBox,"ChatItemBox",_super);

    ChatItemBox.prototype.onRender = function(data){
        this._data = data;

        var userID = this._data.userID;
        var msg = this._data.msg;
        var userName = this._data.userName;
        var selfId = App.player.getId();

        if (this._chatImg) {
            this.selfText.visible = true;
            this.playerBox.visible = true;
            this._chatImg.removeSelf();
        }

        if(msg.indexOf(".png") != -1)
        {
            var img = new Laya.Image();
            img.skin = msg;
            img.y = 40;
            img.scale(0.8,0.8);

            this._chatImg = img;

            if(selfId == userID)
            {
                img.x = 350 - img.width;
                this.selfBox.visible = true;
                this.playerBox.visible = false;
                this.selfText.visible = false;
                this.playerBox.visible = false;
                this.selfNameLab.text = userName;
                this.selfBox.addChild(img);
            }
            else
            {
                this.selfBox.visible = false;
                this.playerBox.visible = true;
                this.playerText.visible = false;
                this.selfBox.visible = false;
                this.playerNameLab.text = userName;
                this.playerBox.addChild(img);
            }
        }
        else {
            if (selfId == userID) {
                this.selfBox.visible = true;
                this.playerBox.visible = false;
                this.selfText.text = msg;
                this.selfNameLab.text = userName;
            }
            else {
                this.selfBox.visible = false;
                this.playerBox.visible = true;
                this.playerText.text = msg;
                this.playerNameLab.text = userName;
            }
        }
    };

    ChatItemBox.renderHandler = function(cell, index) {
        cell.onRender(cell.dataSource,index);
    };

    return ChatItemBox;
})(ChatItemBoxUI);
