var SubjectController = (function ($scope, $service, ToastService) {
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
    $scope.subjects = [];
    $scope.subject = {};
    $scope.isEdit = false;
    $scope.searchKeyword = '';
    $scope.loading = false;

    $scope.departments = [];
    $scope.teachers = [];

    $scope.buildin = {

        init: function () {
            this.loadSubjects();
            this.loadDepartments();
            this.loadTeachers();
            this.resetForm();
        },

        loadSubjects: function () {
            $scope.loading = true;
            const url = `/api/Subject/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.subjects = response.data.data;
                    } else {
                        ToastService.error('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể tải danh sách môn học');
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
                    ToastService.error('Lỗi khi tải danh sách khoa:', error);
                });
        },
        loadTeachers: function () {
            const url = `/api/Teacher/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.teachers = response.data.data;
                    }
                })
                .catch(function (error) {
                    ToastService.error('Lỗi khi tải danh sách giảng viên:', error);
                });
        },

        resetForm: function () {
            $scope.subject = {
                subjectId: 0,
                subjectCode: '',
                subjectName: '',
                credits: 0,
                departmentId: null,
                teacherId: null,
                createdBy: $scope.userId
            };
            $scope.isEdit = false;
        }
    };

    $scope.actions = {
        save: function () {
            if (!$scope.subject.subjectCode || $scope.subject.subjectCode.trim() === '') {
                ToastService.warning('Vui lòng nhập mã môn học');
                return;
            }
            if (!$scope.subject.subjectName || $scope.subject.subjectName.trim() === '') {
                ToastService.warning('Vui lòng nhập tên môn học');
                return;
            }
            if (!$scope.subject.credits || $scope.subject.credits <= 0) {
                ToastService.warning('Vui lòng nhập số tín chỉ hợp lệ');
                return;
            }

            $scope.loading = true;

            var requestData = {
                model: {
                    subjectId: $scope.subject.subjectId || 0,
                    subjectCode: $scope.subject.subjectCode,
                    subjectName: $scope.subject.subjectName,
                    credits: $scope.subject.credits,
                    departmentId: $scope.subject.departmentId,
                    teacherId: $scope.subject.teacherId,
                    createdBy: $scope.userId
                },
                userId: $scope.userId,
                role: $scope.role
            };

            $service.post('/api/Subject/save', requestData)
                .then(function (response) {
                    if (response.data.success) {
                        ToastService.success($scope.isEdit ? 'Cập nhật môn học thành công!' : 'Thêm mới môn học thành công!');
                        $scope.buildin.resetForm();
                        $scope.buildin.loadSubjects();
                        $('#subjectModal').modal('hide');
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

        delete: function (subjectId) {
            if (!confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
                return;
            }

            $scope.loading = true;

            const url = `/api/Subject/${subjectId}?userId=${$scope.userId}&role=${$scope.role}`;
            $service.delete(url)
                .then(function (response) {
                    if (response.data.success) {
                        ToastService.success('Xóa môn học thành công!');
                        $scope.buildin.loadSubjects();
                    } else {
                        ToastService.success('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    
                    ToastService.success('Không thể xóa môn học. Có thể môn học đang được sử dụng!');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Mở form thêm mới
        openAddForm: function () {
            $scope.buildin.resetForm();
            $('#subjectModal').modal('show');
        },

        // Mở form chỉnh sửa
        openEditForm: function (subject) {
            $scope.subject = angular.copy(subject);
            $scope.isEdit = true;
            $('#subjectModal').modal('show');
        },

        // Hủy bỏ form
        cancel: function () {
            $scope.buildin.resetForm();
            $('#subjectModal').modal('hide');
        },

        // Tìm kiếm môn học
        search: function () {
            if (!$scope.searchKeyword || $scope.searchKeyword.trim() === '') {
                $scope.buildin.loadSubjects();
                return;
            }

            var keyword = $scope.searchKeyword.toLowerCase();
            $scope.subjects = $scope.subjects.filter(function (subject) {
                return (subject.subjectCode && subject.subjectCode.toLowerCase().includes(keyword)) ||
                    (subject.subjectName && subject.subjectName.toLowerCase().includes(keyword));
            });
        },

        refresh: function () {
            $scope.searchKeyword = '';
            $scope.buildin.loadSubjects();
        }
    };

    $scope.buildin.init();
});

SubjectController.$inject = ['$scope', '$service', 'ToastService'];

angular.module('StudentManagementApp')
    .controller('SubjectController', SubjectController);