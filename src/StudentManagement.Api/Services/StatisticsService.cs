using Microsoft.AspNetCore.Mvc;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Interfaces;
using StudentManagement.Core.SeedWorks;
using StudentManagement.Data;
using System;
using System.Collections.Generic;

namespace StudentManagement.Api.Services
{
    public class StatisticsService : IStatisticsService
    {
        private readonly IRepository _repository;

        public StatisticsService(IRepository repository)
        {
            _repository = repository;
        }

        public QueryResponse<OverviewStatistics> GetOverview(int userId, int role)
        {
            try
            {
                var procedure = StoredProcedures.PRC_STATISTICS_OVERVIEW;
                var result = _repository.ExecuteQuery<OverviewStatistics>(procedure, new
                {
                    UserId = userId,
                    Role = role
                }, System.Data.CommandType.StoredProcedure);

                return result;
            }
            catch (Exception ex)
            {
                return new QueryResponse<OverviewStatistics>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = new List<OverviewStatistics>()
                };
            }
        }

        public QueryResponse<StudentsByClassStatistics> GetStudentsByClass(int userId, int role)
        {
            try
            {
                var procedure = StoredProcedures.PRC_STATISTICS_STUDENTS_BY_CLASS;
                var result = _repository.ExecuteQuery<StudentsByClassStatistics>(procedure, new
                {
                    UserId = userId,
                    Role = role
                }, System.Data.CommandType.StoredProcedure);

                return result;
            }
            catch (Exception ex)
            {
                return new QueryResponse<StudentsByClassStatistics>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = new List<StudentsByClassStatistics>()
                };
            }
        }

        public QueryResponse<StudentsByDepartmentStatistics> GetStudentsByDepartment(int userId, int role)
        {
            try
            {
                var procedure = StoredProcedures.PRC_STATISTICS_STUDENTS_BY_DEPARTMENT;
                var result = _repository.ExecuteQuery<StudentsByDepartmentStatistics>(procedure, new
                {
                    UserId = userId,
                    Role = role
                }, System.Data.CommandType.StoredProcedure);

                return result;
            }
            catch (Exception ex)
            {
                return new QueryResponse<StudentsByDepartmentStatistics>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = new List<StudentsByDepartmentStatistics>()
                };
            }
        }

        public QueryResponse<AverageGradeByClassStatistics> GetAverageGradeByClass(
            int? classId, int? semester, string? academicYear, int userId, int role)
        {
            try
            {
                var procedure = StoredProcedures.PRC_STATISTICS_AVG_GRADE_BY_CLASS;
                var result = _repository.ExecuteQuery<AverageGradeByClassStatistics>(procedure, new
                {
                    ClassId = classId,
                    Semester = semester,
                    AcademicYear = academicYear,
                    UserId = userId,
                    Role = role
                }, System.Data.CommandType.StoredProcedure);

                return result;
            }
            catch (Exception ex)
            {
                return new QueryResponse<AverageGradeByClassStatistics>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = new List<AverageGradeByClassStatistics>()
                };
            }
        }

        public QueryResponse<AverageGradeBySubjectStatistics> GetAverageGradeBySubject(
            int? subjectId, int? semester, string? academicYear, int userId, int role)
        {
            try
            {
                var procedure = StoredProcedures.PRC_STATISTICS_AVG_GRADE_BY_SUBJECT;
                var result = _repository.ExecuteQuery<AverageGradeBySubjectStatistics>(procedure, new
                {
                    SubjectId = subjectId,
                    Semester = semester,
                    AcademicYear = academicYear,
                    UserId = userId,
                    Role = role
                }, System.Data.CommandType.StoredProcedure);

                return result;
            }
            catch (Exception ex)
            {
                return new QueryResponse<AverageGradeBySubjectStatistics>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = new List<AverageGradeBySubjectStatistics>()
                };
            }
        }
    }
}