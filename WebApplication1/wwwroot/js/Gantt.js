const GanttManage = Vue.createApp({
    data() {
        return {
            myChart: null,
            chartInstance: null,
            paused: false,
            startTime: '',
            endTime: '',
            customers: ['ERNSH', 'SUPRD', 'WELLI', 'OTTIK', 'FOLKO'],
            selectedCustomer: 'ERNSH', // 初始選中的客戶
            allData: [] // 存儲所有客戶數據
        };
    },
    methods: {
        applyTimeRange() {
            if (this.startTime && this.endTime) {
                console.log('Start Time:', this.startTime);
                console.log('End Time:', this.endTime);
                this.fetchGanttData();
            } else {
                alert('請選時間範圍');
            }
        },
        updateChart(datasets) {
            if (!datasets || !datasets.length) {
                console.error('Invalid datasets:', datasets);
                return;
            }

            const canvas = this.$refs.myChart;
            if (!canvas) {
                console.error('Canvas element not found');
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Unable to get context for myChart');
                return;
            }

            if (this.chartInstance != null) {
                this.chartInstance.destroy();
            }

            this.chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    datasets: datasets
                },
                options: {
                    borderRadius: 5,
                    borderSkipped: false,
                    borderWidth: 2,
                    animation: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            position: 'bottom',
                            type: 'time',
                            time: {
                                unit: 'day',
                                displayFormats: {
                                    day: 'MMM d',
                                    month: 'MMM yyyy',
                                    year: 'yyyy'
                                }
                            },
                            ticks: {
                                align: 'start'
                            }
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            labels: [...new Set(datasets.flatMap(dataset => dataset.data.map(d => d.y)))] // 顯示所有客戶ID
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                            position: 'top'
                        },
                        zoom: {
                            pan: {
                                enabled: true,
                                mode: 'x'
                            },
                            zoom: {
                                wheel: {
                                    enabled: true,
                                },
                                pinch: {
                                    enabled: true
                                },
                                mode: 'x'
                            }
                        }
                    }
                }
            });
        },
        fetchGanttData() {
            if (this.startTime && this.endTime) {
                axios.get('api/Gantt/GetGanttDate', {
                    params: {
                        OrderDate: this.startTime,
                        RequiredDate: this.endTime,
                        CustomerID: this.selectedCustomer
                    }
                })
                    .then(response => {
                        console.log(response.data);
                        this.allData = response.data; // 存儲所有客戶數據
                        this.filterCustomerData();
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            } else {
                alert('請選時間範圍');
            }
        },
        filterCustomerData() {
            const filteredData = this.allData.filter(d => d.CustomerID === this.selectedCustomer);
            this.GetChartDataSet(filteredData);
        },
        GetChartDataSet(StatesDatas) {
            const statusColorMap = {
                0: { backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgba(75, 192, 192, 1)' },
                1: { backgroundColor: 'rgba(192, 75, 192, 0.2)', borderColor: 'rgba(192, 75, 192, 1)' },
                2: { backgroundColor: 'rgba(192, 192, 75, 0.2)', borderColor: 'rgba(192, 192, 75, 1)' },
                default: { backgroundColor: 'rgba(75, 192, 192, 0.2)', borderColor: 'rgba(75, 192, 192, 1)' }
            };

            const statusLabelMap = {
                0: '揀貨中',
                1: '已完成',
                2: '運送中',
                default: '未知狀態'
            };

            let customerData = {};

            StatesDatas.forEach(d => {
                if (!customerData[d.CustomerID]) {
                    customerData[d.CustomerID] = [];
                }

                const { backgroundColor, borderColor } = statusColorMap[d.OrderStatusID] || statusColorMap.default;
                const label = statusLabelMap[d.OrderStatusID] || statusLabelMap.default;

                customerData[d.CustomerID].push({
                    x: [d.OrderDate, d.RequiredDate],
                    y: d.CustomerID,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 2,
                    label: label
                });
            });

            let datasets = [];
            Object.keys(customerData).forEach(customerID => {
                customerData[customerID].forEach(item => {
                    datasets.push({
                        label: item.label,
                        data: [item],
                        backgroundColor: item.backgroundColor,
                        borderColor: item.borderColor,
                        borderWidth: 2,
                        barPercentage: 0.8
                    });
                });
            });

            console.log(datasets);
            this.updateChart(datasets);
            return datasets;
        },
        selectCustomer(customer) {
            this.selectedCustomer = customer;
            this.fetchGanttData();
        }
    },
    mounted() {
        this.updateChart([]);
    }
}).mount('#app');
