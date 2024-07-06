public interface ICategoryRepository : IRepository<Category>
    {
        void UpDate(Category obj);
        void Save();
    }