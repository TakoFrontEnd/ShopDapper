using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Northwind.DataAccess.Data;
using Northwind.DataAccess.Repository;
using Northwind.Models.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Northwind.DataAccess
{
    public class OrderRepository<T> : IRepository<T> where T : class
    {
        private readonly ApplicationDbContext _db;
        private readonly string _connectionString;

        public OrderRepository(ApplicationDbContext db)
        {
            _db = db;
            _connectionString = _db.Database.GetDbConnection().ConnectionString;
        }

        

        public void Add([FromBody] T entity)
        {
            throw new NotImplementedException();
        }

        public T Get(int entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<T> GetAll()
        {
            throw new NotImplementedException();
        }

        public void Remove(int T)
        {
            throw new NotImplementedException();
        }

        public void Save()
        {
            throw new NotImplementedException();
        }

        public IActionResult Update(T entity)
        {
            throw new NotImplementedException();
        }
    }
}
