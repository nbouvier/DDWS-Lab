// ========== Page loading ========== //

function loadElectricityManagmentPage() {
    loadCoalPowerPlant(loadCoalPowerPlantSuccess)
}

// ========== Coal Power Plant ========== //

function loadCoalPowerPlant(callback) {
    $.ajax({
        url: '/api/coal-power-plant/one',
        type: 'POST',
        dataType: 'JSON',
        data: { id: $('#coalPowerPlantID').html() },

        success: data => callback(data.result),

        error: error => console.log(error)
    })
}

function loadCoalPowerPlantSuccess(data) {
    let coalPowerPlant = data.coal_power_plant
    let running = coalPowerPlant.running == '1'
    let url = running ? '/api/coal-power-plant/stop' : '/api/coal-power-plant/start'
    let buffer = coalPowerPlant.buffer
    let bufferFilling = (buffer.resource / buffer.capacity * 100).toFixed(2)

    $('#startAndStopForm').attr('action', url)
    $('#startAndStop').html(running ? 'STOP' : 'RUN').addClass(`btn-${running ? 'danger' : 'success'}`)
    $('#production').html((coalPowerPlant.production * 3600 / 1000000).toFixed(3))
    $('#bufferFilling').html(bufferFilling)
    $('#productionBufferPercentage').val(coalPowerPlant.buffer_percentage)
    $('#toBuffer').html(coalPowerPlant.buffer_percentage)
    $('#toMarket').html(100 - coalPowerPlant.buffer_percentage)
}

function refreshCoalPowerPlantSuccess(data) {
    let coalPowerPlant = data.coal_power_plant
    let buffer = coalPowerPlant.buffer
    let bufferFilling = (buffer.resource / buffer.capacity * 100).toFixed(2)

    $('#production').html((coalPowerPlant.production * 3600 / 1000000).toFixed(3))
    $('#bufferFilling').html(bufferFilling)
}

// ========== Start and stop form ========== //

function startAndStopFormData() {
    return {
        id: $('#coalPowerPlantID').html()
    }
}

function startAndStopFormSuccess(data) {
    showSystemMessage(data.message, MessageType.success)

    let url = data.result ? '/api/coal-power-plant/stop' : '/api/coal-power-plant/start'

    $('#startAndStopForm').attr('action', url)
    $('#startAndStop').html(data.result ? 'STOP' : 'RUN').addClass(`btn-${data.result ? 'danger' : 'success'}`)
}

// ========== Production form ========== //

function productionFormData() {
    return {
        id: $('#coalPowerPlantID').html(),
        buffer_percentage: $('#productionBufferPercentage').val()
    }
}

function productionFormSuccess(data) {
    showSystemMessage(data.message, MessageType.success)
    $('#productionBufferPercentage').val(data.result.coal_power_plant.buffer_percentage)
}

// ========== Page ready ========== //

$(document).ready(function() {

    loadElectricityManagmentPage()
    setInterval(() => loadCoalPowerPlant(refreshCoalPowerPlantSuccess), 10000)

    $('#productionBufferPercentage').on('input', function() {
        $('#toBuffer').html($(this).val())
        $('#toMarket').html(100 - $(this).val())
    })

    showProductionChart()

})
