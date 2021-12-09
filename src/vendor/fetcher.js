import fetch from 'node-fetch'

// Query the database
export async function fetchFromService(url, data) {
    return await (await fetch(process.env.URL + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(data)
    })).json()
}

const fetcher = { fetchFromService }

export default fetcher
