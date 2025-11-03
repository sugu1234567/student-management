using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagement.Core.Models
{
    public class SubjectModel
    {
        public int SubjectId { get; set; }
        public string? SubjectCode { get; set; }
        public string? SubjectName { get; set; }
        public int Credits { get; set; }
        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public int? TeacherId { get; set; }
        public string? TeacherName { get; set; }
        public int? CreatedBy { get; set; }
    }
}
