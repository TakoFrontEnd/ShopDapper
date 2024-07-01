const { createApp, ref, reactive, onMounted } = Vue;


/* 改善點 : 
    1. 希望能用表格形式傳送數據
    2. formate形式
    3. 由新至舊排
    4. 分頁 => 套bootstrip table + axios後端
 */


createApp({
    setup() {
        const OrderID = ref('');
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const orderDate = ref(formattedDate);
        const customerId = ref('');
        const shipCountry = ref('');
        const shipCity = ref('');
        const shipAddress = ref('');

        let orderList = reactive([]);
        const orderDetail = ref({
            orderId: '',
            customerId: '',
            orderDate: '',
            shipCountry: '',
            shipCity: '',
            shipAddress: ''
        });
        
        
        const isModalOpen = ref(false);
        const createModalOpen = ref(false);
        const editModalOpen = ref(false);

        const closeModal = () => {
            isModalOpen.value = false;
            createModalOpen.value = false;
            editModalOpen.value = false;
        };

        const openCreateModal = () => {
            createModalOpen.value = true;
        };

        const columns = ref([
            { field: 'orderId', title: 'Order ID', sortable: true },
            { field: 'customerId', title: 'Customer ID', sortable: true },
            { field: 'orderDate', title: 'Order Date', sortable: true },
            { field: 'shippedDate', title: 'Shipped Date', sortable: true },
            { field: 'freight', title: 'Freight', sortable: true }
        ]);

        //分頁pageSize應該是可以調整的 
        const options = ref({
            search: false,
            showColumns: false,
            pagination: true,
            pageSize: 10,
            pageList: [10, 25, 50, 100],
            sortOrder: 'desc'
        });

        const fetchOrders = (pageNumber, pageSize) => {
            console.log("傳入:", pageNumber, pageSize);
            axios.get('api/crud/GetOrders')
                .then(response => response.data)
                .then(getData => {
                    console.log(getData);
                    orderList.splice(0, orderList.length, ...getData);
                    $('#OrderTable').bootstrapTable('load', orderList);
                })
                .catch(error => {
                    console.error("There was an error fetching the data!", error);
                });
        };


        const initTable = () => {
            console.log(options);
            $("#OrderTable").bootstrapTable({
                columns: columns.value,
                pagination: options.value.pagination,
                search: options.value.search,
                showColumns: options.value.showColumns,
                sortOrder: options.value.sortOrder,
                data: orderList
            });
        };


        
        //分頁
        const paginations = (pageNumber, sizeValue) => {
            console.log("傳入:", pageNumber, sizeValue)
            let size = pageSize[0];
            console.log(size);
            if (sizeValue === size ) {
                size = size
            } else if (sizeValue === pageSize[1]) {
                size = pageSize[1]
            } else {
                size = pageSize[2]
            }
            axios.get('api/crud/GetOrdersPaged', {
                params: {
                    pageNumber: pageNumber,
                    pageSize: size
                }
            })
                .then(response => response.data)
                .then(getData => {
                    console.log(getData);
                })
                .catch(error => {
                    console.error("There was an error fetching the data!", error);
                });
        };


        const getOrderList = () => {
            axios.get('api/crud/GetOrders')
                .then(response => response.data)
                .then(getData => {
                    orderList.splice(0, orderList.length, ...getData);
                    
                    console.log(getData);
                })
                .catch(error => {
                    console.log('Error fetching data:', error);
                });
        };

        const getOrderId = (OrderID) => {
            axios.get('api/crud/GetOrderId', {
                params: { OrderID: OrderID }
            })
                .then(response => response.data)
                .then(getData => {
                    orderList.splice(0, orderList.length, getData);
                })
                .catch(error => {
                    console.log('Error fetching data:', error);
                });
        };

        const getDetail = (OrderID) => {
            axios.get('api/crud/GetOrderId', {
                params: { OrderID: OrderID }
            })
                .then(response => response.data)
                .then(getData => {
                    orderDetail.value = getData;
                    isModalOpen.value = true;
                })
                .catch(error => {
                    console.log('Error fetching data:', error);
                });
        };

        const createOrder = (customerId, shipCountry, shipCity, shipAddress, orderDate) => {
            console.log(customerId, shipCountry, shipCity, shipAddress, orderDate);
            axios.post('api/crud/CreateOrder', {
                CustomerId: customerId,
                ShipCountry: shipCountry,
                ShipCity: shipCity,
                ShipAddress: shipAddress,
                OrderDate: orderDate
            })
                .then(response => {
                    console.log("Order created successfully:", response.data);
                    createModalOpen.value = false;
                    alert("新增成功");
                    window.location.reload();
                })
                .catch(error => {
                    console.log('Error creating order:', error);
                });
        };



        //開啟編輯功能
        const editOrder = (OrderID) => {
            axios.get('api/crud/GetOrderId', {
                params: { OrderID: OrderID }
            })
                .then(response => response.data)
                .then(getData => {
                    console.log("開啟編輯");
                    orderDetail.value = getData;
                    editModalOpen.value = true;
                })
                .catch(error => {
                    console.log('Error fetching data:', error);
                });
        };

        //保存編輯
        const saveChanges = () => {
            console.log(orderDetail.value.orderId);
            axios.post('api/crud/UpdateOrder', {
                OrderID: orderDetail.value.orderId,
                CustomerID: orderDetail.value.customerId,
                ShipCountry: orderDetail.value.shipCountry,
                ShipCity: orderDetail.value.shipCity,
                ShipAddress: orderDetail.value.shipAddress,
                /*orderDate: orderDetail.orderDate,*/
            })
                .then(response => {
                    alert('更新成功');
                    this.editModalOpen = false;
                    window.location.reload();
                })
                .catch(error => {
                    console.error('保存失败:', error);
                });
        };

        //刪除
        const deleteOrder = (OrderID) => {
            if (confirm('確認刪除?')) {
                axios.get('api/crud/DelectOrder', {
                    params: { OrderID: OrderID }
                })
                    .then(response => response.data)
                    .then(getData => {
                        window.location.reload();
                    })
                    .catch(error => {
                        console.log('Error fetching data:', error);
                    });
            } else {
                console.log('取消');
            }
        }



        onMounted(() => {
            //getOrderList();
            initTable();
            fetchOrders();
        });

        return {
            columns,
            options,
            OrderID,
            orderDate,
            customerId,
            shipCountry,
            shipCity,
            shipAddress,
            orderList,
            orderDetail,
            getOrderId,
            getDetail,
            createOrder,
            editOrder,
            deleteOrder,
            saveChanges,
            paginations,
            isModalOpen,
            createModalOpen,
            openCreateModal,
            editModalOpen,
            closeModal
        };
    }
}).mount('#app');