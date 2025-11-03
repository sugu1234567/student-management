using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.DTOs.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagement.Core.Interfaces;

public interface IAuthService
{
    LoginResponse Login(LoginRequest request);
    BaseResponse ChangePassword(ChangePasswordRequest request);
}
