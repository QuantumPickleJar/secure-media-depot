# Use an official Python runtime (ARM compatible for Raspberry Pi)
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Install tc for network shaping
RUN apt-get update && \
    apt-get install -y iproute2 && \
    rm -rf /var/lib/apt/lists/*

# Copy project files
COPY . /app/

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Create uploads directory (will be mounted as a volume)
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 8081

# Set resource limits (CPU and memory) via Docker Compose or run command
# ENTRYPOINT and CMD
ENTRYPOINT ["/entrypoint.sh"]
CMD ["python", "app.py"]
