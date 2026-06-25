FROM php:8.4-apache

RUN apt-get update && apt-get install -y \
    git curl zip unzip libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite \
    && a2enmod rewrite \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --optimize-autoloader
RUN cp .env.example .env
RUN php artisan key:generate
RUN mkdir -p database && touch database/database.sqlite
RUN php artisan migrate --force
RUN chown -R www-data:www-data storage bootstrap/cache database

ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -i 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf

EXPOSE 80
