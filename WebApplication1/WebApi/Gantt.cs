﻿using Dapper;
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
        public IEnumerable<Object> GetGanttDate(string OrderDate, string RequiredDate, string CustomerID)
        {
            var startTime = Convert.ToDateTime(OrderDate);
            var endTime = Convert.ToDateTime(RequiredDate);
            var sql = @"SELECT o.OrderID,o.OrderDate,o.RequiredDate,(od.UnitPrice * od.Quantity * 1-(Od.Discount))AS 'price',OrderStatus,OrderStatusID, CustomerID
                        FROM Orders o
                        LEFT JOIN [Order Details] Od On o.OrderID = Od.OrderID
                        WHERE o.OrderDate >= @OrderDate AND o.RequiredDate < @RequiredDate AND　CustomerID = @CustomerID";

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

        [HttpGet]
        public IEnumerable<Object> GetCustomers()
        {
            var sql = @"SELECT TOP(5) CustomerID FROM Customers";
            using (var conn = new SqlConnection(_connectString))
            {
                return conn.Query<Object>(sql);
            }
        }
    }
}
