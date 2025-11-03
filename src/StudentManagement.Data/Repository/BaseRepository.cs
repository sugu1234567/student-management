using StudentManagement.Core.DTOs.Response;
using StudentManagement.Core.SeedWorks;
using System.Data;
using Dapper;
using Newtonsoft.Json;
namespace StudentManagement.Data.Repository;

public class BaseRepository : IRepository
{
    private readonly DapperContext _context;

    public BaseRepository(DapperContext context)
    {
        _context = context;
    }

    public QueryResponse<T> ExecuteQuery<T>(string storedProcedure, object parameters = null, CommandType commandType = CommandType.StoredProcedure)
    {
        try
        {
            using (var connection = _context.CreateConnection())
            {
                connection.Open();

                var dynamicResults = connection.Query<dynamic>(storedProcedure, parameters, commandType: commandType).ToList();

                if (dynamicResults.Count == 0)
                {
                    return new QueryResponse<T>
                    {
                        Success = true,
                        Message = "Query executed successfully",
                        Data = new List<T>(),
                        TotalRecords = 0
                    };
                }

                var firstResult = dynamicResults.First();
                var dict = (IDictionary<string, object>)firstResult;

                if (dict.ContainsKey("Success") && dict.ContainsKey("Message"))
                {
                    var success = Convert.ToInt32(dict["Success"]) == 1;
                    var message = dict["Message"]?.ToString() ?? "Operation completed";

                    if (dict.Count == 2)
                    {
                        return new QueryResponse<T>
                        {
                            Success = success,
                            Message = message,
                            Data = new List<T>(),
                            TotalRecords = 0
                        };
                    }

                    // Nếu có nhiều hơn 2 fields -> có dữ liệu thực, convert sang T
                    var json = JsonConvert.SerializeObject(dynamicResults);
                    var data = JsonConvert.DeserializeObject<List<T>>(json);

                    return new QueryResponse<T>
                    {
                        Success = success,
                        Message = message,
                        Data = data ?? new List<T>(),
                        TotalRecords = data?.Count ?? 0
                    };
                }

                // không có Success/Message
                var jsonData = JsonConvert.SerializeObject(dynamicResults);
                var resultData = JsonConvert.DeserializeObject<List<T>>(jsonData);

                return new QueryResponse<T>
                {
                    Success = true,
                    Message = "Query executed successfully",
                    Data = resultData ?? new List<T>(),
                    TotalRecords = resultData?.Count ?? 0
                };
            }
        }
        catch (Exception ex)
        {
            return new QueryResponse<T>
            {
                Success = false,
                Message = ex.Message,
                Data = new List<T>(),
                TotalRecords = 0
            };
        }
    }

    public BaseResponse ExecuteNonQuery(string storedProcedure, object parameters = null, CommandType commandType = CommandType.StoredProcedure)
    {
        try
        {
            using (var connection = _context.CreateConnection())
            {
                connection.Open();
                var result = connection.Query<dynamic>(storedProcedure, parameters, commandType: commandType).FirstOrDefault();

                if (result != null)
                {
                    var dict = (IDictionary<string, object>)result;

                    if (dict.ContainsKey("Success") && dict.ContainsKey("Message"))
                    {
                        var success = Convert.ToInt32(dict["Success"]) == 1;
                        var message = dict["Message"]?.ToString() ?? "Operation completed";

                        return new BaseResponse
                        {
                            Success = success,
                            Message = message
                        };
                    }

                    if (dict.ContainsKey("Message"))
                    {
                        return new BaseResponse
                        {
                            Success = false,
                            Message = dict["Message"]?.ToString() ?? "Operation failed"
                        };
                    }
                }

                return new BaseResponse
                {
                    Success = true,
                    Message = "Command executed successfully"
                };
            }
        }
        catch (Exception ex)
        {
            return new BaseResponse
            {
                Success = false,
                Message = ex.Message
            };
        }
    }



    public T ExecuteScalar<T>(string storedProcedure, object parameters = null, CommandType commandType = CommandType.StoredProcedure)
    {
        try
        {
            using (var connection = _context.CreateConnection())
            {
                connection.Open();
                return connection.ExecuteScalar<T>(storedProcedure, parameters, commandType: commandType);
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"Error executing scalar: {ex.Message}");
        }
    }
}
