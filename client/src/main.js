var window = window || global;

(function () {
    // 设计宽度和高度
    var designW = 1136;
    var designH = 640;

    // 初始化Laya
    Laya.init(designW, designH, Laya.WebGL);

    // 设置屏幕缩放模式
    Laya.stage.scaleMode = laya.display.Stage.SCALE_SHOWALL;

    // 设置屏幕为竖屏幕模式
    Laya.stage.screenMode = laya.display.Stage.SCREEN_HORIZONTAL;

    // 设置舞台的对齐方式
    Laya.stage.alignH = laya.display.Stage.ALIGN_CENTER;
    Laya.stage.alignV = laya.display.Stage.ALIGN_MIDDLE;

    // 创建应用
    var app = window.App = Application;

    // 加载配置文件
    Laya.loader.load(                               // Laya.LoadManager.load - 加载资源
        "project.json",                             // url:* — 单个资源地址，或者资源地址数组(简单数组：["a.png","b.png"]，复杂数组[{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSON,size:50,priority:1}])。
        Laya.Handler.create(null, Main),            // complete:Handler (default = null) — 结束回调，如果加载失败，则返回 null 。
        null,                                       // progress:Handler (default = null) — 进度回调，回调参数为当前文件加载的进度信息(0-1)。
        null,                                       // type:String (default = null) — 资源类型。比如：Loader.IMAGE
        1,                                          // priority:int (default = 1) — 优先级，0-4，5个优先级，0优先级最高，默认为1。
        false,                                      // cache:Boolean (default = true) — 是否缓存加载结果。
        null,                                       // group:String (default = null) — 分组，方便对资源进行管理。
        true                                        // ignoreCache:Boolean (default = false) — 是否忽略缓存，强制重新加载
    );

    // 主程序入口
    function Main(config) {
        app.config = config;

        // 通过传参的方式改变project.json的默认配置
        var params = URLUtils.getParams();
        Object.keys(params).forEach(function(key) {
            console.log(key);
            if (config.hasOwnProperty(key)) {
                console.log(key);
                app.config[key] = params[key];
            }
        });

        // 打开监视窗口
        if (config.showFPS) {
            Laya.Stat.show();
            Laya.alertGlobalError = true;
        }

        if (config.frameRate) {
            Laya.stage.frameRate = "mouse";
        }

        // 初始化应用
        app.init();

        // 预先加载加载画面的资源
        Laya.loader.load(app.assetsManager.getLoaderRes(), Laya.Handler.create(app, app.start));
    }
} ());


