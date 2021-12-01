// ========== Production ========== //

async function productionLoadData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/house/production',
            type: 'POST',
            dataType: 'JSON',
            data: { id: $('#excessiveProductionHouseID').val() },

            success: data => resolve(data.result.production),

            error: error => reject(error)
        })
    })
}

function productionPullData(serie) {
    $.ajax({
        url: '/api/house/production',
        type: 'POST',
        dataType: 'JSON',
        data: {
            id: $('#excessiveProductionHouseID').val(),
            from: Date.now() - 10000
        },

        success: data => serie.addPoint(data.result.production[0], true, true),

        error: error => console.log(error)
    })
}

// ========== Consumption ========== //

async function consumptionLoadData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/house/consumption',
            type: 'POST',
            dataType: 'JSON',
            data: { id: $('#excessiveProductionHouseID').val() },

            success: data => resolve(data.result.consumption),

            error: error => reject(error)
        })
    })
}

function consumptionPullData(serie) {
    $.ajax({
        url: '/api/house/consumption',
        type: 'POST',
        dataType: 'JSON',
        data: {
            id: $('#excessiveProductionHouseID').val(),
            from: Date.now() - 10000
        },

        success: data => serie.addPoint(data.result.consumption[0], true, true),

        error: error => console.log(error)
    })
}

// ========== Chart ========== //

async function showProductionChart() {
    Highcharts.stockChart('productionChart', {
        chart: {
            events: {
                load: function() {
                    setInterval(() => {
                        productionPullData(this.series[0])
                        consumptionPullData(this.series[1])
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
        }, {
            name: 'Consumption (W)',
            data: await consumptionLoadData(),
            turboThreshold: 0
        }]
    })
}
