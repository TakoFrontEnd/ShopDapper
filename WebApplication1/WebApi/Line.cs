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
    public class LineController : ControllerBase
    {
        private readonly string _connectString;

        public LineController(IConfiguration configuration)
        {
            _connectString = configuration.GetConnectionString("Northwind");
        }

        [HttpGet]
        public IEnumerable<Object> GetShippedFreight(string OrderDate, string RequiredDate, string CustomerID)
        {
            var sql = @"SELECT CustomerID, ShippedDate, Freight FROM Orders
                        WHERE OrderDate > @OrderDate AND 
                            RequiredDate <= @RequiredDate AND
                            CustomerID = @CustomerID ORDER BY ShippedDate ASC";

            var parameters = new
            {
                OrderDate = OrderDate,
                RequiredDate = RequiredDate,
                CustomerID = CustomerID,
            };
            using (var conn = new SqlConnection(_connectString))
            {
                return conn.Query<Object>(sql, parameters).ToList();
            }
        }

    }
}


/*
  [HttpGet]
        public IEnumerable<Object> GetShippedFreight()
        {
            var sql = @"SELECT CustomerID, ShippedDate, Freight FROM Orders";
            using (var conn = new SqlConnection(_connectString))
            {
                return conn.Query<Object>(sql);
            }
        }
 
 */