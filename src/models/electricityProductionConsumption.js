import db from '../database/database.js'

import coalProduction from './coalProduction.js'
import houseProduction from './houseProduction.js'
import houseConsumption from './houseConsumption.js'
import houseNeed from './houseNeed.js'

const REFRESH_FREQUENCY = 10

async function gatherInformations() {
    let coalsProduction = (await db.query('SELECT SUM(remaining_production) AS production FROM coal_production cp JOIN (SELECT coal_power_plant_id, MAX(timestamp) AS timestamp FROM coal_production GROUP BY coal_power_plant_id) t ON cp.coal_power_plant_id = t.coal_power_plant_id AND cp.timestamp = t.timestamp;'))[0].production || 0
    let housesNeeds = await db.query('SELECT need FROM house_need hn JOIN (SELECT house_id, MAX(timestamp) AS timestamp FROM house_need GROUP BY house_id) t ON hn.house_id = t.house_id AND hn.timestamp = t.timestamp;')
    let production = coalsProduction + housesNeeds.map(need => need.need < 0 ? -need.need : 0).reduce((a, b) => a + b, 0)
    let consumption = housesNeeds.map(need => need.need > 0 ? need.need : 0).reduce((a, b) => a + b, 0)

    db.query('INSERT INTO total_production_consumption (production, consumption) VALUES (?, ?);', [ production, consumption ])
}

export default function generateData() {
    while(new Date().getSeconds() % REFRESH_FREQUENCY) {}

    setInterval(async () => {
        coalProduction.setCoalPowerPlantProduction()
        houseProduction.setHouseAverageProduction()
        houseConsumption.setHouseAverageConsumption()
        await houseProduction.setHouseProduction()
        await houseConsumption.setHouseConsumption()
        await houseNeed.calculateHouseNeed()
        gatherInformations()
    }, REFRESH_FREQUENCY * 1000)
}
