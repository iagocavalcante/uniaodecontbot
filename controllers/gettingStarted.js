'use strict'

const { curry, pipe, tryCatch, Either } = require('../utils/functional')
const { updateFacebookProfile } = require('../utils/httpClient')

// Pure functions for creating profile configurations
const createGetStartedConfig = (payload = "getstarted") => ({
    get_started: { payload }
})

const createRegisterConfig = (payload = "USER_DEFINED_PAYLOAD") => ({
    get_started: [{ payload }]
})

const createGreetingConfig = () => ({
    greeting: [
        {
            locale: "default",
            text: "Bem-vindo à União de Contabilidade! Como posso ajudá-lo hoje?"
        },
        {
            locale: "en_US", 
            text: "Welcome to União de Contabilidade! How can I help you today?"
        }
    ]
})

const createPersistentMenuConfig = () => ({
    persistent_menu: [
        {
            locale: "default",
            composer_input_disabled: true,
            call_to_actions: [
                {
                    title: "Informações",
                    type: "nested",
                    call_to_actions: [
                        {
                            title: "Ajuda",
                            type: "postback",
                            payload: "HELP_PAYLOAD"
                        },
                        {
                            title: "Contato",
                            type: "postback",
                            payload: "CONTACT_INFO_PAYLOAD"
                        }
                    ]
                },
                {
                    type: "web_url",
                    title: "Visite nosso site",
                    url: "https://uniaodecontabilidade.com.br",
                    webview_height_ratio: "full"
                }
            ]
        },
        {
            locale: "en_US",
            composer_input_disabled: false
        }
    ]
})

// Higher-order function to create response handlers
const createResponseHandler = curry((operation, res) => (result) => {
    return Either.fold(
        (error) => {
            console.error(`Error in ${operation}:`, error)
            res.status(500).send({ 
                error: `Failed to ${operation}`,
                details: error.message 
            })
        },
        (data) => {
            console.log(`${operation} successful`)
            res.send(data)
        }
    )(result)
})

// Safe profile update function
const safeUpdateProfile = tryCatch(updateFacebookProfile)

// Higher-order function to create setup functions
const createSetupFunction = curry((configCreator, operation) => async (req, res) => {
    const config = configCreator()
    const result = await safeUpdateProfile(config)
    const handleResponse = createResponseHandler(operation, res)
    return handleResponse(result)
})

// Composed setup functions
const setupGetStartedButton = createSetupFunction(
    createGetStartedConfig,
    'setup get started button'
)

const register = createSetupFunction(
    createRegisterConfig,
    'register'
)

const setupGreetingText = createSetupFunction(
    createGreetingConfig,
    'setup greeting text'
)

const setupPersistentMenu = createSetupFunction(
    createPersistentMenuConfig,
    'setup persistent menu'
)

// Utility function to run all setup functions in sequence
const runAllSetups = async (req, res) => {
    const setupFunctions = [
        () => register(req, { send: () => {}, status: () => ({ send: () => {} }) }),
        () => setupGetStartedButton(req, { send: () => {}, status: () => ({ send: () => {} }) }),
        () => setupGreetingText(req, { send: () => {}, status: () => ({ send: () => {} }) }),
        () => setupPersistentMenu(req, { send: () => {}, status: () => ({ send: () => {} }) })
    ]

    const results = []
    for (const setupFn of setupFunctions) {
        try {
            const result = await setupFn()
            results.push({ success: true, result })
        } catch (error) {
            results.push({ success: false, error: error.message })
        }
    }

    const successCount = results.filter(r => r.success).length
    const errorCount = results.length - successCount

    if (errorCount === 0) {
        res.send({ 
            message: 'All setup operations completed successfully',
            results 
        })
    } else {
        res.status(207).send({ 
            message: `${successCount} operations succeeded, ${errorCount} failed`,
            results 
        })
    }
}

module.exports = {
    setupGetStartedButton,
    register,
    setupGreetingText,
    setupPersistentMenu,
    runAllSetups,
    
    // Export pure functions for testing
    createGetStartedConfig,
    createRegisterConfig,
    createGreetingConfig,
    createPersistentMenuConfig
}