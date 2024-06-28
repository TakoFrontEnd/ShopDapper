using System;
using System.Collections.Generic;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using YourNamespace.Models;

namespace WebApplication1.WebApi
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class CrudController : ControllerBase
    {
        private readonly string _connectString;

        public CrudController(IConfiguration configuration)
        {
            _connectString = configuration.GetConnectionString("Northwind");
        }

        public void TryConnect()
        {
            using (var conn = new SqlConnection(_connectString))
            {
                try
                {
                    conn.Open();
                    Console.WriteLine("Connection successful!");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Connection failed: {ex.Message}");
                }
            }
        }
        
        
        [HttpGet]
        public IEnumerable<Order> GetOrders()
        {
            using (var conn = new SqlConnection(_connectString))
            {
                return conn.Query<Order>("SELECT * FROM Orders");
            }
        }

        public Order GetOrderId(int OrderID)
        {
            var sql = @"SELECT * FROM Orders WHERE OrderID = @OrderID";

            var parameters = new DynamicParameters();
            parameters.Add("OrderID", OrderID);

            using (var conn = new SqlConnection(_connectString))
            {
                var result = conn.QueryFirstOrDefault<Order>(sql, parameters);
                return result;
            }
        }
        
        
        
    }
}