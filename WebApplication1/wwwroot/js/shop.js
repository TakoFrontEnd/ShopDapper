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
        const orderDetail = ref({});
        
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
            axios.get('api/crud/GetOrders')
                .then(response => response.data)
                .then(getData => {
                    orderList.splice(0, orderList.length, ...getData);
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
            isModalOpen,
            createModalOpen,
            openCreateModal,
            editModalOpen,
            closeModal
        };
    }
}).mount('#app');
