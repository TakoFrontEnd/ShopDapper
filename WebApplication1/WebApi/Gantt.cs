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
        public IEnumerable<Object> GetGanttData(string OrderDate, string RequiredDate, string CustomerID)
        {
            var startTime = Convert.ToDateTime(OrderDate);
            var endTime = Convert.ToDateTime(RequiredDate);
            var sql = @"SELECT o.OrderID,
                        o.CustomerID,
                        o.OrderDate,
                        o.RequiredDate,
                        (od.UnitPrice * od.Quantity * 1-(Od.Discount))AS 'price',
                        OrderStatus,
                        OrderStatusID, 
                        CustomerID,
                        [OrderStatus],
                        [OrderStatusID],
                        [StateColor]
                        FROM Orders o
                        LEFT JOIN [Order Details] Od On o.OrderID = Od.OrderID
                        WHERE o.OrderDate >= @OrderDate AND o.RequiredDate <= @RequiredDate AND　o.CustomerID = @CustomerID";

            var parameters = new {
                OrderDate = startTime,
                RequiredDate = endTime,
                CustomerID = CustomerID
            };

            using (var conn = new SqlConnection(_connectString))
            {
                return conn.Query<Object>(sql, parameters);
            }
        }

        // 呈現目前時間內的客戶 先設計5個就好
        [HttpGet]
        public IEnumerable<Object> GetTimeRangeCustomer(string OrderDate, string RequiredDate)
        {
            var sql = @"SELECT  DISTINCT TOP(5) CustomerID
                        FROM [Northwind].[dbo].[Orders]
                        WHERE OrderDate > @OrderDate AND  RequiredDate <= @RequiredDate";

            var parameters = new
            {
                OrderDate = OrderDate,
                RequiredDate = RequiredDate
            };

            using (var conn = new SqlConnection(_connectString))
            {
                return conn.Query<Object>(sql, parameters);
            }
        }

       

    }
}
