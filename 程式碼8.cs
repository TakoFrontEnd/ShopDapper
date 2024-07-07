public class OrderRepository : IOrderRepository
{
    private readonly IDbConnection _dbConnection;

    public OrderRepository(IConfiguration configuration)
    {
        string connectionString = configuration.GetConnectionString("Northwind");
        _dbConnection = new SqlConnection(connectionString);
    }

    public void CreateOrder([FromBody] Order order)
    {
        var sql = @"INSERT INTO [Northwind].[dbo].[Orders] 
                        (CustomerID, ShipCountry, ShipCity, ShipAddress)
                VALUES (@CustomerID, @ShipCountry, @ShipCity, @ShipAddress)";
        var parameters = new DynamicParameters();
        parameters.Add("CustomerID", order.CustomerId);
        parameters.Add("ShipCountry", order.ShipCountry);
        parameters.Add("ShipCity", order.ShipCity);
        parameters.Add("ShipAddress", order.ShipAddress);
        _dbConnection.Execute(sql, parameters);
    }

    public void DeletectOrder(int orderId)
    {
        var sql = @"DELETE FROM [Northwind].[dbo].[Order Details] WHERE OrderID=@OrderID";
        var sql2 = @"DELETE FROM Orders WHERE OrderID=@OrderID";
        var sql3 = @"SELECT * FROM Orders WHERE OrderID=@OrderID";

        var parameters = new DynamicParameters();
        parameters.Add("OrderID", orderId);

        var query = _dbConnection.Query<Order>(sql3, parameters);
        if (query == null)
        {
            _dbConnection.Close();
            _dbConnection.Dispose();
        }
        else
        {
            _dbConnection.Execute(sql, parameters);
            _dbConnection.Execute(sql2, parameters);
        }

    }

    public IEnumerable<Order> GetAllOrders()
    {
        return _dbConnection.Query<Order>("SELECT * FROM Orders WHERE CustomerID IS NOT NULL");
    }

    public Order GetOrderById(int OrderID)
    {
        var sql = @"SELECT * FROM Orders WHERE OrderID = @OrderID AND CustomerID IS NOT NULL";
        var parameters = new DynamicParameters();
        parameters.Add("OrderID", OrderID);
        return _dbConnection.QueryFirstOrDefault<Order>(sql, parameters);
    }

    public void UpdateOrder([FromBody] Order order)
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

        var query = _dbConnection.Query<Order>(sql, parameters);
        if (query == null)
        {
            _dbConnection.Close();
            _dbConnection.Dispose();
        }
        else
        {
            _dbConnection.Execute(updateSql, parameters);
        }

    }
}