ARG IMAGE_TAG=latest
FROM ghcr.io/prompt-edu/prompt/prompt-clients-base:${IMAGE_TAG} AS core-base

# Yarn's node-modules linker can exceed the default V8 heap limit for this workspace in CI.
ENV NODE_OPTIONS=--max-old-space-size=6144

WORKDIR /app/github_challenge_component
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

COPY . ./

RUN yarn build

# Build the final image
FROM nginx:stable-alpine

COPY --from=core-base /app/github_challenge_component/build /usr/share/nginx/html
COPY --from=core-base /app/github_challenge_component/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
