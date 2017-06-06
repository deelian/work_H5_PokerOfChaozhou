var ChatViewDialog = (function(_super) {

    function StatementsItem() {
        StatementsItem.super(this);
        this.size(350, 50);

        this.downLint = new Laya.Image();
        this.downLint.skin = "assets/ui.room/chat/img_Divide.png";
        this.downLint.pivot(this.downLint.width/2, this.downLint.height/2);
        this.downLint.x = this.width/2;
        this.downLint.y = this.height - this.downLint.height/2;
        this.addChild(this.downLint);

        this.statement = new Laya.Label();
        this.statement.font = "Microsoft YaHei";
        this.statement.fontSize = 25;
        this.statement.color = "#ffffff";
        this.addChild(this.statement);

        this.setData = function(src)
        {
            //for(var i = 0; i < src.length ; i++)
            //{
                this.statement.text = src;
                //this.statement.text = src[i];

                if(this.statement.width > this.width)
                {
                    // 换多少行
                    var wrapCount = Math.ceil(this.statement.width/this.width);
                    this.statement.height *= wrapCount;
                    this.statement.wordWrap = true;
                    this.statement.width = this.width;
                }

                this.statement.pivot(0,this.statement.height/2);
                this.statement.x = 20;
                this.statement.y = this.height/2;
            //}
        }
    }

    Laya.class(StatementsItem, "StatementsItem", Laya.Box);


    function ExpressionItem() {
        ExpressionItem.super(this);
        this.size(350, 100);

        this.imageContent = [];

        this.setData = function(src)
        {
            var img;
            for(var i = 0 ; i < src.length ; i++)
            {
                if(this.imageContent[i])
                {
                    //this.imageContent[i].skin = src[i].skin;
                    //this.imageContent[i].x = src[i].pos.x;
                    //this.imageContent[i].y = src[i].pos.y;
                }
                else
                {
                    img = src[i].img;
                    this.addChild(img);
                    this.imageContent.push(img)
                }
            }
        }
    }

    Laya.class(ExpressionItem, "ExpressionItem", Laya.Box);


    function ChatViewDialog() {
        ChatViewDialog.super(this);

        this.boxContent = [
            this.normalInputBox,
            this.expressionBox,
            this.chatInpuBox
        ];

        this.chatData = null;

        this.chatInputLab.on(Laya.Event.INPUT,this,this.changInputText);

        this.initTouchEvent();

        this.initChatList();
        this.initChatRecord();
        this.initStatementsList();
        this.initExpressionList();
    }

    Laya.class(ChatViewDialog, "ChatViewDialog", _super);

    ChatViewDialog.prototype.initTouchEvent = function() {
        this.normalBtn.on(Laya.Event.CLICK,this,this.onClick,[this.normalInputBox]);
        this.expressionBtn.on(Laya.Event.CLICK,this,this.onClick,[this.expressionBox]);
        this.chatClickBtn.on(Laya.Event.CLICK,this,this.onClick,[this.chatInpuBox]);
        this.sandBtn.on(Laya.Event.CLICK,this,this.sendChat);

        App.tableManager.on(RoomTableMgr.EVENT.SAND_CHAT_DATA, this, this.showSendChat);
    };

    ChatViewDialog.prototype.initStatementsList = function() {

        this.statementsList.vScrollBarSkin = "";
        this.statementsList.itemRender = StatementsItem;
        this.statementsList.mouseHandler = new Laya.Handler(this, this.onStatementsItem);
        this.statementsList.renderHandler = new Laya.Handler(this, this.updateStatementsItem);
        this.statementsList.selectEnable = true;

        var listWidth = this.statementsList.width;
        var listHeight = this.statementsList.height;

        var statements = Game.Game.Chat.normal;
        var statement;
        var wrapCount;
        var pagesData = [];
        var posX = 5;

        for(var i = 0 ; i < statements.length ; i++)
        {
            //statement = createLabel(statements[i]);
            //statement.x = posX;
            //
            //if(statement.width > listWidth)
            //{
            //    // 换多少行
            //    wrapCount = Math.ceil(statement.width/listWidth);
            //    statement.height *= wrapCount;
            //    statement.wordWrap = true;
            //    statement.width = listWidth;
            //}
            //
            //statement.pivot(0,statement.height/2);

            //pagesData[i] = [];
            pagesData.push(statements[i]);
        }

        this.statementsList.repeatX = 1;
        this.statementsList.repeatY = pagesData.length;

        this.statementsList.array = pagesData;
    };

    ChatViewDialog.prototype.updateStatementsItem = function(cell) {
        //console.log("cell.dataSource = ");
        //console.log(cell.dataSource);
        cell.setData(cell.dataSource);
    };

    ChatViewDialog.prototype.onStatementsItem = function(e, index){
        //console.log("index == " + index);
        //console.log("this.statementsList.cells == ");
        //console.log(this.statementsList.startIndex);
        var mouseEvenType = e.type;
        if (mouseEvenType == Laya.Event.CLICK) {
            var src = this.statementsList.cells[index - this.statementsList.startIndex].dataSource;

            this.chatData = src;
            this.sendChat();
            this.onClick(this.chatInpuBox);
        }
    };

    ChatViewDialog.prototype.initExpressionList = function() {
        this.expressionList.vScrollBarSkin = "";
        this.expressionList.itemRender = ExpressionItem;
        this.expressionList.renderHandler = new Laya.Handler(this, this.updateExpressionItem);
        this.expressionList.selectEnable = true;

        var listWidth = this.expressionList.width;
        var listHeight = this.expressionList.height;

        var expressions = Game.Game.Chat.expression;
        var pagesData = [];
        var index = 0;
        var img;
        var widthCount = 0;
        var heightCount = 0;
        var widthLeading = 20;
        var heightLeading = 5;

        for(var i = 0 ; i < expressions.length ; i++)
        {
            img = new Laya.Image();
            img.skin = "assets/ui.room/chat/expression/"+expressions[i].img;
            img.name = expressions[i].code;
            img.on(Laya.Event.CLICK,this,this.onExpressionClick);

            if((widthCount + img.width) > listWidth)
            {
                index = index + 1;
                widthCount = 0;
                heightCount = heightCount + img.height + heightLeading;
            }
            img.x = widthCount;
            widthCount = widthCount + img.width + widthLeading;
            img.y = 10;

            pagesData[index] = pagesData[index] || [];
            pagesData[index].push({img: img});
        }

        this.expressionList.repeatX = 1;

        this.expressionList.repeatY = pagesData.length;

        this.expressionList.array = pagesData;
    };

    ChatViewDialog.prototype.updateExpressionItem = function(cell) {
        cell.setData(cell.dataSource);
    };

    ChatViewDialog.prototype.onExpressionClick = function(e) {
        var target = e.target;

        this.chatData = target.name;
        this.sendChat();
        this.onClick(this.chatInpuBox);
    };

    ChatViewDialog.prototype.initChatRecord = function () {
        var chatRecordList = App.tableManager.getChatSaveList();
        for (var i = 0; i < chatRecordList.length; i++) {
            var info = chatRecordList[i];
            this.showSendChat(info);
        }
    };

    ChatViewDialog.prototype.initChatList = function () {
        var array = [];
        var list = new laya.ui.List();
        var render = ChatItemBox || new laya.ui.Box() ;

        list.array = array;
        list.itemRender = render || new laya.ui.Box();

        list.x = 0;
        list.y = 0;
        list.width = this.chatList.width;
        list.height = this.chatList.height;

        list.spaceY = 10;
        list.vScrollBarSkin = "";

        list.renderHandler = render.renderHandler ? new Laya.Handler(render, render.renderHandler) : null;

        this._chatShowList = list;

        this.chatList.addChild(list);
    };

    ChatViewDialog.prototype.changInputText = function(e) {
        this.chatData = e.text;
    };

    ChatViewDialog.prototype.showSendChat = function (info) {
        var userID = info.userID; //*谁发送的
        var msg = info.msg;
        var userName = info.name || "游客";

        var expressions = Game.Game.Chat.expression;
        if(msg.indexOf("/") != -1) {
            for (var i = 0; i < expressions.length; i++) {
                if (expressions[i].code == msg) {
                    msg = "assets/ui.room/chat/expression/" + expressions[i].img;
                    break;
                }
            }
        }

        this._chatShowList.addItem({userID: userID, msg: msg , userName: userName});

        var chatListLength = this._chatShowList.length;
        this._chatShowList.scrollTo(chatListLength - 1);
    };

    ChatViewDialog.prototype.sendChat = function () {
        if (!this.chatData) {
            return;
        }
        //var chatData = this.chatInputLab.text;
        var self = this;
        var complete = function (err, data) {
            if (err) {

            }
            else {
                self.chatInputLab.text = "";
                self.chatData = null;
            }
        };
        App.netManager.send(
            "room.handler.chat",
            {
                data: this.chatData
            },
            Laya.Handler.create(null, complete)
        );
    };

    ChatViewDialog.prototype.onClick = function(showBox) {
        showBox.visible = true;

        for(var i = 0 ; i < this.boxContent.length ; i++)
        {
            if(this.boxContent[i] != showBox)
            {
                this.boxContent[i].visible = false;
            }
        }
    };

    return ChatViewDialog;
}(ChatViewDialogUI));