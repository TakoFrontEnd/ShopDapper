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

        //方法注入
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
                return conn.Query<Order>("SELECT OrderID, CustomerID, OrderDate, ShippedDate, Freight  FROM Orders WHERE CustomerID IS NOT NULL");
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

        //分頁
        public IEnumerable<Order> GetOrdersPaged(int pageNumber, int pageSize)
        {
            var sql = @"
                        SELECT * 
                        FROM (
                            SELECT *, ROW_NUMBER() OVER (ORDER BY OrderID) AS RowNum
                            FROM Orders
                        ) AS Result
                        WHERE RowNum >= @StartRow AND RowNum <= @EndRow
                        ORDER BY OrderID";

            // 計算開始行和結束行
            var StartRow = (pageNumber - 1) * pageSize + 1;
            var EndRow = pageNumber * pageSize;

            // 設置參數
            var parameters = new DynamicParameters();
            parameters.Add("StartRow", StartRow);
            parameters.Add("EndRow", EndRow);

            using (var conn = new SqlConnection(_connectString))
            {
                return conn.Query<Order>(sql, parameters);
            }
        }



        [HttpPost]
        //單筆
        public IActionResult CreateOrder([FromBody] Order order)
        {
            if (order == null)
            {
                return BadRequest("新增失敗");
            }
            else
            {
                var sql = @"INSERT INTO [Northwind].[dbo].[Orders] 
                        (CustomerID, ShipCountry, ShipCity, ShipAddress)
                VALUES (@CustomerID, @ShipCountry, @ShipCity, @ShipAddress)";

                var parameters = new DynamicParameters();
                parameters.Add("CustomerID", order.CustomerId);
                parameters.Add("ShipCountry", order.ShipCountry);
                parameters.Add("ShipCity", order.ShipCity);
                parameters.Add("ShipAddress", order.ShipAddress);

                using (var conn = new SqlConnection(_connectString))
                {
                    conn.Execute(sql, parameters);
                }
            }
            return Ok("新增成功");
        }



        [HttpPost]
        //編輯
        public IActionResult UpdateOrder([FromBody] Order order)
        {

            if (order == null)
            {
                return BadRequest("新增失敗");
            }
            else
            {
                var sql = @"SELECT OrderID FROM Orders WHERE OrderID = @OrderID";
                var updateSql = @"UPDATE Orders 
                        SET ShipCountry= @ShipCountry, 
                            ShipCity= @ShipCity, 
                            ShipAddress= @ShipAddress
                        WHERE OrderID = @OrderID";

                var parameters = new DynamicParameters();
                parameters.Add("OrderID", order.OrderId);
                parameters.Add("CustomerID", order.CustomerId);
                parameters.Add("ShipCountry", order.ShipCountry);
                parameters.Add("ShipCity", order.ShipCity);
                parameters.Add("ShipAddress", order.ShipAddress);

                using (var conn = new SqlConnection(_connectString))
                {
                    //先判斷有沒有該訂單
                    var query = conn.Query<Order>(sql, parameters);
                    if (query == null)
                    {
                        BadRequest("找不到該訂單");
                    }
                    else
                    {
                        conn.Execute(updateSql, parameters);
                    }
                }
            }
            return Ok("保存成功");
        }




        //刪除
        public void DelectOrder(int OrderID)
        {
            var sql = @"DELETE FROM [Northwind].[dbo].[Order Details] WHERE OrderID=@OrderID";
            var sql2 = @"DELETE FROM Orders WHERE OrderID=@OrderID";

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
                    conn.Execute(sql2, parameters);
                }
            }
        }
    }
}