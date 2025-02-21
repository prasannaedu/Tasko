from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from modeltranslation.translator import register, TranslationOptions
from googletrans import Translator
from django.db.models.signals import post_save
from django.dispatch import receiver

from tasko import settings

# Create your models here.


class Category(models.Model):
    name=models.CharField(max_length=200)
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.name

class Task(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=200)
    category=models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    PRIORITY_CHOICES = [('H', 'High'), ('M', 'Medium'), ('L', 'Low')]
    priority=models.CharField(max_length=1, choices=PRIORITY_CHOICES, default='M')  
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    photo=models.ImageField(upload_to='task_photos/', null=True, blank=True)
    due_date = models.DateTimeField(default=timezone.now)
    reminder=models.DateTimeField(null=True, blank=True)
    dark_mode=models.BooleanField(default=False)

    def __str__(self):
        return self.title
    
class Quote(models.Model):
    text=models.TextField()
    author=models.CharField(max_length=200)
    date_added=models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.text} - {self.author}"

class UserProfile(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE)
    avatar=models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio=models.TextField(null=True, blank=True)
    preferences=models.JSONField(default=dict)
    def __str__(self):
        return self.user.username

class Collaboration(models.Model):
    task=models.ForeignKey(Task, on_delete=models.CASCADE)
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    comment=models.TextField(blank=True, null=True)

    def __str__(self):#here __ __ this is called dunder method generally 
        return f"{self.user.username} on {self.task.title}"
    
class Badge(models.Model):
    name=models.CharField(max_length=200)
    description=models.TextField()

    def __str__(self):
        return self.name
class Achievement(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    badge=models.ForeignKey(Badge, on_delete=models.CASCADE)
    date_achieved=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.badge.name}"
def auto_translate_task(sender,instance,**kwargs):
    translator=Translator()
    for lang_code, lang_name in settings.LANGUAGES:
        if lang_code != 'en':
            translated_title=translator.translate(instance.title, dest=lang_code).text
            trnaslated_desc=translator.translate(instance.description, dest=lang_code).text
            setattr(instance, f'title_{lang_code}', translated_title)
            setattr(instance, f'description_{lang_code}', trnaslated_desc)

class Community(models.Model):
    name=models.CharField(max_length=200)
    description=models.TextField()
    created_by=models.ForeignKey(User, on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Post(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    community=models.ForeignKey(Community, on_delete=models.CASCADE)
    content=models.TextField()
    image=models.ImageField(upload_to='post_images/', null=True, blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    hashtags=models.CharField(max_length=200, null=True, blank=True)


    def __str__(self):
        return f"{self.user.username} in {self.community.name}"

class Challenge(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    community=models.ForeignKey(Community, on_delete=models.CASCADE)
    title=models.CharField(max_length=200)
    description=models.TextField()
    hashtag=models.CharField(max_length=50,unique=True)
    created_at=models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.title

class ChallengeParticipation(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    challenge=models.ForeignKey(Challenge, on_delete=models.CASCADE)
    joined_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} joined {self.challenge.title}"

from django.db.models.signals import pre_save
post_save.connect(auto_translate_task, sender=Task)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        print('Profile created!')
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()
    print('Profile saved!')