import jwt from 'jsonwebtoken'

export class JWTService {
    private accessSecret: string
    private refreshSecret: string

    constructor(accessSecret: string, refreshSecret: string) {
        this.accessSecret = accessSecret
        this.refreshSecret = refreshSecret
    }

    static decode(token: string) {
        return jwt.decode(token)
    }

    createAccess(id: number) {
        return jwt.sign({ sub: id.toString() }, this.accessSecret, {
            algorithm: 'HS256',
            issuer: 'fullstack-starterkit',
            audience: 'urn:fullstack-starterkit:audience',
            expiresIn: '6h',
        })
    }

    createRefresh(id: number) {
        return jwt.sign({ sub: id.toString() }, this.refreshSecret, {
            algorithm: 'HS256',
            issuer: 'reva-ai',
            audience: 'urn:fullstack-starterkit:audience',
            expiresIn: '7d',
        })
    }

    validateAccess(accessToken: string) {
        try {
            return jwt.verify(accessToken, this.accessSecret)
        } catch {
            return null
        }
    }

    validateRefresh(refreshToken: string) {
        try {
            return jwt.verify(refreshToken, this.refreshSecret)
        } catch {
            return null
        }
    }
}
