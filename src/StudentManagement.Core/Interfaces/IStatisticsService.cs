using StudentManagement.Core.DTOs.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagement.Core.Interfaces
{
    public interface IStatisticsService
    {
        QueryResponse<OverviewStatistics> GetOverview(int userId, int role);
        QueryResponse<StudentsByClassStatistics> GetStudentsByClass(int userId, int role);
        QueryResponse<StudentsByDepartmentStatistics> GetStudentsByDepartment(int userId, int role);
        QueryResponse<AverageGradeByClassStatistics> GetAverageGradeByClass(
            int? classId, int? semester, string? academicYear, int userId, int role);
        QueryResponse<AverageGradeBySubjectStatistics> GetAverageGradeBySubject(
            int? subjectId, int? semester, string? academicYear, int userId, int role);
    }
}