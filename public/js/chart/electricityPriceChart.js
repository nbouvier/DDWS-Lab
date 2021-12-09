// ========== Modeled electricity price ========== //

async function modeledElectricityPriceLoadData() {
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

function modeledElectricityPricePullData(serie) {
    $.ajax({
        url: '/api/market/modeled-price',
        type: 'POST',
        dataType: 'JSON',
        data: { from: date = Date.now() - 10000 },

        success: data => serie.addPoint(data.result.modeled_price[0]),

        error: error => console.log(error)
    })
}

// ========== Electricity price ========== //

async function electricityPriceLoadData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/market/price',
            type: 'POST',
            dataType: 'JSON',

            success: data => {
                prices = []
                for(i=0; i<data.result.price.length; i++) {
                    if(i) { prices.push([ data.result.price[i][0], data.result.price[i-1][1] ]) }
                    prices.push(data.result.price[i])
                }

                prices.push([ Date.now(), data.result.price.slice(-1)[0][1] ])

                resolve(prices)
            },

            error: error => reject(error)
        })
    })
}

function electricityPricePullData(serie) {
    $.ajax({
        url: '/api/market/price',
        type: 'POST',
        dataType: 'JSON',
        data: { from: date = Date.now() - 10000 },

        success: data => {
            price = data.result.price[0]

            if(price) {
                serie.addPoint(price)
                serie.addPoint(price)
            } else { serie.data.slice(-1)[0].x = Date.now() }
        },

        error: error => console.log(error)
    })
}

// ========== Chart ========== //

async function showElectricityPriceChart() {
    let series = [{
        name: 'Price (€/kW)',
        data: await electricityPriceLoadData()
    }]

    if(!$('#houseID').length) {
        series.push({
            name: 'Modeled price (€/kW)',
            data: await modeledElectricityPriceLoadData()
        })
    }

    return Highcharts.chart('electricityPriceChart', {
        chart: {
            events: {
                load: function() {
                    setInterval(() => {
                        electricityPricePullData(this.series[0])
                        if(!$('#houseID').length) {
                            modeledElectricityPricePullData(this.series[1])
                        }
                    }, 10000)
                }
            },
            zoomType: 'x'
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
        series: series
    })
}
