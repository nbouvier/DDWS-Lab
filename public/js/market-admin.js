// ========== Order flow list ========== //

async function loadOrderFlowListData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/market/orders',
            type: 'POST',
            dataType: 'JSON',

            success: data => resolve(mapOrderFlowListData(data.result.orders)),

            error: error => reject(error)
        })
    })
}

function mapOrderFlowListData(orders) {
    return orders.map(order => ({
        action: order.action,
        amount: order.amount,
        price: order.price,
        total: order.amount * order.price,
        user: order.user,
        date: order.timestamp
    }))
}

// ========== Set electricity price form ========== //

function setPriceFormData() {
    return {
        price: $('#setPricePrice').val()
    }
}

// ========== Page ready ========== //

$(document).ready(async function() {

    chart = await showElectricityPriceChart()

    $('#setPricePrice').val(chart.series[0].data.slice(-1)[0].y)

    $('#orderFlowList').DataTable({
        data: await loadOrderFlowListData(),
        columns: [
            { data: 'action' },
            { data: 'amount' },
            { data: 'price' },
            { data: 'total' },
            { data: 'user' },
            { data: 'date' }
        ],
        order: [ [ 5, 'desc' ] ]
    })

})
