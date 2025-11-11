using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Interfaces;
using StudentManagement.Core.Models;
using StudentManagement.Core.SeedWorks;
using StudentManagement.Data;

namespace StudentManagement.Api.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository _repository;

        public UserService(IRepository repository)
        {
            _repository = repository;
        }

        public BaseResponse Delete(int userId, int role)
        {
            try
                {
                var procedure = StoredProcedures.PRC_USER_DELETE;
                var result = _repository.ExecuteQuery<UserModel>(procedure, new
                {
                    UserId = userId,
                    Role = role
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
                    Message = $"Error deleting user: {ex.Message}"
                };
            }

        }

        public QueryResponse<UserModel> GetAll(int userId, int role)
        {
            try
                {
                var procedure = StoredProcedures.PRC_USER_GET_ALL;
                var result = _repository.ExecuteQuery<UserModel>(procedure, new
                {
                    UserId = userId,
                    Role = role
                }, System.Data.CommandType.StoredProcedure);
                return new QueryResponse<UserModel>
                {
                    Success = result.Success,
                    Message = result.Message,
                    Data = result.Data,
                    TotalRecords = result.Data?.Count ?? 0
                };
            }
            catch (Exception ex)
            {
                return new QueryResponse<UserModel>
                {
                    Success = false,
                    Message = $"Error retrieving users: {ex.Message}",
                    Data = null,
                    TotalRecords = 0
                };
            }
        }

        public QueryResponse<UserModel> GetById(int userId, int role)
        {
            try
                {
                var procedure = StoredProcedures.PRC_USER_GET_BY_ID;
                var result = _repository.ExecuteQuery<UserModel>(procedure, new
                {
                    UserId = userId,
                    Role = role
                }, System.Data.CommandType.StoredProcedure);
                return new QueryResponse<UserModel>
                {
                    Success = result.Success,
                    Message = result.Message,
                    Data = result.Data,
                    TotalRecords = result.Data?.Count ?? 0
                };
            }
            catch (Exception ex)
            {
                return new QueryResponse<UserModel>
                {
                    Success = false,
                    Message = $"Error retrieving user: {ex.Message}",
                    Data = null,
                    TotalRecords = 0
                };
            }
        }

        public SaveResponse<int> Save(SaveRequest<UserModel> request, int userId, int role)
        {   

            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            var procedure = StoredProcedures.PRC_USER_SAVE;

            var model = request.Model;

            try
            {
                var result = _repository.ExecuteQuery<UserModel>(procedure, new
                {
                    model.UserId,
                    model.Username,
                    model.PasswordHash,
                    model.FullName,
                    model.Email,
                    model.Role,
                    RequestUserId = request.UserId,
                    RequestUserRole = request.Role
                }, System.Data.CommandType.StoredProcedure);
                return new SaveResponse<int>
                {
                    Success = result.Success,
                    Message = result.Message,
                    Id = result.Success ? (result.Data?.FirstOrDefault()?.UserId ?? 0) : 0
                };
            }
            catch (Exception ex)
            {
                return new SaveResponse<int>
                {
                    Success = false,
                    Message = $"Error saving user: {ex.Message}",
                    Id = 0
                };
            }
        }

        public QueryResponse<UserModel> Search(string keyword, int? roleFilter, int userId, int role)
        {
            try
                {
                var procedure = StoredProcedures.PRC_USER_SEARCH;
                var result = _repository.ExecuteQuery<UserModel>(procedure, new
                {
                    Keyword = keyword,
                    RoleFilter = roleFilter,
                    UserId = userId,
                    Role = role
                }, System.Data.CommandType.StoredProcedure);
                return new QueryResponse<UserModel>
                {
                    Success = result.Success,
                    Message = result.Message,
                    Data = result.Data,
                    TotalRecords = result.Data?.Count ?? 0
                };
            }
            catch (Exception ex)
            {
                return new QueryResponse<UserModel>
                {
                    Success = false,
                    Message = $"Error searching users: {ex.Message}",
                    Data = null,
                    TotalRecords = 0
                };
            }
        }
    }
}
