#to import rest_framework serializers moduel we use the following code
from rest_framework import serializers
from .models import Task , UserProfile, Category, Collaboration, Challenge, Community, Post, Badge, Achievement, Comment
from django.contrib.auth.models import User

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id','title','description','priority','completed','due_date','title_en','title_es','title_te','title_hi','description_en','description_es','description_te','description_hi']
    
class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    avatar=serializers.ImageField(allow_null=True, required=False)
    cover_image=serializers.ImageField(allow_null=True, required=False)
    class Meta:
        model = UserProfile
        fields = ['user','username','bio', 'avatar', 'cover_image', 'mobile_number', 'joined_date', 'preferences']
        read_only_fields = ['user']

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
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'text', 'created_at']
    
class PostSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    image = serializers.ImageField(required=False)
    likes_count = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'community', 'content', 'image','likes_count', 
                 'comments', 'is_liked', 'is_saved', 'hashtags', 'created_at', 'post_type']
    def get_likes_count(self, obj):
            return obj.likes.count()

    def get_is_liked(self, obj):
        user = self.context['request'].user
        return user.is_authenticated and obj.likes.filter(id=user.id).exists()

    def get_is_saved(self, obj):
        user = self.context['request'].user
        return user.is_authenticated and obj.saved_by.filter(id=user.id).exists()
class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Ensure password is write-only

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
