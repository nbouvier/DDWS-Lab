import db from '../database/database.js'

const REFRESH_FREQUENCY = 10

async function calculateHouseNeed() {
    let houses = await db.query('SELECT id FROM house;')
    houses.forEach(async house => {
        let production = await db.query('SELECT remaining_production AS production FROM house_production WHERE house_id = ? ORDER BY timestamp DESC LIMIT 1;', [ house.id ])
        production = production.length ? production[0].production : 0
        let consumption = await db.query('SELECT consumption FROM house_consumption WHERE house_id = ? ORDER BY timestamp DESC LIMIT 1;', [ house.id ])
        consumption = consumption.length ? consumption[0].consumption : 0
        let need = consumption - production

        db.query('INSERT INTO house_need (house_id, need) VALUES (?, ?)', [ house.id, need ])
    })
}

const houseNeed = { calculateHouseNeed }

export default houseNeed
