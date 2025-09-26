const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Functional utilities
const { pipe, curry, Either, tryCatch, log } = require('./utils/functional')
const { 
    createLogger, 
    createErrorHandler, 
    validateContentType,
    composeMiddleware,
    safeAsyncMiddleware,
    createRateLimiter,
    securityHeaders,
    requestId,
    createHealthCheck
} = require('./utils/middleware')

// Controllers
const verification = require('./controllers/verification')
const processMessage = require('./controllers/processMessage')
const getStart = require('./controllers/gettingStarted')

// Configuration functions
const createAppConfig = () => ({
    port: parseInt(process.env.PORT) || 5000,
    mongoUrl: process.env.MONGODB_URL || `mongodb://${process.env.MONGO_HOST || 'localhost:27017'}/uniaodecontbot`,
    nodeEnv: process.env.NODE_ENV || 'development'
})

// Database connection functions
const connectToDatabase = tryCatch(async (mongoUrl) => {
    // Set connection timeout to 5 seconds
    await mongoose.connect(mongoUrl, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
    })
    return `Connected to MongoDB: ${mongoUrl}`
}, (error) => {
    console.warn('MongoDB connection failed:', error.message)
    console.log('⚠️  Running without database connection')
    return error
})

// Middleware setup functions
const setupBasicMiddleware = (app) => {
    app.use(requestId)
    app.use(createLogger('HTTP'))
    app.use(securityHeaders)
    
    // Rate limiting - 100 requests per 15 minutes
    app.use(createRateLimiter(100, 15 * 60 * 1000))
    
    return app
}

const setupBodyParsers = (app) => {
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    return app
}

const setupErrorHandling = (app) => {
    app.use(createErrorHandler())
    return app
}

// Route setup functions
const setupHealthRoute = (app) => {
    const healthChecks = [
        async function databaseCheck() {
            if (mongoose.connection.readyState !== 1) {
                throw new Error('Database not connected')
            }
        }
    ]
    
    app.get('/health', createHealthCheck(healthChecks))
    return app
}

const setupBasicRoutes = (app) => {
    // Index route
    app.get('/', (req, res) => {
        res.json({
            message: "União de Contabilidade Bot API",
            version: "2.0.0",
            status: "running",
            timestamp: new Date().toISOString()
        })
    })
    
    return app
}

const setupWebhookRoutes = (app) => {
    // Facebook webhook verification
    app.get('/webhook/', verification)
    
    // Facebook webhook message processing
    app.post('/webhook/', 
        validateContentType('application/json'),
        safeAsyncMiddleware(processMessage)
    )
    
    return app
}

const setupManagementRoutes = (app) => {
    // Individual setup endpoints
    app.get('/setup/register', safeAsyncMiddleware(getStart.register))
    app.get('/setup/get-started', safeAsyncMiddleware(getStart.setupGetStartedButton))
    app.get('/setup/greeting', safeAsyncMiddleware(getStart.setupGreetingText))
    app.get('/setup/menu', safeAsyncMiddleware(getStart.setupPersistentMenu))
    
    // Complete setup endpoint
    app.get('/setup', safeAsyncMiddleware(getStart.runAllSetups))
    
    return app
}

// Application factory function
const createApplication = () => {
    const app = express()
    
    return pipe(
        setupBasicMiddleware,
        setupBodyParsers,
        setupHealthRoute,
        setupBasicRoutes,
        setupWebhookRoutes,
        setupManagementRoutes,
        setupErrorHandling
    )(app)
}

// Server startup function
const startServer = curry(async (config, app) => {
    // Connect to database
    const dbResult = await connectToDatabase(config.mongoUrl)
    
    // Start HTTP server regardless of database connection
    const server = app.listen(config.port, () => {
        console.log(`🚀 Server running on port ${config.port}`)
        console.log(`📊 Health check available at http://localhost:${config.port}/health`)
        console.log(`🤖 Webhook endpoint at http://localhost:${config.port}/webhook`)
        console.log(`⚙️  Setup endpoint at http://localhost:${config.port}/setup`)
        
        // Log database connection status
        Either.fold(
            (error) => {
                console.log(`❌ Database: Disconnected (${error.message})`)
            },
            (message) => {
                console.log(`✅ Database: ${message}`)
            }
        )(dbResult)
    })
    
    return server
})

// Graceful shutdown function
const setupGracefulShutdown = (server) => {
    const shutdown = async (signal) => {
        console.log(`\n${signal} received. Starting graceful shutdown...`)
        
        server.close(async () => {
            console.log('HTTP server closed.')
            
            try {
                await mongoose.connection.close()
                console.log('Database connection closed.')
                process.exit(0)
            } catch (error) {
                console.error('Error during shutdown:', error)
                process.exit(1)
            }
        })
    }
    
    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))
}

// Main application initialization
const initializeApplication = async () => {
    try {
        const config = createAppConfig()
        const app = createApplication()
        const server = await startServer(config, app)
        
        setupGracefulShutdown(server)
        
        return { app, server, config }
    } catch (error) {
        console.error('Failed to initialize application:', error)
        process.exit(1)
    }
}

// Start the application
if (require.main === module) {
    initializeApplication()
}

module.exports = {
    createApplication,
    createAppConfig,
    startServer,
    initializeApplication,
    // Export for testing
    setupBasicMiddleware,
    setupBodyParsers,
    setupWebhookRoutes,
    setupManagementRoutes
}