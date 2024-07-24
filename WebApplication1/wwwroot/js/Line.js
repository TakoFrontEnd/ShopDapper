const GanttManage = Vue.createApp({
    data() {
        return {
            CustomerData: [],
            RequestData: [],
            CustomerId: '',
            LineData: [],
            LineChart: [],
            MySelection: {
                StartDateTime: moment('1996-01-01').format().slice(0, 19),
                EndDateTime: moment('1999-12-31').format().slice(0, 19),
            }
        };
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
            }
        },
        FetchCurrentTimeAndCustomerId(customer) {
            console.log("1", this.MySelection.StartDateTime);
            console.log("2", this.MySelection.EndDateTime);
            console.log("3", customer)

            this.CustomerId = customer;
            $("canvas").attr("id", `Line${customer}`);

            this.RequestData = [{
                StartDateTime: this.MySelection.StartDateTime,
                EndDateTime: this.MySelection.EndDateTime,
                Customer: customer
            }];

            // 輸出 RequestData 確認
            console.log("RequestData", this.RequestData);
        },
        Search() {
            if (this.RequestData.length > 0) {
                console.log(this.RequestData[0].Customer);
                const { StartDateTime: OrderDate, EndDateTime: RequiredDate, Customer: CustomerID } = this.RequestData[0];

                axios.get('api/Line/GetShippedFreight', {
                    params: {
                        OrderDate,
                        RequiredDate,
                        CustomerID
                    }
                })
                    .then(response => {
                        this.LineData = response.data;
                        this.PushLineChart(this.LineData, this.RequestData[0].StartDateTime, this.RequestData[0].EndDateTime);
                        console.log("LineData", this.LineData);
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            } else {
                console.warn('RequestData is empty.');
            }
        },
        PushLineChart(StatesData, Time1, Time2) {
            let linechart = this.$refs.lineChart;
            if (linechart) {
                this.UpdateChart(StatesData, Time1, Time2);
            } else {
                console.warn('Chart reference not found.');
            }
        },
        UpdateChart(StatesDatas, Time1, Time2) {
            console.log('StatesDatas', StatesDatas);
            const canvas = this.$refs.lineChart;
            if (!canvas) {
                console.error('Canvas element not found');
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Unable to get context for ganttChart');
                return;
            }

            // 銷毀之前的圖表實例，以防止重複繪製
            if (this.chartInstance) {
                this.chartInstance.destroy();
            }

            const data = {
                datasets: [{
                    label: 'Freight over Time',
                    data: StatesDatas.map(item => ({
                        x: new Date(item.ShippedDate).getTime(),
                        y: item.Freight
                    })),
                    borderColor: 'blue',
                    fill: false,
                    pointRadius: 10,          
                    pointHoverRadius: 12
                }]
            };

            console.log('data', data);

            

            const options = {
                legend: {
                    display: false
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {},
                tooltips: {
                    callbacks: {
                        
                    }
                }
            };

            if (StatesDatas.length > 1) {
                const sortedData = StatesDatas.sort((a, b) => a.Freight - b.Freight);
                const secondSmallest = sortedData[1];
                const secondLargest = sortedData[sortedData.length - 2];

                console.log('Second Smallest Freight:', secondSmallest.Freight);
                console.log('Second Largest Freight:', secondLargest.Freight);

                options.plugins.annotation = {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: secondSmallest.Freight,
                            yMax: secondSmallest.Freight,
                            borderColor: 'green',
                            borderWidth: 2,
                        },
                        line2: {
                            type: 'line',
                            yMin: secondLargest.Freight,
                            yMax: secondLargest.Freight,
                            borderColor: 'red',
                            borderWidth: 2,
                        },
                        label1: {
                            type: 'label',
                            textAlign: 'center',
                            yValue: secondSmallest.Freight,
                            backgroundColor: 'rgba(245,245,245)',
                            content: ['Min'],
                            font: {
                                size: 18
                            }
                        },
                        label2: {
                            type: 'label',
                            textAlign: 'center',
                            yValue: secondLargest.Freight,
                            backgroundColor: 'rgba(245,245,245)',
                            content: ['Max'],
                            font: {
                                size: 18
                            }
                        },
                    }
                };
            }

            this.chartInstance = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options,
            });

            console.log("chartInstance", this.chartInstance);
        }
    },
    beforeUnmount() {
    },
    mounted() {
        this.BulidDateTimeRange();
    }
}).mount('#app');


