ALTER TABLE Orders
ADD OrderStatus NVARCHAR(50);

ALTER TABLE Orders
ADD OrderStatusID INT;

ALTER TABLE Orders
ADD StateColor NVARCHAR(7);  -- �ϥ� NVARCHAR(7) �Ӧs���C��N�X (�p #FFFFFF)


ALTER TABLE Orders
DROP COLUMN OrderStatusID;
