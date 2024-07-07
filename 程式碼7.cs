public interface IOrderRepository
{
    IEnumerable<Order> GetAllOrders();
    Order GetOrderById(int orderId);
    void CreateOrder(Order order);
    void UpdateOrder(Order order);
    void DeletectOrder(int orderId);
}