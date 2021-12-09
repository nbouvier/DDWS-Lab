// ========== Page ready ========== //

$(document).ready(function() {

    showProductionChart()
    showElectricityPriceChart()
    showBufferChart()

    if($('#houseID').length) { showWindChart() }

})
