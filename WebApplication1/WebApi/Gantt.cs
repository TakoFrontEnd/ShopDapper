using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.WebApi
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class GanttController : ControllerBase
    {
        private readonly string _connectString;

        public GanttController(IConfiguration configuration)
        {
            _connectString = configuration.GetConnectionString("Northwind");
        }

        [HttpGet]
        public IEnumerable<Object> GetGanttDate(string OrderDate, string RequiredDate)
        {
            var startTime = Convert.ToDateTime(OrderDate);
            var endTime = Convert.ToDateTime(RequiredDate);
            var sql = @"SELECT o.OrderID,o.OrderDate,o.RequiredDate,(od.UnitPrice * od.Quantity * 1-(Od.Discount))AS 'price',OrderStatus,OrderStatusID
                        FROM Orders o
                        LEFT JOIN [Order Details] Od On o.OrderID = Od.OrderID
                        WHERE o.OrderDate >= @OrderDate AND o.RequiredDate < @RequiredDate";

            var parameters = new {
                OrderDate = startTime,
                RequiredDate = endTime
            };

            using (var conn = new SqlConnection(_connectString))
            {
                return conn.Query<Object>(sql, parameters);
            }
        }
    }
}
