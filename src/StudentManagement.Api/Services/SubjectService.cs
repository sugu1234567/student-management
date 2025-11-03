using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Interfaces;
using StudentManagement.Core.Models;
using StudentManagement.Core.SeedWorks;
using StudentManagement.Data;
using System.Data;

namespace StudentManagement.Api.Services;

public class SubjectService : ISubjectService
{
    private readonly IRepository _repository;

    public SubjectService(IRepository repository)
    {
        _repository = repository;
    }

    public SaveResponse<int> Save(SaveRequest<SubjectModel> request, int userId, int role)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var procedure = StoredProcedures.PRC_SUBJECT_SAVE;
        var model = request.Model;

        try
        {
            var result = _repository.ExecuteQuery<SubjectModel>(procedure, new
            {
                model.SubjectId,
                model.SubjectCode,
                model.SubjectName,
                model.Credits,
                model.DepartmentId,
                model.TeacherId,
                Role = role,
                UserId = userId
            }, CommandType.StoredProcedure);

            return new SaveResponse<int>
            {
                Success = result.Success,
                Message = result.Message,
                Id = result.Success ? (result.Data?.FirstOrDefault()?.SubjectId ?? 0) : 0
            };
        }
        catch (Exception ex)
        {
            return new SaveResponse<int>
            {
                Success = false,
                Message = $"Error saving subject: {ex.Message}",
                Id = 0
            };
        }
    }

    public BaseResponse Delete(int subjectId, int userId, int role)
    {
        var procedure = StoredProcedures.PRC_SUBJECT_DELETE;


        try
        {
            var result = _repository.ExecuteNonQuery(procedure, new
            {
                SubjectId = subjectId,
                Role = role,
                UserId = userId
            }, CommandType.StoredProcedure);

            return result;
        }
        catch (Exception ex)
        {
            return new BaseResponse
            {
                Success = false,
                Message = $"Error deleting subject: {ex.Message}"
            };
        }
    }

    public QueryResponse<SubjectModel> GetAll(int userId, int role)
    {
        var procedure = StoredProcedures.PRC_SUBJECT_GET_ALL;

        try
        {
            var result = _repository.ExecuteQuery<SubjectModel>(procedure, new
            {
                Role = role,
                UserId = userId
            },CommandType.StoredProcedure);

            return result;
        }
        catch (Exception ex)
        {
            return new QueryResponse<SubjectModel>
            {
                Success = false,
                Message = $"Error getting subjects: {ex.Message}",
                Data = new List<SubjectModel>()
            };
        }
    }

    public QueryResponse<SubjectModel> GetById(int subjectId, int userId, int role)
    {
        throw new NotImplementedException();
    }

    public QueryResponse<SubjectModel> Search(string keyword)
    {
        throw new NotImplementedException();
    }
}
