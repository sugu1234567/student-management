using Microsoft.IdentityModel.Tokens;
using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.Interfaces;
using StudentManagement.Core.Models;
using StudentManagement.Core.SeedWorks;
using StudentManagement.Data;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StudentManagement.Api.Services;

public class AuthService : IAuthService
{
    private readonly IRepository _repository;
    private readonly IConfiguration _configuration;

    public AuthService(IRepository repository, IConfiguration configuration)
    {
        _repository = repository;
        _configuration = configuration;
    }

    public LoginResponse Login(LoginRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Username and password are required"
                };
            }

            var procedure = StoredProcedures.PRC_USER_LOGIN;
            var result = _repository.ExecuteQuery<UserLoginModel>(procedure, new
            {
                Username = request.Username
            }, CommandType.StoredProcedure);

            var user = result.Data?.FirstOrDefault();

            if (user == null)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Invalid username or password"
                };
            }

            // Verify password
            bool isValidPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isValidPassword)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Invalid username or password"
                };
            }

            if (!user.IsActive)
            {
                return new LoginResponse
                {
                    Success = false,
                    Message = "Account is inactive"
                };
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            return new LoginResponse
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                UserId = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                Role = GetRoleName(user.Role)
            };
        }
        catch (Exception ex)
        {
            return new LoginResponse
            {
                Success = false,
                Message = $"Error during login: {ex.Message}"
            };
        }
    }

    public BaseResponse ChangePassword(ChangePasswordRequest request)
    {
        try
        {
            // Get user info
            var procedure = StoredProcedures.PRC_USER_GET_BY_ID;
            var result = _repository.ExecuteQuery<UserLoginModel>(procedure, new
            {
                UserId = request.UserId
            }, CommandType.StoredProcedure);

            var user = result.Data?.FirstOrDefault();

            if (user == null)
            {
                return new BaseResponse
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            // Verify old password
            bool isValidPassword = BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash);

            if (!isValidPassword)
            {
                return new BaseResponse
                {
                    Success = false,
                    Message = "Old password is incorrect"
                };
            }

            // Hash new password
            string newPasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            // Update password
            var changeProcedure = StoredProcedures.PRC_USER_CHANGE_PASSWORD;
            var changeResult = _repository.ExecuteNonQuery(changeProcedure, new
            {
                UserId = request.UserId,
                PasswordHash = newPasswordHash
            }, CommandType.StoredProcedure);

            return changeResult;
        }
        catch (Exception ex)
        {
            return new BaseResponse
            {
                Success = false,
                Message = $"Error changing password: {ex.Message}"
            };
        }
    }

    private string GenerateJwtToken(UserLoginModel user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"];
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];
        var expiryMinutes = int.Parse(jwtSettings["ExpiryMinutes"]);

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("userId", user.UserId.ToString()),
            new Claim("fullName", user.FullName),
            new Claim("role", user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.Now.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GetRoleName(int role)
    {
        return role switch
        {
            1 => "Admin",
            2 => "Teacher",
            3 => "Student",
            _ => "Unknown"
        };
    }
}
