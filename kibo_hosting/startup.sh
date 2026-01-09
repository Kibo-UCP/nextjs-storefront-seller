dotnet /app/tools/net6.0/any/Mozu.Core.ConfigXformer.dll -d . -e docker_template
sed -i 's/^KIBO_APPDEV_HOST=http:\/\//KIBO_APPDEV_HOST=/' .env
sed -i 's/^KIBO_ADMIN_USER_HOST=http:\/\//KIBO_ADMIN_USER_HOST=/' .env

# Allow self-signed certificates for internal API calls
export NODE_TLS_REJECT_UNAUTHORIZED=0

npm run start