FROM node:18
LABEL maintainer="PayrollPortal"

WORKDIR /var/app

COPY package.json package-lock.json ./  
RUN npm install --force


COPY ./ ./

RUN npx prisma generate
RUN npm run build
CMD ["npm", "run", "start:prod"]
