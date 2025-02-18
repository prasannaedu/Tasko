from modeltranslation.translator import register, TranslationOptions
from .models import Task, Quote


@register(Task)
class TaskTranslationOptions(TranslationOptions):
    fields = ('title', 'description')

