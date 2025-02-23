# generate_secret_key.py

from django.core.management.utils import get_random_secret_key

secret_key = get_random_secret_key()
print("Your new Django SECRET_KEY is:", secret_key)
