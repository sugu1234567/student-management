var StatisticController = (function ($scope, $service, ToastService) {
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
    $scope.loading = false;

    // Data cho thống kê
    $scope.overview = {};
    $scope.studentsByClass = [];
    $scope.studentsByDepartment = [];
    $scope.avgGradeByClass = [];
    $scope.avgGradeBySubject = [];
    $scope.classificationData = [];
    $scope.topStudents = [];

    // Filter parameters
    $scope.filters = {
        classId: null,
        subjectId: null,
        semester: null,
        academicYear: null,
        topCount: 10
    };

    $scope.classes = [];
    $scope.subjects = [];
    $scope.semesters = [
        { value: 1, label: 'Học kỳ 1' },
        { value: 2, label: 'Học kỳ 2' },
        { value: 3, label: 'Học kỳ 3 (Hè)' }
    ];


    $scope.buildin = {
        init: function () {
            this.loadOverview();
            this.loadStudentsByClass();
            this.loadStudentsByDepartment();
            //this.loadAverageGradeByClass();
            //this.loadAverageGradeBySubject();
            this.loadClasses();
            this.loadSubjects();
        },

        // Thống kê tổng quan
        loadOverview: function () {
            const url = `/api/Statistics/overview?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    const data = response.data.data;
                    $scope.overview = Array.isArray(data) ? data[0] : data;

                    console.log('Overview data:', $scope.overview);
                })
                .catch(function (error) {
                    console.error('Load overview error:', error);
                });
        },


        // Sinh viên theo lớp
        loadStudentsByClass: function () {
            $scope.loading = true;
            const url = `/api/Statistics/students-by-class?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    $scope.studentsByClass = response.data.data || response.data;
                    $scope.renderStudentsByClassChart();
                })
                .catch(function (error) {
                    console.error('Load students by class error:', error);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Sinh viên theo khoa
        loadStudentsByDepartment: function () {
            if ($scope.role !== 1) return; // Chỉ Admin

            const url = `/api/Statistics/students-by-department?userId=${$scope.userId}&role=${$scope.role}`;
            $service.get(url)
                .then(function (response) {
                    $scope.studentsByDepartment = response.data.data || response.data;
                    $scope.renderStudentsByDepartmentChart();
                })
                .catch(function (error) {
                    console.error('Load students by department error:', error);
                });
        },

        // Điểm TB theo lớp
        loadAverageGradeByClass: function () {
            $scope.loading = true;
            var params = [
                `userId=${$scope.userId}`,
                `role=${$scope.role}`
            ];

            if ($scope.filters.classId) params.push('classId=' + $scope.filters.classId);
            if ($scope.filters.semester) params.push('semester=' + $scope.filters.semester);
            if ($scope.filters.academicYear) params.push('academicYear=' + encodeURIComponent($scope.filters.academicYear));

            const url = `/api/Statistics/average-grade-by-class?${params.join('&')}`;
            $service.get(url)
                .then(function (response) {
                    $scope.avgGradeByClass = response.data.data || response.data;
                    $scope.renderAvgGradeByClassChart();
                })
                .catch(function (error) {
                    console.error('Load avg grade by class error:', error);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

        // Điểm TB theo môn
        loadAverageGradeBySubject: function () {
            $scope.loading = true;
            var params = [
                `userId=${$scope.userId}`,
                `role=${$scope.role}`
            ];

            if ($scope.filters.subjectId) params.push('subjectId=' + $scope.filters.subjectId);
            if ($scope.filters.semester) params.push('semester=' + $scope.filters.semester);
            if ($scope.filters.academicYear) params.push('academicYear=' + encodeURIComponent($scope.filters.academicYear));

            const url = `/api/Statistics/average-grade-by-subject?${params.join('&')}`;
            $service.get(url)
                .then(function (response) {
                    $scope.avgGradeBySubject = response.data.data || response.data;
                    $scope.renderAvgGradeBySubjectChart();
                })
                .catch(function (error) {
                    console.error('Load avg grade by subject error:', error);
                })
                .finally(function () {
                    $scope.loading = false;
                });
        },

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
        }
    };

    $scope.actions = {
        applyFilter: function () {
            $scope.buildin.loadAverageGradeByClass();
            $scope.buildin.loadAverageGradeBySubject();
        },

        resetFilter: function () {
            $scope.filters = {
                classId: null,
                subjectId: null,
                semester: null,
                academicYear: null,
                topCount: 10
            };
            $scope.actions.applyFilter();
        },
    };

    $scope.renderStudentsByClassChart = function () {
    };

    $scope.renderStudentsByDepartmentChart = function () {
    };

    $scope.renderAvgGradeByClassChart = function () {
    };

    $scope.renderAvgGradeBySubjectChart = function () {
    };

    $scope.renderClassificationChart = function () {
    };

    $scope.buildin.init();
});

StatisticController.$inject = ['$scope', '$service', 'ToastService'];

angular.module('StudentManagementApp')
    .controller('StatisticController', StatisticController);