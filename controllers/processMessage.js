const { pipe, prop, asyncMap, forEach, Either, tryCatch, log } = require('../utils/functional')
const { processEvent } = require('../handlers/messageHandlers')

// Pure functions for request validation and data extraction
const isPageWebhook = pipe(
    prop('body'),
    prop('object'),
    (obj) => obj === 'page'
)

const extractEntries = pipe(
    prop('body'),
    prop('entry')
)

const extractMessagingEvents = pipe(
    prop('messaging')
)

const flattenEvents = (entries) => 
    entries.flatMap(extractMessagingEvents)

// Pure function to process all events
const processAllEvents = async (events) => {
    const results = await asyncMap(processEvent, events)
    return results
}

// Safe event processor with error handling
const safeProcessEvent = tryCatch(processEvent, (error) => {
    console.error('Error processing event:', error)
    return error
})

// Higher-order function to create response handler
const createResponseHandler = (res) => (results) => {
    // Log successful processing
    const successCount = results.filter(Either.fold(() => false, () => true)).length
    const errorCount = results.length - successCount
    
    if (errorCount > 0) {
        console.log(`Processed ${successCount} events successfully, ${errorCount} with errors`)
    } else {
        console.log(`Successfully processed ${successCount} events`)
    }
    
    res.status(200).end()
    return results
}

// Functional pipeline for processing webhook requests
const processWebhookRequest = async (req, res) => {
    if (!isPageWebhook(req)) {
        res.status(400).json({ error: 'Invalid webhook object type' })
        return
    }

    const pipeline = pipe(
        extractEntries,
        flattenEvents,
        async (events) => {
            const results = await Promise.all(
                events.map(safeProcessEvent)
            )
            return results
        },
        createResponseHandler(res)
    )

    return await pipeline(req)
}

// Main export with error handling
module.exports = tryCatch(processWebhookRequest, (error) => {
    console.error('Webhook processing error:', error)
    return (req, res) => {
        res.status(500).json({ error: 'Internal server error' })
    }
})