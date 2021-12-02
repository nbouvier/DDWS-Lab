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

async function productionPullData(serie) {
    setInterval(() => {
        $.ajax({
            url: `/api/coal-power-plant/production`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                id: $('#coalPowerPlantID').html(),
                from: date = Date.now() - 10000
            },

            id: $('#coalPowerPlantID').html(),
            success: data => serie.addPoint(data.result.production[0], true, true),

            error: error => console.log(error)
        })
    }, 10000)
}

// ========== Chart ========== //

async function showProductionChart() {
    Highcharts.chart('productionChart', {
        chart: { events: { load: function() { productionPullData(this.series[0]) } } },
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
