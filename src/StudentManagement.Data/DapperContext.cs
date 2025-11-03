using Microsoft.Extensions.Configuration;
using System.Data;
using Microsoft.Data.SqlClient;

namespace StudentManagement.Data
{
    public class DapperContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public DapperContext(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection") 
                ?? throw new ArgumentNullException(nameof(_connectionString), "Connection string 'DefaultConnection' not found");
        }

        public IDbConnection CreateConnection()
            => new SqlConnection(_connectionString);
    }
}
