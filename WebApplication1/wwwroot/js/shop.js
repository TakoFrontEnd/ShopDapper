const { createApp, ref, reactive, onMounted } = Vue;

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
            { field: 'freight', title: 'Freight', sortable: true },
            {
                field: 'actions',
                title: 'Actions',
                formatter: (value, row) => {
                    return `
                        <button class="btn btn-primary btn-sm edit-btn" data-id="${row.orderId}">編輯</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${row.orderId}">刪除</button>
                        <button class="btn btn-info btn-sm detail-btn" data-id="${row.orderId}">詳細</button>
                    `;
                }
            }
        ]);

        const options = ref({
            search: true,
            showColumns: false,
            pagination: true,
            pageSize: 10,
            pageList: [10, 25, 50, 100],
            smartDisplay: false,
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
            $("#OrderTable").bootstrapTable({
                columns: columns.value,
                pagination: options.value.pagination,
                search: options.value.search,
                showColumns: options.value.showColumns,
                sortOrder: options.value.sortOrder,
                data: orderList,
                onPostBody: () => {
                    $('.edit-btn').click(function () {
                        const orderId = $(this).data('id');
                        editOrder(orderId);
                    });
                    $('.delete-btn').click(function () {
                        const orderId = $(this).data('id');
                        deleteOrder(orderId);
                    });
                    $('.detail-btn').click(function () {
                        const orderId = $(this).data('id');
                        getDetail(orderId);
                    });
                }
            });
            console.log("test : ",options.value);
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
            axios.post('api/crud/CreateOrder', {
                CustomerId: customerId,
                ShipCountry: shipCountry,
                ShipCity: shipCity,
                ShipAddress: shipAddress,
                OrderDate: orderDate
            })
                .then(response => {
                    createModalOpen.value = false;
                    alert("新增成功");
                    window.location.reload();
                })
                .catch(error => {
                    console.log('Error creating order:', error);
                });
        };

        const editOrder = (OrderID) => {
            axios.get('api/crud/GetOrderId', {
                params: { OrderID: OrderID }
            })
                .then(response => response.data)
                .then(getData => {
                    orderDetail.value = getData;
                    editModalOpen.value = true;
                })
                .catch(error => {
                    console.log('Error fetching data:', error);
                });
        };

        const saveChanges = () => {
            axios.post('api/crud/UpdateOrder', {
                OrderID: orderDetail.value.orderId,
                CustomerID: orderDetail.value.customerId,
                ShipCountry: orderDetail.value.shipCountry,
                ShipCity: orderDetail.value.shipCity,
                ShipAddress: orderDetail.value.shipAddress
            })
                .then(response => {
                    alert('更新成功');
                    editModalOpen.value = false;
                    window.location.reload();
                })
                .catch(error => {
                    console.error('保存失败:', error);
                });
        };

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
        };

        onMounted(() => {
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
            isModalOpen,
            createModalOpen,
            openCreateModal,
            editModalOpen,
            closeModal
        };
    }
}).mount('#app');
