const { createApp, ref, reactive, onMounted } = Vue;

createApp({
    setup(){
        let orderList = reactive([]);
        const orderDetail = ref({});
        const OrderID = ref('');
        const isModalOpen = ref(false);
        
        const closeModal = () => {
            console.log("close : ", isModalOpen.value)
            isModalOpen.value = false;
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
            axios.get('api/crud/GetOrderId',{
                params:{OrderID : OrderID}
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
            axios.get('api/crud/GetOrderId',{
                params:{OrderID : OrderID}
            })
                .then(response => response.data)
                .then(getData => {
                    orderDetail.value = getData;
                    isModalOpen.value = true;
                })
                .catch(error => {
                    console.log('Error fetching data:', error);
                });
        }
        
        
        onMounted(()=>{
            getOrderList();
        });
        
        return {OrderID, 
                orderList,
                orderDetail,
                getOrderId,
                getDetail,
                isModalOpen,
                closeModal};
    }
}).mount('#app');

