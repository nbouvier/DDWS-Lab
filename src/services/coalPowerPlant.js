import db from '../database/database.js'

import CoalPowerPlant from '../class/coalPowerPlant.js'

// Get a coal power plant production given its ID and a from value.
export async function production(coalPowerPlantID, from = null) {
    let coalPowerPlant = await db.loadOne(CoalPowerPlant, coalPowerPlantID)

    if(!coalPowerPlant) { return [false, 'CoalPowerPlant does not exists.'] }

    from = new Date(from).toISOString().slice(0, 19).replace('T', ' ')

    return [await coalPowerPlant.production(from), null]
}

const coalPowerPlant = { production }

export default coalPowerPlant
