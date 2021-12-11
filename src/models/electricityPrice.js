import db from '../database/database.js'

const REFRESH_FREQUENCY = 10

// Prices are in € / kWh
const REGULATORY_FACTOR = 35
const SPREAD_FACTOR = 165
const GROWTH_FACTOR = 4
const SAFE_PRICE = 0

async function calculateElectricityPrice() {
    let production = (await db.query('SELECT SUM(production) AS production FROM coal_production cp JOIN (SELECT coal_power_plant_id, MAX(timestamp) AS timestamp FROM coal_production GROUP BY coal_power_plant_id) t ON cp.coal_power_plant_id = t.coal_power_plant_id AND cp.timestamp = t.timestamp;'))[0].production
    let consumption = (await db.query('SELECT SUM(consumption) AS consumption FROM house_consumption hc JOIN (SELECT house_id, MAX(timestamp) AS timestamp FROM house_consumption GROUP BY house_id) t ON hc.house_id = t.house_id AND hc.timestamp = t.timestamp;'))[0].consumption

    if(production !== null && consumption !== null) {
        let price = SAFE_PRICE

        if(production > 0) {
            price = (Math.exp(GROWTH_FACTOR * consumption / production / SPREAD_FACTOR) - 1) / REGULATORY_FACTOR
        }

        db.query('INSERT INTO modeled_electricity_price (price) VALUES (?);', [ price ])
    }
}

export default async function generateData() {
    while(new Date().getSeconds() % REFRESH_FREQUENCY) {}

    setInterval(() => {
        calculateElectricityPrice()
    }, REFRESH_FREQUENCY * 1000)
}
