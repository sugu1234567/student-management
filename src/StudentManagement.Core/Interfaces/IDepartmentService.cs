using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Models;

namespace StudentManagement.Core.Interfaces
{
    public interface IDepartmentService
    {
        SaveResponse<int> Save(SaveRequest<DepartmentModel> request);
        BaseResponse Delete(int departmentId, int userId, int role);
        QueryResponse<DepartmentModel> GetById(int departmentId, int role);
        QueryResponse<DepartmentModel> GetAll(int role);
        QueryResponse<DepartmentModel> Search(string keyword);
    }
}
