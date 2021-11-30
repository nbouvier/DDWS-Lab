// ========== Production chart ========== //

async function productionLoadDataFunction() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/coal-power-plant/production?id=1',
            type: 'POST',
            dataType: 'JSON',

            success: data => resolve(data.result.production),

            error: error => reject(error)
        })
    })
}

async function productionPullDataFunction() {
    setInterval(() => {
        date = Date.now() - 10000

        $.ajax({
            url: `/api/coal-power-plant/production?id=1&from=${date}`,
            type: 'POST',
            dataType: 'JSON',

            success: data => this.series[0].addPoint(data.result.production[0], true, true),

            error: error => console.log(error)
        })
    }, 10000)
}

function showProductionChart(loadDataFunction, pullDataFunction) {
    Highcharts.stockChart('productionChart', {
        chart: { events: { load: pullDataFunction } },
        title: { text: 'Coal power plant production over time' },
        xAxis: { type: 'datetime' },
        yAxis: { title: { text: 'Production (MWh)' } },
        legend: { enabled: false },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: { radius: 2 },
                lineWidth: 1,
                states: { hover: { lineWidth: 1 } },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: 'Production (MWh)',
            data: loadDataFunction
        }]
    })
}

// ========== Page ready ========== //

$(document).ready(async function() {

    $('#productionBufferPercentage').on('input', function() {
        $('#toBuffer').html($(this).val())
        $('#toMarket').html(100 - $(this).val())
    })

    showProductionChart(await productionLoadDataFunction(), productionPullDataFunction)

})
