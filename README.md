# 🚀 Upwork to WhatsApp Bridge

Automatically receive all your Upwork notifications directly in WhatsApp! Never miss a client message, proposal acceptance, or contract update again.

## ✨ Features

- 🔔 **Real-time Notifications** - Get instant WhatsApp alerts for all Upwork activity
- 📱 **WhatsApp Group Support** - Send to personal chat or WhatsApp groups
- 🐳 **Dockerized** - Easy deployment with persistent sessions
- 🌐 **Web QR Scanner** - Beautiful browser-based QR code interface
- 🔄 **Auto-reconnect** - Maintains WhatsApp connection automatically
- 💾 **Session Persistence** - No need to re-scan QR after restarts
- 🆓 **100% Free** - Can be hosted completely free on Railway/Render

## 🎯 What Gets Notified

- ✅ New client messages
- ✅ Proposal acceptances/rejections
- ✅ Job invitations
- ✅ Contract updates
- ✅ Payment notifications
- ✅ Any Upwork webhook event!

## 📸 Screenshots

Messages appear in WhatsApp like:
```
🔔 Upwork Notification

📋 Type: message
📌 New message from John Doe

Hey! I loved your proposal. When can we start?

👤 Client: John Doe
💼 Job: Website Development Project
💰 Amount: $500
🔗 Link: https://upwork.com/messages/123

⏰ 2/14/2026, 10:30:00 AM
```

## 🚀 Quick Start

### **Option 1: Docker (Recommended)**

```bash
# Clone/download the repository
cd upwork-whatsapp-bridge

# Edit server.js - set your WhatsApp number/group
# Line 10: const YOUR_WHATSAPP_NUMBER = '120363404438498488@g.us';

# Start with Docker Compose
docker-compose up -d

# View logs and scan QR code
docker-compose logs -f

# Or open in browser
open http://localhost:3000/qr

# Test it
curl -X POST http://localhost:3000/test
```

### **Option 2: Node.js (Local)**

```bash
# Install dependencies
npm install

# Edit server.js with your WhatsApp number

# Run
npm start

# Scan QR code at http://localhost:3000/qr

# Test
curl -X POST http://localhost:3000/test
```

## 📋 Prerequisites

**For Docker:**
- Docker & Docker Compose installed
- WhatsApp on your phone

**For Node.js:**
- Node.js v18+ installed
- WhatsApp on your phone

## 🔧 Configuration

### **WhatsApp Number/Group Format**

Edit `server.js` line 10:

```javascript
// For WhatsApp Group (Recommended - works for self-notifications)
const YOUR_WHATSAPP_NUMBER = '120363404438498488@g.us';

// For Individual Number (won't work for self-notifications)
const YOUR_WHATSAPP_NUMBER = '923001234567@c.us';
```

**How to get your Group ID:**
Run this script to see all your groups:
```javascript
// See DOCKER_DEPLOYMENT.md for full script
```

### **Environment Variables**

Can be set in `docker-compose.yml` or `.env`:

```env
WHATSAPP_NUMBER=120363404438498488@g.us
PORT=3000
NODE_ENV=production
```

## 🌐 Deployment Options

### **Railway.app (Easiest - Free)**
- 500 hours/month free
- Automatic HTTPS
- Easy GitHub integration
- See `DOCKER_DEPLOYMENT.md` for details

### **Render.com (Free)**
- Free tier available
- Auto-sleeps after inactivity
- Wakes up on requests
- See `DOCKER_DEPLOYMENT.md` for details

### **VPS (DigitalOcean, AWS, etc.)**
- $4-6/month
- Always running
- Full control
- See `DOCKER_DEPLOYMENT.md` for details

## 🔗 Connect to Upwork

1. Log into Upwork
2. Go to **Settings → Integrations**
3. Find **Custom Webhook**
4. Add webhook URL:
   ```
   https://your-deployment-url.com/webhook/upwork
   ```
5. Select all notification types
6. Save!

## 🧪 Testing

### **Test Endpoint**
```bash
curl -X POST http://localhost:3000/test
```

### **Simulate Upwork Notification**
```bash
curl -X POST http://localhost:3000/webhook/upwork \
  -H "Content-Type: application/json" \
  -d '{
    "type": "message",
    "title": "New message from Client",
    "message": "When can you start?",
    "client_name": "John Doe"
  }'
```

### **Health Check**
```bash
curl http://localhost:3000/
```

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check & status |
| `/qr` | GET | WhatsApp QR code scanner |
| `/test` | POST | Send test message |
| `/webhook/upwork` | POST | Upwork webhook receiver |

## 🛠️ Docker Commands

```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Restart
docker-compose restart

# Rebuild after changes
docker-compose up -d --build

# Remove everything (including session)
docker-compose down -v
```

**Or use the Makefile:**
```bash
make start    # Start container
make logs     # View logs
make test     # Send test message
make qr       # Open QR in browser
make help     # See all commands
```

## 🐛 Troubleshooting

### **Not receiving messages?**
- Check your WhatsApp number/group format
- Verify WhatsApp is connected (check logs)
- Note: Can't send to yourself, use a group instead

### **QR code not showing?**
- Visit `http://localhost:3000/qr` in browser
- Or check logs: `docker-compose logs -f`

### **Container won't start?**
- Check if port 3000 is already in use
- View error logs: `docker-compose logs`

### **Session lost after restart?**
- Don't use `docker-compose down -v` (deletes session)
- Check volumes in `docker-compose.yml`

## 📁 Project Structure

```
upwork-whatsapp-bridge/
├── server.js              # Main application
├── package.json           # Dependencies
├── Dockerfile            # Docker image config
├── docker-compose.yml    # Docker orchestration
├── Makefile             # Command shortcuts
├── DOCKER_DEPLOYMENT.md # Detailed deployment guide
└── README.md            # This file
```

## 🔒 Security Notes

- WhatsApp session is stored locally (not in database)
- No API keys needed (uses WhatsApp Web)
- Webhook endpoint has no authentication by default
- For production: Add webhook secret validation

## 📝 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Found a bug? Have a feature request? Pull requests welcome!

## 💡 Tips

1. **Use a WhatsApp Group** for self-notifications (can't send to yourself directly)
2. **Keep it running** with a free uptime monitor (UptimeRobot)
3. **Backup session** periodically: `make backup`
4. **Check logs** if something goes wrong
5. **Update regularly** for latest features

## 🎉 Success!

Once set up, you'll receive every Upwork notification in WhatsApp automatically. No more constantly checking Upwork!

---

**Questions?** Check `DOCKER_DEPLOYMENT.md` for detailed deployment instructions.

**Star this repo** if it helped you! ⭐

## Made with ❤️ by Muhammad Abbas
