using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Interfaces;
using StudentManagement.Core.Models;
using StudentManagement.Core.SeedWorks;
using StudentManagement.Data;
using System.Data;

namespace StudentManagement.Api.Services;

public class GradeService : IGradeService
{
    private readonly IRepository _repository;

    public GradeService(IRepository repository)
    {
        _repository = repository;
    }

    public SaveResponse<int> Save(SaveRequest<GradeModel> request, int userId, int role)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var procedure = StoredProcedures.PRC_GRADE_SAVE;
        var model = request.Model;

        try
        {
            // Calculate classification based on score
            int classification = CalculateClassification(model.Score);

            var result = _repository.ExecuteQuery<GradeModel>(procedure, new
            {
                model.GradeId,
                model.StudentId,
                model.SubjectId,
                model.Score,
                Classification = classification,
                model.Semester,
                model.AcademicYear,
                UserId = userId,
                Role = role
            }, CommandType.StoredProcedure);

            return new SaveResponse<int>
            {
                Success = result.Success,
                Message = result.Message,
                Id = result.Success ? (result.Data?.FirstOrDefault()?.GradeId ?? 0) : 0
            };
        }
        catch (Exception ex)
        {
            return new SaveResponse<int>
            {
                Success = false,
                Message = $"Error saving grade: {ex.Message}",
                Id = 0
            };
        }
    }

    public BaseResponse Delete(int gradeId, int userId, int role)
    {
        try
        {
            var procedure = StoredProcedures.PRC_GRADE_DELETE;
            var result = _repository.ExecuteNonQuery(procedure, new { GradeId = gradeId, UserId = userId, Role = role}, CommandType.StoredProcedure);
            return result;
        }
        catch (Exception ex)
        {
            return new BaseResponse
            {
                Success = false,
                Message = $"Error deleting grade: {ex.Message}"
            };
        }
    }

    public QueryResponse<GradeModel> GetByStudent(int studentId)
    {
        try
        {
            var procedure = StoredProcedures.PRC_GRADE_GET_BY_STUDENT;
            return _repository.ExecuteQuery<GradeModel>(procedure, new { StudentId = studentId }, CommandType.StoredProcedure);
        }
        catch (Exception ex)
        {
            return new QueryResponse<GradeModel>
            {
                Success = false,
                Message = $"Error getting grades: {ex.Message}",
                Data = new List<GradeModel>()
            };
        }
    }


    public QueryResponse<GradeModel> GetAll(int userId, int role)
    {
        try
        {
            var procedure = StoredProcedures.PRC_GRADE_GET_ALL;
            
            var result = _repository.ExecuteQuery<GradeModel>(procedure, new 
            {
                UserId = userId,
                Role = role
            }, CommandType.StoredProcedure);
            return result;
        }
        catch (Exception ex)
        {
            return new QueryResponse<GradeModel>
            {
                Success = false,
                Message = $"Error getting grades: {ex.Message}",
                Data = new List<GradeModel>()
            };
        }
    }

    public QueryResponse<GradeModel> GetBySubject(int subjectId)
    {
        try
        {
            var procedure = StoredProcedures.PRC_GRADE_GET_BY_SUBJECT;
            return _repository.ExecuteQuery<GradeModel>(procedure, new { SubjectId = subjectId }, CommandType.StoredProcedure);
        }
        catch (Exception ex)
        {
            return new QueryResponse<GradeModel>
            {
                Success = false,
                Message = $"Error getting grades: {ex.Message}",
                Data = new List<GradeModel>()
            };
        }
    }

    public QueryResponse<GradeModel> Search(string? keyword, int? classId, int? studentId, int? subjectId)
    {
        try
        {
            var procedure = StoredProcedures.PRC_GRADE_SEARCH;
            return _repository.ExecuteQuery<GradeModel>(procedure, new 
            { 
                Keyword = keyword,
                ClassId = classId,
                StudentId = studentId,
                SubjectId = subjectId
            }, CommandType.StoredProcedure);
        }
        catch (Exception ex)
        {
            return new QueryResponse<GradeModel>
            {
                Success = false,
                Message = $"Error getting grades: {ex.Message}",
                Data = new List<GradeModel>()
            };
        }
    }

    public QueryResponse<GradeModel> GetByClass(int classId)
    {
        try
        {
            var procedure = StoredProcedures.PRC_GRADE_GET_BY_CLASS;
            return _repository.ExecuteQuery<GradeModel>(procedure, new { ClassId = classId }, CommandType.StoredProcedure);
        }
        catch (Exception ex)
        {
            return new QueryResponse<GradeModel>
            {
                Success = false,
                Message = $"Error getting grades: {ex.Message}",
                Data = new List<GradeModel>()
            };
        }
    }

    private int CalculateClassification(decimal score)
    {
        if (score >= 9.0m) return 1; // Excellent
        if (score >= 8.0m) return 2; // Good
        if (score >= 7.0m) return 3; // Fair
        if (score >= 5.5m) return 4; // Average
        return 5; // Poor
    }

    public QueryResponse<GradeModel> GetByTeacher(int userId, int role)
    {
        throw new NotImplementedException();
    }
}
