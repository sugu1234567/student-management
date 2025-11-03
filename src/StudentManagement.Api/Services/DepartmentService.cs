using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Entities;
using StudentManagement.Core.Interfaces;
using StudentManagement.Core.Models;
using StudentManagement.Core.SeedWorks;
using StudentManagement.Data;
using System.Data;

namespace StudentManagement.Api.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IRepository _repository;

        public DepartmentService(IRepository repository)
        {
            _repository = repository;
        }

        public SaveResponse<int> Save(SaveRequest<DepartmentModel> request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }
            
            var procedure = StoredProcedures.PRC_DEPARTMENT_SAVE;

            var model = request.Model;

            try
            {
                var result = _repository.ExecuteQuery<DepartmentModel>(procedure, new
                {
                    model.DepartmentId,
                    model.DepartmentCode,
                    model.DepartmentName,
                    model.CreatedBy
                }, System.Data.CommandType.StoredProcedure);
                var obj = result.Data?.FirstOrDefault();
                return new SaveResponse<int>
                {
                    Success = result.Success,
                    Message = result.Message,
                    Id = obj?.DepartmentId ?? 0
                };
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
        public BaseResponse Delete(int departmentId, int userId, int role)
        {
            try
                {
                var procedure = StoredProcedures.PRC_DEPARTMENT_DELETE;
                var result = _repository.ExecuteNonQuery(procedure, new 
                { 
                    DepartmentId = departmentId,
                    UserId = userId,
                    Role = role

                }
                ,CommandType.StoredProcedure);
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

        public QueryResponse<DepartmentModel> GetAll(int role)
        {
            try
            {
                var procedure = StoredProcedures.PRC_DEPARTMENT_GET_ALL;
                var result = _repository.ExecuteQuery<DepartmentModel>(procedure, new {Role = role}, CommandType.StoredProcedure);
                return result;
            }
            catch
            {
                return new QueryResponse<DepartmentModel>
                {
                    Success = false,
                    Message = "Error retrieving departments.",
                    Data = null
                };
            }
        }

        public QueryResponse<DepartmentModel> GetById(int departmentId, int role)
        {
            try
                {
                var procedure = StoredProcedures.PRC_DEPARTMENT_GET_BY_ID;
                var result = _repository.ExecuteQuery<DepartmentModel>(procedure, new {
                    //UserId = userId,
                    Role = role,
                    DepartmentId = departmentId 
                }, CommandType.StoredProcedure);
                return result;
            }
            catch (Exception ex)
            {
                return new QueryResponse<DepartmentModel>
                {
                    Success = false,
                    Message = $"Error retrieving department: {ex.Message}",
                    Data = null
                };
            }
        }

        public QueryResponse<DepartmentModel> Search(string keyword)
        {
            throw new NotImplementedException();
        }
    }
}
