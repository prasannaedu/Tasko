from django.urls import path
from .views import TaskList, CompleteTask, DeleteTask, DailyQuote, WeeklyPerformance, ShareTask, UserProfile, Dashboard, CategoryList, SetReminder, Collaboration, Leaderboard, ExportTasks, ToggleDarkMode, WeeklyPerformance, DailyQuote, ShareTask, UserProfile, Dashboard, CategoryList, SetReminder, Collaboration, Leaderboard, ExportTasks, ToggleDarkMode, PostList, CommunityList


urlpatterns = [
    path('tasks/', TaskList.as_view(), name='task_list'),
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

]