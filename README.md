# Multilingual Loan Advisor

A multilingual chatbot application for providing loan information in multiple Indian languages.

## Features

- Multilingual support for 11 Indian languages
- Text and voice input
- Text-to-speech for responses
- Resizable chatbot interface
- Conversation history with clear functionality
- Dark/light theme support
- Comprehensive logging system for debugging

## API Architecture

This application uses a dual-API approach:

1. **Custom API** - Handles text-based interactions only
   - Receives English text queries from the user (translated on the client-side)
   - Processes the queries and returns English text responses (as plain text)
   - Expects requests in the format: `{ "question": "your question here" }` (no language parameter needed)
   - Responses are translated back to the user's language on the client-side
   - Accessed directly via the `/ask` endpoint without a proxy to avoid CORS issues

2. **Sarvam AI API** - Handles all audio-related operations
   - Speech-to-Text (STT) - Converts user's voice recordings to text
   - Text-to-Speech (TTS) - Converts bot responses to audio
   - Translation - Translates text between languages
   - Accessed via `/api/stt`, `/api/tts`, and `/api/translate` endpoints through a proxy

## Logging System

The application includes a comprehensive logging system for debugging:

1. **Client-side Logging**:
   - All API requests are logged with timestamps, endpoints, methods, and request bodies
   - API responses are logged with status codes and response data
   - Translation operations are logged with original and translated text
   - Error handling includes detailed error logs
   - Mock responses and fallbacks are clearly identified in logs

2. **Server-side Logging**:
   - All proxy requests are logged with detailed information
   - Request headers and bodies are captured
   - Response status codes and headers are logged
   - Error handling includes comprehensive error logs
   - Each proxy target (TTS, STT, Translation) has its own labeled logs

3. **Log Format**:
   - Client-side: Uses console groups with emoji indicators for different operations
   - Server-side: Uses timestamp-prefixed logs with clear labels for each operation
   - Binary data (like audio) is logged with type and size information

To view logs:
- Client-side: Open browser developer tools and check the console
- Server-side: Check the terminal where the server is running

## CORS-Safe Implementation

This application avoids CORS issues by:

1. Sending requests directly to the custom API without using credentials mode
2. Translating user messages to English before sending to the custom API
3. Translating API responses back to the user's language on the client-side
4. Using a proxy server only for Sarvam AI API requests (audio-related operations)
5. Implementing a fallback mechanism that tries different request modes:
   - First attempts with standard 'cors' mode
   - If blocked by CORS, falls back to 'no-cors' mode
   - If both fail, uses intelligent mock responses based on the query
   - All mock responses are translated to the user's language

## Installation

```bash
# Install dependencies
npm install
```

## Development

```bash
# Build the frontend
npm run build

# Start the proxy server and serve the application
npm start
```

For development with hot-reloading:

```bash
# Start the frontend development server
npm run dev

# In a separate terminal, start the proxy server
npm run dev:server
```

## Environment Variables

You can configure the API endpoint by setting the custom API URL in the ApiUrlContext:

```typescript
// In src/contexts/ApiUrlContext.tsx
const [customApiUrl, setCustomApiUrl] = useState<string>('https://your-custom-api.com');
```

## Deployment

The application can be deployed to any static hosting service. Make sure to set up the proxy server to handle Sarvam API requests.

## Troubleshooting

If you encounter CORS issues:

1. Check that the custom API URL is correctly set in ApiUrlContext and points to the base URL without any path
2. Verify that the API endpoint is correctly set to `/ask` in the sendMessage function
3. Make sure the request body only includes the `question` field (the API expects `{ "question": "your question here" }` without any language parameter)
4. Make sure the fetchWithCORS function is properly handling CORS errors with fallback mechanisms
5. Check the browser console for detailed error messages about CORS issues
6. If using a custom API server, ensure it has proper CORS headers configured:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, POST, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Accept
   ```
7. Remember that even if CORS issues persist, the application will still function using intelligent mock responses

## License

MIT
