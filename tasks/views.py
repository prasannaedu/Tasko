from django.shortcuts import render
from .models import Task, UserProfile, Category, Quote, Collaboration, Community, Post, Challenge
from .serializers import TaskSerializer, UserProfileSerializer, CategorySerializer, CommunitySerializer, PostSerializer, ChallengeSerializer, UserSerializer
from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Count
from django.contrib.auth.models import User
import csv
from django.http import HttpResponse
from rest_framework.pagination import PageNumberPagination
from tasks import models

# Create your views here.
class TaskList(generics.ListCreateAPIView):
    # queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user
        priority = self.request.query_params.get('priority',None)
        queryset=Task.objects.filter(user=user)
        if priority:
            queryset=queryset.filter(priority=priority)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer 
    def perform_update(self, serializer):
        serializer.save(user=self.request.user)  # Ensure the user is preserved

class CompleteTask(generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        task.completed = True
        task.completed_at = timezone.now()
        task.save()
        serializer = self.get_serializer(task)
        # return Response({'status': 'task completed (serializer.data)'} )
        return Response({'status': 'task completed', 'data': serializer.data})
class DeleteTask(generics.DestroyAPIView):
    get_queryset = Task.objects.all()
    serializer_class = TaskSerializer


    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(user=user)

    def perform_update(self, serializer):
        serializer.instance.completed = True
        serializer.instance.completed_at = timezone.now()
        serializer.save()

    #to return a message after deleting a task
    def delete(self, request, *args, **kwargs):
        task = self.get_object()
        task.delete()
        serializer = self.get_serializer(task)
        return Response({'status': 'task deleted','data':serializer.data})
    
class DailyQuote(APIView):
    def get(self, request):
        quote = Quote.objects.order_by('-date_added').first()
        print(quote)
        if quote :
            data={'text':quote.text, 'author':quote.author}
            return Response(data)
        return Response({'text': 'Stay motivated!','author':'Tasko'})

class WeeklyPerformance(APIView):
    def get(self, request):
        user = request.user
        tasks = Task.objects.filter(user=user)
        start_of_week = timezone.now() - timezone.timedelta(days=timezone.now().weekday())#
        start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        completed_tasks = tasks.filter(user=user, completed=True,completed_at__gte=start_of_week).count()
        #to filter the tasks that are completed in the current week we use the following code   
        total_tasks = 5*7
        print(tasks)
        print("Start of the week (midnight)", start_of_week)
        print("Completed tasks in the week:", completed_tasks)
        score=(completed_tasks/total_tasks)*100
        return Response({'score':round(score,2)})

class ShareTask(APIView):
    # def post(self, request):
    #     task_id = request.data.get('task_id')
    #     task = Task.objects.get(id=task_id)
    #     task.shared = True
    #     task.save()
    #     return Response({'status': 'task shared'})
    
    def get(self, request,task_id):
        task = Task.objects.get(id=task_id)
        sharable_text = f"I just completed : {task.title}\n Description: {task.description}\n"
        return Response({'sharable_text': sharable_text})   
    
    # def delete(self, request):
    #     task_id = request.data.get('task_id')
    #     task = Task.objects.get(id=task_id)
    #     task.shared = False
    #     task.save()
    #     return Response({'status': 'task unshared'})

class RegisterUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if User.objects.filter(username=request.data['username']).exists():
            print('Username already exists')
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=request.data['email']).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': UserSerializer(user).data,
                'message': 'User registered successfully.',
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfile(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()


    def get_object(self):
        return self.request.user.userprofile

    def perform_update(self, serializer):
        serializer.save(partial=True)
    
class Dashboard(APIView):

    def get(self, request):
        user = request.user
        tasks = Task.objects.filter(user=user)
        completed_tasks = tasks.filter(completed=True).count()
        streaks=0
        data={
            'completed_tasks':completed_tasks,
            'streaks':streaks
        }
        return Response(data)
    

class CategoryList(generics.ListCreateAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  


class SetReminder(generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def update(self, request, *args, **kwargs):
        task=self.get_object()
        task.reminder = request.data.get('reminder')
        task.save()
        return Response({'status':'reminder set'})


class Collaboration(generics.ListCreateAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        task_id = self.kwargs['task_id']
        return Collaboration.objects.filter(task_id=task_id)
    def perform_create(self, serializer):
        task_id = self.kwargs['task_id']
        serializer.save(task_id=task_id, user=self.request.user)
class Leaderboard(APIView):
    def get(self, request):
        leaderboard=User.objects.annotate(
            completed_tasks=Count('task', filter=models.Q(task__completed=True)))
        leaderboard=leaderboard.order_by('-completed_tasks')[:10]
        data=[{'username':user.username, 'completed_tasks':user.completed_tasks} for user in leaderboard]
        return Response(data)
    
class ExportTasks(APIView):
    def get(self,request):
        user=request.user
        tasks=Task.objects.filter(user=user)
        response=HttpResponse(content_type='text/csv')
        response['Content-Disposition']='attachment; filename="tasks.csv"'
        writer=csv.writer(response)
        writer.writerow(['Title','Completed','Created At'])
        for task in tasks:
            writer.writerow([task.title,task.completed,task.created_at])
        return response

class ToggleDarkMode(APIView):
    def post(self, request):
        profile=request.user.userprofile
        profile.dark_mode=not profile.dark_mode
        profile.save()
        return Response({'status':'dark mode toggled'})

class CommunityList(generics.ListCreateAPIView):
    serializer_class = CommunitySerializer
    queryset=Community.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    

class PostList(generics.ListCreateAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        post_type = self.request.query_params.get('type', 'public')
        if post_type == 'community':
            community_id = self.kwargs.get('community_id')
            return Post.objects.filter(community_id=community_id, post_type='community')
        return Post.objects.filter(post_type='public')

    def perform_create(self, serializer):
        post_type = self.request.data.get('post_type', 'public')
        community_id = self.request.data.get('community_id')
        serializer.save(user=self.request.user, post_type=post_type, community_id=community_id)
class PublicPostList(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.filter(post_type='public')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, post_type='public')

    
class ChallengeList(generics.ListCreateAPIView):
    serializer_class = ChallengeSerializer
    def get_queryset(self):
        community_id=self.kwargs['community_id']
        return Challenge.objects.filter(community_id=community_id)
    
    def perform_create(self, serializer):
        community_id=self.kwargs['community_id']
        serializer.save(user=self.request.user, community_id=community_id)

class TrendingHashtags(APIView):
    def get(self,request):
        hashtags=Post.objects.values('hashtags').annotate(count=Count('hashtags')).order_by('-count')[:10]
        return Response(hashtags)
    
class UserPosts(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)