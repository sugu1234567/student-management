using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Interfaces;
using StudentManagement.Core.Models;
using StudentManagement.Core.SeedWorks;
using StudentManagement.Data;
using System.Data;

namespace StudentManagement.Api.Services;

public class TeacherService : ITeacherService
{
    private readonly IRepository _repository;

    public TeacherService(IRepository repository)
    {
        _repository = repository;
    }

    public SaveResponse<int> Save(SaveRequest<TeacherModel> request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var procedure = StoredProcedures.PRC_TEACHER_SAVE;
        var model = request.Model;

        try
        {
            string passwordHash = null;
            if (!string.IsNullOrEmpty(model.Password))
            {
                passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
            }

            var result = _repository.ExecuteQuery<TeacherModel>(procedure, new
            {
                model.TeacherId,
                model.UserId,
                model.TeacherCode,
                model.FullName,
                model.DateOfBirth,
                model.Gender,
                model.Phone,
                model.Address,
                model.Username,
                PasswordHash = passwordHash,
                model.Email,
                model.CreatedBy
            }, CommandType.StoredProcedure);

            var obj = result.Data?.FirstOrDefault();

            return new SaveResponse<int>
            {
                Success = result.Success,
                Message = result.Message,
                Id = obj?.TeacherId ?? 0
            };
        }
        catch (Exception ex)
        {
            return new SaveResponse<int>
            {
                Success = false,
                Message = $"Error saving teacher: {ex.Message}",
                Id = 0
            };
        }
    }

    public BaseResponse Delete(int teacherId, int userId, int role)
    {
        try
        {
            var procedure = StoredProcedures.PRC_TEACHER_DELETE;
            return _repository.ExecuteNonQuery(procedure, new 
            { 
                TeacherId = teacherId,
                UserId = userId,
                Role = role
            }
            , CommandType.StoredProcedure);
        }
        catch (Exception ex)
        {
            return new BaseResponse
            {
                Success = false,
                Message = $"Error deleting teacher: {ex.Message}"
            };
        }
    }

    public QueryResponse<TeacherModel> GetById(int teacherId, int userId, int role)
    {
        try
        {
            var procedure = StoredProcedures.PRC_TEACHER_GET_BY_ID;
            return _repository.ExecuteQuery<TeacherModel>(procedure, new 
            { 
                TeacherId = teacherId,
                UserId = userId,
                Role = role
            }, CommandType.StoredProcedure);
        }
        catch (Exception ex)
        {
            return new QueryResponse<TeacherModel>
            {
                Success = false,
                Message = $"Error getting teacher: {ex.Message}",
                Data = new List<TeacherModel>()
            };
        }
    }

    public QueryResponse<TeacherModel> GetAll(int role)
    {
        try
        {
            var procedure = StoredProcedures.PRC_TEACHER_GET_ALL;
            return _repository.ExecuteQuery<TeacherModel>(procedure, new {Role = role}, CommandType.StoredProcedure);
        }
        catch (Exception ex)
        {
            return new QueryResponse<TeacherModel>
            {
                Success = false,
                Message = $"Error getting teachers: {ex.Message}",
                Data = new List<TeacherModel>()
            };
        }
    }

    public QueryResponse<TeacherModel> Search(string keyword)
    {
        try
        {
            var procedure = StoredProcedures.PRC_TEACHER_SEARCH;
            return _repository.ExecuteQuery<TeacherModel>(procedure, new { Keyword = keyword }, CommandType.StoredProcedure);
        }
        catch (Exception ex)
        {
            return new QueryResponse<TeacherModel>
            {
                Success = false,
                Message = $"Error searching teachers: {ex.Message}",
                Data = new List<TeacherModel>()
            };
        }
    }
}
