var UserController = (function ($scope, $service, ToastService) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    function getRoleNumber(roleString) {
        switch (roleString) {
            case 'Admin':
                return 1;
            case 'Teacher':
                return 2;
            case 'Student':
                return 3;
            default:
                return 0;
        }
    }

    $scope.userId = currentUser.userId || 0;
    $scope.role = getRoleNumber(currentUser.role) || 0;
    $scope.users = [];
    $scope.user = {};
    $scope.isEdit = false;
    $scope.loading = false;
    $scope.searchKeyword = '';
    $scope.filterRole = null;

    $scope.buildin = {
        init: function () {
            if ($scope.role !== 1) {
                ToastService.error('Bạn không có quyền truy cập trang này');
                window.location.href = '/';
                return;
            }
            this.loadUsers();
            this.resetForm();
        },

        loadUsers: function () {
            $scope.loading = true;
            const url = `/api/User/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success || response.data.Success) {
                        $scope.users = response.data.data || response.data;
                    } else {
                        ToastService.error('Lỗi: ' + (response.data.message || response.data.Message));
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể tải danh sách tài khoản');
                    console.error('Load users error:', error);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        searchUsers: function () {
            $scope.loading = true;
            var params = [
                `userId=${$scope.userId}`,
                `role=${$scope.role}`
            ];

            if ($scope.searchKeyword && $scope.searchKeyword.trim() !== '') {
                params.push('keyword=' + encodeURIComponent($scope.searchKeyword.trim()));
            }
            if ($scope.filterRole && $scope.filterRole !== '' && $scope.filterRole !== null) {
                params.push('roleFilter=' + $scope.filterRole);
            }

            var queryString = '?' + params.join('&');

            $service.get('/api/User/search' + queryString)
                .then(function (response) {
                    $scope.users = response.data.data || response.data;
                })
                .catch(function (error) {
                    ToastService.error('Không thể tìm kiếm tài khoản');
                    console.error('Search users error:', error);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        resetForm: function () {
            $scope.user = {
                userId: 0,
                username: '',
                password: '',
                confirmPassword: '',
                email: '',
                fullName: '',
                role: 3, // Mặc định là Sinh viên
                isActive: true
            };
            $scope.isEdit = false;
        }
    };

    $scope.actions = {
        save: function () {
            // Validation
            if (!$scope.user.username || $scope.user.username.trim() === '') {
                ToastService.warning('Vui lòng nhập tên đăng nhập');
                return;
            }
            if (!$scope.isEdit) {
                if (!$scope.user.password || $scope.user.password.trim() === '') {
                    ToastService.warning('Vui lòng nhập mật khẩu');
                    return;
                }
                if ($scope.user.password !== $scope.user.confirmPassword) {
                    ToastService.warning('Mật khẩu xác nhận không khớp');
                    return;
                }
                if ($scope.user.password.length < 6) {
                    ToastService.warning('Mật khẩu phải có ít nhất 6 ký tự');
                    return;
                }
            }
            if (!$scope.user.email || $scope.user.email.trim() === '') {
                ToastService.warning('Vui lòng nhập email');
                return;
            }
            if (!$scope.user.fullName || $scope.user.fullName.trim() === '') {
                ToastService.warning('Vui lòng nhập họ tên');
                return;
            }
            if (!$scope.user.role) {
                ToastService.warning('Vui lòng chọn vai trò');
                return;
            }

            $scope.loading = true;

            var requestData = {
                data: {
                    userId: $scope.user.userId || 0,
                    username: $scope.user.username,
                    password: $scope.user.password,
                    email: $scope.user.email,
                    fullName: $scope.user.fullName,
                    role: $scope.user.role,
                    isActive: $scope.user.isActive
                },
                userId: $scope.userId,
                role: $scope.role
            };

            const url = `/api/User/save?userId=${$scope.userId}&role=${$scope.role}`;
            $service.post(url, requestData)
                .then(function (response) {
                    if (response.data.success || response.data.Success) {
                        ToastService.success(
                            response.data.message || response.data.Message ||
                            ($scope.isEdit ? 'Cập nhật tài khoản thành công!' : 'Thêm tài khoản thành công!')
                        );
                        $scope.buildin.resetForm();
                        $scope.buildin.loadUsers();
                        $('#userModal').modal('hide');
                    } else {
                        ToastService.error('Lỗi: ' + (response.data.message || response.data.Message));
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể lưu tài khoản. Vui lòng thử lại!');
                    console.error('Save user error:', error);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        delete: function (userId) {
            if (userId === $scope.userId) {
                ToastService.error('Không thể xóa tài khoản của chính bạn');
                return;
            }

            if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
                return;
            }

            $scope.loading = true;

            const url = `/api/User/${userId}?userId=${$scope.userId}&role=${$scope.role}`;
            $service.delete(url)
                .then(function (response) {
                    if (response.data.success || response.data.Success) {
                        ToastService.success('Xóa tài khoản thành công!');
                        $scope.buildin.loadUsers();
                    } else {
                        ToastService.error('Lỗi: ' + (response.data.message || response.data.Message));
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi xóa tài khoản:', error);
                    ToastService.error('Không thể xóa tài khoản. Vui lòng thử lại!');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        toggleStatus: function (user) {
            if (user.userId === $scope.userId) {
                ToastService.error('Không thể thay đổi trạng thái tài khoản của chính bạn');
                return;
            }

            var newStatus = !user.isActive;
            var action = newStatus ? 'mở khóa' : 'khóa';

            if (!confirm('Bạn có chắc chắn muốn ' + action + ' tài khoản này?')) {
                return;
            }

            $scope.loading = true;

            var requestData = {
                userId: user.userId,
                isActive: newStatus
            };

            const url = `/api/User/toggle-status?userId=${$scope.userId}&role=${$scope.role}`;
            $service.post(url, requestData)
                .then(function (response) {
                    if (response.data.success || response.data.Success) {
                        ToastService.success(response.data.message || response.data.Message);
                        $scope.buildin.loadUsers();
                    } else {
                        ToastService.error('Lỗi: ' + (response.data.message || response.data.Message));
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi thay đổi trạng thái:', error);
                    ToastService.error('Không thể thay đổi trạng thái tài khoản!');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        resetPassword: function (user) {
            var newPassword = prompt('Nhập mật khẩu mới (tối thiểu 6 ký tự):');
            if (!newPassword) return;

            if (newPassword.length < 6) {
                ToastService.warning('Mật khẩu phải có ít nhất 6 ký tự');
                return;
            }

            $scope.loading = true;

            var requestData = {
                userId: user.userId,
                newPassword: newPassword
            };

            const url = `/api/User/reset-password?userId=${$scope.userId}&role=${$scope.role}`;
            $service.post(url, requestData)
                .then(function (response) {
                    if (response.data.success || response.data.Success) {
                        ToastService.success('Reset mật khẩu thành công!');
                    } else {
                        ToastService.error('Lỗi: ' + (response.data.message || response.data.Message));
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi reset mật khẩu:', error);
                    ToastService.error('Không thể reset mật khẩu!');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        openAddForm: function () {
            $scope.buildin.resetForm();
            $('#userModal').modal('show');
        },

        openEditForm: function (userItem) {
            $scope.user = angular.copy(userItem);
            $scope.user.password = '';
            $scope.user.confirmPassword = '';
            $scope.isEdit = true;
            $('#userModal').modal('show');
        },

        cancel: function () {
            $scope.buildin.resetForm();
            $('#userModal').modal('hide');
        },

        onKeywordSearch: function () {
            $scope.buildin.searchUsers();
        },

        onRoleFilterChange: function () {
            $scope.buildin.searchUsers();
        },

        refresh: function () {
            $scope.searchKeyword = '';
            $scope.filterRole = null;
            $scope.buildin.loadUsers();
        },

        getRoleLabel: function (role) {
            switch (role) {
                case 1: return 'Admin';
                case 2: return 'Giáo viên';
                case 3: return 'Sinh viên';
                default: return 'Không xác định';
            }
        }

    };

    $scope.roles = [
        { value: 1, label: 'Admin' },
        { value: 2, label: 'Giáo viên' },
        { value: 3, label: 'Sinh viên' }
    ];

    // Khởi tạo
    $scope.buildin.init();
});

UserController.$inject = ['$scope', '$service', 'ToastService'];

angular.module('StudentManagementApp')
    .controller('UserController', UserController);