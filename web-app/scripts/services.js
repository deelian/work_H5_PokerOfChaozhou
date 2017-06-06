(function() {
    'use strict';

    var app = angular.module('app');

    app.factory('netManager', [
        '$http',
        '$location',
        '$window',
        function($http, $location, $window) {
            var token = "";
            var server = "http://127.0.0.1:9980";
            var service = {};

            service.login = function(data) {
                data = data || {};

                var api = '/token';
                return  $http({
                    method: 'POST',
                    url: server + api,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    transformRequest: function(obj) {
                        var str = [];
                        for(var p in obj) {
                            if (obj.hasOwnProperty(p)) {
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            }
                        }
                        return str.join("&");
                    },
                    data: data
                }).then(function(response) {
                    $window.sessionStorage.setItem('token', response.data);

                    return true;
                }).catch(function(e) {
                    return false;
                });
            };

            service.logout = function() {
                $window.sessionStorage.removeItem('token');
                $location.path('/login');
            };

            service.isLoggedIn = function() {
                return $window.sessionStorage.token != null;
            };

            service.get = function(api, params) {
                return $http({
                    method: 'GET',
                    url: server + api,
                    params: params
                });
            };

            service.post = function(api, data) {
                return $http.post(server + api, data);
            };

            service.put = function(api, data) {
                return $http({
                    method: 'PUT',
                    url: server + api,
                    data: data
                });
            };

            service.delete = function(api) {
                return $http({
                    method: 'DELETE',
                    url: server + api
                });
            };

            return service;
        }
    ]);
}());
