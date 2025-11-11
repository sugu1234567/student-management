using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagement.Core.Models
{
    public class GradeModel
    {
        public int? GradeId { get; set; }
        public int? StudentId { get; set; }
        public string? StudentCode { get; set; }
        public string? StudentName { get; set; }
        public int? SubjectId { get; set; }
        public string? SubjectCode { get; set; }
        public string? SubjectName { get; set; }
        public string? ClassName { get; set; }
        public decimal Score { get; set; }
        public int? Classification { get; set; }
        public string? ClassificationName { get; set; }
        public int? Semester { get; set; }
        public string? AcademicYear { get; set; }
        public int? CreatedBy { get; set; }
    }
}
