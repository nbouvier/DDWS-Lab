// Query the database
export function fetchFromService(url, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'JSON',
            data: data,

            success: data => resolve(data),

            error: error => reject(error)
        })
    })
}

const fetcher = { fetchFromService }

export default fetcher
