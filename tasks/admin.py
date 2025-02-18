from django.contrib import admin
from .models import Task, Category, Quote, UserProfile, Collaboration, Community, Post, Challenge
from modeltranslation.admin import TranslationAdmin
# Register your models here.

class TaskAdmin(TranslationAdmin):
    list_display=('title','description','user')

admin.site.register(Task)
admin.site.register(UserProfile)