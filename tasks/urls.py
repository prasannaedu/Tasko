from django.urls import path
from .views import TaskList, CompleteTask, DeleteTask, DailyQuote, WeeklyPerformance, ShareTask, UserProfile, Dashboard, CategoryList, SetReminder, Collaboration, Leaderboard, ExportTasks, ToggleDarkMode, WeeklyPerformance, DailyQuote, ShareTask, UserProfile, Dashboard, CategoryList, SetReminder, Collaboration, Leaderboard, ExportTasks, ToggleDarkMode, PostList, CommunityList, RegisterUser,TaskDetail,UserPosts,PublicPostList, UserProfileUpdateView, PostViewSet, CommentCreateView, SavedPostsView, PostDetail
from django.conf import settings
from django.views.static import serve

urlpatterns = [
    path('tasks/', TaskList.as_view(), name='task_list'),
    path('tasks/<int:pk>/', TaskDetail.as_view(), name='task_detail'),
    path('tasks/<int:pk>/complete/', CompleteTask.as_view(), name='complete_task'),
    path('tasks/<int:pk>/delete/', DeleteTask.as_view(), name='delete_task'),
    path('quote/',DailyQuote.as_view(), name='daily_quote'),
    path('weekly-performance/',WeeklyPerformance.as_view(), name='weekly_performance'),
    path('tasks/<int:task_id>/share/', ShareTask.as_view(), name='share_task'),
    path('profile/', UserProfile.as_view(), name='user_profile'),
    path('dashboard/', Dashboard.as_view(), name='dashboard'),
    path('categories/', CategoryList.as_view(), name='category_list'),
    path('tasks/<int:pk>/set-reminder/', SetReminder.as_view(), name='set-reminder'),
    path('tasks/<int:task_id>/collaborate/', Collaboration.as_view(), name='collaborate'),
    path('leaderboard/', Leaderboard.as_view(), name='leaderboard'),
    path('export-tasks/', ExportTasks.as_view(), name='export_tasks'),
    path('toggle-dark-mode/',ToggleDarkMode.as_view(), name='toggle_dark_mode'),
    path('communities/', CommunityList.as_view(), name='community_list'),
    path('communities/<int:community_id>/posts/', PostList.as_view(), name='post_list'),
    path('register/', RegisterUser.as_view(), name='register_user'),
    path('profile/posts/', UserPosts.as_view(), name='user_posts'),
    path('posts/public/', PublicPostList.as_view(), name='public_posts'),
    path('posts/<int:pk>/like/', PostViewSet.as_view({'post': 'like'}), name='like_post'),
    path('posts/<int:pk>/save/', PostViewSet.as_view({'post': 'save_post'}), name='save_post'),
    path('posts/<int:post_id>/comment/', CommentCreateView.as_view(), name='create_comment'),
    path('profile/saved_posts/', SavedPostsView.as_view(), name='saved_posts'),
    path('posts/<int:pk>/', PostDetail.as_view(), name='post_detail'),
    path('posts/<int:pk>', PostDetail.as_view()),



    path('media/<path:path>', serve,{'document_root':settings.MEDIA_ROOT}),

]