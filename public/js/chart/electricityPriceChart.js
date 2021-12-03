// ========== Production ========== //

async function electricityPriceLoadData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/market/modeled-price',
            type: 'POST',
            dataType: 'JSON',

            success: data => resolve(data.result.modeled_price),

            error: error => reject(error)
        })
    })
}

function electricityPricePullData(serie) {
    $.ajax({
        url: '/api/market/modeled-price',
        type: 'POST',
        dataType: 'JSON',
        data: { from: date = Date.now() - 10000 },

        success: data => serie.addPoint(data.result.modeled_price[0], true, true),

        error: error => console.log(error)
    })
}

// ========== Chart ========== //

async function showElectricityPriceChart() {
    Highcharts.chart('electricityPriceChart', {
        chart: {
            events: {
                load: function() {
                    setInterval(() => {
                        electricityPricePullData(this.series[0])
                    }, 10000)
                }
            }
        },
        title: { text: 'Electricity price over time' },
        xAxis: { type: 'datetime' },
        yAxis: { title: { text: 'Price (€/kW)' } },
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
            name: 'Price (€/kW)',
            data: await electricityPriceLoadData(),
            turboThreshold: 0
        }]
    })
}
