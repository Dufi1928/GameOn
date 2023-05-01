from django.contrib.auth.models import User
import datetime
import jwt
import requests
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import User  # import the User model from your app
from .serializers import UserSerializer


def generate_jwt(user):
    payload = {
        'id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
        'iat': datetime.datetime.utcnow()
    }
    return jwt.encode(payload, 'secret', algorithm='HS256')


def authenticate_user(email, password=None):
    user = User.objects.filter(email=email).first()

    if not user:
        return None

    if password and not user.check_password(password):
        return None

    return user


class Register(APIView):
    @staticmethod
    def post(request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class Login(APIView):
    @staticmethod
    def post(request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate_user(email, password)

        if not user:
            raise AuthenticationFailed('User not found or incorrect password')

        token = generate_jwt(user)
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {'jwt': token}

        user.is_active = True
        user.save()

        return response


class SocialLogin(APIView):
    @staticmethod
    def verify_social_token(provider, access_token):
        if provider == 'google':
            url = f"https://www.googleapis.com/oauth2/v3/tokeninfo?access_token={access_token}"
        elif provider == 'facebook':
            url = f"https://graph.facebook.com/v12.0/me?fields=email&access_token={access_token}"
        else:
            return None

        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as error:
            print(f"{provider.capitalize()} authentication error: {error}")
            print(f"URL: {url}")
            print(f"Access token: {access_token}")
        return None

    @staticmethod
    def social_auth(provider, access_token):
        user_data = SocialLogin.verify_social_token(provider, access_token)

        if not user_data:
            return None

        email = user_data.get('email')
        user = authenticate_user(email)

        if not user:
            user = User.objects.create_user(username=email.split('@')[0], email=email, password='')

        user.is_active = True
        user.save()

        return user

    @staticmethod
    def post(request):
        access_token = request.data.get('access_token')

        # Déterminer le fournisseur en fonction de l'URL
        if 'google' in request.path:
            provider = 'google'
        elif 'facebook' in request.path:
            provider = 'facebook'
        else:
            raise AuthenticationFailed('Invalid provider')

        user = SocialLogin.social_auth(provider, access_token)

        if not user:
            raise AuthenticationFailed(f'{provider.capitalize()} authentication failed')

        token = generate_jwt(user)
        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {'jwt': token}

        return response


class UserView(APIView):
    @staticmethod
    def get(request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('User not logged in')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Invalid token')

        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        print(response)
        # Vérifier si l'utilisateur est authentifié
        if request.user.is_authenticated:
            request.user.is_active = False
            request.user.save()

        response.delete_cookie('jwt')
        response.data = {
            'message': 'User logged out'
        }
        return response
