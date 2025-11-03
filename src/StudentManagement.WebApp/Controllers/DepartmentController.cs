using Microsoft.AspNetCore.Mvc;

namespace StudentManagement.WebApp.Controllers
{
    public class DepartmentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
