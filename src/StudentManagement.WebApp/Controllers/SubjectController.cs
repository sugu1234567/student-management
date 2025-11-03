using Microsoft.AspNetCore.Mvc;

namespace StudentManagement.WebApp.Controllers
{
    public class SubjectController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
