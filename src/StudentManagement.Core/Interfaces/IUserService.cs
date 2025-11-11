using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Enums;
using StudentManagement.Core.Models;

namespace StudentManagement.Core.Interfaces
{
    public interface IUserService
    {
        SaveResponse<int> Save(SaveRequest<UserModel> request, int userId, int role);
        BaseResponse Delete(int userId, int role);
        QueryResponse<UserModel> GetById(int userId, int role);
        QueryResponse<UserModel> GetAll(int userId, int role);
        QueryResponse<UserModel> Search(string keyword, int? roleFilter, int userId, int role);

    }
}
