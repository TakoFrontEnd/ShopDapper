const GanttManage = Vue.createApp({
    data() {
        return {
            myChart: null,
            chartInstance: null,
            paused: false,
            startTime: '',
            endTime: '',
            customers: ['ERNSH', 'SUPRD', 'WELLI', 'OTTIK', 'LEHMS'],
            selectedCustomer: 'ERNSH',
            allData: [],
            intervalId: null
        };
    },
    methods: {
        applyTimeRange() {
            if (this.startTime && this.endTime) {
                console.log('Start Time:', this.startTime);
                console.log('End Time:', this.endTime);
                chartInstance.options.scales.x.min = start;
                chartInstance.options.scales.x.max = end;
                this.fetchGanttData();
            } else {
                alert('請選時間範圍');
            }
        },
        toggleUpdate() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
                console.log('更新已暫停');
            } else {
                this.intervalId = setInterval(this.fetchGanttData, 1000);
                console.log('開始自動更新數據');
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

            const zoomOptions = {
                pan: {
                    enabled: true,
                    modifierKey: 'ctrl',
                },
                zoom: {
                    wheel: {
                        enabled: true,
                        speed: 0.1,
                    },
                    pinch: {
                        enabled: true,
                        mode: 'x'
                    },
                    mode: 'x',
                    drag: {
                        enabled: true,
                        modifierKey: 'shift',
                        borderColor: 'rgba(54, 162, 235, 0.5)',
                        borderWidth: 1,
                        backgroundColor: 'rgba(54, 162, 235, 0.3)',
                        animationDuration: 1000
                    },
                    onZoomComplete: ({ chart }) => {
                        const min = chart.scales.x.min;
                        const max = chart.scales.x.max;
                        const range = max - min;

                        if (range <= 1000 * 60) {
                            chart.options.scales.x.time.unit = 'second';
                        } else if (range <= 1000 * 60 * 60) {
                            chart.options.scales.x.time.unit = 'minute';
                        } else if (range <= 1000 * 60 * 60 * 24) {
                            chart.options.scales.x.time.unit = 'hour';
                        } else {
                            chart.options.scales.x.time.unit = 'day';
                        }

                        console.log(`Zoom completed. New range: ${min} to ${max}`);
                        chart.update();
                    }
                }
            };

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
                            min: this.startTime,
                            max: this.endTime,
                            time: {
                                unit: 'day',
                                displayFormats: {
                                    day: 'MMM d, yyyy',
                                    month: 'MMM yyyy',
                                    year: 'yyyy',
                                    hour: 'HH:mm:ss',
                                    minute: 'HH:mm:ss',
                                    second: 'HH:mm:ss'
                                }
                            },
                            ticks: {
                                align: 'start'
                            }
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            labels: [...new Set(datasets.flatMap(dataset => dataset.data.map(d => d.y)))]
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                            position: 'top'
                        },
                        zoom: zoomOptions,
                        annotation: {
                            annotations: {
                                line1: {
                                    type: 'line',
                                    xMin: '1997-01-01',
                                    xMax: '1997-01-01',
                                    borderColor: 'rgb(255, 99, 132)',
                                    borderWidth: 3,
                                    borderDash: [6, 6],
                                    label: {
                                        display: true,
                                        content: '▲',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        font: {
                                            size: 45,
                                            weight: 'bold'
                                        },
                                        color: 'red',
                                        position: 'start',
                                        yAdjust: 30,
                                        z: 10
                                    },
                                },
                                line2: {
                                    type: 'line',
                                    xMin: '1997-01-01',
                                    xMax: '1997-01-01',
                                    borderColor: 'rgb(255, 99, 132)',
                                    borderWidth: 3,
                                    borderDash: [6, 6],
                                    label: {
                                        display: true,
                                        content: '▼',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        font: {
                                            size: 45,
                                            weight: 'bold'
                                        },
                                        color: 'red',
                                        position: 'end',
                                        yAdjust: -30,
                                        z: 10
                                    },
                                }
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
                        this.allData = response.data;
                        this.filterCustomerData();
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                    });
            } else {
                //alert('請選時間範圍');
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
    beforeUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    },
    mounted() {
        this.updateChart([]);
        this.intervalId = setInterval(this.fetchGanttData, 1000);
    }
}).mount('#app');
