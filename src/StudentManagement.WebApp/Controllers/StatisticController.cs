using Microsoft.AspNetCore.Mvc;

namespace StudentManagement.WebApp.Controllers
{
    public class StatisticController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
