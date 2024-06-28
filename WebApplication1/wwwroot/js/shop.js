const { createApp, ref, reactive, onMounted } = Vue;

createApp({
    setup(){
        let orderList = reactive([]);
        let temp = reactive([]);
        const OrderID = ref('');

        const getOrderList = () => {
            axios.get('api/crud/GetOrders')
                .then(response => response.data)
                .then(getData => {
                    //console.log("原本:",getData);
                    orderList.splice(0, orderList.length, ...getData);
                    // console.log("test : ",orderList[0].orderId)
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
        
        onMounted(()=>{
            getOrderList();
        });
        
        return {OrderID, orderList, getOrderId};
        
        
    }
}).mount('#app');

git config user.name "klas9802"
git config user.email "klas9806@gmail.com"
