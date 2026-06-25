FROM webdevops/php-apache:8.4

ENV WEB_DOCUMENT_ROOT=/app/public
ENV PHP_DISPLAY_ERRORS=0

WORKDIR /app
COPY . .

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --optimize-autoloader
RUN cp .env.example .env
RUN php artisan key:generate
RUN mkdir -p database && touch database/database.sqlite
RUN sed -i 's|DB_DATABASE=.*|DB_DATABASE=/app/database/database.sqlite|g' .env
RUN php artisan migrate --force
RUN chown -R application:application storage bootstrap/cache database

EXPOSE 80
