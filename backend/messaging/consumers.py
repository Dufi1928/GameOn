from datetime import datetime
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.db import models
from .models import Message
import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding as asym_padding
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import base64

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
        try:
            text_data_json = json.loads(text_data)
            # print(f"Received message: {text_data_json}")
            sender_id_to_save = text_data_json.get('sender_id')
            receiver_id_to_save = text_data_json.get('receiver_id')
            content_to_save = text_data_json.get('content')

            if sender_id_to_save and receiver_id_to_save and content_to_save:
                sender = await sync_to_async(User.objects.get)(pk=sender_id_to_save)
                receiver = await sync_to_async(User.objects.get)(pk=receiver_id_to_save)

                # Encrypt the message for the sender and receiver
                try:
                    sender_public_key = serialization.load_pem_public_key(
                        sender.public_key.encode(),
                        backend=default_backend()
                    )
                    encrypted_content_sender = sender_public_key.encrypt(
                        content_to_save.encode(),
                        asym_padding.OAEP(
                            mgf=asym_padding.MGF1(algorithm=hashes.SHA256()),
                            algorithm=hashes.SHA256(),
                            label=None
                        )
                    )
                    # binary_representation = ''.join(format(byte, '08b') for byte in encrypted_content_sender)
                    # print(binary_representation)
                    encrypted_content_sender_str = base64.b64encode(encrypted_content_sender).decode()
                except ValueError as ve:
                    print(f"Encryption Error with sender's key: {ve}")
                    encrypted_content_sender_str = None

                try:
                    receiver_public_key = serialization.load_pem_public_key(
                        receiver.public_key.encode(),
                        backend=default_backend()
                    )
                    encrypted_content_receiver = receiver_public_key.encrypt(
                        content_to_save.encode(),
                        asym_padding.OAEP(
                            mgf=asym_padding.MGF1(algorithm=hashes.SHA256()),
                            algorithm=hashes.SHA256(),
                            label=None
                        )
                    )
                    encrypted_content_receiver_str = base64.b64encode(encrypted_content_receiver).decode()
                except ValueError as ve:
                    print(f"Encryption Error with receiver's key: {ve}")
                    encrypted_content_receiver_str = None

                message = Message(
                    sender=sender,
                    receiver=receiver,
                    encrypted_content_sender=encrypted_content_sender_str,
                    encrypted_content_receiver=encrypted_content_receiver_str,
                    timestamp=datetime.now(),
                    read=False
                )
                await sync_to_async(message.save)()

                formatted_message = await sync_to_async(self.format_message)(message, sender)

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
        except Exception as e:
            print(f"General Error: {e}")

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
                latest_messages.append(self.format_message(last_message, user))
        return latest_messages

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=message)

    def format_message(self, message, user):
        content = message.encrypted_content_receiver if message.receiver == user else message.encrypted_content_sender
        return {
            'sender_content': message.encrypted_content_sender,
            'receiver_content': message.encrypted_content_receiver,
            'sender': message.sender.pseudo,
            'sender_id': message.sender.id,
            'receiver_id': message.receiver.id,
            'receiver': message.receiver.pseudo,
            'receiver_status': message.receiver.online,
            'sender_status': message.sender.online,
            'sender_avatar': message.sender.small_size_avatar,
            'receiver_avatar': message.receiver.small_size_avatar,
            'content': content,
            'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'read': message.read,
        }
