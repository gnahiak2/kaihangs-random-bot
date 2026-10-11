# ==========================================
# Base Stage
# ==========================================
FROM python:alpine AS base
WORKDIR /app

# ==========================================
# Production Release Stage
# ==========================================
FROM base AS release

# Set environment variables for Python performance and logging
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Create a system group and user to avoid running the container as root
RUN addgroup -g 1000 appgroup && \
    adduser -u 1000 -G appgroup -D appuser

# Copy package files first to maximize Docker layer caching
COPY --chown=appuser:appgroup requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy your source code
COPY --chown=appuser:appgroup . .

# Run as a non-root user for security
USER appuser

# Run your Python Slack bot script
CMD ["python", "main.py"]
