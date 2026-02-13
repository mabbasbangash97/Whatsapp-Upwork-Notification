const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');

const app = express();
app.use(express.json());

// const YOUR_WHATSAPP_NUMBER = '120363404438498488@g.us';
const YOUR_WHATSAPP_NUMBER = '923408828851@c.us';
// Initialize WhatsApp client
const whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

let isWhatsAppReady = false;
let currentQRCode = null;

// WhatsApp QR Code for authentication
whatsappClient.on('qr', async (qr) => {
    console.log('\n📱 WhatsApp QR Code Generated!');
    console.log('🌐 Open your browser and go to: http://localhost:3000/qr');
    console.log('📱 Or scan the small QR code below:\n');

    // Generate smaller QR in terminal
    qrcode.generate(qr, { small: true });

    // Generate QR code image for web viewing
    try {
        currentQRCode = await QRCode.toDataURL(qr, {
            width: 400,
            margin: 2
        });
        console.log('\n✅ QR Code ready! Visit http://localhost:3000/qr in your browser');
    } catch (err) {
        console.error('Error generating QR image:', err);
    }
});

whatsappClient.on('ready', () => {
    console.log('✅ WhatsApp is ready!');
    isWhatsAppReady = true;
    currentQRCode = null; // Clear QR code once connected
});

whatsappClient.on('authenticated', () => {
    console.log('✅ WhatsApp authenticated successfully!');
});

whatsappClient.on('auth_failure', () => {
    console.error('❌ WhatsApp authentication failed. Please try again.');
});

// Start WhatsApp client
whatsappClient.initialize();

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'running',
        whatsappReady: isWhatsAppReady,
        message: 'Upwork to WhatsApp Bridge is active!',
        qrAvailable: currentQRCode ? true : false
    });
});

// QR Code viewer page
app.get('/qr', (req, res) => {
    if (!currentQRCode) {
        return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>WhatsApp QR Code</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-align: center;
                        padding: 20px;
                    }
                    .container {
                        background: rgba(255, 255, 255, 0.1);
                        padding: 40px;
                        border-radius: 20px;
                        backdrop-filter: blur(10px);
                        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                    }
                    h1 { margin-top: 0; }
                    .spinner {
                        border: 4px solid rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        border-top: 4px solid white;
                        width: 40px;
                        height: 40px;
                        animation: spin 1s linear infinite;
                        margin: 20px auto;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>⏳ Waiting for QR Code...</h1>
                    <div class="spinner"></div>
                    <p>The server is starting up. Refresh this page in a few seconds.</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; font-size: 16px; cursor: pointer; border: none; border-radius: 5px; background: white; color: #667eea;">
                        🔄 Refresh Page
                    </button>
                </div>
            </body>
            </html>
        `);
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>WhatsApp QR Code - Scan Me!</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-align: center;
                    padding: 20px;
                }
                .container {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                    max-width: 500px;
                }
                .qr-container {
                    background: white;
                    padding: 20px;
                    border-radius: 15px;
                    display: inline-block;
                    margin: 20px 0;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }
                img {
                    display: block;
                    max-width: 100%;
                    height: auto;
                }
                h1 {
                    margin-top: 0;
                    font-size: 28px;
                }
                .steps {
                    text-align: left;
                    margin: 20px 0;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .step {
                    margin: 10px 0;
                    padding-left: 10px;
                }
                .emoji {
                    font-size: 24px;
                    margin-right: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📱 Scan with WhatsApp</h1>
                <div class="qr-container">
                    <img src="${currentQRCode}" alt="WhatsApp QR Code" />
                </div>
                <div class="steps">
                    <div class="step"><span class="emoji">1️⃣</span>Open WhatsApp on your phone</div>
                    <div class="step"><span class="emoji">2️⃣</span>Go to Settings → Linked Devices</div>
                    <div class="step"><span class="emoji">3️⃣</span>Tap "Link a Device"</div>
                    <div class="step"><span class="emoji">4️⃣</span>Scan this QR code</div>
                </div>
                <p style="font-size: 14px; opacity: 0.8;">This page will automatically refresh if the QR code expires</p>
            </div>
            <script>
                // Auto-refresh after 30 seconds to get new QR if needed
                setTimeout(() => location.reload(), 30000);
            </script>
        </body>
        </html>
    `);
});

// Webhook endpoint for Upwork notifications
app.post('/webhook/upwork', async (req, res) => {
    console.log('📨 Received webhook from Upwork:', JSON.stringify(req.body, null, 2));

    try {
        // Parse the Upwork notification
        const notification = req.body;

        // Format the message for WhatsApp
        let message = '🔔 *Upwork Notification*\n\n';

        // Handle different types of notifications
        if (notification.type) {
            message += `📋 Type: ${notification.type}\n`;
        }

        if (notification.title) {
            message += `📌 ${notification.title}\n`;
        }

        if (notification.message || notification.body || notification.description) {
            const content = notification.message || notification.body || notification.description;
            message += `\n${content}\n`;
        }

        // Add timestamp
        message += `\n⏰ ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' })}`;

        // Add any additional data
        if (notification.client_name) {
            message += `\n👤 Client: ${notification.client_name}`;
        }

        if (notification.job_title) {
            message += `\n💼 Job: ${notification.job_title}`;
        }

        if (notification.amount) {
            message += `\n💰 Amount: $${notification.amount}`;
        }

        if (notification.link || notification.url) {
            message += `\n🔗 Link: ${notification.link || notification.url}`;
        }

        // If notification structure is unknown, send the whole payload
        if (!notification.type && !notification.title && !notification.message) {
            message += '\n📦 Raw Data:\n' + JSON.stringify(notification, null, 2);
        }

        // Send to WhatsApp
        if (isWhatsAppReady) {
            await whatsappClient.sendMessage(YOUR_WHATSAPP_NUMBER, message);
            console.log('✅ Notification sent to WhatsApp!');
            res.json({ success: true, message: 'Notification sent to WhatsApp' });
        } else {
            console.log('⚠️  WhatsApp not ready yet');
            res.status(503).json({ success: false, message: 'WhatsApp not ready' });
        }

    } catch (error) {
        console.error('❌ Error processing webhook:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Test endpoint to send a test message
app.post('/test', async (req, res) => {
    if (!isWhatsAppReady) {
        return res.status(503).json({ success: false, message: 'WhatsApp not ready yet' });
    }

    try {
        const testMessage = '*Test Message*\n\nYour Upwork to WhatsApp bridge is working! 🎉';
        await whatsappClient.sendMessage('923408828851@c.us', testMessage);
        res.json({ success: true, message: 'Test message sent!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook/upwork`);
    console.log(`🧪 Test URL: http://localhost:${PORT}/test`);
});
