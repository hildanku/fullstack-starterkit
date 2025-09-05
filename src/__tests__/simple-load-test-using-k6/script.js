import http from 'k6/http'
import { expect } from "https://jslib.k6.io/k6-testing/0.5.0/index.js"

export const options = {
    vus: 20,
    duration: '15s',
}

export default function() {
    let res = http.get('http://localhost:5550/api/v1/users')
    expect.soft(res.status).toBe(200)
}
