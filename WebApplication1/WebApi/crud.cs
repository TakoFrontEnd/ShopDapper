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
                return conn.Query<Order>("SELECT * FROM Orders WHERE CustomerID IS NOT NULL");
            }
        }

        [HttpGet]
        public Order GetOrderId(int OrderID)
        {
            var sql = @"SELECT * FROM Orders WHERE OrderID = @OrderID AND CustomerID IS NOT NULL";

            var parameters = new DynamicParameters();
            parameters.Add("OrderID", OrderID);

            using (var conn = new SqlConnection(_connectString))
            {
                var result = conn.QueryFirstOrDefault<Order>(sql, parameters);
                return result;
            }
        }


        [HttpPost]
        //單筆
        public void CreateOrder(string CustomerID, string ShipCountry, string ShipCity, string ShipAddress, DateTime OrderDate)
        {
            var sql = @"INSERT INTO [Northwind].[dbo].[Orders] 
                        (CustomerID, ShipCountry, ShipCity, ShipAddress, OrderDate)
                VALUES (@CustomerID, @ShipCountry, @ShipCity, @ShipAddress,@OrderDate)";

            var parameters = new DynamicParameters();
            parameters.Add("CustomerID", CustomerID);
            parameters.Add("ShipCountry", ShipCountry);
            parameters.Add("ShipCity", ShipCity);
            parameters.Add("ShipAddress", ShipAddress);
            parameters.Add("OrderDate", OrderDate);

            using (var conn = new SqlConnection(_connectString))
            {
                conn.Execute(sql, parameters);
            }
        }


        //多筆
        public void CreatePluralOrder(IEnumerable<Order> orders)
        {
            var sql = @"INSERT INTO [Northwind].[dbo].[Orders] (CustomerID, ShipCountry, ShipCity, ShipAddress, OrderDate)
                VALUES (@CustomerID, @ShipCountry, @ShipCity, @ShipAddress,@OrderDate)";

            using (var conn = new SqlConnection(_connectString))
            {
                conn.Execute(sql, orders);
            }
        }


        //編輯
        public void UpdateOrder(int OrderID, string CustomerID, int EmployeeID, DateTime OrderDate)
        {
            //先判斷有沒有該訂單
            var sql = @"SELECT OrderID FROM Orders WHERE OrderID = @OrderID";
            var updateSql = @"UPDATE Orders 
                        SET CustomerID = @CustomerID, 
                            EmployeeID = @EmployeeID, 
                            OrderDate = @OrderDate 
                        WHERE OrderID = @OrderID";

            var parameters = new DynamicParameters();
            parameters.Add("OrderID", OrderID);
            parameters.Add("CustomerID", CustomerID);
            parameters.Add("EmployeeID", EmployeeID);
            parameters.Add("OrderDate", OrderDate);

            using (var conn = new SqlConnection(_connectString))
            {
                var query = conn.Query<Order>(sql, parameters);
                if(query == null)
                {
                    BadRequest("找不到該訂單");
                }
                else
                {
                    conn.Execute(updateSql, parameters);
                }
            }
        }

        //刪除
        public void DelectOrder(int OrderID)
        {
            var sql = @"UPDATE Orders 
                        SET CustomerID = NULL, 
                            EmployeeID = NULL, 
                            OrderDate = NULL 
                        WHERE OrderID = @OrderID";

            var parameters = new DynamicParameters();
            parameters.Add("OrderID", OrderID);

            using (var conn = new SqlConnection(_connectString))
            {
                var query = conn.Query<Order>(sql, parameters);
                if (query == null)
                {
                    BadRequest("找不到該訂單");
                }
                else
                {
                    conn.Execute(sql, parameters);
                }
            }
        }
    }
}