using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Interfaces;
using StudentManagement.Core.Models;
using StudentManagement.Core.SeedWorks;
using StudentManagement.Data;

namespace StudentManagement.Api.Services;

public class ClassService : IClassService
{
    private readonly IRepository _repository;

    public ClassService(IRepository repository)
    {
        _repository = repository;
    }

    public SaveResponse<int> Save(SaveRequest<ClassModel> request,int userId, int role)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        try
            {
            var procedure = StoredProcedures.PRC_CLASS_SAVE;
            var model = request.Model;

            var result = _repository.ExecuteQuery<ClassModel>(procedure, new
            {
                model.ClassId,
                model.ClassName,
                model.DepartmentId,
                model.DepartmentName,
                model.TeacherId,
                model.TeacherName,
                Role = role,
                UserId = userId
            }, System.Data.CommandType.StoredProcedure);

            var obj = result.Data?.FirstOrDefault();

            var response = new SaveResponse<int>
            {
                Success = true,
                Message = result.Message,
                Id = obj?.ClassId ?? 0
            };

            return response;
        }
        catch (Exception ex)
        {
            return new SaveResponse<int>
            {
                Success = false,
                Message = ex.Message,
                Id = 0
            };
        }
    }

    public BaseResponse Delete(int classId, int userId, int role)
    {
        try
        {
            var procedure = StoredProcedures.PRC_CLASS_DELETE;
            var result = _repository.ExecuteQuery<ClassModel>(procedure, new
            {
                ClassId = classId,
                Role = role,
                UserId = userId
            }, System.Data.CommandType.StoredProcedure);
            return new BaseResponse
            {
                Success = result.Success,
                Message = result.Message
            };
        }
        catch (Exception ex)
        {
            return new BaseResponse
            {
                Success = false,
                Message = ex.Message
            };
        }
    }

    public QueryResponse<ClassModel> GetAll(int userId, int role)
    {
        try
        {   
            var procedure = StoredProcedures.PRC_CLASS_GET_ALL;
            var result = _repository.ExecuteQuery<ClassModel>(procedure, new
            {
                UserId = userId,
                Role = role
            }, System.Data.CommandType.StoredProcedure);
            return new QueryResponse<ClassModel>
            {
                Success = result.Success,
                Message = result.Message,
                Data = result.Data
            };
        }
        catch (Exception ex)
        {
            return new QueryResponse<ClassModel>
            {
                Success = false,
                Message = ex.Message,
                Data = null
            };
        }
    }

    public QueryResponse<ClassModel> GetById(int classId, int userId, int role)
    {
        throw new NotImplementedException();
    }

    
    public QueryResponse<ClassModel> Search(string keyword)
    {
        throw new NotImplementedException();
    }
}
