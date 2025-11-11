var StudentController = (function ($scope, $service, ToastService) {
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
    $scope.students = [];
    $scope.filteredStudents = [];
    $scope.student = {};
    $scope.isEdit = false;
    $scope.searchKeyword = '';
    $scope.searchClassId = null;
    $scope.searchDepartmentId = null;
    $scope.loading = false;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;

    $scope.classes = [];
    $scope.departments = [];


    $scope.buildin = {

        init: function () {
            this.loadStudents();
            this.loadDepartments();
            this.loadClasses();
            this.resetForm();
        },

        loadStudents: function () {
            $scope.loading = true;
            const url = `/api/Student/all?userId=${$scope.userId}&role=${$scope.role}`;
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

        getStudentById: function (id) {
            $scope.loading = true;
            const url = `/api/Student/${id}?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.student = response.data.data[0];
                        if ($scope.student.dateOfBirth) {
                            $scope.student.dateOfBirth = new Date($scope.student.dateOfBirth).toISOString().split('T')[0];
                        }
                        $scope.isEdit = true;
                    } else {
                        ToastService.error('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {

                    ToastService.error('Không thể tải thông tin sinh viên');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        //getStudentsByClass: function (classId) {
        //    $scope.loading = true;
        //    const url = `/api/Student/by-class/${classId}?userId=${$scope.userId}&role=${$scope.role}`;
        //    $service.get(url)
        //        .then(function (response) {
        //            if (response.data.success) {
        //                $scope.filteredStudents = response.data.data;
        //            } else {
        //                ToastService.error('Lỗi: ' + response.data.message);
        //            }
        //        })
        //        .catch(function (error) {
        //            ToastService.error('Không thể tải sinh viên theo lớp');
        //        })
        //        .finally(function () {
        //            $scope.loading = false;
        //        });
        //},

        // Tìm kiếm sinh viên
        searchStudents: function (keyword, classId, departmentId) {
            $scope.loading = true;
            var url = `/api/Student/search?userId=${$scope.userId}&role=${$scope.role}`;
            url += `&keyword=${encodeURIComponent(keyword || '')}`;
   
            if (classId) {
                url += `&classId=${classId}`;
            }
            if (departmentId) {
                url += `&departmentId=${departmentId}`;
            }

            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.filteredStudents = response.data.data;
                    } else {
                        ToastService.error('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể tìm kiếm sinh viên');
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

        loadClasses: function () {
            const url = `/api/Class/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.classes = response.data.data;
                    }
                })
                .catch(function (error) {
                    ToastService.error('Lỗi khi tải danh sách lớp:', error);
                });
        },

        // Reset form về trạng thái ban đầu
        resetForm: function () {
            $scope.student = {
                studentId: 0,
                userId: '',
                studentCode: '',
                fullName: '',
                dateOfBirth: '',
                gender: 'Nam',
                email: '',
                phone: '',
                address: '',
                classId: 0,
                createdBy: $scope.userId,
                username: '',
                password: ''
            };
            $scope.isEdit = false;
        },

        // Phân trang
        getPaginatedStudents: function () {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;
            return $scope.filteredStudents.slice(begin, end);
        },

        getTotalPages: function () {
            return Math.ceil($scope.filteredStudents.length / $scope.itemsPerPage);
        }
    };

    $scope.actions = {
        save: function () {
            // Validate dữ liệu
            if (!$scope.student.studentCode || $scope.student.studentCode.trim() === '') {
                ToastService.warning('Vui lòng nhập mã sinh viên');
                return;
            }
            if (!$scope.student.fullName || $scope.student.fullName.trim() === '') {
                ToastService.warning('Vui lòng nhập họ tên sinh viên');
                return;
            }
            if (!$scope.student.dateOfBirth) {
                ToastService.warning('Vui lòng chọn ngày sinh');
                return;
            }
            if (!$scope.student.email || $scope.student.email.trim() === '') {
                ToastService.warning('Vui lòng nhập email');
                return;
            }
            // Validate email format
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test($scope.student.email)) {
                ToastService.warning('Email không hợp lệ');
                return;
            }
            if (!$scope.student.phone || $scope.student.phone.trim() === '') {
                ToastService.warning('Vui lòng nhập số điện thoại');
                return;
            }
            if (!$scope.student.classId || $scope.student.classId === 0) {
                ToastService.warning('Vui lòng chọn lớp');
                return;
            }

            if (!$scope.student.username || $scope.student.username === '') {
                ToastService.warning('Vui lòng nhập tên đăng nhập');
                return;
            }

            if (!$scope.isEdit && (!$scope.student.password || $scope.student.password === '')) {
                ToastService.warning('Vui lòng nhập mật khẩu');
                return;
            }

            $scope.loading = true;

            var requestData = {
                model: {
                    studentId: $scope.student.studentId || 0,
                    userId: $scope.student.userId || '' || 0,
                    studentCode: $scope.student.studentCode,
                    fullName: $scope.student.fullName,
                    dateOfBirth: $scope.student.dateOfBirth,
                    gender: getGenderNumber($scope.student.gender),
                    email: $scope.student.email,
                    phone: $scope.student.phone,
                    address: $scope.student.address || '',
                    classId: $scope.student.classId,
                    createdBy: $scope.userId,
                    username: $scope.student.username,
                    password: $scope.student.password,
                },
                userId: $scope.userId,
                role: $scope.role
            };

            $service.post('/api/Student/save', requestData)
                .then(function (response) {
                    if (response.data.success) {
                        ToastService.success($scope.isEdit ? 'Cập nhật sinh viên thành công!' : 'Thêm mới sinh viên thành công!');
                        $scope.buildin.resetForm();
                        $scope.buildin.loadStudents();
                        // Đóng modal nếu có
                        $('#studentModal').modal('hide');
                    } else {
                        ToastService.error('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể lưu sinh viên. Vui lòng thử lại!');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Xóa sinh viên
        delete: function (studentId) {
            if (!confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
                return;
            }

            $scope.loading = true;

            const url = `/api/Student/${studentId}?userId=${$scope.userId}&role=${$scope.role}`;
            $service.delete(url)
                .then(function (response) {
                    if (response.data.success) {
                        ToastService.success('Xóa sinh viên thành công!');
                        $scope.buildin.loadStudents();
                    } else {
                        ToastService.error('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể xóa sinh viên. Có thể sinh viên đang có điểm hoặc đang học!');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Mở form thêm mới
        openAddForm: function () {
            $scope.buildin.resetForm();
            $('#studentModal').modal('show');
        },

        // Mở form chỉnh sửa
        openEditForm: function (studentId) {
            $scope.buildin.getStudentById(studentId);
            $('#studentModal').modal('show');
        },

        // Hủy bỏ form
        cancel: function () {
            $scope.buildin.resetForm();
            $('#studentModal').modal('hide');
        },

        // Tìm kiếm sinh viên
        search: function () {
            if (!$scope.searchKeyword || $scope.searchKeyword.trim() === '') {
                if (!$scope.searchClassId && !$scope.searchDepartmentId) {
                    $scope.filteredStudents = $scope.students;
                    $scope.currentPage = 1;
                    return;
                }
            }

            $scope.buildin.searchStudents($scope.searchKeyword, $scope.searchClassId, $scope.searchDepartmentId);
            $scope.currentPage = 1;
        },

        // Lọc theo lớp
        filterByClass: function () {
            if ($scope.searchClassId) {
                $scope.buildin.searchStudents($scope.searchClassId);
                $scope.currentPage = 1;
            } else {
                $scope.actions.search();
            }
        },

        // Làm mới danh sách
        refresh: function () {
            $scope.searchKeyword = '';
            $scope.searchClassId = null;
            $scope.searchDepartmentId = null;
            $scope.currentPage = 1;
            $scope.buildin.loadStudents();
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

    $scope.buildin.init();
});

StudentController.$inject = ['$scope', '$service', 'ToastService'];

angular.module('StudentManagementApp')
    .controller('StudentController', StudentController);