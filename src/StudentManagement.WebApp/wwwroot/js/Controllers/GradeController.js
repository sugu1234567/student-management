var GradeController = (function ($scope, $service) {
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
    $scope.userId = currentUser.userId || 0;
    $scope.role = getRoleNumber(currentUser.role) || 0;
    $scope.grades = [];
    $scope.grade = {};
    $scope.isEdit = false;
    $scope.loading = false;

    // Danh sách cho dropdown
    $scope.students = [];
    $scope.subjects = [];
    $scope.classes = [];

    // Filter
    $scope.filterClassId = null;
    $scope.filterSubjectId = null;
    $scope.filterStudentId = null;

    console.log('User ID:', $scope.userId);
    console.log('Role:', $scope.role, '(Original:', currentUser.role + ')');

    // Các hàm buildin - dùng để khởi tạo và lấy dữ liệu
    $scope.buildin = {

        // Khởi tạo controller
        init: function () {
            console.log('Khởi tạo Grade Controller');
            this.loadGrades();
            this.loadStudents();
            this.loadSubjects();
            this.loadClasses();
            this.resetForm();
        },

        // Lấy danh sách điểm (theo role)
        loadGrades: function () {
            $scope.loading = true;
            var url = '';

            // Nếu là teacher thì lấy điểm của giáo viên đó
            if ($scope.role === 2) {
                url = `/api/Grade/by-teacher?userId=${$scope.userId}&role=${$scope.role}`;
            } else {
                // Admin có thể xem tất cả
                url = `/api/Grade/by-teacher?userId=${$scope.userId}&role=${$scope.role}`;
            }

            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.grades = response.data.data;
                        console.log('Đã tải ' + $scope.grades.length + ' bản ghi điểm');
                    } else {
                        alert('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi tải danh sách điểm:', error);
                    alert('Không thể tải danh sách điểm');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Lấy điểm theo sinh viên
        loadGradesByStudent: function (studentId) {
            $scope.loading = true;
            const url = `/api/Grade/by-student/${studentId}?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.grades = response.data.data;
                        console.log('Đã tải điểm của sinh viên');
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi tải điểm sinh viên:', error);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Lấy điểm theo môn học
        loadGradesBySubject: function (subjectId) {
            $scope.loading = true;
            const url = `/api/Grade/by-subject/${subjectId}?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.grades = response.data.data;
                        console.log('Đã tải điểm của môn học');
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi tải điểm môn học:', error);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Lấy điểm theo lớp
        loadGradesByClass: function (classId) {
            $scope.loading = true;
            const url = `/api/Grade/by-class/${classId}?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.grades = response.data.data;
                        console.log('Đã tải điểm của lớp');
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi tải điểm lớp:', error);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Load danh sách sinh viên
        loadStudents: function () {
            const url = `/api/Student/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.students = response.data.data;
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi tải danh sách sinh viên:', error);
                });
        },

        // Load danh sách môn học
        loadSubjects: function () {
            const url = `/api/Subject/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.subjects = response.data.data;
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi tải danh sách môn học:', error);
                });
        },

        // Load danh sách lớp
        loadClasses: function () {
            const url = `/api/Class/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success) {
                        $scope.classes = response.data.data;
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi tải danh sách lớp:', error);
                });
        },

        // Reset form về trạng thái ban đầu
        resetForm: function () {
            $scope.grade = {
                gradeId: 0,
                studentId: 0,
                subjectId: 0,
                midtermScore: 0,
                finalScore: 0,
                averageScore: 0,
                createdBy: $scope.userId
            };
            $scope.isEdit = false;
        },

        // Tính điểm trung bình
        calculateAverage: function () {
            var midterm = parseFloat($scope.grade.midtermScore) || 0;
            var final = parseFloat($scope.grade.finalScore) || 0;
            $scope.grade.averageScore = ((midterm * 0.4) + (final * 0.6)).toFixed(2);
        }
    };

    // Các hàm actions - dùng để thêm, sửa, xóa
    $scope.actions = {
        // Thêm mới hoặc cập nhật điểm
        save: function () {
            // Validate dữ liệu
            if (!$scope.grade.studentId || $scope.grade.studentId === 0) {
                alert('Vui lòng chọn sinh viên');
                return;
            }
            if (!$scope.grade.subjectId || $scope.grade.subjectId === 0) {
                alert('Vui lòng chọn môn học');
                return;
            }
            if ($scope.grade.midtermScore < 0 || $scope.grade.midtermScore > 10) {
                alert('Điểm giữa kỳ phải từ 0 đến 10');
                return;
            }
            if ($scope.grade.finalScore < 0 || $scope.grade.finalScore > 10) {
                alert('Điểm cuối kỳ phải từ 0 đến 10');
                return;
            }

            $scope.loading = true;

            // Tính điểm trung bình trước khi lưu
            $scope.buildin.calculateAverage();

            var requestData = {
                model: {
                    gradeId: $scope.grade.gradeId || 0,
                    studentId: $scope.grade.studentId,
                    subjectId: $scope.grade.subjectId,
                    midtermScore: $scope.grade.midtermScore,
                    finalScore: $scope.grade.finalScore,
                    averageScore: $scope.grade.averageScore,
                    createdBy: $scope.userId
                },
                userId: $scope.userId,
                role: $scope.role
            };

            $service.post('/api/Grade/save', requestData)
                .then(function (response) {
                    if (response.data.success) {
                        alert($scope.isEdit ? 'Cập nhật điểm thành công!' : 'Thêm mới điểm thành công!');
                        $scope.buildin.resetForm();
                        $scope.buildin.loadGrades();
                        $('#gradeModal').modal('hide');
                    } else {
                        alert('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi lưu điểm:', error);
                    alert('Không thể lưu điểm. Vui lòng thử lại!');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Xóa điểm
        delete: function (gradeId) {
            if (!confirm('Bạn có chắc chắn muốn xóa điểm này?')) {
                return;
            }

            $scope.loading = true;

            const url = `/api/Grade/${gradeId}?userId=${$scope.userId}&role=${$scope.role}`;
            $service.delete(url)
                .then(function (response) {
                    if (response.data.success) {
                        alert('Xóa điểm thành công!');
                        $scope.buildin.loadGrades();
                    } else {
                        alert('Lỗi: ' + response.data.message);
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi xóa điểm:', error);
                    alert('Không thể xóa điểm. Vui lòng thử lại!');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Mở form thêm mới
        openAddForm: function () {
            $scope.buildin.resetForm();
            $('#gradeModal').modal('show');
        },

        // Mở form chỉnh sửa
        openEditForm: function (grade) {
            $scope.grade = angular.copy(grade);
            $scope.isEdit = true;
            $('#gradeModal').modal('show');
        },

        // Hủy bỏ form
        cancel: function () {
            $scope.buildin.resetForm();
            $('#gradeModal').modal('hide');
        },

        // Lọc điểm
        filterGrades: function () {
            if ($scope.filterClassId) {
                $scope.buildin.loadGradesByClass($scope.filterClassId);
            } else if ($scope.filterSubjectId) {
                $scope.buildin.loadGradesBySubject($scope.filterSubjectId);
            } else if ($scope.filterStudentId) {
                $scope.buildin.loadGradesByStudent($scope.filterStudentId);
            } else {
                $scope.buildin.loadGrades();
            }
        },

        // Làm mới danh sách
        refresh: function () {
            $scope.filterClassId = null;
            $scope.filterSubjectId = null;
            $scope.filterStudentId = null;
            $scope.buildin.loadGrades();
        },

        // Xếp loại điểm
        getGradeRank: function (score) {
            if (score >= 9) return { text: 'Xuất sắc', class: 'success' };
            if (score >= 8) return { text: 'Giỏi', class: 'info' };
            if (score >= 6.5) return { text: 'Khá', class: 'primary' };
            if (score >= 5) return { text: 'Trung bình', class: 'warning' };
            return { text: 'Yếu', class: 'danger' };
        }
    };

    // Watch để tự động tính điểm TB khi nhập
    $scope.$watch('grade.midtermScore', function () {
        if ($scope.grade.midtermScore !== undefined) {
            $scope.buildin.calculateAverage();
        }
    });

    $scope.$watch('grade.finalScore', function () {
        if ($scope.grade.finalScore !== undefined) {
            $scope.buildin.calculateAverage();
        }
    });

    // Khởi tạo khi controller được load
    $scope.buildin.init();
});

// Inject dependencies
GradeController.$inject = ['$scope', '$service'];

// Đăng ký controller với AngularJS app
angular.module('StudentManagementApp')
    .controller('GradeController', GradeController);