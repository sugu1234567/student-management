using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagement.Core.Interfaces
{
    public interface IStudentService
    {
        SaveResponse<int> Save(SaveRequest<StudentModel> request);
        BaseResponse Delete(int studentId);
        QueryResponse<StudentModel> GetById(int studentId, int userId, int role);
        QueryResponse<StudentModel> GetAll();
        QueryResponse<StudentModel> Search(string? keyword, int? classId, int? departmentId);
        QueryResponse<StudentModel> GetByClass(int classId, int userId, int role);
    }
}
