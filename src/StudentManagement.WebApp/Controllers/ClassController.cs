using Microsoft.AspNetCore.Mvc;

namespace StudentManagement.WebApp.Controllers
{
    public class ClassController : Controller
    {
        public IActionResult ClassStudents()
        {
            return View();
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
