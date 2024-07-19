---- 更新每筆訂單的 RandomNumber 欄位為 1 到 10 的隨機數字

--UPDATE Orders
--SET OrderStatus = 'Unknow'
--WHERE OrderStatusID = 0;

--UPDATE Orders
--SET OrderStatus = 'Pending'
--WHERE OrderStatusID = 1;

--UPDATE Orders
--SET OrderStatus = 'Processing'
--WHERE OrderStatusID = 2;

--UPDATE Orders
--SET OrderStatus = 'Shipped'
--WHERE OrderStatusID = 3;

--UPDATE Orders
--SET OrderStatus = 'Delivered'
--WHERE OrderStatusID = 4;

--UPDATE Orders
--SET OrderStatus = 'Cancelled'
--WHERE OrderStatusID = 5;

--UPDATE Orders
--SET OrderStatus = 'Returned'
--WHERE OrderStatusID = 6;

--UPDATE Orders
--SET OrderStatus = 'On Hold'
--WHERE OrderStatusID = 7;

--UPDATE Orders
--SET OrderStatus = 'Completed'
--WHERE OrderStatusID = 8;

--UPDATE Orders
--SET OrderStatus = 'Processing'
--WHERE OrderStatusID = 9;

--UPDATE Orders
--SET OrderStatus = 'Failed'
--WHERE OrderStatusID = 10;

UPDATE Orders
SET StateColor = 'Pink'
WHERE OrderStatusID = 0;

UPDATE Orders
SET StateColor = 'Red'
WHERE OrderStatusID = 1;

UPDATE Orders
SET StateColor = 'Blue'
WHERE OrderStatusID = 2;

UPDATE Orders
SET StateColor = 'Green'
WHERE OrderStatusID = 3;

UPDATE Orders
SET StateColor = 'Yellow'
WHERE OrderStatusID = 4;

UPDATE Orders
SET StateColor = 'Purple'
WHERE OrderStatusID = 5;

UPDATE Orders
SET StateColor = 'Orange'
WHERE OrderStatusID = 6;

UPDATE Orders
SET StateColor = 'Pink'
WHERE OrderStatusID = 7;

UPDATE Orders
SET StateColor = 'Brown'
WHERE OrderStatusID = 8;

UPDATE Orders
SET StateColor = 'Gray'
WHERE OrderStatusID = 9;

UPDATE Orders
SET StateColor = 'Black'
WHERE OrderStatusID = 10;
