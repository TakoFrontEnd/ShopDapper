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
                this.fetchData();
            }
        },
        createChart(datasets) {
            if (this.chartInstance != null) {
                this.chartInstance.destroy();
            }

            const ctx = this.$refs.myChart.getContext('2d');

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
                            parser: 'YYYY-MM-DD',
                            tooltipFormat: 'yyyy-MM-DD HH:mm:ss.SSS',
                            time: {
                                unit: 'minute',
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
        fetchData() {
            if (!this.paused) {
                const params = {
                    OrderDate: this.startTime,
                    RequiredDate: this.endTime
                };
                axios.get('api/Gantt/GetGanttDate', { params })
                    .then(response => {
                        const transformedData = this.GetChartDataSet(response.data);
                        //this.createChart(transformedData);
                        console.log(transformedData);
                    })
                    .catch(error => {
                        console.log('Error fetching data:', error);
                    });
            }
        },
        GetChartDataSet(StatesDatas) {
            let data = [];
            StatesDatas.forEach(d => {
                if (!data[d.DeviceStateId]) {
                    data[d.DeviceStateId] = [];
                }
                data[d.DeviceStateId].push({
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

            return datasets;
        },
        togglePause() {
            this.paused = !this.paused;
        }
    }
}).mount('#app');