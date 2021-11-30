// ========== Page loading ========== //

function loadElectricityManagmentPage(callback) {
    $.ajax({
        url: '/api/coal-power-plant/one/1',
        type: 'POST',
        dataType: 'JSON',

        success: data => callback(data.result),

        error: error => console.log(error)
    })
}

function loadElectricityManagmentPageSuccess(data) {
    let coalPowerPlant = data.coal_power_plant
    let buffer = coalPowerPlant.buffer
    let bufferFilling = (buffer.ressource / buffer.capacity * 100).toFixed(2)

    $('#startAndStop').attr('active', coalPowerPlant.running)
    $('#production').html(coalPowerPlant.production.toFixed(3))
    $('#bufferFilling').html(bufferFilling)
    $('#productionBufferPercentage').val(coalPowerPlant.buffer_percentage)
    $('#toBuffer').html(coalPowerPlant.buffer_percentage)
    $('#toMarket').html(100 - coalPowerPlant.buffer_percentage)
}

function refreshElectricityManagmentPageSuccess(data) {
    let coalPowerPlant = data.coal_power_plant
    let buffer = coalPowerPlant.buffer
    let bufferFilling = (buffer.ressource / buffer.capacity * 100).toFixed(2)

    $('#production').html(coalPowerPlant.production.toFixed(3))
    $('#bufferFilling').html(bufferFilling)
}

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

function showProductionChart(loadedData, pullDataFunction) {
    Highcharts.stockChart('productionChart', {
        chart: { events: { load: pullDataFunction } },
        title: { text: 'Coal power plant production over time' },
        xAxis: { type: 'datetime' },
        yAxis: { title: { text: 'Production (MW)' } },
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
            name: 'Production (MW)',
            data: loadedData,
            turboThreshold: 10000
        }]
    })
}

// ========== Production form ========== //

function productionFormData() {
    return {
        id: $('#productionCoalPowerPlantID').val(),
        buffer_percentage: $('#productionBufferPercentage').val()
    }
}

function productionFormSuccess(data) {
    showSystemMessage(data.message, MessageType.success)
    $('#productionBufferPercentage').val(data.result.coal_power_plant.buffer_percentage)
}

// ========== Page ready ========== //

$(document).ready(async function() {

    loadElectricityManagmentPage(loadElectricityManagmentPageSuccess)
    setInterval(() => loadElectricityManagmentPage(refreshElectricityManagmentPageSuccess), 10000)

    $('#productionBufferPercentage').on('input', function() {
        $('#toBuffer').html($(this).val())
        $('#toMarket').html(100 - $(this).val())
    })

    showProductionChart(await productionLoadDataFunction(), productionPullDataFunction)

})
