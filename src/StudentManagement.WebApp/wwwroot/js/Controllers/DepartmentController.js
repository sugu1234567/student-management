var DepartmentController = (function ($scope, $service) {
    // Lấy thông tin user từ localStorage
    var currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    // Hàm chuyển đổi role string sang number
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

    // Khởi tạo biến
    $scope.userId = currentUser.userId || 0;  // ID của user đang đăng nhập
    $scope.role = getRoleNumber(currentUser.role) || 0;  // Chuyển đổi role sang số

    console.log('User ID:', $scope.userId);
    console.log('Role:', $scope.role, '(Original:', currentUser.role + ')');

    $scope.departments = [];
    $scope.department = {};
    $scope.isEdit = false;
    $scope.searchKeyword = '';
    $scope.loading = false;

    // Các hàm buildin - dùng để khởi tạo và lấy dữ liệu
    $scope.buildin = {

        // Khởi tạo controller
        init: function () {
            console.log('Khởi tạo Department Controller');
            this.loadDepartments();
            this.resetForm();
        },

        // Lấy danh sách tất cả phòng ban
        loadDepartments: function () {
            $scope.loading = true;
            const url = `/api/Department/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.departments = response.data.data;
                        console.log('Đã tải ' + $scope.departments.length + ' phòng ban');
                    } else {
                        alert('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi tải danh sách phòng ban:', error);
                    alert('Không thể tải danh sách phòng ban');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },


        // Lấy thông tin chi tiết phòng ban theo ID
        getDepartmentById: function (id) {
            $scope.loading = true;
            const url = `/api/Department/${id}?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.department = response.data.data[0];
                        $scope.isEdit = true;
                        console.log('Đã tải thông tin phòng ban:', $scope.department);
                    } else {
                        alert('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi tải thông tin phòng ban:', error);
                    alert('Không thể tải thông tin phòng ban');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Reset form về trạng thái ban đầu
        resetForm: function () {
            $scope.department = {
                departmentId: 0,
                departmentCode: '',
                departmentName: '',
                createdBy: $scope.userId
            };
            $scope.isEdit = false;
        }
    };

    // Các hàm actions - dùng để thêm, sửa, xóa
    $scope.actions = {
        // Thêm mới hoặc cập nhật phòng ban
        save: function () {
            // Validate dữ liệu
            if (!$scope.department.departmentCode || $scope.department.departmentCode.trim() === '') {
                alert('Vui lòng nhập mã phòng ban');
                return;
            }
            if (!$scope.department.departmentName || $scope.department.departmentName.trim() === '') {
                alert('Vui lòng nhập tên phòng ban');
                return;
            }

            $scope.loading = true;

            var requestData = {
                model: {
                    departmentId: $scope.department.departmentId || 0,
                    departmentCode: $scope.department.departmentCode,
                    departmentName: $scope.department.departmentName,
                    createdBy: $scope.userId
                },
                userId: $scope.userId,
                role: $scope.role
            };

            $service.post('/api/Department/save', requestData)
                .then(function (response) {
                    if (response.data.success) {
                        alert($scope.isEdit ? 'Cập nhật phòng ban thành công!' : 'Thêm mới phòng ban thành công!');
                        $scope.buildin.resetForm();
                        $scope.buildin.loadDepartments();
                        // Đóng modal nếu có
                        $('#departmentModal').modal('hide');
                    } else {
                        alert('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi lưu phòng ban:', error);
                    alert('Không thể lưu phòng ban. Vui lòng thử lại!');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Xóa phòng ban
        delete: function (departmentId) {
            if (!confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) {
                return;
            }

            $scope.loading = true;

            const url = `/api/Department/${departmentId}?userId=${$scope.userId}&role=${$scope.role}`;
            $service.delete(url)
                .then(function (response) {
                    if (response.data.success) {
                        alert('Xóa phòng ban thành công!');
                        $scope.buildin.loadDepartments();
                    } else {
                        alert('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi xóa phòng ban:', error);
                    alert('Không thể xóa phòng ban. Có thể phòng ban đang được sử dụng!');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Mở form thêm mới
        openAddForm: function () {
            $scope.buildin.resetForm();
            $('#departmentModal').modal('show');
        },

        // Mở form chỉnh sửa
        openEditForm: function (departmentId) {
            $scope.buildin.getDepartmentById(departmentId);
            $('#departmentModal').modal('show');
        },

        // Hủy bỏ form
        cancel: function () {
            $scope.buildin.resetForm();
            $('#departmentModal').modal('hide');
        },

        // Tìm kiếm phòng ban
        search: function () {
            if (!$scope.searchKeyword || $scope.searchKeyword.trim() === '') {
                $scope.buildin.loadDepartments();
                return;
            }

            var keyword = $scope.searchKeyword.toLowerCase();
            $scope.departments = $scope.departments.filter(function (dept) {
                return (dept.departmentCode && dept.departmentCode.toLowerCase().includes(keyword)) ||
                    (dept.departmentName && dept.departmentName.toLowerCase().includes(keyword));
            });
        },

        // Làm mới danh sách
        refresh: function () {
            $scope.searchKeyword = '';
            $scope.buildin.loadDepartments();
        }
    };

    // Khởi tạo khi controller được load
    $scope.buildin.init();
});

// Inject dependencies
DepartmentController.$inject = ['$scope', '$service'];

// Đăng ký controller với AngularJS app
angular.module('StudentManagementApp')
    .controller('DepartmentController', DepartmentController);