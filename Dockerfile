FROM n8nio/n8n:latest

USER root

# Create a writable subdirectory inside Railway’s mounted volume
RUN mkdir -p /data/files && chmod -R 777 /data/files

# Set n8n user folder to that writable path
ENV N8N_USER_FOLDER=/data/files

EXPOSE 5678

# Run as root permanently so we can always write inside mounted volumes
CMD ["n8n", "start"]
