from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async
from datetime import datetime
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.db import models
from .serializers import MessageSerializer
from .models import Message
import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

User = get_user_model()


class MessageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = None
        self.room_group_name = 'chat_room'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        print('WebSocket connection established.')
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        sender_id_to_save = text_data_json.get('sender_id')
        receiver_id_to_save = text_data_json.get('receiver_id')
        content_to_save = text_data_json.get('content')

        if sender_id_to_save and receiver_id_to_save and content_to_save:
            sender = await sync_to_async(User.objects.get)(pk=sender_id_to_save)
            receiver = await sync_to_async(User.objects.get)(pk=receiver_id_to_save)

            message = Message(
                sender=sender,
                receiver=receiver,
                content=content_to_save,
                timestamp=datetime.now(),
                read=False
            )
            await sync_to_async(message.save)()

            formatted_message = await sync_to_async(self.format_message)(message)

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': json.dumps(formatted_message)
                }
            )

        # Check if user_id is provided
        if 'user_id' in text_data_json:
            self.user_id = text_data_json['user_id']
            # Retrieve and send the latest messages
            latest_messages = await self.get_latest_messages()
            await self.send(text_data=json.dumps(latest_messages))

    @database_sync_to_async
    def get_latest_messages(self):
        if self.user_id is None:
            return []

        user = User.objects.get(pk=self.user_id)
        users = User.objects.exclude(pk=self.user_id)

        latest_messages = []
        for other_user in users:
            last_message = Message.objects.filter(
                models.Q(sender=user, receiver=other_user) |
                models.Q(sender=other_user, receiver=user)
            ).order_by('timestamp').last()
            if last_message is not None:
                latest_messages.append(self.format_message(last_message))
        return latest_messages

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=message)

    def format_message(self, message):
        return {
            'sender': message.sender.pseudo,
            'sender_id': message.sender.id,
            'receiver_id': message.receiver.id,
            'receiver': message.receiver.pseudo,
            'receiver_status': message.receiver.online,
            'sender_status': message.sender.online,
            'sender_avatar': message.sender.small_size_avatar,
            'receiver_avatar': message.receiver.small_size_avatar,
            'content': message.content,
            'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'read': message.read,
        }
