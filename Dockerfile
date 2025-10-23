FROM n8nio/n8n:latest

# Make sure the /home/node/.n8n directory exists and is writable
USER root
RUN mkdir -p /home/node/.n8n && chown -R node:node /home/node/.n8n

# Switch back to node user (best practice)
USER node

EXPOSE 5678
CMD ["n8n", "start"]
