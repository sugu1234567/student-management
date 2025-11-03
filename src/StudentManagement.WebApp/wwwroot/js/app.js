var app = angular.module('StudentManagementApp', []);

// Cấu hình Interceptor để đính token vào header
app.factory('authInterceptor', ['$q', function ($q) {
    return {
        request: function (config) {
            var currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                var userObj = JSON.parse(currentUser);
                if (userObj.token) {
                    config.headers.Authorization = 'Bearer ' + userObj.token;
                }
            }
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                window.location.href = '/Login';
            }
            return $q.reject(rejection);
        }
    };
}]);

// Gắn interceptor vào $httpProvider
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
}]);