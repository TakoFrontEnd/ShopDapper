const GanttCharts = [];

const mygantt = {
    props: ['orderid', 'startrangetime', 'endrangetime', 'statesdatas'],
    template: `<canvas :id="'MyGantt'+orderid"></canvas>`,
    data() {
        return {
        };
    },
    methods: {
    },
    mounted() {
    }
};