# União de Contabilidade Bot

A Facebook Messenger bot for União de Contabilidade (Accounting Union) built with **functional programming principles** that provides automated customer service and information about accounting services.

## Features

- 🤖 Automated responses to customer inquiries
- 📋 Interactive button templates for easy navigation
- 🛍️ Product/service information display
- 📞 Contact information and support
- ⚙️ Facebook Messenger profile setup automation
- 🔧 **Pure functional architecture** with immutable data flow
- 🛡️ **Error handling with Either monads**
- 🔄 **Function composition and currying**
- 📊 **Health monitoring and graceful shutdown**
- 🚦 **Rate limiting and security headers**

## Functional Architecture

This bot is built using functional programming principles with the following key concepts:

### Core Functional Utilities (`utils/functional.js`)
- **Pipe & Compose**: Function composition for readable data transformations
- **Curry**: Partial application for flexible function reuse
- **Maybe & Either Monads**: Safe handling of null values and errors
- **Pure Functions**: Predictable, testable code without side effects

### Message Processing Pipeline
```javascript
const processWebhookRequest = pipe(
    extractEntries,
    flattenEvents,
    asyncMap(safeProcessEvent),
    createResponseHandler(res)
)
```

### HTTP Client with Functional Error Handling
- Curried functions for flexible API calls
- Either monad for error handling
- Pure functions for request building
- Validation pipelines

### Middleware Composition
- Higher-order functions for middleware creation
- Function composition for middleware chains
- Immutable configuration objects

## Technology Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database for storing user data
- **Mongoose** - MongoDB object modeling
- **Axios** - HTTP client for API requests
- **Facebook Messenger Platform** - Bot platform
- **Functional Programming** - Core architecture approach

## Prerequisites

- Node.js >= 18.0.0
- MongoDB database (optional - app runs without it)
- Facebook Page with Messenger enabled
- Facebook App with Messenger permissions

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd uniaodecontbot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
FACEBOOK_ACCESS_TOKEN=your_facebook_page_access_token
MONGODB_URL=your_mongodb_connection_string
MONGO_HOST=your_mongo_host
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Port for the Express server | No (default: 5000) |
| `FACEBOOK_ACCESS_TOKEN` | Facebook Page Access Token | Yes |
| `MONGODB_URL` | Complete MongoDB connection string | No |
| `MONGO_HOST` | MongoDB host (fallback) | No |

## API Endpoints

### Public Endpoints

- `GET /` - API information and status
- `GET /health` - Health check with database status
- `GET /webhook` - Facebook webhook verification
- `POST /webhook` - Receive messages from Facebook

### Setup Endpoints

- `GET /setup` - Complete Messenger profile setup (runs all setup functions)
- `GET /setup/register` - Register bot
- `GET /setup/get-started` - Setup get started button
- `GET /setup/greeting` - Setup greeting text
- `GET /setup/menu` - Setup persistent menu

## Functional Architecture Overview

### 1. Pure Functions
All business logic is implemented as pure functions that:
- Take input parameters
- Return consistent outputs
- Have no side effects
- Are easily testable

### 2. Function Composition
Complex operations are built by composing simple functions:
```javascript
const processMessage = pipe(
    extractText,
    getMessageType,
    getResponse,
    createTextMessage,
    safeSendMessage
)
```

### 3. Error Handling with Either Monad
Errors are handled functionally without throwing exceptions:
```javascript
const result = await safeSendMessage(recipientId, messageData)
Either.fold(
    error => console.error('Send failed:', error),
    success => console.log('Message sent:', success)
)(result)
```

### 4. Immutable Data Flow
All data transformations create new objects rather than mutating existing ones.

### 5. Higher-Order Functions
Functions that operate on other functions for maximum reusability:
```javascript
const createSetupFunction = curry((configCreator, operation) => 
    async (req, res) => {
        const config = configCreator()
        const result = await safeUpdateProfile(config)
        return handleResponse(operation, res)(result)
    }
)
```

## Facebook Messenger Setup

1. **Create a Facebook App**:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app
   - Add Messenger product

2. **Configure Webhook**:
   - Set webhook URL to `https://yourdomain.com/webhook`
   - Subscribe to `messages` and `messaging_postbacks` events

3. **Get Page Access Token**:
   - Generate a page access token for your Facebook page
   - Add it to your `.env` file

4. **Setup Bot Profile**:
   - Visit `/setup` endpoint to configure all bot features at once

## Project Structure

```
├── handlers/
│   └── messageHandlers.js    # Pure functions for message processing
├── controllers/
│   ├── gettingStarted.js     # Functional setup controllers
│   ├── processMessage.js     # Main webhook processor
│   └── verification.js       # Webhook verification
├── utils/
│   ├── functional.js         # Core functional utilities
│   ├── httpClient.js         # Functional HTTP client
│   └── middleware.js         # Functional middleware
├── index.js                  # Application entry point
├── package.json
├── CLAUDE.md                 # Claude configuration
└── README.md
```

## Development

### Running in Development Mode

```bash
npm run dev
```

This starts the server with nodemon for automatic restarts on file changes.

### Running in Production

```bash
npm start
```

### Testing Functions

The functional architecture makes testing simple since all functions are pure:

```javascript
const { getMessageType, createTextMessage } = require('./handlers/messageHandlers')

// Test pure functions
console.log(getMessageType('oi')) // 'greeting'
console.log(createTextMessage('Hello')) // { text: 'Hello' }
```

## Deployment

### Fly.io Deployment

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Login to Fly:
```bash
fly auth login
```

3. Launch the app:
```bash
fly launch
```

4. Set environment variables:
```bash
fly secrets set FACEBOOK_ACCESS_TOKEN=your_token
fly secrets set MONGODB_URL=your_mongodb_url
```

5. Deploy:
```bash
fly deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Follow functional programming principles:
   - Write pure functions
   - Use function composition
   - Handle errors with Either monad
   - Avoid mutations
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/new-feature`)
6. Create a Pull Request

## Functional Programming Benefits

### 1. Predictability
Pure functions always return the same output for the same input, making the code predictable and easier to debug.

### 2. Testability
Pure functions are easy to test since they don't depend on external state or have side effects.

### 3. Composability
Small functions can be composed to create complex behavior while maintaining readability.

### 4. Error Handling
Using Either monads provides explicit error handling without exceptions, making error paths clear.

### 5. Immutability
Immutable data prevents bugs caused by unexpected mutations and makes concurrent programming safer.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact: [Your contact information]

## Changelog

### v2.0.0 - Functional Refactor
- Complete rewrite using functional programming principles
- Pure functions for all business logic
- Function composition for complex operations
- Either monad for error handling
- Immutable data flow
- Higher-order functions for reusability
- Improved error handling and logging
- Health monitoring and graceful shutdown
- Rate limiting and security improvements

### v1.0.0
- Initial release
- Basic Messenger bot functionality
- Facebook profile setup automation
- MongoDB integration
- Updated to modern dependencies (Express 5, Mongoose 8, Axios)