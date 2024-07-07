using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Northwind.DataAccess.Repository;
using Northwind.Models.Models;


namespace WebApplication1.WebApi
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        public OrderController(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        [HttpGet]
        public IEnumerable<Order> GetAllOrders()
        {
            return _orderRepository.GetAllOrders();
        }

    }
}