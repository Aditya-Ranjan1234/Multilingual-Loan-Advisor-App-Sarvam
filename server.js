const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Logger middleware for all requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  console.log(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
  
  // Log request body if it exists
  if (req.body) {
    console.log(`Request body: ${JSON.stringify(req.body, null, 2)}`);
  }
  
  // Capture the response
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`[${timestamp}] Response status: ${res.statusCode}`);
    
    // Try to log the response body, but don't log binary data or very large responses
    if (typeof body === 'string' && body.length < 1000) {
      console.log(`Response body: ${body}`);
    } else if (Buffer.isBuffer(body)) {
      console.log(`Response body: [Binary data of length ${body.length}]`);
    } else {
      console.log(`Response body: [Data of type ${typeof body}]`);
    }
    
    return originalSend.apply(res, arguments);
  };
  
  next();
});

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// Custom logger for proxy requests
const createLoggerProxy = (targetName) => {
  return {
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[PROXY:${targetName}] Request: ${req.method} ${req.url} -> ${proxyReq.path}`);
      console.log(`[PROXY:${targetName}] Headers: ${JSON.stringify(proxyReq.getHeaders(), null, 2)}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[PROXY:${targetName}] Response: ${proxyRes.statusCode} ${proxyRes.statusMessage}`);
      console.log(`[PROXY:${targetName}] Response headers: ${JSON.stringify(proxyRes.headers, null, 2)}`);
    },
    onError: (err, req, res) => {
      console.error(`[PROXY:${targetName}] Error: ${err.message}`);
      res.status(500).json({ 
        error: `${targetName} proxy error`, 
        message: err.message,
        response: `Sorry, there was an error connecting to the ${targetName} service. Please try again later.`,
        shouldPlayAudio: false
      });
    }
  };
};

// Remove the proxy for the custom API since we're handling translation on the client side
// and sending requests directly to the API with the correct /ask endpoint

// Keep proxy audio-related requests to the Sarvam API
app.use('/api/tts', createProxyMiddleware({
  target: 'https://api.sarvam.ai',
  changeOrigin: true,
  pathRewrite: {
    '^/api/tts': '/tts' // Remove /api prefix when forwarding the request
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Accept', 'audio/mpeg');
    // Use the custom logger
    createLoggerProxy('TTS').onProxyReq(proxyReq, req, res);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Use the custom logger
    createLoggerProxy('TTS').onProxyRes(proxyRes, req, res);
  },
  onError: createLoggerProxy('TTS').onError
}));

// Proxy speech-to-text requests to the Sarvam API
app.use('/api/stt', createProxyMiddleware({
  target: 'https://api.sarvam.ai',
  changeOrigin: true,
  pathRewrite: {
    '^/api/stt': '/stt' // Remove /api prefix when forwarding the request
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Accept', 'application/json');
    // Use the custom logger
    createLoggerProxy('STT').onProxyReq(proxyReq, req, res);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Use the custom logger
    createLoggerProxy('STT').onProxyRes(proxyRes, req, res);
  },
  onError: createLoggerProxy('STT').onError
}));

// Proxy translation requests to the Sarvam API
app.use('/api/translate', createProxyMiddleware({
  target: 'https://api.sarvam.ai',
  changeOrigin: true,
  pathRewrite: {
    '^/api/translate': '/translate' // Remove /api prefix when forwarding the request
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Accept', 'application/json');
    // Use the custom logger
    createLoggerProxy('Translate').onProxyReq(proxyReq, req, res);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Use the custom logger
    createLoggerProxy('Translate').onProxyRes(proxyRes, req, res);
  },
  onError: createLoggerProxy('Translate').onError
}));

// Fallback route for any other API requests
app.use('/api', (req, res) => {
  console.log(`[API:Fallback] Unhandled API request: ${req.method} ${req.url}`);
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested API endpoint does not exist',
    response: 'Sorry, this feature is not available.',
    shouldPlayAudio: false
  });
});

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any other request, send the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Audio requests are proxied to: https://api.sarvam.ai`);
  console.log(`Server logs will show detailed information about all requests and responses`);
}); 