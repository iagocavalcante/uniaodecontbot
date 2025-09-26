const { pipe, curry, prop, toLowerCase, includes, Either, tryCatch } = require('../utils/functional')
const { sendFacebookMessage } = require('../utils/httpClient')

// Pure functions for message matching
const extractText = pipe(
    prop('message'),
    (message) => message ? message.text : '',
    toLowerCase
)

const matchesGreeting = (text) => text === 'oi'
const matchesContact = (text) => text === 'contato'
const matchesService = (text) => includes('serviço')(text) || includes('servico')(text)

// Pure functions for creating message responses
const createTextMessage = (text) => ({ text })

const createButtonMessage = (text, buttons) => ({
    attachment: {
        type: "template",
        payload: {
            template_type: "button",
            text,
            buttons
        }
    }
})

const createGenericMessage = () => createButtonMessage(
    "O que você quer fazer agora ?",
    [
        {
            type: "postback",
            title: "Contato",
            payload: "evento_contato"
        },
        {
            type: "postback",
            title: "Ver produtos",
            payload: "evento_produtos"
        }
    ]
)

const createProductMessage = () => ({
    attachment: {
        type: "template",
        payload: {
            template_type: "generic",
            elements: [{
                title: "Serviços de Contabilidade",
                image_url: "https://example.com/accounting-services.jpg",
                subtitle: "Oferecemos serviços completos de contabilidade para empresas de todos os portes.",
                buttons: {
                    type: "postback",
                    title: "Saber Mais",
                    payload: "MAIS_INFORMACOES"
                }
            }]
        }
    }
})

// Message response functions
const responses = {
    greeting: "Olá! Bem-vindo à União de Contabilidade! Como posso ajudá-lo?",
    contact: "Para entrar em contato com a União de Contabilidade, envie um WhatsApp para (11) 99999-9999",
    service: "Oferecemos serviços completos de contabilidade para empresas de todos os portes!",
    default: "Olá! Como posso ajudá-lo com nossos serviços de contabilidade?",
    contactFull: "Para entrar em contato com a União de Contabilidade, envie um WhatsApp para (11) 99999-9999 ou ligue para (11) 3333-4444",
    notUnderstood: "Desculpe, não entendi. Como posso ajudá-lo?"
}

// Pure function to determine message type
const getMessageType = (text) => {
    if (matchesGreeting(text)) return 'greeting'
    if (matchesContact(text)) return 'contact'
    if (matchesService(text)) return 'service'
    return 'default'
}

// Pure function to get response based on message type
const getResponse = (messageType) => responses[messageType]

// Pure function to determine postback response
const getPostbackResponse = (payload) => {
    switch (payload) {
        case 'evento_comecar':
        case 'getstarted':
            return { type: 'generic', data: createGenericMessage() }
        case 'evento_produtos':
            return { type: 'product', data: createProductMessage() }
        case 'evento_contato':
            return { type: 'text', data: createTextMessage(responses.contactFull) }
        default:
            return { type: 'text', data: createTextMessage(responses.notUnderstood) }
    }
}

// Curried function to send message
const sendMessage = curry(async (senderId, messageData) => {
    return await sendFacebookMessage(senderId, messageData)
})

// Safe message sender with error handling
const safeSendMessage = tryCatch(sendMessage)

// Higher-order function to handle text messages
const handleTextMessage = curry(async (event) => {
    const senderId = prop('sender')(event).id
    const text = extractText(event)
    const messageType = getMessageType(text)
    
    if (messageType === 'greeting') {
        const genericMessage = createGenericMessage()
        return await safeSendMessage(senderId)(genericMessage)
    } else {
        const response = getResponse(messageType)
        const textMessage = createTextMessage(response)
        return await safeSendMessage(senderId)(textMessage)
    }
})

// Higher-order function to handle postback events
const handlePostback = curry(async (event) => {
    const senderId = prop('sender')(event).id
    const payload = prop('postback')(event).payload
    const response = getPostbackResponse(payload)
    
    return await safeSendMessage(senderId)(response.data)
})

// Pure function to check if event has text message
const hasTextMessage = (event) => 
    event.message && event.message.text

// Pure function to check if event has postback
const hasPostback = (event) => Boolean(event.postback)

// Main message processor function
const processEvent = async (event) => {
    if (hasTextMessage(event)) {
        return await handleTextMessage(event)
    } else if (hasPostback(event)) {
        console.log('Postback received:', event.postback)
        return await handlePostback(event)
    }
    return Either.right(null)
}

module.exports = {
    // Pure functions
    extractText,
    matchesGreeting,
    matchesContact,
    matchesService,
    createTextMessage,
    createButtonMessage,
    createGenericMessage,
    createProductMessage,
    getMessageType,
    getResponse,
    getPostbackResponse,
    hasTextMessage,
    hasPostback,
    
    // Handler functions
    handleTextMessage,
    handlePostback,
    processEvent,
    
    // Utilities
    sendMessage,
    safeSendMessage,
    
    // Constants
    responses
}