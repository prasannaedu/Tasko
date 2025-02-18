from __future__ import absolute_import, unicode_literals

# This will ensure the Celery app is loaded when Django starts
from .celery_config import app as celery_app

__all__ = ('celery_app',)
# default_app_config = 'tasks.apps.TasksConfig'

