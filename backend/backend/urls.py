from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('games.urls')),
    path('api/', include('friends.urls')),
    path('api/', include('blogs.urls')),
    path('api/', include('messaging.urls')),
    path('api/', include('guides.urls')),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)