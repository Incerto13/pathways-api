# Use the official MongoDB image as base
FROM mongo:latest

# Update the apt repository and install MongoDB shell client tools
RUN apt-get update && apt-get install -y \
  mongodb-org-shell \
  && rm -rf /var/lib/apt/lists/*  # Clean up to reduce image size

# Expose the default MongoDB port
EXPOSE 27017
