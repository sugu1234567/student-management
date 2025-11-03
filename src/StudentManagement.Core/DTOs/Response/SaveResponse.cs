using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagement.Core.DTOs.Response
{
    public class SaveResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Id { get; set; }
    }
}
