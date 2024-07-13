const GanttManage = Vue.createApp({
    data() {
        return {
            myChart: null,
            chartInstance: null,
            paused: false,
            startTime: '',
            endTime: ''
        };
    },
    methods: {
        applyTimeRange() {
            if (this.startTime && this.endTime) {
                // You can handle the logic of the time range application here
                console.log('Start Time:', this.startTime);
                console.log('End Time:', this.endTime);
                this.fetchGanttData();

            } else {
                alert('請選時間範圍');
            }
        },

        updateChart(datasets) {
            const ctx = this.$refs.myChart.getContext('2d');
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
                                unit: 'day', // 這裡調整為 'day' 以適應較大的時間範圍
                                displayFormats: {
                                    millisecond: 'HH:mm:ss.SSS',
                                    second: 'HH:mm:ss',
                                    minute: 'HH:mm',
                                    hour: 'HH:mm',
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
                            stacked: false,
                            beginAtZero: true,
                            labels: datasets.map(d => d.label)
                        }
                    },
                    plugins: {
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



        //取後端
        fetchGanttData() {
            if (this.startTime && this.endTime) {
                axios.get('api/Gantt/GetGanttDate', {
                    params: {
                        OrderDate: this.startTime,
                        RequiredDate: this.endTime
                    }
                })
                .then(response => {
                    console.log(response.data);
                    this.GetChartDataSet(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
            } else {
                alert('請選時間範圍');
            }
        },
        //處理數據
        GetChartDataSet(StatesDatas) {
            let data = [];
            StatesDatas.forEach(d => {
                if (!data[d.OrderStatusID]) {
                    data[d.OrderStatusID] = [];
                }
                data[d.OrderStatusID].push({
                    x: [d.OrderDate, d.RequiredDate],
                    y: d.OrderID,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                });
            });

            let datasets = [];
            Object.keys(data).forEach(key => {
                datasets.push({
                    label: `Order ID ${key}`,
                    data: data[key],
                    borderColor: data[key][0].borderColor,
                    backgroundColor: data[key][0].backgroundColor,
                    borderWidth: 2,
                    barPercentage: 0.8
                });
            });

            console.log(datasets);
            this.updateChart(datasets);
            return datasets
        },

    },
    mounted() {
        this.updateChart([]);
    }
}).mount('#app');