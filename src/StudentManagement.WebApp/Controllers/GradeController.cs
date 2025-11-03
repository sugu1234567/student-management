using Microsoft.AspNetCore.Mvc;

namespace StudentManagement.WebApp.Controllers
{
    public class GradeController : Controller
    {
        public IActionResult Index()
        {
            return View("Grade");
        }
    }
}
