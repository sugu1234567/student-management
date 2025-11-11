var GradeController = (function ($scope, $service, ToastService) {
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
    $scope.grades = [];
    $scope.grade = {};
    $scope.isEdit = false;
    $scope.loading = false;
    $scope.classes = [];
    $scope.subjects = [];
    $scope.allStudents = [];
    $scope.searchKeyword = '';
    $scope.searchClassId = null;
    $scope.searchSubjectId = null;

    console.log('User ID:', $scope.userId);
    console.log('Role:', $scope.role, '(Original:', currentUser.role + ')');

    $scope.buildin = {
        init: function () {
            this.loadGrades();
            this.loadClasses();
            this.loadSubjects();
            this.loadAllStudents();
            this.resetForm();
        },

        // Load danh sách điểm
        loadGrades: function () {
            $scope.loading = true;
            const url = `/api/Grade/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success || response.data.Success) {
                        $scope.grades = response.data.data || response.data;
                    } else {
                        ToastService.error('Lỗi: ' + (response.data.message || response.data.Message));
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể tải danh sách điểm');
                    console.error('Load grades error:', error);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        searchGrades: function (keyword, classId, subjectId) {
            $scope.loading = true;
            var url = `/api/Grade/search?userId=${$scope.userId}&role=${$scope.role}`;

            // Chỉ thêm keyword nếu có giá trị
            if (keyword && keyword.trim() !== '') {
                url += `&keyword=${encodeURIComponent(keyword.trim())}`;
            }
            if (classId && classId !== '' && classId !== null) {
                url += `&classId=${classId}`;
            }
            if (subjectId && subjectId !== '' && subjectId !== null) {
                url += `&subjectId=${subjectId}`;
            }
            console.log('Search URL:', url);
            console.log('Search params:', { keyword, classId, subjectId });

            $service.get(url)
                .then(function (response) {
                    if (response.data.success || response.data.Success) {
                        $scope.grades = response.data.data || response.data;
                        console.log('Search results:', $scope.grades.length + ' records');
                    } else {
                        ToastService.error('Lỗi: ' + (response.data.message || response.data.Message));
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể tìm kiếm điểm');
                    console.error('Search grades error:', error);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Load danh sách class
        loadClasses: function () {
            const url = `/api/Class/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success || response.data.Success) {
                        $scope.classes = response.data.data || response.data;
                    }
                })
                .catch(function (error) {
                    console.error('Load classes error:', error);
                });
        },

        // Load danh sách subjects
        loadSubjects: function () {
            const url = `/api/Subject/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success || response.data.Success) {
                        $scope.subjects = response.data.data || response.data;
                    }
                })
                .catch(function (error) {
                    console.error('Load subjects error:', error);
                });
        },

        // Load danh sách 
        loadAllStudents: function () {
            const url = `/api/Student/all?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    if (response.data.success || response.data.Success) {
                        $scope.allStudents = response.data.data || response.data;
                    }
                })
                .catch(function (error) {
                    console.error('Load students error:', error);
                });
        },

        // Reset form về trạng thái ban đầu
        resetForm: function () {
            var currentYear = new Date().getFullYear();
            $scope.grade = {
                gradeId: 0,
                studentId: null,
                subjectId: null,
                score: null,
                classification: 3,
                semester: 1,
                academicYear: currentYear + '-' + (currentYear + 1)
            };
            $scope.isEdit = false;
        }
    };

    $scope.actions = {
        save: function () {
            if (!$scope.grade.studentId) {
                ToastService.warning('Vui lòng chọn học sinh');
                return;
            }
            if (!$scope.grade.subjectId) {
                ToastService.warning('Vui lòng chọn môn học');
                return;
            }
            if ($scope.grade.score === null || $scope.grade.score === undefined || $scope.grade.score === '') {
                ToastService.warning('Vui lòng nhập điểm');
                return;
            }
            var score = parseFloat($scope.grade.score);
            if (isNaN(score) || score < 0 || score > 10) {
                ToastService.warning('Điểm phải từ 0 đến 10');
                return;
            }
            if (!$scope.grade.classification) {
                ToastService.warning('Vui lòng chọn xếp loại');
                return;
            }
            if (!$scope.grade.semester) {
                ToastService.warning('Vui lòng chọn học kỳ');
                return;
            }
            if (!$scope.grade.academicYear) {
                ToastService.warning('Vui lòng nhập năm học');
                return;
            }

            $scope.loading = true;

            var requestData = {
                data: {
                    gradeId: $scope.grade.gradeId || 0,
                    studentId: $scope.grade.studentId,
                    subjectId: $scope.grade.subjectId,
                    score: parseFloat($scope.grade.score),
                    classification: $scope.grade.classification,
                    semester: $scope.grade.semester,
                    academicYear: $scope.grade.academicYear
                },
                userId: $scope.userId,
                role: $scope.role
            };

            const url = `/api/Grade/save?userId=${$scope.userId}&role=${$scope.role}`;
            $service.post(url, requestData)
                .then(function (response) {
                    if (response.data.success || response.data.Success) {
                        ToastService.success(
                            response.data.message || response.data.Message ||
                            ($scope.isEdit ? 'Cập nhật điểm thành công!' : 'Thêm điểm thành công!')
                        );
                        $scope.buildin.resetForm();
                        $scope.buildin.loadGrades();
                        $('#gradeModal').modal('hide');
                    } else {
                        ToastService.error('Lỗi: ' + (response.data.message || response.data.Message));
                    }
                })
                .catch(function (error) {
                    ToastService.error('Không thể lưu điểm. Vui lòng thử lại!');
                    console.error('Save grade error:', error);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Xóa điểm
        delete: function (gradeId) {
            if ($scope.role !== 2) {
                ToastService.error('Chỉ giáo viên mới được xóa điểm');
                return;
            }

            if (!confirm('Bạn có chắc chắn muốn xóa điểm này?')) {
                return;
            }

            $scope.loading = true;

            const url = `/api/Grade/${gradeId}?userId=${$scope.userId}&role=${$scope.role}`;
            $service.delete(url)
                .then(function (response) {
                    if (response.data.success || response.data.Success) {
                        ToastService.success('Xóa điểm thành công!');
                        $scope.buildin.loadGrades();
                    } else {
                        ToastService.error('Lỗi: ' + (response.data.message || response.data.Message));
                    }
                })
                .catch(function (error) {
                    console.error('Lỗi khi xóa điểm:', error);
                    ToastService.error('Không thể xóa điểm. Vui lòng thử lại!');
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        openAddForm: function () {
            $scope.buildin.resetForm();
            $('#gradeModal').modal('show');
        },

        openEditForm: function (gradeItem) {
            $scope.grade = angular.copy(gradeItem);
            $scope.isEdit = true;
            $('#gradeModal').modal('show');
        },

        cancel: function () {
            $scope.buildin.resetForm();
            $('#gradeModal').modal('hide');
        },

        search: function () {
            var keyword = $scope.searchKeyword ? $scope.searchKeyword.trim() : '';
            var classId = $scope.searchClassId || null;
            var subjectId = $scope.searchSubjectId || null;

            if (!keyword && !classId && !subjectId) {
                $scope.buildin.loadGrades();
                return;
            }

            // Gọi search với các tham số đã chuẩn hóa
            $scope.buildin.searchGrades(keyword, classId, subjectId);
        },

        //onKeywordSearch: function () {
        //    $scope.buildin.searchGrades(
        //        $scope.searchKeyword,
        //        $scope.searchClassId,
        //        $scope.searchSubjectId
        //    );
        //},

        //onSubjectFilterChange: function () {

        //    if ($scope.searchSubjectId) {
        //        $scope.buildin.searchGrades($scope.searchSubjectId);
        //    } else {
        //        $scope.actions.search();
        //    }
        //},

        //onClassFilterChange: function () {
        //    if ($scope.searchClassId) {
        //        $scope.buildin.searchGrades($scope.searchClassId);
        //    } else {
        //        $scope.actions.search();
        //    }
        //},

        // Làm mới danh sách
        refresh: function () {
            $scope.searchKeyword = '';
            $scope.searchClassId = null;
            $scope.searchSubjectId = null;
            $scope.buildin.loadGrades();
        },

        calculateClassification: function () {
            var score = parseFloat($scope.grade.score);
            if (isNaN(score)) return;

            if (score >= 9) {
                $scope.grade.classification = 1; // Xuất sắc
            } else if (score >= 8) {
                $scope.grade.classification = 2; // Giỏi
            } else if (score >= 6.5) {
                $scope.grade.classification = 3; // Khá
            } else if (score >= 5) {
                $scope.grade.classification = 4; // Trung bình
            } else {
                $scope.grade.classification = 5; // Yếu
            }
        },

        getGradeRank: function (score) {
            if (score >= 9) {
                return { class: 'success', text: 'Xuất sắc' };
            } else if (score >= 8) {
                return { class: 'info', text: 'Giỏi' };
            } else if (score >= 6.5) {
                return { class: 'primary', text: 'Khá' };
            } else if (score >= 5) {
                return { class: 'warning', text: 'Trung bình' };
            } else {
                return { class: 'danger', text: 'Yếu' };
            }
        }
    };

    $scope.classifications = [
        { value: 1, label: 'Xuất sắc' },
        { value: 2, label: 'Giỏi' },
        { value: 3, label: 'Khá' },
        { value: 4, label: 'Trung bình' },
        { value: 5, label: 'Yếu' }
    ];

    $scope.getClassificationName = function (classValue) {
        var item = $scope.classifications.find(function (c) {
            return c.value === classValue;
        });
        return item ? item.label : '';
    };

    $scope.buildin.init();
});

GradeController.$inject = ['$scope', '$service', 'ToastService'];

angular.module('StudentManagementApp')
    .controller('GradeController', GradeController);