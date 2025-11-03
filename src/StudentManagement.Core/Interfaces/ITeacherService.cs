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
    public interface ITeacherService
    {
        SaveResponse<int> Save(SaveRequest<TeacherModel> request);
        BaseResponse Delete(int teacherId, int userId, int role);
        QueryResponse<TeacherModel> GetById(int teacherId, int userId, int role);
        QueryResponse<TeacherModel> GetAll(int role);
        QueryResponse<TeacherModel> Search(string keyword);
    }
}
