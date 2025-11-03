using StudentManagement.Core.SeedWorks;
using System.Data;
using BCrypt.Net;
using Dapper;
namespace StudentManagement.Data
{
    public class AdminSeeder
    {
        private readonly IRepository _repository;

        public AdminSeeder(IRepository repository)
        {
            _repository = repository;
        }

        public void SeedAdminAccount()
        {
            try
            {
                // Check if admin exists
                var existingAdmin = _repository.ExecuteScalar<int>(
                    StoredProcedures.PRC_USER_GET_BY_ID,
                    new { UserId = 1 },
                    CommandType.StoredProcedure
                );

                if (existingAdmin == 0)
                {
                    // Create default admin account
                    // Password: Admin@123 (should be hashed)
                    var passwordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123");

                    _repository.ExecuteNonQuery(
                        StoredProcedures.PRC_USER_SAVE,
                        new
                        {
                            UserId = 0,
                            Username = "admin",
                            PasswordHash = passwordHash,
                            FullName = "System Administrator",
                            Email = "admin@studentmanagement.com",
                            Phone = "0123456789",
                            Role = 1, // Admin
                            IsActive = true,
                            CreatedBy = 0
                        },
                        CommandType.StoredProcedure
                    );

                    Console.WriteLine("Admin account created successfully!");
                    Console.WriteLine("Username: admin");
                    Console.WriteLine("Password: Admin@123");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error seeding admin account: {ex.Message}");
            }
        }
    }
}
