#to import rest_framework serializers moduel we use the following code
from rest_framework import serializers
from .models import Task , UserProfile, Category, Collaboration, Challenge, Community, Post, Badge, Achievement

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id','title','description','completed','title_en','title_es','title_te','title_hi','description_en','description_es','description_te','description_hi']
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio','avatar','preferences']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
class CollaborationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collaboration
        fields = '__all__'
    
class CommunitySerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    class Meta:
        model = Community
        fields = ['id','name','description','created_by','created_at']
    
    def validate_name(self,value):
        if Community.objects.filter(name=value).exists():
            raise serializers.ValidationError('A community with that name already exists')
        return value
    
class PostSerializer(serializers.ModelSerializer):
    user =serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Post
        fields = ['id','user','community','content','image','hashtags','created_at']
    
class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = '__all__'
