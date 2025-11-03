var TeacherController = (function ($scope, $service, ToastService) {

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
    function getGenderNumber(genderString) {
        switch (genderString) {
            case 'Nam':
            case 'Male':
                return 1;
            case 'Nữ':
            case 'Female':
                return 2;
            case 'Khác':
            case 'Other':
                return 3;
            default:
                return 3;
        }
    }
    $scope.userId = currentUser.userId || 0;
    $scope.role = getRoleNumber(currentUser.role) || 0;
    $scope.teachers = [];
    $scope.filteredTeachers = [];
    $scope.teacher = {};
    $scope.isEdit = false;
    $scope.searchKeyword = '';
    $scope.loading = false;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 5;

    $scope.buildin = {

        // Khởi tạo controller
        init: function () {
            this.loadTeachers();
            this.resetForm();
        },

        loadTeachers: function () {
            $scope.loading = true;
            const url = `/api/Teacher/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.teachers = response.data.data;
                        $scope.filteredTeachers = $scope.teachers;
                    } else {
                        ToastService.error('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể tải danh sách giáo viên');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        getTeacherById: function (id) {
            $scope.loading = true;
            const url = `/api/Teacher/${id}?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.teacher = response.data.data[0];
                        $scope.isEdit = true;
                    } else {
                        ToastService.error('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể tải thông tin giáo viên');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        searchTeachers: function (keyword) {
            if (!keyword || keyword.trim() === '') {
                return $scope.teachers;
            }

            $scope.loading = true;
            const url = `/api/Teacher/search?keyword=${encodeURIComponent(keyword)}&userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.filteredTeachers = response.data.data;
                    } else {
                        ToastService.error('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi tìm kiếm giáo viên:', error);
                    ToastService.error('Không thể tìm kiếm giáo viên');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Reset form về trạng thái ban đầu
        resetForm: function () {
            $scope.teacher = {
                teacherId: 0,
                teacherCode: '',
                fullName: '',
                email: '',
                phone: '',
                dateOfBirth: null,
                gender: "Nam",
                address: '',
                departmentId: 0,
                createdBy: $scope.userId,
                username: '',
                password: ''
            };
            $scope.isEdit = false;
        },

        getPaginatedTeachers: function () {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;
            return $scope.filteredTeachers.slice(begin, end);
        },

        getTotalPages: function () {
            return Math.ceil($scope.filteredTeachers.length / $scope.itemsPerPage);
        }
    };

    $scope.actions = {
        // Thêm mới hoặc cập nhật giáo viên
        save: function () {
            // Validate dữ liệu
            if (!$scope.teacher.teacherCode || $scope.teacher.teacherCode.trim() === '') {
                ToastService.warning('Vui lòng nhập mã giáo viên');
                return;
            }
            if (!$scope.teacher.fullName || $scope.teacher.fullName.trim() === '') {
                ToastService.warning('Vui lòng nhập họ tên giáo viên');
                return;
            }
            if (!$scope.teacher.email || $scope.teacher.email.trim() === '') {
                ToastService.warning('Vui lòng nhập email');
                return;
            }
            // Validate email format
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test($scope.teacher.email)) {
                ToastService.warning('Email không hợp lệ');
                return;
            }
            if (!$scope.teacher.phone || $scope.teacher.phone.trim() === '') {
                ToastService.warning('Vui lòng nhập số điện thoại');
                return;
            }

            $scope.loading = true;

            var requestData = {
                model: {
                    teacherId: $scope.teacher.teacherId || 0,
                    teacherCode: $scope.teacher.teacherCode,
                    fullName: $scope.teacher.fullName,
                    dateOfBirth: $scope.teacher.dateOfBirth,
                    gender: getGenderNumber($scope.teacher.gender),
                    email: $scope.teacher.email,
                    phone: $scope.teacher.phone,
                    address: $scope.teacher.address || '',
                    departmentId: $scope.teacher.departmentId || 0,
                    createdBy: $scope.userId,
                    username: $scope.teacher.username || '',
                    password: $scope.teacher.password || ''
                },
                userId: $scope.userId,
                role: $scope.role
            };

            $service.post('/api/Teacher/save', requestData)
                .then(function (response) {
                    if (response.data.success) {
                        ToastService.success($scope.isEdit ? 'Cập nhật giáo viên thành công!' : 'Thêm mới giáo viên thành công!');
                        $scope.buildin.resetForm();
                        $scope.buildin.loadTeachers();
                        // Đóng modal nếu có
                        $('#teacherModal').modal('hide');
                    } else {
                        ToastService.error('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể lưu giáo viên. Vui lòng thử lại!');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Xóa giáo viên
        delete: function (teacherId) {
            if (!confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
                return;
            }

            $scope.loading = true;

            const url = `/api/Teacher/${teacherId}?userId=${$scope.userId}&role=${$scope.role}`;
            $service.delete(url)
                .then(function (response) {
                    if (response.data.success) {
                        ToastService.success('Xóa giáo viên thành công!');
                        $scope.buildin.loadTeachers();
                    } else {
                        ToastService.error('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    ToastService.error(response.data.message);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Mở form thêm mới
        openAddForm: function () {
            $scope.buildin.resetForm();
            $('#teacherModal').modal('show');
        },

        // Mở form chỉnh sửa
        openEditForm: function (teacherId) {
            $scope.buildin.getTeacherById(teacherId);
            $('#teacherModal').modal('show');
        },

        // Hủy bỏ form
        cancel: function () {
            $scope.buildin.resetForm();
            $('#teacherModal').modal('hide');
        },

        // Tìm kiếm giáo viên
        search: function () {
            if (!$scope.searchKeyword || $scope.searchKeyword.trim() === '') {
                $scope.filteredTeachers = $scope.teachers;
                $scope.currentPage = 1;
                return;
            }

            $scope.buildin.searchTeachers($scope.searchKeyword);
            $scope.currentPage = 1;
        },

        // Làm mới danh sách
        refresh: function () {
            $scope.searchKeyword = '';
            $scope.currentPage = 1;
            $scope.buildin.loadTeachers();
        },

        // Phân trang
        goToPage: function (page) {
            if (page >= 1 && page <= $scope.buildin.getTotalPages()) {
                $scope.currentPage = page;
            }
        },

        previousPage: function () {
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
            }
        },

        nextPage: function () {
            if ($scope.currentPage < $scope.buildin.getTotalPages()) {
                $scope.currentPage++;
            }
        }
    };

    // Khởi tạo khi controller được load
    $scope.buildin.init();
});

// Inject dependencies
TeacherController.$inject = ['$scope', '$service', 'ToastService'];

// Đăng ký controller với AngularJS app
angular.module('StudentManagementApp')
    .controller('TeacherController', TeacherController);