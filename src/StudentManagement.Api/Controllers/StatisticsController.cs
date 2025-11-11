using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.Core.Interfaces;

namespace StudentManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StatisticsController : BaseController
{
    private readonly IStatisticsService _statisticsService;

    public StatisticsController(IStatisticsService statisticsService)
    {
        _statisticsService = statisticsService;
    }

    // Thống kê tổng quan
    [HttpGet("overview")]
    public IActionResult GetOverview(int userId, int role)
    {
        try
        {
            var result = _statisticsService.GetOverview(userId, role);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    // Thống kê sinh viên theo lớp
    [HttpGet("students-by-class")]
    public IActionResult GetStudentsByClass(int userId, int role)
    {
        try
        {
            var result = _statisticsService.GetStudentsByClass(userId, role);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    // Thống kê sinh viên theo khoa
    [HttpGet("students-by-department")]
    public IActionResult GetStudentsByDepartment(int userId, int role)
    {
        try
        {
            var result = _statisticsService.GetStudentsByDepartment(userId, role);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    // Thống kê điểm trung bình theo lớp
    [HttpGet("average-grade-by-class")]
    public IActionResult GetAverageGradeByClass(int? classId, int? semester, string? academicYear, int userId, int role)
    {
        try
        {
            var result = _statisticsService.GetAverageGradeByClass(classId, semester, academicYear, userId, role);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    // Thống kê điểm trung bình theo môn học
    [HttpGet("average-grade-by-subject")]
    public IActionResult GetAverageGradeBySubject(int? subjectId, int? semester, string? academicYear, int userId, int role)
    {
        try
        {
            var result = _statisticsService.GetAverageGradeBySubject(subjectId, semester, academicYear, userId, role);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }
}