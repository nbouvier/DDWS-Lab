// ========== Page loading ========== //

function loadMarketPage() {
    $.ajax({
        url: '/api/house/one',
        type: 'POST',
        dataType: 'JSON',
        data: { id: $('#houseID').html() },

        success: data => {
            if(data.error) {
                showSystemMessage(data.error, MessageType.danger)
                return
            }
            
            let bufferResources = data.result.house.buffer.resource
            let bufferCapacity = data.result.house.buffer.capacity

            $('#sellMaxAmount').html(bufferResources)
            $('#buyMaxAmount').html(bufferCapacity - bufferResources)
        },

        error: error => console.log(error)
    })
}

// ========== Sell form ========== //

function sellFormData() {
    return {
        house_id: $('#houseID').html(),
        amount: $('#sellAmount').val()
    }
}

function sellFormSuccess(data) {
    showSystemMessage(data.message, MessageType.success)

    newBuyAmount = parseFloat($('#buyMaxAmount').html()) + parseFloat(data.result.amount)
    newSellAmount = parseFloat($('#sellMaxAmount').html()) - parseFloat(data.result.amount)

    $('#buyMaxAmount').html(newBuyAmount)
    $('#sellMaxAmount').html(newSellAmount)
}

// ========== Buy form ========== //

function buyFormData() {
    return {
        house_id: $('#houseID').html(),
        amount: $('#buyAmount').val()
    }
}

function buyFormSuccess(data) {
    showSystemMessage(data.message, MessageType.success)

    newBuyAmount = parseFloat($('#buyMaxAmount').html()) - parseFloat(data.result.amount)
    newSellAmount = parseFloat($('#sellMaxAmount').html()) + parseFloat(data.result.amount)

    $('#buyMaxAmount').html(newBuyAmount)
    $('#sellMaxAmount').html(newSellAmount)
}

// ========== Page ready ========== //

$(document).ready(async function() {

    loadMarketPage()
    setInterval(() => loadMarketPage(), 10000)

    chart = await showElectricityPriceChart()

    $('#sellAmount').on('input', function() {
        price = $(this).val() * chart.series[0].data.slice(-1)[0].y
        $('#sellPrice').val(price)
    })

    $('#buyAmount').on('input', function() {
        price = $(this).val() * chart.series[0].data.slice(-1)[0].y
        $('#buyPrice').val(price)
    })

})
