const { curry, pipe, tryCatch, log, Either } = require('./functional')

// Pure functions for middleware operations
const createLogger = (prefix) => (req, res, next) => {
    console.log(`[${prefix}] ${req.method} ${req.url}`)
    next()
}

const createErrorHandler = (errorHandler = console.error) => (err, req, res, next) => {
    errorHandler('Error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
}

// Functional middleware for request validation
const validateContentType = curry((expectedType, req, res, next) => {
    const contentType = req.headers['content-type']
    if (contentType && contentType.includes(expectedType)) {
        next()
    } else {
        res.status(400).json({ 
            error: 'Invalid content type', 
            expected: expectedType,
            received: contentType 
        })
    }
})

// Middleware composition utility
const composeMiddleware = (...middlewares) => (req, res, next) => {
    const runMiddleware = (index) => {
        if (index >= middlewares.length) {
            return next()
        }
        
        const middleware = middlewares[index]
        middleware(req, res, (err) => {
            if (err) return next(err)
            runMiddleware(index + 1)
        })
    }
    
    runMiddleware(0)
}

// Higher-order function to create async middleware with error handling
const safeAsyncMiddleware = (asyncFn) => (req, res, next) => {
    Promise.resolve(asyncFn(req, res, next))
        .catch(next)
}

// Request body validation middleware
const validateRequiredFields = curry((fields, req, res, next) => {
    const missing = fields.filter(field => !(field in req.body))
    
    if (missing.length > 0) {
        res.status(400).json({
            error: 'Missing required fields',
            missing
        })
    } else {
        next()
    }
})

// Rate limiting middleware (simple implementation)
const createRateLimiter = (maxRequests, windowMs) => {
    const requests = new Map()
    
    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress
        const now = Date.now()
        const windowStart = now - windowMs
        
        // Clean old entries
        if (requests.has(ip)) {
            const userRequests = requests.get(ip).filter(time => time > windowStart)
            requests.set(ip, userRequests)
        } else {
            requests.set(ip, [])
        }
        
        const currentRequests = requests.get(ip)
        
        if (currentRequests.length >= maxRequests) {
            res.status(429).json({
                error: 'Too Many Requests',
                retryAfter: Math.ceil(windowMs / 1000)
            })
        } else {
            currentRequests.push(now)
            next()
        }
    }
}

// CORS middleware
const createCorsMiddleware = (options = {}) => {
    const defaultOptions = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
        credentials: false
    }
    
    const config = { ...defaultOptions, ...options }
    
    return (req, res, next) => {
        res.header('Access-Control-Allow-Origin', config.origin)
        res.header('Access-Control-Allow-Methods', config.methods)
        res.header('Access-Control-Allow-Headers', config.allowedHeaders)
        
        if (config.credentials) {
            res.header('Access-Control-Allow-Credentials', 'true')
        }
        
        if (req.method === 'OPTIONS') {
            res.sendStatus(200)
        } else {
            next()
        }
    }
}

// Security headers middleware
const securityHeaders = (req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff')
    res.header('X-Frame-Options', 'DENY')
    res.header('X-XSS-Protection', '1; mode=block')
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    next()
}

// Request ID middleware
const requestId = (req, res, next) => {
    req.id = Math.random().toString(36).substr(2, 9)
    res.header('X-Request-ID', req.id)
    next()
}

// Health check middleware factory
const createHealthCheck = (checks = []) => async (req, res) => {
    const results = await Promise.allSettled(
        checks.map(async (check) => {
            try {
                await check()
                return { name: check.name || 'unnamed', status: 'ok' }
            } catch (error) {
                return { 
                    name: check.name || 'unnamed', 
                    status: 'error', 
                    error: error.message 
                }
            }
        })
    )
    
    const healthData = results.map(result => result.value || result.reason)
    const hasErrors = healthData.some(check => check.status === 'error')
    
    res.status(hasErrors ? 503 : 200).json({
        status: hasErrors ? 'unhealthy' : 'healthy',
        timestamp: new Date().toISOString(),
        checks: healthData
    })
}

module.exports = {
    createLogger,
    createErrorHandler,
    validateContentType,
    composeMiddleware,
    safeAsyncMiddleware,
    validateRequiredFields,
    createRateLimiter,
    createCorsMiddleware,
    securityHeaders,
    requestId,
    createHealthCheck
}