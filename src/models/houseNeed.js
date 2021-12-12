import db from '../database/database.js'

const REFRESH_FREQUENCY = 10

async function calculateHouseNeed() {
    let coalProduction = (await db.query('SELECT SUM(remaining_production) AS production FROM coal_production cp JOIN (SELECT coal_power_plant_id, MAX(timestamp) AS timestamp FROM coal_production GROUP BY coal_power_plant_id) t ON cp.coal_power_plant_id = t.coal_power_plant_id AND cp.timestamp = t.timestamp;'))[0].production || 0
    let housesProduction = (await db.query('SELECT SUM(need) AS production FROM house_need hn JOIN (SELECT house_id, MAX(timestamp) AS timestamp FROM house_need GROUP BY house_id) t ON hn.house_id = t.house_id AND hn.timestamp = t.timestamp AND need < 0;'))[0].production || 0
    let totalProduction = coalProduction + housesProduction

    let houses = await db.query('SELECT id FROM house;')
    houses.forEach(async house => {
        let production = await db.query('SELECT remaining_production AS production FROM house_production WHERE house_id = ? ORDER BY timestamp DESC LIMIT 1;', [ house.id ])
        production = production.length ? production[0].production : 0
        let consumption = await db.query('SELECT consumption FROM house_consumption WHERE house_id = ? ORDER BY timestamp DESC LIMIT 1;', [ house.id ])
        consumption = consumption.length ? consumption[0].consumption : 0
        let need = consumption - production
        let blackout = 0

        if(need <= 0) {
            let block = await db.query('SELECT bu.* FROM block_user bu JOIN user u ON bu.user_id = u.id JOIN house h ON u.house_id = h.id WHERE h.id = ? AND NOW() BETWEEN bu.begin AND bu.end;', [ house.id ])
            if(block.length) { need = 0 }
        } else {
            let residualNeed = totalProduction - need < 0 ? need - totalProduction : 0
            totalProduction = totalProduction - need >= 0 ? totalProduction - need : 0

            if(residualNeed > 0) { blackout = parseInt(residualNeed / consumption * 100) }
        }

        db.query('INSERT INTO house_need (house_id, need, blackout) VALUES (?, ?, ?)', [ house.id, need, blackout ])
    })
}

const houseNeed = { calculateHouseNeed }

export default houseNeed
