from celery_config import shared_task
from django.utils import timezone
from .models import Task
from django.core.mail import send_mail

@shared_task
def delete_old_tasks():
    twenty_four_hours_ago = timezone.now() - timezone.timedelta(hours=24)
    Task.objects.filter(completed=False, due_date__lte=timezone.now).delete()

@shared_task
def send_reminders():
    now = timezone.now()
    tasks = Task.objects.filter(reminder__lte=now,completed=False)
    for task in tasks:
        send_mail(
            'Task Reminder',
            f'You have a task "{task.title}" due at {task.due_date}',
            'reply@tasko.com',
            [task.user.email],
            fail_silently=False,)
        task.reminder=None
        task.save()