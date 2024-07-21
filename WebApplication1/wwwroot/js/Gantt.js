const GanttManage = Vue.createApp({
    data() {
        return {
            CustomerData: [],
            GanttData: [],
            RequestData: [],
            CustomerId: '',
            MySelection: {
                StartDateTime: moment('1996-01-01').format().slice(0, 19),
                EndDateTime: moment('1999-12-31').format().slice(0, 19),
            }
        };
    },
    components: {
        mygantt
    },
    methods: {
        // 建置時間範圍資料
        BulidDateTimeRange() {
            let startTime = moment('1996-01-01');
            let endTime = moment('1999-12-31');

            $('#TimePicker').daterangepicker({
                timePicker: true,
                timePicker24Hour: true,
                timePickerIncrement: 60,
                minDate: startTime,
                maxDate: endTime,
                autoApply: true,
                startDate: startTime,
                endDate: endTime,
                locale: {
                    format: 'M/DD hh:mm A'
                },
                applyButtonClasses: "btn-success",
                cancelClass: "btn-danger"
            }, (start, end, label) => {
                $("#TimePickerStartTime").val(start.format().slice(0, 19));
                $("#TimePickerEndTime").val(end.format().slice(0, 19));
                this.MySelection.StartDateTime = start.format().slice(0, 19);
                this.MySelection.EndDateTime = end.format().slice(0, 19);
                this.FetchCustomerId();
                this.FetchCurrentTimeAndCustomerId();
            });
        },
        FetchCustomerId() {
            if (this.MySelection.StartDateTime && this.MySelection.EndDateTime) {
                axios.get('api/Gantt/GetTimeRangeCustomer', {
                    params: {
                        OrderDate: this.MySelection.StartDateTime,
                        RequiredDate: this.MySelection.EndDateTime,
                    }
                })
                    .then(response => {
                        console.log("init GetTimeRangeCustomer", response.data);
                        this.CustomerData = response.data;
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            } else {
                //alert('請選時間範圍');
            }
        },
        FetchCurrentTimeAndCustomerId(customer) {
            console.log("1",this.MySelection.StartDateTime);
            console.log("2",this.MySelection.EndDateTime);
            console.log("3", customer)

            this.CustomerId = customer;
            $("canvas").attr("id", `MyGantt${customer}`);

            this.RequestData = [{
                StartDateTime: this.MySelection.StartDateTime,
                EndDateTime: this.MySelection.EndDateTime,
                Customer: customer
            }];

            // 輸出 RequestData 確認
            console.log("RequestData",this.RequestData); 
        },
        Search() {
            if (this.RequestData.length > 0) {
                console.log(this.RequestData[0].Customer);
                const { StartDateTime: OrderDate, EndDateTime: RequiredDate, Customer: CustomerID } = this.RequestData[0];

                axios.get('api/Gantt/GetGanttData', {
                    params: {
                        OrderDate,
                        RequiredDate,
                        CustomerID
                    }
                })
                    .then(response => {
                        this.GanttData = response.data;
                        this.FormatData(this.GanttData);
                        this.PushGanttChart(this.GanttData, this.RequestData[0].StartDateTime, this.RequestData[0].EndDateTime);
                        console.log("Formatted GanttData", this.GanttData);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            } else {
                console.warn('RequestData is empty.');
            }

           
        },
        FormatData(StatesData) {
            this.GanttData = [];
            StatesData.forEach(d => {
                this.GanttData.push({
                    x: [d.OrderDate, d.RequiredDate],
                    y: d.CustomerID,
                    backgroundColor: d.StateColor,
                    borderColor: d.StateColor,
                    borderWidth: 2.5,
                    borderSkipped: false,
                    borderRadius: 5,
                    barPercentage: 0.8,
                    label: d.OrderStatusID
                })
            })
        },
        PushGanttChart(StatesData, Time1, Time2) {
            let ganttchart = this.$refs.ganttChart;
            if (ganttchart) {
                ganttchart.UpdateChart(StatesData, Time1, Time2);
            } else {
                console.warn('Gantt chart reference not found.');
            }
        }
    },
    beforeUnmount() {
    },
    mounted() {
        this.BulidDateTimeRange();
    }
}).mount('#app');


