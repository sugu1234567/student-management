using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Entities;
using StudentManagement.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagement.Core.Interfaces;

public interface IGradeService
{
    SaveResponse<int> Save(SaveRequest<GradeModel> request, int userId, int role);
    BaseResponse Delete(int gradeId, int role, int userId);
    QueryResponse<GradeModel> GetByStudent(int studentId);
    QueryResponse<GradeModel> GetBySubject(int subjectId);
    QueryResponse<GradeModel> GetByClass(int classId);
    QueryResponse<GradeModel> GetByTeacher(int userId, int role);
    QueryResponse<GradeModel> GetAll(int userId, int role);
    QueryResponse<GradeModel> Search(string? keyword,int? classId,int? studentId,int? subjectId);

}

