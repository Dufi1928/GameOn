from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import path
from .consumers import OnlineConsumer
from messaging import routing as messaging_routing


application = ProtocolTypeRouter({
    'https': get_asgi_application(),
    'websocket': AllowedHostsOriginValidator(
        URLRouter([
            path('ws/', OnlineConsumer.as_asgi()),
            *messaging_routing.websocket_urlpatterns,
        ])
    ),
})