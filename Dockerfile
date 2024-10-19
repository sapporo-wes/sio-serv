FROM node:22.7.0-bookworm

LABEL org.opencontainers.image.authors="Graduate School of Medicine and School of Medicine, Chiba University <tazro.ohta@chiba-u.jp>"
LABEL org.opencontainers.image.url="https://github.com/sapporo-wes/sio-serv"
LABEL org.opencontainers.image.source="https://github.com/sapporo-wes/sio-serv/blob/main/Dockerfile"
LABEL org.opencontainers.image.version="0.1.0"
LABEL org.opencontainers.image.description="sapporo-wes/sio-serv, User-friendly web interface for executing workflows using the GA4GH Workflow Execution Service (WES) API."
# LABEL org.opencontainers.image.licenses="CC-BY-4.0"

WORKDIR /app
COPY package.json package-lock.json /app/

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["sleep", "infinity"]
