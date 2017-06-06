(function() {
    var app = angular.module('app');

    app.config([
        '$locationProvider',
        '$httpProvider',
        function($locationProvider, $httpProvider, $resourceProvider) {
            $locationProvider.hashPrefix('#');

            $httpProvider.interceptors.push([
                '$q',
                '$location',
                '$window',
                function($q, $location, $window) {
                    return {
                        'request': function (config) {
                            config.headers = config.headers || {};
                            if ($window.sessionStorage.token) {
                                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                            }
                            return config;
                        },
                        'responseError': function(response) {
                            var status = response.status;
                            var data   = response.data;

                            if (status == 401 || status == 403) {
                                $location.path('/login');
                            }

                            console.log("responseError: ", status, data.code, data.error, data.description);
                            return $q.reject(response);
                        }
                    };
                }
            ]);
        }
    ]);

    app.config([
        '$stateProvider',
        '$urlRouterProvider',
        '$ocLazyLoadProvider',
        'IdleProvider',
        'KeepaliveProvider',
        function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider) {
            // Configure Idle settings
            IdleProvider.idle(5); // in seconds
            IdleProvider.timeout(120); // in seconds
    
            $urlRouterProvider.otherwise("/login");
    
            $ocLazyLoadProvider.config({
                // Set to true if you want to see what and when is dynamically loaded
                debug: true
            });
    
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: "views/login.html",
                    controller:  "LoginController as login",
                    data: { pageTitle: 'Login', bgClass: 'gray-bg' },
                    resolve: {
                    }
                })

                .state('main', {
                    abstract: true,
                    url: "/main",
                    templateUrl: "views/main.html",
                    controller: "MainController as main",
                    data: { pageTitle: 'Main' },
                    resolve: {
                        'account': function(netManager) {
                            return netManager.get('/me')
                                .then(function(response) {
                                    return response.data;
                                })
                                .catch(function(e) {
                                    return null;
                                });
                        }
                    }
                })

                .state('main.summary', {
                    url: "/summary",
                    templateUrl: "views/main/summary.html",
                    controller:  "SummaryController as summary",
                    resolve: {
                        loadPlugin: function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    serie: true,
                                    name: 'angular-flot',
                                    files: [ 'js/plugins/flot/jquery.flot.js', 'js/plugins/flot/jquery.flot.time.js', 'js/plugins/flot/jquery.flot.tooltip.min.js', 'js/plugins/flot/jquery.flot.spline.js', 'js/plugins/flot/jquery.flot.resize.js', 'js/plugins/flot/jquery.flot.pie.js', 'js/plugins/flot/curvedLines.js', 'js/plugins/flot/angular-flot.js' ]
                                },
                                {
                                    files: ['js/plugins/sparkline/jquery.sparkline.min.js']
                                }
                            ]);
                        }
                    }
                })
                
                .state('main.account', {
                    abstract: true,
                    url: "/account",
                    templateUrl: "views/common/common.html",
                    resolve: {
                    }
                })
                .state('main.account.basics', {
                    url: "/basics",
                    templateUrl: "views/main/account/basics.html"
                })
                .state('main.account.bind', {
                    url: "/bind",
                    templateUrl: "views/main/account/view-bind.html"
                })
                .state('main.account.center', {
                    url: "/center",
                    templateUrl: "views/main/account/view-center.html"
                })

                .state('main.agents', {
                    //abstract: true,
                    url: "/agents",
                    templateUrl: "views/main/agents.html",
                    resolve: {
                    }
                })

                .state('main.users', {
                    abstract: true,
                    url: "/users",
                    templateUrl: "views/common/common.html"
                })
                .state('main.users.list', {
                    url: "/list",
                    templateUrl: "views/main/users/list.html",
                    controller: "UserListController as user"
                })
                .state('main.users.online', {
                    url: "/online",
                    templateUrl: "views/main/users/online.html"
                })
                .state('main.users.recharge', {
                    url: "/recharge",
                    templateUrl: "views/main/users/recharge.html",
                    controller: "rechargeController"
                })

                .state('main.orders', {
                    abstract: true,
                    url: "/orders",
                    templateUrl: "views/main/account.html"
                })
                .state('main.orders.list', {
                    //abstract: true,
                    url: "/list",
                    templateUrl: "views/main/account.html"
                })
                .state('main.orders.review', {
                    //abstract: true,
                    url: "/review",
                    templateUrl: "views/main/account.html"
                })

                .state('main.products', {
                    url: '/products',
                    templateUrl: "views/main/products.html",
                    //controller: "ApplyController",
                    data: { pageTitle: 'Apply' }
                })

                .state('main.system', {
                    url: '/system',
                    templateUrl: "views/main/system.html",
                    //controller: "ApplyController",
                    data: { pageTitle: 'Apply' }
                })

                .state('main.apply', {
                    url: '/apply',
                    templateUrl: "views/main/apply.html",
                    //controller: "ApplyController",
                    data: { pageTitle: 'Apply' }
                })

                .state('main.purchase', {
                    url: '/purchase',
                    templateUrl: "views/main/purchase.html",
                    //controller: "ApplyController",
                    data: { pageTitle: 'Purchase' }
                })

                .state('main.bulletin', {
                    url: '/bulletin',
                    templateUrl: "views/main/bulletin.html",
                    controller: "BulletinController",
                    data: { pageTitle: 'Bulletin' },
                    resolve: {
                        loadPlugin: function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'datePicker',
                                    files: ['css/plugins/datapicker/angular-datapicker.css','js/plugins/datapicker/angular-datepicker.js']
                                }
                            ]);
                        }
                    }
                })

                .state('main.stats', {
                    abstract: true,
                    url: '/stats',
                    templateUrl: "views/main/stats.html"
                })
                .state('main.stats.new-users', {
                    url: '/new-users',
                    templateUrl: "views/main/purchase.html"
                    //controller: "ApplyController"
                })
                .state('main.stats.active-users', {
                    url: '/active-users',
                    templateUrl: "views/main/purchase.html"
                    //controller: "ApplyController"
                })
                .state('main.stats.consume', {
                    url: '/consume',
                    templateUrl: "views/main/purchase.html"
                    //controller: "ApplyController"
                })
                .state('main.stats.payments', {
                    url: '/payments',
                    templateUrl: "views/main/purchase.html"
                    //controller: "ApplyController"
                })

            ;
        }
    ]);

    app.run([
        '$rootScope',
        '$state',
        'netManager',
        function($rootScope, $state, netManager) {
            $rootScope.$state = $state;
            $rootScope.$on('$stateChangeStart', function(event, to, toParams, from, fromParams) {

                if (netManager.isLoggedIn() === false) {
                    if (to.name.match(/^main/)) {
                        event.preventDefault();
                        $state.go('login');
                    }
                }
            });

            $rootScope.$on('$stateChangeSuccess', function() {

            });

            $rootScope.$on('$stateChangeError', function() {

            });
        }
    ]);
}());