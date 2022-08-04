FROM node:18-slim as base
ENV NODE_ENV=production
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    tini@0.19.0 \
    && rm -rf /var/lib/apt/lists/*
EXPOSE 3000
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node package.json package-lock*.json ./
RUN npm ci --only=production && npm cache clean --force

# expose node inspector debug port
# use this stage using docker compose and mount 
FROM base as develop
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH
RUN npm install --only=development
EXPOSE 9320
CMD ["npm", "run", "debug" ]

FROM base as source
COPY --chown=node:node . .

FROM source as test
ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH
COPY --from=develop /app/node_modules /app/node_modules
CMD ["npm", "run", "test"]

# npm audit and trivy CVE vulnarebility scan
FROM source as audit
RUN npm audit
# --audit-level critical
ENV TRIVY_VERSION=0.30.4
# Use BuildKit to help translate architecture names
ARG TARGETPLATFORM
USER root
RUN case ${TARGETPLATFORM} in \
    "linux/amd64")  ARCH=64bit  ;; \
    "linux/arm64")  ARCH=ARM64  ;; \
    "linux/arm/v7") ARCH=ARM    ;; \
  esac \
  && apt-get -qq update \
  && apt-get -qq install -y ca-certificates wget --no-install-recommends \
  && wget -O trivy.deb -qSL https://github.com/aquasecurity/trivy/releases/download/v${TRIVY_VERSION}/trivy_${TRIVY_VERSION}_Linux-${ARCH}.deb \
  && dpkg -i trivy.deb
RUN trivy rootfs --severity "HIGH,CRITICAL" --exit-code 1 --no-progress --security-checks vuln /

# clean production image
FROM source as prod
USER node
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["/app/node_modules/.bin/fastify", "start", "--log-level", "info", "src/app.js"]
