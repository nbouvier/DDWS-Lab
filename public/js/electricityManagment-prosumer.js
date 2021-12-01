// ========== Page loading ========== //

function loadElectricityManagmentPage(callback) {
    $.ajax({
        url: '/api/house/one',
        type: 'POST',
        dataType: 'JSON',
        data: { id: $('#excessiveProductionHouseID').val() },

        success: data => callback(data.result),

        error: error => console.log(error)
    })
}

function loadElectricityManagmentPageSuccess(data) {
    let house = data.house
    let buffer = house.buffer
    let bufferFilling = (buffer.ressource / buffer.capacity * 100).toFixed(2)

    $('#production').html((house.production * 3600).toFixed(3))
    $('#consumption').html((house.consumption * 3600).toFixed(3))
    $('#totalProduction').html(((house.production - house.consumption) * 3600).toFixed(3))
    $('#bufferFilling').html(bufferFilling)
    $('#excessiveProductionBufferPercentage').val(house.to_buffer_percentage)
    $('#underProductionBufferPercentage').val(house.from_buffer_percentage)
    $('#toBuffer').html(house.to_buffer_percentage)
    $('#toMarket').html(100 - house.to_buffer_percentage)
    $('#fromBuffer').html(house.from_buffer_percentage)
    $('#fromMarket').html(100 - house.from_buffer_percentage)
}

function refreshElectricityManagmentPageSuccess(data) {
    let house = data.coal_power_plant
    let buffer = house.buffer
    let bufferFilling = (buffer.ressource / buffer.capacity * 100).toFixed(2)

    $('#production').html((house.production * 3600).toFixed(3))
    $('#consumption').html((house.consumption * 3600).toFixed(3))
    $('#totalProduction').html(((house.production - house.consumption) * 3600).toFixed(3))
    $('#bufferFilling').html(bufferFilling)
}

// ========== Excessive production form ========== //

function excessiveProductionFormData() {
    return {
        id: $('#excessiveProductionHouseID').val(),
        to_buffer_percentage: $('#excessiveProductionBufferPercentage').val()
    }
}

function excessiveProductionFormSuccess(data) {
    showSystemMessage(data.message, MessageType.success)
    $('#excessiveProductionBufferPercentage').val(data.result.house.to_buffer_percentage)
}

// ========== Under-production form ========== //

function underProductionFormData() {
    return {
        id: $('#underProductionHouseID').val(),
        from_buffer_percentage: $('#underProductionBufferPercentage').val()
    }
}

function underProductionFormSuccess(data) {
    showSystemMessage(data.message, MessageType.success)
    $('#underProductionBufferPercentage').val(data.result.house.from_buffer_percentage)
}

// ========== Page ready ========== //

$(document).ready(async function() {

    loadElectricityManagmentPage(loadElectricityManagmentPageSuccess)
    setInterval(() => loadElectricityManagmentPage(refreshElectricityManagmentPageSuccess), 10000)

    $('#excessiveProductionBufferPercentage').on('input', function() {
        $('#toBuffer').html($(this).val())
        $('#toMarket').html(100 - $(this).val())
    })

    $('#underProductionBufferPercentage').on('input', function() {
        $('#fromBuffer').html($(this).val())
        $('#fromMarket').html(100 - $(this).val())
    })

    showProductionChart()

})
