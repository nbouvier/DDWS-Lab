// ========== Calcul ========== //

function calculateBufferFilling(data) {
    let buffer = data.result[data.result.house ? 'house' : 'coal_power_plant'].buffer
    let bufferFilling = parseFloat((buffer.ressource / buffer.capacity * 100).toFixed(2))

    return bufferFilling
}

// ========== Buffer ========== //

async function bufferLoadData() {
    return new Promise((resolve, reject) => {
        let url = $('#houseID').length ? '/api/house/one' : '/api/coal-power-plant/one'
        let assetID = $('#houseID').length ? $('#houseID').html() : $('#coalPowerPlantID').html()

        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'JSON',
            data: { id: assetID },

            success: data => resolve(calculateBufferFilling(data)),

            error: error => reject(error)
        })
    })
}

function bufferPullData(chart) {
    let url = $('#houseID').length ? '/api/house/one' : '/api/coal-power-plant/one'
    let assetID = $('#houseID').length ? $('#houseID').html() : $('#coalPowerPlantID').html()

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'JSON',
        data: {
            id: assetID,
            from: date = Date.now() - 10000
        },

        success: data => updateBufferChartData(chart, data),

        error: error => console.log(error)
    })
}

function updateBufferChartData(chart, data) {
    let bufferFilling = calculateBufferFilling(data)

    chart.update({
        subtitle: { text: `${bufferFilling} %` },
        series: [{
            name: 'Speed',
            data: [{
                color: Highcharts.getOptions().colors[0],
                radius: '100%',
                innerRadius: '70%',
                y: bufferFilling
            }]
        }]
    })
}

// ========== Chart ========== //

async function showBufferChart() {
    let bufferFilling = await bufferLoadData()

    return Highcharts.chart('bufferChart', {
        chart: {
            type: 'solidgauge',
            events: {
                load: function() {
                    setInterval(() => {
                        bufferPullData(this.series[0])
                    }, 10000)
                }
            }
        },
        title: { text: 'Buffer filling' },
        subtitle: {
            floating: true,
            verticalAlign: 'middle',
            text: `${bufferFilling} %`,
            style: {
                fontSize: '2.5em',
                fontWeight: 'bold',
                color: Highcharts.getOptions().colors[0],
                transform: 'translateY(25px)'
            }
        },
        tooltip: { enabled: false },
        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{
                outerRadius: '100%',
                innerRadius: '70%',
                backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
                borderWidth: 0
            }]
        },
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },
        plotOptions: {
            solidgauge: {
                dataLabels: { enabled: false },
                linecap: 'round',
                stickyTracking: false,
                rounded: true
            }
        },
        series: [{
            name: 'Speed',
            data: [{
                color: Highcharts.getOptions().colors[0],
                radius: '100%',
                innerRadius: '70%',
                y: bufferFilling
            }]
        }]
    })
}
