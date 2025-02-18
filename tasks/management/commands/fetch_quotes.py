from django.core.management.base import BaseCommand
import requests
from tasks.models import Quote
import os
from dotenv import load_dotenv

load_dotenv()

class Command(BaseCommand):
    help = 'Fetches a quote from the internet and saves it to the database'

    def handle(self, *args, **kwargs):
        url = 'https://quotes15.p.rapidapi.com/quotes/random/'
        headers = {
            "X-RapidAPI-Key": os.getenv('XAPI_KEY'),  # Ensure this matches your .env variable
            "X-RapidAPI-Host": "quotes15.p.rapidapi.com"
        }
        params = {"language_code": "en"}

        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()  # Raise exception for HTTP errors

            data = response.json()
            
            # Validate the API response structure
            print(data)
            if 'content' in data and 'originator' in data and 'name' in data['originator']:
                Quote.objects.create(
                    text=data['content'],
                    author=data['originator']['name']
                )
                self.stdout.write(self.style.SUCCESS('Successfully fetched a quote'))
            else:
                self.stdout.write(self.style.WARNING('Unexpected API response format'))

        except requests.exceptions.RequestException as e:
            self.stdout.write(self.style.ERROR(f'API request failed: {str(e)}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))