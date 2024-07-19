ALTER TABLE Orders
ADD OrderStatus NVARCHAR(50);

ALTER TABLE Orders
ADD OrderStatusID INT;

ALTER TABLE Orders
ADD StateColor NVARCHAR(7);  -- 使用 NVARCHAR(7) 來存放顏色代碼 (如 #FFFFFF)


ALTER TABLE Orders
DROP COLUMN OrderStatusID;
