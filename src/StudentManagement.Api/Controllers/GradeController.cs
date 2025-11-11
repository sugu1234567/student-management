using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.Api.Services;
using StudentManagement.Core.DTOs.Request;
using StudentManagement.Core.Interfaces;
using StudentManagement.Core.Models;

namespace StudentManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GradeController : BaseController
{
    private readonly IGradeService _gradeService;

    public GradeController(IGradeService gradeService)
    {
        _gradeService = gradeService;
    }

    [HttpPost("save")]
    public IActionResult Save([FromBody] SaveRequest<GradeModel> request)
    {
        try
        {
            var result = _gradeService.Save(request, userId, role);
            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        try
        {
            var result = _gradeService.Delete(id, userId, role);
            if (result.Success)
            {
                return Ok(result);
            }
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpGet("all")]
    public IActionResult GetAll()
    {
        try
        {
            var result = _gradeService.GetAll(userId, role);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    //[HttpGet("by-student/{studentId}")]
    //public IActionResult GetByStudent(int studentId)
    //{
    //    try
    //    {
    //        var result = _gradeService.GetByStudent(studentId);
    //        return Ok(result);
    //    }
    //    catch (Exception ex)
    //    {
    //        return StatusCode(500, new { success = false, message = ex.Message });
    //    }
    //}

    //[HttpGet("by-subject/{subjectId}")]
    //public IActionResult GetBySubject(int subjectId)
    //{
    //    try
    //    {
    //        var result = _gradeService.GetBySubject(subjectId);
    //        return Ok(result);
    //    }
    //    catch (Exception ex)
    //    {
    //        return StatusCode(500, new { success = false, message = ex.Message });
    //    }
    //}

    //[HttpGet("by-class/{classId}")]
    //public IActionResult GetByClass(int classId)
    //{
    //    try
    //    {
    //        var result = _gradeService.GetByClass(classId);
    //        return Ok(result);
    //    }
    //    catch (Exception ex)
    //    {
    //        return StatusCode(500, new { success = false, message = ex.Message });
    //    }
    //}

    [HttpGet("search")]
    public IActionResult Search([FromQuery] string? keyword, [FromQuery] int? classId, [FromQuery] int? studentId, [FromQuery] int? subjectId)
    {
        try
        {
            var result = _gradeService.Search(keyword, classId, studentId, subjectId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

}
