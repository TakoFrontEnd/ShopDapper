const mygantt = {
    props: ['CustomerId', 'startrangetime', 'endrangetime'],
    template: `<canvas ref="ganttChart"></canvas>`,
    data() {
        return {
            chartInstance: null,
        };
    },
    methods: {
        UpdateChart(StatesDatas) {
            this.BulidGanttChart(StatesDatas);
        },
        BulidGanttChart(StatesDatas) {
            console.log('StatesDatas', StatesDatas);
            if (!StatesDatas || !StatesDatas.length) {
                console.error('Invalid datasets:', StatesDatas);
                return;
            }

            const canvas = this.$refs.ganttChart;
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

            // 設置甘特圖的數據和配置
            const data = {
                datasets: StatesDatas
            };

            

            const options = {
                borderRadius: 5,
                borderSkipped: false,
                borderWidth: 2,
                animation: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        position: 'bottom',
                        type: 'time',
                        min: new Date(this.startrangetime).getTime(),
                        max: new Date(this.endrangetime).getTime(),
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
                    }
                },
            };

            // 創建圖表實例
            this.chartInstance = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: options,
            });

            console.log("chartInstance", this.chartInstance);
        },
    },
};
