FROM n8nio/n8n:latest

# Run as root temporarily
USER root

# Create the directory & fix permissions
RUN mkdir -p /home/node/.n8n && \
    chown -R node:node /home/node/.n8n && \
    chmod -R 775 /home/node/.n8n

# Switch back to node user
USER node

# Set the working directory
WORKDIR /home/node

# Expose the default n8n port
EXPOSE 5678

# Start n8n
CMD ["n8n", "start"]
