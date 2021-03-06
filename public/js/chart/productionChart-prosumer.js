// ========== Production ========== //

async function productionLoadData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/house/production',
            type: 'POST',
            dataType: 'JSON',
            data: { id: $('#houseID').html() },

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
            id: $('#houseID').html(),
            from: Date.now() - 10000
        },

        success: data => {
            if (serie.data.length >= 8640) {
                serie.data[0].remove()
            }
            serie.addPoint(data.result.production[0])
        },

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
            data: { id: $('#houseID').html() },

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
            id: $('#houseID').html(),
            from: Date.now() - 10000
        },

        success: data => {
            if (serie.data.length >= 8640) {
                serie.data[0].remove()
            }
            serie.addPoint(data.result.consumption[0])
        },

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
                        consumptionPullData(this.series[1])
                    }, 10000)
                }
            },
            zoomType: 'x'
        },
        title: { style: { display: 'none' } },
        xAxis: { type: 'datetime' },
        yAxis: { title: { text: 'Production (W)' } },
        legend: {
            align: 'left',
            verticalAlign: 'top',
            borderWidth: 0
        },
        exporting: { enabled: false },
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
            data: await productionLoadData()
        }, {
            name: 'Consumption (W)',
            data: await consumptionLoadData()
        }]
    })
}
