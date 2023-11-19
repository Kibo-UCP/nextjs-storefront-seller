# Use the official Node.js 21 image as a parent image
FROM node:21-alpine

# Set the working directory
WORKDIR /app

# install curl, dotnet , and the config xformer
RUN apk add aspnetcore6-runtime &&\
    apk add curl &&\
    curl -L -o config_xformer.zip http://ng-repo.dev.kibocommerce.com:8081/repository/nuget-localbuild/Mozu.Core.ConfigXformer/2.2342.2 &&\
    unzip config_xformer.zip -d /app &&\
    rm config_xformer.zip


# Copy package.json and package-lock.json
COPY ./package.json ./
COPY ./package-lock.json ./

# Install npm packages
RUN npm install --force 

# Copy the rest of the application code , startup code, and mock test results
COPY ./ ./
COPY ./kibo_hosting ./
COPY ./kibo_hosting/TestResults.xml /buildoutput/testoutput/TestResults.xml

RUN npm run build

ENTRYPOINT [ "sh", "startup.sh" ]

