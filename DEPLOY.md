# DEPLOY.md — put this app on your OWN server

> **Claude: the student wants to deploy this app to their own cloud server.**
> Follow these steps. You'll need three things from the student: the server's
> **IP address**, the **SSH username**, and the path to their **SSH key file**
> (`.pem`). Ask for any you don't have. Explain each step in plain language and
> pause if something needs the student's input.

This is the "graduation" step: your app moves from the course server to a server
**you** own and control.

## ⚠️ Read first (money + safety)
- A cloud server **costs real money** and requires a **credit card**. Know your
  plan's price before you start.
- **Only ever give Claude an SSH key for a server you own.**
- **Delete/stop the server when you're done** so you don't keep getting charged.

## What Claude will do
The app just needs `npm install` → `npm start` and it listens on `PORT`. On your
own server we serve it at the root of the machine (no `/s/...` path), with nginx
in front on port 80.

### Steps (Claude runs these over SSH)
1. **Connect** (fix key permissions first, or SSH refuses it):
   ```bash
   chmod 600 <path-to-key.pem>
   ssh -i <path-to-key.pem> <username>@<server-ip>
   ```
   (Common usernames: `ubuntu` for an Ubuntu server, `bitnami` for a Bitnami
   image. Ask the student if unsure.)

2. **Install the tools** (Debian/Ubuntu shown):
   ```bash
   sudo apt-get update
   sudo apt-get install -y git nginx
   # Node.js 20 LTS:
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

3. **Get the app** (this repo is public, so cloning needs no password):
   ```bash
   git clone <this-repo's-https-url> ~/app
   cd ~/app
   npm install
   npm run build
   ```

4. **Run it, kept alive by pm2**, on an internal port (3000):
   ```bash
   PORT=3000 pm2 start npm --name myapp -- start
   pm2 save
   sudo env PATH=$PATH pm2 startup systemd -u $USER --hp $HOME   # survive reboots
   ```

5. **Put nginx in front** so the world reaches it on port 80. Create
   `/etc/nginx/sites-available/myapp`:
   ```nginx
   server {
       listen 80 default_server;
       server_name _;
       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   Then enable it and reload:
   ```bash
   sudo ln -sf /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo nginx -t && sudo systemctl restart nginx
   ```

6. **Open the firewall.** Claude can't change the cloud provider's firewall —
   **tell the student** to allow **HTTP (port 80)** (and 443 for HTTPS) in their
   provider's console:
   - **Lightsail:** instance → *Networking* → add rule HTTP / 80.
   - **Google Cloud:** allow "HTTP traffic" on the VM (checkbox), or a firewall
     rule for tcp:80.

7. **Visit it:** `http://<server-ip>/` — your app is live on your own server! 🎉

### Redeploying later
```bash
ssh -i <key> <user>@<ip> "cd ~/app && git pull && npm install && npm run build && pm2 restart myapp"
```

### Optional: a real domain + HTTPS
If the student has a domain, point an A record at the server IP, then:
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d their-domain.com
```

When the student is finished showing off their app, **remind them to delete the
server** in their cloud console to stop charges.
