using Microsoft.AspNetCore.Mvc;
using Northwind.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Northwind.DataAccess.Repository
{
    public interface IOrderRepository
    {
        IEnumerable<Order> GetAllOrders();
        Order GetOrderById(int orderId);
        void CreateOrder(Order order);
        void UpdateOrder(Order order);
        void DeletectOrder(int orderId);
    }
}
