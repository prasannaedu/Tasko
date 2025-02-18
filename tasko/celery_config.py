import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tasko.settings')

# Create an instance of Celery
app = Celery('tasko')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - 'celeryconfig' is the module that will be used for configuration.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

# This is the key part that resolves the circular import issue.
@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
