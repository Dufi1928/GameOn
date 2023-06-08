from django.contrib.auth.models import User
import datetime
import jwt
import requests
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.hashers import make_password

from .models import User
from games.models import Game
from .serializers import GetUserSerializer
from .serializers import UserSerializer
from .serializers import GetUserPseudosSerializer


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


class CheckIfUserExist(APIView):
    @staticmethod
    def post(request):
        email = request.data.get('email')
        pseudo = request.data.get('pseudo')
        user_with_email = User.objects.filter(email=email).first()
        user_with_pseudo = User.objects.filter(pseudo=pseudo).first()
        if user_with_email and user_with_pseudo:
            return Response({'error_email': 'User with this email already exists',
                             'error_pseudo': 'User with this pseudo already exists'},
                            status=400)
        elif user_with_email:
            return Response({'error_email': 'User with this email already exists'}, status=400)
        elif user_with_pseudo:
            return Response({'error_pseudo': 'User with this pseudo already exists'}, status=400)
        else:
            return Response({'message': 'User with this email or pseudo does not exist'}, status=200)


class Register(APIView):
    def post(self, request):
        email = request.data.get('email')
        pseudo = request.data.get('pseudo')
        games = request.data.get('selectedGamesIds')
        password = request.data.get('password')
        first_name = request.data.get('firstName')
        last_name = request.data.get('lastName')

        user_with_email = User.objects.filter(email=email).first()
        user_with_pseudo = User.objects.filter(pseudo=pseudo).first()

        if user_with_email:
            return Response({'error': 'User with this email already exists'}, status=400)
        elif user_with_pseudo:
            return Response({'error': 'User with this pseudo already exists'}, status=400)
        else:
            hashed_password = make_password(password)
            user = User.objects.create(
                username=first_name,
                email=email,
                pseudo=pseudo,
                password=hashed_password,
                first_name=first_name,
                last_name=last_name
            )
            for game_id in games:
                game = Game.objects.get(id=game_id)
                user.favorite_games.add(game)

            serializer = UserSerializer(user)

            user = authenticate_user(email, password)
            token = generate_jwt(user)

            response = Response({'message': 'User registered successfully', 'user': serializer.data})
            response.set_cookie(key='jwt', value=token, httponly=True)
            response.data = {'jwt': token}

            return response


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
        return response


class checkLoginView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({'status': 'not logged in'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return Response({'status': 'not logged in'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(f"Error decoding token: {e}")
            return Response({'status': 'not logged in'}, status=status.HTTP_401_UNAUTHORIZED)

        user = User.objects.filter(id=payload['id']).first()

        if not user:
            return Response({'status': 'not logged in'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({'status': 'logged in', 'id': user.id}, status=status.HTTP_200_OK)

class SocialLogin(APIView):
    @staticmethod
    def verify_social_token(url):
        response = requests.get(url)
        user_info = response.json()
        return user_info

    @staticmethod
    def post(request):
        code = request.data.get('code')
        provider = request.data.get('provider')

        if provider == 'google':

            url = "https://oauth2.googleapis.com/token"
            params = {
                "client_id": "799631150296-rgsacnb85t05u6tl0uv2mfd0anpsrlq4.apps.googleusercontent.com",
                "client_secret": "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",
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": "https://localhost:5173",
            }
            response = requests.post(url, data=params, headers={'Content-Type': 'application/x-www-form-urlencoded'})
            tokens = response.json()

            if 'error' in tokens:
                raise AuthenticationFailed(tokens['error'])

            access_token = tokens["access_token"]
            url = f'https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}'
            user_info = SocialLogin.verify_social_token(url)

            email = user_info.get('email')
            first_name = user_info.get('given_name')
            last_name = user_info.get('family_name')
            user = User.objects.filter(email=email).first()

            if not user:
                return Response({
                    'message': 'User not found',
                    'user': {
                        'found': 'false',
                        'email': email,
                        'firstName': first_name,
                        'lastName': last_name
                    }
                })
            token = generate_jwt(user)
            response = Response()
            response.set_cookie(key='jwt', value=token, httponly=True)
            response.data = {'jwt': token}

            return Response({
                'message': 'Access token printed successfully',
                'user': {
                    'found': 'true',
                    'email': email,
                    'firstName': first_name,
                    'lastName': last_name,
                    'jwt': token
                }
            })
        elif provider == 'facebook':
            email = request.data.get('email')
            user = User.objects.filter(email=email).first()
            if not user:
                return Response({
                    'message': 'User not found',
                    'user': {
                        'found': 'false',
                        'email': email,
                    }
                })

            token = generate_jwt(user)
            response = Response()
            response.set_cookie(key='jwt', value=token, httponly=True)
            response.data = {'jwt': token}

            return Response({
                'message': 'Access token printed successfully',
                'user': {
                    'found': 'true',
                    'email': email,
                    'jwt': token,
                }
            })
        else:
            raise AuthenticationFailed('Invalid provider')


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
        except Exception as e:
            print(f"Error decoding token: {e}")
            raise AuthenticationFailed('Invalid token')

        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        user_id = request.data.get('user_id')  # Utilisation de request.data.get('user_id') pour accéder à la valeur
        print(user_id)
        user = User.objects.get(id=user_id)
        user.online = False
        user.save()
        if request.user.is_authenticated:
            try:
                print('User logged out')

            except User.DoesNotExist:
                pass

        response.delete_cookie('jwt')
        response.data = {
            'message': 'User logged out'
        }
        return response


class UserDetail(APIView):
    def get(self, request, user_id, format=None):
        if user_id is not None:
            try:
                user = User.objects.get(pk=user_id)
                serializer = GetUserSerializer(user)
                return Response(serializer.data)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "No id provided"}, status=status.HTTP_400_BAD_REQUEST)


class GetUsersNotif(APIView):
    def post(self, request):
        user_ids = request.data.get('senders', [])
        users = User.objects.filter(id__in=user_ids)
        serializer = GetUserPseudosSerializer(users, many=True)
        return Response(serializer.data)