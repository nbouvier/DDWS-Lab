// ========== Production ========== //

async function productionLoadData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/coal-power-plant/production',
            type: 'POST',
            dataType: 'JSON',
            data: { id: $('#coalPowerPlantID').html() },

            success: data => resolve(data.result.production),

            error: error => reject(error)
        })
    })
}

function productionPullData(serie) {
    $.ajax({
        url: '/api/coal-power-plant/production',
        type: 'POST',
        dataType: 'JSON',
        data: {
            id: $('#coalPowerPlantID').html(),
            from: date = Date.now() - 10000
        },

        success: data => serie.addPoint(data.result.production[0], true, true),

        error: error => console.log(error)
    })
}

// ========== Chart ========== //

async function showProductionChart() {
    return Highcharts.chart('productionChart', {
        chart: {
            events: {
                load: function() {
                    setInterval(() => {
                        productionPullData(this.series[0])
                    }, 10000)
                }
            }
        },
        title: { text: 'Energy production over time' },
        xAxis: { type: 'datetime' },
        yAxis: { title: { text: 'Production (W)' } },
        legend: { enabled: false },
        plotOptions: {
            area: {
                marker: { radius: 2 },
                lineWidth: 1,
                states: { hover: { lineWidth: 1 } },
                threshold: null
            }
        },
        series: [{
            name: 'Production (W)',
            data: await productionLoadData(),
            turboThreshold: 0
        }]
    })
}
