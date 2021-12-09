// ========== Page loading ========== //

function loadMarketPage() {
    $.ajax({
        url: '/api/house/one',
        type: 'POST',
        dataType: 'JSON',
        data: { id: $('#houseID').html() },

        success: data => {
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
        amount: $('#sellAmout').val()
    }
}

// ========== Buy form ========== //

function buyFormData() {
    return {
        amount: $('#buyAmout').val()
    }
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
