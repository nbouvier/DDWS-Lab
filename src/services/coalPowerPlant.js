import db from '../database/database.js'

import CoalPowerPlant from '../class/coalPowerPlant.js'

// Get a CoalPowerPlant given its ID.
export async function get(coalPowerPlantID) {
    let coalPowerPlant = await db.loadOne(CoalPowerPlant, coalPowerPlantID)
    
    if(!coalPowerPlant) { return [false, 'CoalPowerPlant does not exists.'] }

    return [coalPowerPlant, null]
}

// Update a CoalPowerPlant given its ID using newData as data to update.
// newData should be an object with <attribute>: <value> pairs.
export async function update(coalPowerPlantID, newData) {
    let coalPowerPlant = await db.loadOne(CoalPowerPlant, coalPowerPlantID)

    if(!coalPowerPlant) { return [false, 'CoalPowerPlant does not exists.'] }

    Object.entries(newData).forEach(([k, v]) => { coalPowerPlant[k] = v })

    if(!(await db.update(CoalPowerPlant, coalPowerPlant))) {
        return [false, 'An error occured while updating the coal power plant.']
    }

    return [coalPowerPlant, null]
}

// Get a coal power plant production given its ID and a from value.
export async function production(coalPowerPlantID, from = null) {
    let coalPowerPlant = await db.loadOne(CoalPowerPlant, coalPowerPlantID)

    if(!coalPowerPlant) { return [false, 'CoalPowerPlant does not exists.'] }

    if(from) {
        let date = new Date(from).toISOString().slice(0, 10)
        let hour = new Date(from).toLocaleString().slice(11, 20)

        from = date + hour
    }

    return [await coalPowerPlant.production(from), null]
}

const coalPowerPlant = { get, update, production }

export default coalPowerPlant
