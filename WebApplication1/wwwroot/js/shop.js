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

        

        const getOrderList = () => {
            axios.get('api/order/GetAllOrders')
                .then(response => response.data)
                .then(getData => {
                    orderList.splice(0, orderList.length, ...getData);
                })
                .catch(error => {
                    console.log('Error fetching data:', error);
                });
        };

        const getOrderId = (OrderID) => {
            axios.get('api/order/GetOrderId', {
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
            axios.get('api/order/GetOrderId', {
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
            axios.post('api/order/CreateOrder', {
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
            axios.get('api/order/GetOrderId', {
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
            axios.post('api/order/UpdateOrder', {
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
                axios.get('api/order/DelectOrder', {
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
            getOrderList();
        });

        return {
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
