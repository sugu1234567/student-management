using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Interfaces;
using StudentManagement.Core.Models;
using StudentManagement.Core.SeedWorks;
using StudentManagement.Data;
using System.Data;

namespace StudentManagement.Api.Services;

public class StudentService : IStudentService
{
    private readonly IRepository _repository;

    public StudentService(IRepository repository)
    {
        _repository = repository;
    }

    public SaveResponse<int> Save(SaveRequest<StudentModel> request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var procedure = StoredProcedures.PRC_STUDENT_SAVE;
        var model = request.Model;

        try
        {
            // Hash password if provided
            string passwordHash = null;
            if (!string.IsNullOrEmpty(model.Password))
            {
                passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
            }

            var result = _repository.ExecuteQuery<StudentModel>(procedure, new
            {
                model.StudentId,
                model.UserId,
                model.StudentCode,
                model.FullName,
                model.DateOfBirth,
                model.Gender,
                model.Phone,
                model.Address,
                model.ClassId,
                model.Username,
                PasswordHash = passwordHash,
                model.Email,
                model.CreatedBy
            }, CommandType.StoredProcedure);

            var obj = result.Data?.FirstOrDefault();

            var response = new SaveResponse<int>
            {
                Success = result.Success,
                Message = result.Message,
                Id = obj?.StudentId ?? 0
            };

            return response;
        }
        catch (Exception ex)
        {
            return new SaveResponse<int>
            {
                Success = false,
                Message = $"Error saving student: {ex.Message}",
                Id = 0
            };
        }
    }

    public BaseResponse Delete(int studentId)
    {
        try
        {
            var procedure = StoredProcedures.PRC_STUDENT_DELETE;
            var result = _repository.ExecuteNonQuery(procedure, new { StudentId = studentId }, CommandType.StoredProcedure);

            return result;
        }
        catch (Exception ex)
        {
            return new BaseResponse
            {
                Success = false,
                Message = $"Error deleting student: {ex.Message}"
            };
        }
    }

    public QueryResponse<StudentModel> GetById(int studentId, int currentUserId, int currentUserRole)
    {
        try
        {
            var procedure = StoredProcedures.PRC_STUDENT_GET_BY_ID;

            var parameters = new
            {
                StudentId = studentId,
                UserId = currentUserId,
                Role = currentUserRole
            };

            var result = _repository.ExecuteQuery<StudentModel>(
                procedure,
                parameters,
                CommandType.StoredProcedure
            );

            return result;
        }
        catch (Exception ex)
        {
            return new QueryResponse<StudentModel>
            {
                Success = false,
                Message = $"Error getting student: {ex.Message}",
                Data = new List<StudentModel>()
            };
        }
    }

    public QueryResponse<StudentModel> GetAll()
    {
        try
        {
            var procedure = StoredProcedures.PRC_STUDENT_GET_ALL;
            var result = _repository.ExecuteQuery<StudentModel>(procedure, null, CommandType.StoredProcedure);

            return result;
        }
        catch (Exception ex)
        {
            return new QueryResponse<StudentModel>
            {
                Success = false,
                Message = $"Error getting students: {ex.Message}",
                Data = new List<StudentModel>()
            };
        }
    }

    public QueryResponse<StudentModel> Search(string? keyword, int? classId, int? departmentId)
    {
        try
        {
            var procedure = StoredProcedures.PRC_STUDENT_SEARCH;
            var result = _repository.ExecuteQuery<StudentModel>(procedure, new
            {
                Keyword = keyword,
                ClassId = classId,
                DepartmentId = departmentId
            }, CommandType.StoredProcedure);

            return result;
        }
        catch (Exception ex)
        {
            return new QueryResponse<StudentModel>
            {
                Success = false,
                Message = $"Error searching students: {ex.Message}",
                Data = new List<StudentModel>()
            };
        }
    }

    public QueryResponse<StudentModel> GetByClass(int classId, int userId, int role)
    {
        try
        {
            var procedure = StoredProcedures.PRC_STUDENT_GET_BY_CLASS;
            var result = _repository.ExecuteQuery<StudentModel>(procedure, new 
            { 
                ClassId = classId,
                UserId = userId,
                Role = role
            }
            , CommandType.StoredProcedure);

            return result;
        }
        catch (Exception ex)
        {
            return new QueryResponse<StudentModel>
            {
                Success = false,
                Message = $"Error getting students by class: {ex.Message}",
                Data = new List<StudentModel>()
            };
        }
    }
}
