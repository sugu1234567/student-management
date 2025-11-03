using StudentManagement.Core.DTOs.Response;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagement.Core.SeedWorks
{
    public interface IRepository
    {
        QueryResponse<T> ExecuteQuery<T>(string storedProcedure, object parameters = null, CommandType commandType = CommandType.StoredProcedure);
        BaseResponse ExecuteNonQuery(string storedProcedure, object parameters = null, CommandType commandType = CommandType.StoredProcedure);
        T ExecuteScalar<T>(string storedProcedure, object parameters = null, CommandType commandType = CommandType.StoredProcedure);
    }
}
