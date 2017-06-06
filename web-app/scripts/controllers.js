(function() {
    var app = angular.module('app');

    app.controller('MainController', [
        '$scope',
        'account',
        'netManager',
        function($scope, account) {
            $scope.account = {
                name: account.account,
                scope: account.scope,
                avatar: account.avatar,
                token: account.tokens,
                country: account.country,
                province: account.province,
                city: account.city,
                id: account.id
            };
        }
    ]);

    app.controller('LoginController', [
        '$scope',
        '$location',
        'netManager',
        function($scope, $location, netManager) {
            $scope.username = "";
            $scope.password = "";
            $scope.loginFailure = false;

            $scope.onFocus = function() {
                $scope.loginFailure = false;
            };

            $scope.submit = function() {
                if ($scope.username.length < 1) {
                    return;
                }

                if ($scope.password.length < 1) {
                    return;
                }

                netManager.login({
                    username: $scope.username,
                    password: $scope.password
                }).then(function(result) {
                    if (result == true) {
                        $location.path('/main/summary');
                    } else {
                        $scope.loginFailure = true;
                    }
                })
            };
        }
    ]);

    app.controller('PurchaseController', [
        '$scope',
        function($scope) {
        }
    ]);

    app.controller('ApplyController', [
        '$scope',
        function($scope) {
        }
    ]);

    app.controller('SummaryController', [
        '$scope',
        function($scope) {
        }
    ]);

    app.controller('AccountController', [
        '$scope',
        function($scope) {

        }
    ]);

    app.controller('OrderController', [
        '$scope',
        function($scope) {
        }
    ]);

    app.controller('AgentController', [
        '$scope',
        function($scope) {
        }
    ]);

    app.controller('UserListController', [
        '$scope',
        'netManager',
        '$uibModal',
        function($scope, netManager,$uibModal) {

            /*会员列表 S*/
            $scope.users = [];

            $scope.maxSize = 5;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.pageCount = 5;

            $scope.pageChanged = function() {
                netManager.get('/users', { page: $scope.currentPage, page_count: $scope.pageCount })
                    .then(function(response) {
                        var results         = response.data;

                        $scope.totalItems   = results.count;
                        $scope.users        = results.data;
                    });
            };

            $scope.pageChanged();

            $scope.check = function (id) {
                netManager.get('/users/' + id)
                    .then(function(response) {
                        $scope.currentUser = response.data;
                    }).then(function(){
                    $uibModal.open({
                        templateUrl:"check_modal",
                        backdrop:"static",
                        animation: true,
                        resolve: {
                            user: function() {
                                return angular.copy($scope.currentUser); //向模态框控制器中传值(对象)
                            }
                        },
                        controller:function($scope,$uibModalInstance,user){
                            $scope.user = user;
                            $scope.close=function(){
                                $uibModalInstance.close();
                            }
                        }
                    })
                });
            };

            $scope.delete = function (id) {
                $uibModal.open({
                    templateUrl:"delete_modal",  //引入模板路径
                    animation: true,                            //出现的效果
                    backdrop:"static",
                    controller:function($scope,$uibModalInstance){
                        $scope.confirm = function () {
                            netManager.delete('/users/' + id)
                                .then(function() {
                                    $uibModalInstance.close();
                                    $scope.pageChanged();
                                });
                        };
                        $scope.cancel = function(){
                            $uibModalInstance.close();
                        }
                    }
                });
            };
            /*会员列表 E*/
        }
    ]);

    app.controller('rechargeController',[
        '$scope',
        'netManager',
        function ($scope, netManager) {
            $scope.data = {
                id: '',
                tokens: ''
            };

            $scope.recharge = function () {

                if($scope.data.id == null){
                    return;
                }

                if($scope.data.tokens == null){
                    return;
                }

                netManager.put('/users/' + $scope.data.id + '/tokens' ,
                    {tokens: $scope.data.tokens})
                    .then(function(result) {});
            }
        }
    ]);

    app.controller('BulletinController', [
        '$scope',
        '$uibModal',
        'netManager',
        function($scope, $uibModal, netManager) {

            $scope.bulletins = [];

            $scope.maxSize = 5;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.pageCount = 5;

            $scope.pageChanged = function() {
                netManager.get('/bulletins', { page: $scope.currentPage, page_count: $scope.pageCount })
                    .then(function(response) {
                        var results = response.data;

                        $scope.totalItems = results.count;
                        $scope.bulletins  = results.data;
                    });
            };

            $scope.pageChanged();

            /*
             * 添加公告和修改公告的规则：
             问题：不确定是否会有web技术的用户人员会修改代码，从而破坏程序，
             解决：手动在js中设置验证规则
             表单内的每个数据都不允许为空(required)
             解决：要在提交前做一次表单内数据不允许为空的认证

             "开始时间"和"结束时间" 不允许写入(readonly='readonly')，只能通过日期时间控件来选择
             解决：要在提交前做一次数据验证(/^\d{4}-\d{2}-\d{2}\s?\d{2}:\d{2}:\d{2}$/.test(datetime))

             "优先权" 允许用户只能写入(type='number')，用户能够输入的内容范围为：( 数字 和 +-. )
             我们要的是正整数，为了避免用户可能输入的内容是负数
             解决：要验证用户输入的是否为正整数(/^\d+$/.test(number))
             否：提示用户只能插入数据正数
             是：此验证通过
             * */

            $scope.testFormAllContent = function (obj) {

                if( $scope.testTimeFormat(obj) ){
                    return $scope.testTimeFormat(obj);
                }

                if( $scope.testFormContentIsNull(obj) ){
                    return $scope.testFormContentIsNull(obj);
                }

                if( $scope.testIsPositiveInteger(obj) ){
                    return $scope.testIsPositiveInteger(obj);
                }

                return;
            }

            $scope.testFormContentIsNull = function (obj) {
                var nullVal = '';
                var keyToChinese = [];
                for(var key in obj){
                    if(parseInt(obj[key]) == 0){
                        continue;
                    }
                    console.log(obj[key]);

                    if(obj[key] == '' || obj[key] == undefined){
                        switch (key){
                            case 'title':
                                keyToChinese[key] = '**标题**';
                                break;
                            case 'summary':
                                keyToChinese[key] = '**概要**';
                                break;
                            case 'content':
                                keyToChinese[key] = '**内容**';
                                break;
                            case 'startTime':
                                keyToChinese[key] = '**开始时间**';
                                break;
                            case 'title':
                                keyToChinese[key] = '**结束时间**';
                                break;
                            default:
                                keyToChinese[key] = '**优先级**';
                        }
                        nullVal += keyToChinese[key] + ' 不能为空\n\n';
                    }
                }

                if(nullVal != ''){
                    return nullVal;
                }

                return;
            }

            $scope.testTimeFormat = function (obj) {

                var formatError = '';

                if(/^\d{4}-\d{2}-\d{2}\s?\d{2}:\d{2}:\d{2}$/.test( obj.startTime ) == false){
                    formatError += '**开始时间**格式错误\n';
                }

                if(/^\d{4}-\d{2}-\d{2}\s?\d{2}:\d{2}:\d{2}$/.test( obj.endTime ) == false){
                    formatError += '**结束时间**格式错误\n';
                }
                return formatError;
            }

            $scope.testIsPositiveInteger = function (obj) {
                if(/^\d+$/.test(obj.priority) == false){
                    return '**优先级**只能输入正整数';
                }
            }

            $scope.formatTime = function (key) {
                if(/^\d{4}-\d{2}-\d{2}\s?\d{2}:\d{2}:\d{2}$/.test(key) == false){
                    return key = key.format('YYYY-MM-DD HH:mm:ss');
                }
            }

            $scope.add = function () {
                $uibModal.open({
                    templateUrl:"add_modal",
                    backdrop:"static",
                    animation: true,
                    resolve: {
                        testFormAllContent: function () {
                            return $scope.testFormAllContent;
                        },
                        formatTime: function () {
                            return $scope.formatTime;
                        },
                        pageChanged: function () {
                            return $scope.pageChanged
                        }
                    },
                    controller:function($scope, $uibModalInstance, testFormAllContent, formatTime, pageChanged){

                        $scope.bulletin = {
                            title: '',
                            summary: '',
                            content: '',
                            startTime: moment(),
                            endTime: moment().add(2, 'hours'),
                            priority: 0
                        };

                        $scope.close=function(){
                            $uibModalInstance.close();
                        }

                        $scope.addBulletin = function () {

                            $scope.bulletin.startTime = formatTime($scope.bulletin.startTime);
                            $scope.bulletin.endTime   = formatTime($scope.bulletin.endTime);

                            if( testFormAllContent($scope.bulletin) ){
                                console.log($scope.bulletin);
                                alert( testFormAllContent($scope.bulletin) );
                                return;
                            }

                            netManager.post(
                                '/bulletins',
                                { bulletin: $scope.bulletin }
                            ).then(function (result) {
                                pageChanged();
                                $scope.close();
                            });
                        }
                    }
                });
            }

            $scope.check = function (id) {
                netManager.get('/bulletins/' + id)
                    .then(function(response) {
                        $scope.currentBulletin = response.data;
                    }).then(function() {
                    $uibModal.open({
                        templateUrl: "check_modal",
                        backdrop: "static",
                        animation: true,
                        resolve: {
                            bulletin: function () {
                                return angular.copy($scope.currentBulletin);
                            },
                            testFormAllContent: function () {
                                return $scope.testFormAllContent;
                            },
                            formatTime: function () {
                                return $scope.formatTime;
                            },
                            pageChanged: function () {
                                return $scope.pageChanged;
                            }
                        },
                        controller: function ($scope, $uibModalInstance, bulletin, testFormAllContent, formatTime, pageChanged) {

                            $scope.bulletinCheck = bulletin;
                            $scope.close = function () {
                                $uibModalInstance.close();
                            }

                            $scope.bulletinCheck.startTime = moment($scope.bulletinCheck.startTime);
                            $scope.bulletinCheck.endTime   = moment($scope.bulletinCheck.endTime);

                            console.log('$scope.bulletinCheck.startTime: '+$scope.bulletinCheck.startTime);
                            console.log('$scope.bulletinCheck.endTime: '+$scope.bulletinCheck.endTime);

                            $scope.alterBulletin = function () {

                                console.log('$scope.bulletin: '+$scope.bulletin);

                                $scope.bulletinCheck.startTime = formatTime($scope.bulletinCheck.startTime);
                                $scope.bulletinCheck.endTime   = formatTime($scope.bulletinCheck.endTime);

                                if( testFormAllContent($scope.bulletinCheck) ){
                                    console.log('$scope.bulletin.startTime: '+$scope.bulletinCheck.startTime);
                                    console.log('$scope.bulletin.endTime: '+$scope.bulletinCheck.endTime);
                                    alert( testFormAllContent($scope.bulletinCheck) );
                                    return;
                                }

                                netManager.put(
                                    '/bulletins/' + $scope.bulletinCheck.id,
                                    { bulletinCheck: $scope.bulletinCheck }
                                ).then(function (result) {
                                    pageChanged();
                                    $scope.close();
                                });
                            }

                        }
                    });
                });
            }

            $scope.delete = function (id) {
                $uibModal.open({
                    templateUrl:"delete_modal",  //引入模板路径
                    animation: true,                            //出现的效果
                    backdrop:"static",
                    controller:function($scope,$uibModalInstance){
                        $scope.confirm = function () {
                            netManager.delete('/bulletins/' + id)
                                .then(function() {
                                    $uibModalInstance.close();
                                    $scope.pageChanged();
                                });
                        };
                        $scope.cancel = function(){
                            $uibModalInstance.close();
                        }
                    }
                });
            };

        }
    ]);

    app.controller('ProductController', [
        '$scope',
        function($scope) {
        }
    ]);

    app.controller('SystemController', [
        '$scope',
        function($scope) {
        }
    ]);

    app.controller('StatsController', [
        '$scope',
        function($scope) {
        }
    ]);
}());