export function randomBM(min, max, skew = 1) {
    var u = 0, v = 0
    while(u === 0) u = Math.random()
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
    num = num / 10.0 + 0.5
    if (num > 1 || num < 0) num = randomBM(min, max)
    num = Math.pow(num, skew)
    num *= max - min
    num += min
    return num
}

const random = { randomBM }

export default random
