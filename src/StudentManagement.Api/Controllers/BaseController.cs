using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace StudentManagement.Api.Controllers;

public class BaseController : ControllerBase
{
    protected int userId
    {
        get
        {
            var value = User.FindFirst("userId")?.Value;
            return int.TryParse(value, out var id) ? id : 0;
        }
    }

    protected int role
    {
        get
        {
            var value = User.FindFirst(ClaimTypes.Role)?.Value
                        ?? User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            return int.TryParse(value, out var r) ? r : 0;
        }
    }
}
