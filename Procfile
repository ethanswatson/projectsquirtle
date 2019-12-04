release: python src/manage.py makemigrations && python src/manage.py migrate --noinput
web: cd src && daphne projectsquirtle.asgi:quizapp --port $PORT --bind 0.0.0.0