const express = require('express');
const app = express();
const PORT = 3000;

// Track connections (for monitoring)
let connections = 0;

app.use((req, res, next) => {
    connections++;
    console.log(` Active Connections: ${connections}`);
    res.on('finish', () => connections--);
    next();
});

// Main route
app.get('/', (req, res) => {
    res.json({
        message: 'Hello from Server! 🚀',
        pod: process.env.HOSTNAME || 'unknown',
        connections: connections,
        time: new Date().toISOString()
    });
});

// Health check (Kubernetes ise use karega)
app.get('/health', (req, res) => {
    res.json({ status: 'healthy ' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});