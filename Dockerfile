FROM node:20.16.0-bookworm-slim

# Environment for reproducibility
ENV TZ=UTC \
    PUPPETEER_CACHE_DIR=/opt/puppeteer \
    PUPPETEER_SKIP_DOWNLOAD=0 \
    NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    fonts-noto-color-emoji \
    libasound2 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxshmfence1 \
    libgbm1 \
    libgtk-3-0 \
    libnss3 \
    libxss1 \
    libxext6 \
    libx11-6 \
    libxtst6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only manifests first for layer caching
COPY package.json package-lock.json ./
COPY danivi-style/package.json ./danivi-style/package.json
COPY danivi-long-style/package.json ./danivi-long-style/package.json
RUN npm ci && npm install ./danivi-style && npm install ./danivi-long-style

# Pre-fetch Chromium tied to pinned Puppeteer version for deterministic binary
RUN node -e "require('puppeteer');"

# Now copy the rest of the project
COPY . .

# Default command: render HTML, generate PDF & TXT, and checksum
CMD ["sh", "-c", "npx resumed render resume.json --theme jsonresume-theme-danivi-style --output index.html && node generate-pdf.js && node generate-txt.js && sha256sum resume.pdf | tee resume.pdf.sha256 && ls -l resume.pdf resume.txt resume.pdf.sha256 index.html"]
