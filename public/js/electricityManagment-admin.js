// ========== Page loading ========== //

function loadElectricityManagmentPage(callback) {
    $.ajax({
        url: '/api/coal-power-plant/one',
        type: 'POST',
        dataType: 'JSON',
        data: { id: $('#coalPowerPlantID').html() },

        success: data => callback(data.result),

        error: error => console.log(error)
    })
}

function loadElectricityManagmentPageSuccess(data) {
    let coalPowerPlant = data.coal_power_plant
    let buffer = coalPowerPlant.buffer
    let bufferFilling = (buffer.ressource / buffer.capacity * 100).toFixed(2)

    $('#startAndStop').attr('active', coalPowerPlant.running)
    $('#production').html((coalPowerPlant.production * 3600).toFixed(3))
    $('#bufferFilling').html(bufferFilling)
    $('#productionBufferPercentage').val(coalPowerPlant.buffer_percentage)
    $('#toBuffer').html(coalPowerPlant.buffer_percentage)
    $('#toMarket').html(100 - coalPowerPlant.buffer_percentage)
}

function refreshElectricityManagmentPageSuccess(data) {
    let coalPowerPlant = data.coal_power_plant
    let buffer = coalPowerPlant.buffer
    let bufferFilling = (buffer.ressource / buffer.capacity * 100).toFixed(2)

    $('#production').html((coalPowerPlant.production * 3600).toFixed(3))
    $('#bufferFilling').html(bufferFilling)
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

$(document).ready(function() {

    loadElectricityManagmentPage(loadElectricityManagmentPageSuccess)
    setInterval(() => loadElectricityManagmentPage(refreshElectricityManagmentPageSuccess), 10000)

    $('#productionBufferPercentage').on('input', function() {
        $('#toBuffer').html($(this).val())
        $('#toMarket').html(100 - $(this).val())
    })

    showProductionChart()

})
