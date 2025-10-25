FROM n8nio/n8n:latest

USER root

# Create a writable directory for persistence
RUN mkdir -p /data/files && chmod -R 777 /data/files

# Set n8n user folder
ENV N8N_USER_FOLDER=/data/files

# ✅ Add your production webhook + CORS configuration
ENV N8N_WEBHOOK_URL=https://ai-resume-screener-production.up.railway.app
ENV N8N_EDITOR_BASE_URL=https://ai-resume-screener-production.up.railway.app
ENV N8N_CORS_ALLOW_ORIGINS=https://ai-resume-screenerr.netlify.app
ENV N8N_CORS_ALLOW_METHODS=GET,POST,PUT,PATCH,DELETE,OPTIONS
ENV N8N_CORS_ALLOW_HEADERS=Accept,Content-Type,Content-Length,Authorization,Origin,Referer,User-Agent,Cache-Control,X-Requested-With
ENV N8N_CORS_ALLOW_CREDENTIALS=true
ENV N8N_PROTOCOL=https
ENV N8N_HOST=0.0.0.0
ENV N8N_PORT=5678

EXPOSE 5678

# Run as root for writing permissions (since we need persistence)
CMD ["n8n", "start"]
