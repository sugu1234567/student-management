using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Models;

namespace StudentManagement.Core.Interfaces;

public interface ISubjectService 
{
    SaveResponse<int> Save(SaveRequest<SubjectModel> request, int userId, int role);
    BaseResponse Delete(int subjectId, int userId, int role);
    QueryResponse<SubjectModel> GetById(int subjectId, int userId, int role);
    QueryResponse<SubjectModel> GetAll(int userId, int role);
    QueryResponse<SubjectModel> Search(string keyword);
}
