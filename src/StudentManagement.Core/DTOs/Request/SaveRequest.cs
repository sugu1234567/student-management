namespace StudentManagement.Core.DTOs.Request;

public class SaveRequest<T> where T : class
{
    public T Model { get; set; }
    public int? UserId { get; set; }
    public int? Role { get; set; }
}
