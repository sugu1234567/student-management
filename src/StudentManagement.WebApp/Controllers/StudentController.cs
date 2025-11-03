using Microsoft.AspNetCore.Mvc;

namespace StudentManagement.WebApp.Controllers
{
    public class StudentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
