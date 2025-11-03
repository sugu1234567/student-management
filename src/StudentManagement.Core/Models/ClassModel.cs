using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagement.Core.Models
{
    public class ClassModel
    {
        public int ClassId { get; set; }
        public string ClassName { get; set; }
        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public int? TeacherId { get; set; }
        public string? TeacherName { get; set; }
    }
}
