
export class ChartHelper {

    static optionsHorizontalBar(callback: (label: string, value: number) => string) {
        return {
            tooltips: {
                mode: 'index',
                intersect: false,
                xPadding: 10,
                yPadding: 10,
                caretPadding: 10,
                callbacks: {
                    label: (tooltipItem: any, data: any) => {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const currentValue = dataset.data[tooltipItem.index];
                        return callback(dataset.label, currentValue);
                    }
                }
            },
            responsive: true,
            scales: {
                xAxes: [
                    {
                        stacked: true,
                        gridLines: false,
                        ticks: {
                            fontColor: '#646c9a',
                            fontSize: 13,
                            padding: 20
                        }
                    }
                ],
                yAxes: [
                    {
                        stacked: true,
                        gridLines: false,
                    }
                ]
            },
        };
    }

    static optionsChart(callback: (label: string, value: number) => string) {
        return {
            responsive: true,
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines: false,
                        ticks: {
                            fontColor: '#646c9a',
                            fontSize: 13,
                            padding: 20
                        }
                    }],
                yAxes: [
                    {
                        display: true,
                        gridLines: {
                            color: '#646c9a',
                            drawBorder: false,
                            offsetGridLines: false,
                            drawTicks: false,
                            borderDash: [3, 4],
                            zeroLineWidth: 1,
                            zeroLineColor: '#646c9a',
                            zeroLineBorderDash: [3, 4]
                        },
                        ticks: {
                            beginAtZero: true,
                            suggestedMax: 5,
                        },
                    }
                ]
            },
            tooltips: {
                intersect: true,
                mode: 'nearest',
                xPadding: 10,
                yPadding: 10,
                caretPadding: 10,
                callbacks: {
                    label: (tooltipItem: any, data: any) => {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const currentValue = dataset.data[tooltipItem.index];
                        return callback(dataset, currentValue);
                    }
                }
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            }
        };
    }

}
