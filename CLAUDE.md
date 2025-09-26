# Claude Configuration for União de Contabilidade Bot

This project is a Facebook Messenger bot for União de Contabilidade (Accounting Union) built with **functional programming principles** using Node.js, Express, and MongoDB.

## Project Structure

- `index.js` - Main application entry point
- `controllers/` - Route handlers and business logic
  - `bot.js` - Bot class with Facebook profile setup methods
  - `gettingStarted.js` - Setup functions for Facebook Messenger profile
  - `messageGeneric.js` - Generic message templates
  - `messageHook.js` - Message sending utility
  - `messageProdutos.js` - Product message templates
  - `processMessage.js` - Main message processing logic
  - `verification.js` - Facebook webhook verification
- `utils/` - Utility functions
  - `httpClient.js` - Axios-based HTTP client for Facebook API calls

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=5000
FACEBOOK_ACCESS_TOKEN=your_facebook_page_access_token
MONGODB_URL=your_mongodb_connection_string
MONGO_HOST=your_mongo_host
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

## Dependencies

- **express** - Web framework
- **body-parser** - Parse HTTP request bodies
- **axios** - HTTP client for API requests
- **mongoose** - MongoDB object modeling
- **mongodb** - MongoDB driver

## Development Dependencies

- **nodemon** - Development server with auto-restart

## API Endpoints

- `GET /` - Health check endpoint
- `GET /webhook` - Facebook webhook verification
- `POST /webhook` - Facebook webhook for receiving messages
- `GET /setup` - Setup Facebook Messenger profile (get started button, persistent menu, greeting)

## Facebook Messenger Features

- Get Started button
- Persistent menu
- Greeting text
- Button templates
- Generic templates (carousel)
- Postback handling

## Deployment Notes

- Requires Node.js >= 18.0.0
- MongoDB database connection required
- Facebook Page Access Token required
- Webhook URL must be HTTPS for production

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Check application health
curl http://localhost:5000/
```

## Troubleshooting

1. **MongoDB Connection Issues**: Verify MONGODB_URL environment variable
2. **Facebook API Errors**: Check FACEBOOK_ACCESS_TOKEN validity
3. **Webhook Verification**: Ensure webhook URL is accessible and uses HTTPS in production