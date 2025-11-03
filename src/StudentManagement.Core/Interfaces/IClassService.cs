using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagement.Core.Interfaces;

public interface IClassService
{
    SaveResponse<int> Save(SaveRequest<ClassModel> request,int userId, int role);
    BaseResponse Delete(int classId, int userId, int role);
    QueryResponse<ClassModel> GetById(int classId,int userId, int role);
    QueryResponse<ClassModel> GetAll(int userId, int role);
    QueryResponse<ClassModel> Search(string keyword);
}
