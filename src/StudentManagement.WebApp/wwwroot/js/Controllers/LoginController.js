app.controller('LoginController', ['$scope', '$service', '$http', 'ToastService', function ($scope, $service, $http, ToastService) {
    $scope.loginModel = {
        username: '',
        password: ''
    };

    $scope.login = function () {
        if (!$scope.loginModel.username || !$scope.loginModel.password) {
            ToastService.warning('Vui lòng nhập tài khoản và mật khẩu!');
            return;
        }

        $service.post('/api/Auth/login', $scope.loginModel)
            .then(function (response) {
                if (response.data.success) {
                    localStorage.setItem('currentUser', JSON.stringify(response.data));

                    // Gắn token mặc định vào header
                    $http.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;

                    ToastService.success('Đăng nhập thành công!');
                    window.location.href = '/'; //
                } else {
                    ToastService.error('Sai tài khoản hoặc mật khẩu!');
                }
            })
            .catch(function (error) {
                console.error('Lỗi đăng nhập:', error);
                ToastService.error('Không thể đăng nhập. Kiểm tra API.');
            });
    };
}]);
