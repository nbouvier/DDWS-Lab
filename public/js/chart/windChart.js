// ========== Production ========== //

async function windLoadData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/weather/wind',
            type: 'POST',
            dataType: 'JSON',

            success: data => resolve(data.result.wind),

            error: error => reject(error)
        })
    })
}

function windPullData(serie) {
    $.ajax({
        url: `/api/weather/wind`,
        type: 'POST',
        dataType: 'JSON',
        data: { from: date = Date.now() - 10000 },

        success: data => serie.addPoint(data.result.wind[0]),

        error: error => console.log(error)
    })
}

// ========== Chart ========== //

async function showWindChart() {
    return Highcharts.chart('windChart', {
        chart: {
            events: {
                load: function() {
                    setInterval(() => {
                        windPullData(this.series[0])
                    }, 10000)
                }
            },
            zoomType: 'x'
        },
        title: { style: { display: 'none' } },
        xAxis: { type: 'datetime' },
        yAxis: { title: { text: 'Speed (m/s)' } },
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
            name: 'Speed (m/s)',
            data: await windLoadData()
        }]
    })
}
