var ClassController = (function ($scope, $service, ToastService) {
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
    $scope.classes = [];
    $scope.class = {};
    $scope.isEdit = false;
    $scope.searchKeyword = '';
    $scope.loading = false;
    $scope.departments = [];
    $scope.filteredStudents = [];


    console.log('User ID:', $scope.userId);
    console.log('Role:', $scope.role, '(Original:', currentUser.role + ')');

    $scope.buildin = {

        init: function () {

            var currentPath = window.location.pathname.toLowerCase();

            if (currentPath.includes('/class/classstudents')) {
                var selectedClass = JSON.parse(localStorage.getItem('selectedClass') || '{}');

                $scope.classId = selectedClass.classId;
                $scope.className = selectedClass.className || 'Đang tải...';

                if ($scope.classId) {
                    this.loadStudents();
                } else {
                    ToastService.error('Không tìm thấy thông tin lớp học');
                    window.location.href = '/class';
                }
            } else {
                this.loadClasses();
                this.loadDepartments();
                this.resetForm();
            }
        },

        loadClasses: function () {
            $scope.loading = true;
            const url = `/api/Class/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.classes = response.data.data;
                        $scope.filteredStudents = $scope.students;
                    } else {
                        ToastService.error('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể tải danh sách lớp học');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        loadDepartments: function () {
            const url = `/api/Department/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.departments = response.data.data;
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi tải danh sách khoa:', error);
                });
        },

        loadStudents: function () {
            $scope.loading = true;
            const url = `/api/Student/by-class/${$scope.classId}?userId=${$scope.userId}&role=${$scope.role}`;

            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.students = response.data.data.map(function (student) {
                            if (student.gender === 1) {
                                student.gender = 'Nam';
                            } else if (student.gender === 2) {
                                student.gender = 'Nữ';
                            } else {
                                student.gender = 'Khác';
                            }
                            return student;
                        });

                        $scope.filteredStudents = $scope.students;

                        if ($scope.students.length === 0) {
                            ToastService.warning('Lớp này chưa có sinh viên');
                        }
                    } else {
                        ToastService.error('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể tải danh sách sinh viên');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Reset form về trạng thái ban đầu
        resetForm: function () {
            $scope.class = {
                classId: 0,
                className: '',
                departmentId: 0,
                createdBy: $scope.userId
            };
            $scope.isEdit = false;
        }
    };

    $scope.actions = {
        save: function () {
            if (!$scope.class.className || $scope.class.className.trim() === '') {
                ToastService.warning('Vui lòng nhập tên lớp học');
                return;
            }
            if (!$scope.class.departmentId || $scope.class.departmentId === 0) {
                ToastService.warning('Vui lòng chọn khoa');
                return;
            }

            $scope.loading = true;

            var requestData = {
                model: {
                    classId: $scope.class.classId || 0,
                    className: $scope.class.className,
                    departmentId: $scope.class.departmentId,
                    createdBy: $scope.userId
                },
                userId: $scope.userId,
                role: $scope.role
            };

            $service.post('/api/Class/save', requestData)
                .then(function (response) {
                    if (response.data.success) {
                        ToastService.success($scope.isEdit ? 'Cập nhật lớp học thành công!' : 'Thêm mới lớp học thành công!');
                        $scope.buildin.resetForm();
                        $scope.buildin.loadClasses();
                        $('#classModal').modal('hide');
                    } else {
                        ToastService.error('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể lưu lớp học. Vui lòng thử lại!');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },
        viewStudents: function (classId) {
            var selectedClass = $scope.classes.find(function (c) {
                return c.classId === classId;
            });

            localStorage.setItem('selectedClass', JSON.stringify({
                classId: selectedClass.classId,
                className: selectedClass.className
            }));

            window.location.href = '/Class/ClassStudents';
        },
        goBack: function () {
            window.location.href = '/class';
        },

        delete: function (classId) {
            if (!confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
                return;
            }

            $scope.loading = true;

            const url = `/api/Class/${classId}?userId=${$scope.userId}&role=${$scope.role}`;
            $service.delete(url)
                .then(function (response) {
                    if (response.data.success) {
                        ToastService.success('Xóa lớp học thành công!');
                        $scope.buildin.loadClasses();
                    } else {
                        ToastService.error('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi xóa lớp học:', error);
                    ToastService.error('Không thể xóa lớp học. Có thể lớp đang có sinh viên!');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Mở form thêm mới
        openAddForm: function () {
            $scope.buildin.resetForm();
            $('#classModal').modal('show');
        },

        // Mở form chỉnh sửa
        openEditForm: function (classItem) {
            $scope.class = angular.copy(classItem);
            $scope.isEdit = true;
            $('#classModal').modal('show');
        },

        // Hủy bỏ form
        cancel: function () {
            $scope.buildin.resetForm();
            $('#classModal').modal('hide');
        },

        // Tìm kiếm lớp học
        search: function () {
            if (!$scope.searchKeyword || $scope.searchKeyword.trim() === '') {
                $scope.buildin.loadClasses();
                return;
            }

            var keyword = $scope.searchKeyword.toLowerCase();
            $scope.classes = $scope.classes.filter(function (cls) {
                return (cls.className && cls.className.toLowerCase().includes(keyword));
            });
        },

        // Làm mới danh sách
        refresh: function () {
            $scope.searchKeyword = '';
            $scope.buildin.loadClasses();
        }
    };

    $scope.buildin.init();
});

ClassController.$inject = ['$scope', '$service', 'ToastService'];

angular.module('StudentManagementApp')
    .controller('ClassController', ClassController);