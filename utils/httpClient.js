const axios = require('axios');
const { curry, pipe, prop, Either, tryCatch, log } = require('./functional');

// Configuration
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const FACEBOOK_BASE_URL = 'https://graph.facebook.com/v2.6';

// Pure functions for building requests
const createRecipient = (recipientId) => ({ id: recipientId });

const createMessagePayload = curry((recipientId, messageData) => ({
    recipient: createRecipient(recipientId),
    message: messageData
}));

const createRequestConfig = (accessToken) => ({
    params: { access_token: accessToken }
});

const buildMessageUrl = (baseUrl) => `${baseUrl}/me/messages`;
const buildProfileUrl = (baseUrl) => `${baseUrl}/me/messenger_profile`;

// HTTP request functions
const makeRequest = curry(async (method, url, data, config) => {
    return await axios({
        method,
        url,
        data,
        ...config
    });
});

const postRequest = makeRequest('POST');

// Response handlers
const logSuccess = curry((operation, response) => {
    console.log(`${operation} successful`);
    return response.data;
});

const logError = curry((operation, error) => {
    const errorMessage = error.response?.data || error.message;
    console.error(`Error ${operation}:`, errorMessage);
    return error;
});

// Safe HTTP operations with Either monad
const safePostRequest = tryCatch(postRequest);

// Functional Facebook API operations
const sendMessageRequest = curry(async (recipientId, messageData) => {
    const url = buildMessageUrl(FACEBOOK_BASE_URL);
    const payload = createMessagePayload(recipientId, messageData);
    const config = createRequestConfig(FACEBOOK_ACCESS_TOKEN);
    
    return await safePostRequest(url, payload, config);
});

const updateProfileRequest = curry(async (profileData) => {
    const url = buildProfileUrl(FACEBOOK_BASE_URL);
    const config = createRequestConfig(FACEBOOK_ACCESS_TOKEN);
    
    return await safePostRequest(url, profileData, config);
});

// Higher-order functions for handling responses
const handleResponse = curry((operation, responseEither) => {
    return Either.fold(
        logError(operation),
        logSuccess(operation)
    )(responseEither);
});

// Main API functions
const sendFacebookMessage = async (recipientId, messageData) => {
    const responseEither = await sendMessageRequest(recipientId, messageData);
    return handleResponse('sending message', responseEither);
};

const updateFacebookProfile = async (profileData) => {
    const responseEither = await updateProfileRequest(profileData);
    return handleResponse('updating profile', responseEither);
};

// Utility functions for common operations
const createTextMessage = (text) => ({ text });

const createButtonTemplate = curry((text, buttons) => ({
    attachment: {
        type: "template",
        payload: {
            template_type: "button",
            text,
            buttons
        }
    }
}));

const createGenericTemplate = (elements) => ({
    attachment: {
        type: "template",
        payload: {
            template_type: "generic",
            elements
        }
    }
});

// Validation functions
const isValidRecipientId = (id) => typeof id === 'string' && id.length > 0;
const isValidMessageData = (data) => typeof data === 'object' && data !== null;

// Composed validation function
const validateMessageInput = (recipientId, messageData) => {
    if (!isValidRecipientId(recipientId)) {
        return Either.left(new Error('Invalid recipient ID'));
    }
    if (!isValidMessageData(messageData)) {
        return Either.left(new Error('Invalid message data'));
    }
    return Either.right({ recipientId, messageData });
};

// Safe send message with validation
const safeSendFacebookMessage = async (recipientId, messageData) => {
    const validationResult = validateMessageInput(recipientId, messageData);
    
    return Either.fold(
        (error) => {
            console.error('Validation error:', error.message);
            return Either.left(error);
        },
        async ({ recipientId, messageData }) => {
            return await sendFacebookMessage(recipientId, messageData);
        }
    )(validationResult);
};

module.exports = {
    // Main API functions
    sendFacebookMessage,
    updateFacebookProfile,
    safeSendFacebookMessage,
    
    // Message creation utilities
    createTextMessage,
    createButtonTemplate,
    createGenericTemplate,
    
    // Low-level functions (for testing and composition)
    createRecipient,
    createMessagePayload,
    buildMessageUrl,
    buildProfileUrl,
    
    // Validation functions
    isValidRecipientId,
    isValidMessageData,
    validateMessageInput,
    
    // Configuration
    FACEBOOK_BASE_URL
};