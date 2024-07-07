using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Northwind.Models.Models;

namespace WebApplication1.Controllers
{
    public class OrderController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public OrderController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}