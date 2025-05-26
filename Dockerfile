# Step 1: Build frontend
FROM node:20 AS frontend-builder
WORKDIR /app/client

COPY src/client/package*.json ./
RUN npm install

COPY src/client ./
RUN npm run build

# Step 2: Build backend
FROM python:3.12-slim AS backend

# System deps
RUN apt-get update && apt-get install -y \
    build-essential \
    libsqlite3-dev \
 && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app/

# Copy pyproject + src
COPY pyproject.toml ./
COPY src/api ./src/api

# Install python dependencies
RUN pip install --upgrade pip \
 && pip install .

# Copy frontend build output into static directory
COPY --from=frontend-builder /app/client/dist ./src/api/static

# Expose volume for config and env files
VOLUME /app/config

# ENV overrides (optional)
ENV FLASK_ENV=production \
    PYTHONUNBUFFERED=1 \
    BEETMAN_CONFIG=/app/config/config.json \
    ENV_PATH=/app/.env

# Entrypoint to set env vars and run app
COPY config/.env ./.env
COPY create_user.py ./create_user.py
COPY src/api/wsgi.py ./wsgi.py

CMD [ "gunicorn", "-b", "0.0.0.0:5000", "wsgi:app" ]
