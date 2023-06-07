import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from users.models import User


class OnlineConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.ping_pong_task = None
        self.pong_received = True
        self.user_id = None
        self.is_connected = False
        self.disconnect_handled = False

    async def set_user_online(self, user_id):
        try:
            user = await database_sync_to_async(User.objects.get)(id=user_id)
            user.online = True
            await database_sync_to_async(user.save)()
            print(f"User {user_id} is now online.")
        except Exception as e:
            print(f"Error saving user {user_id}: {str(e)}")

    async def set_user_offline(self, user_id):
        try:
            user = await database_sync_to_async(User.objects.get)(id=user_id)
            user.online = False
            await database_sync_to_async(user.save)()
            print(f"User {user_id} is now offline.")
        except User.DoesNotExist:
            print(f"User {user_id} does not exist.")

    async def ping_pong(self):
        while self.is_connected:  # Use the connection status to control the loop
            await asyncio.sleep(5)

            if not self.pong_received:
                print("No pong received. User disconnected.")
                self.is_connected = False
                break
            self.pong_received = False

            await self.send(json.dumps({"ping": True}))


    async def websocket_connect(self, event):
        await self.accept()

        self.is_connected = True  # Set connection status to True when connected
        self.ping_pong_task = asyncio.create_task(self.ping_pong())

    async def websocket_receive(self, event):
        message = json.loads(event.get("text", "{}"))
        if isinstance(message, dict):
            if "user_id" in message:
                self.user_id = message['user_id']  # Store user_id for later use
                await self.set_user_online(self.user_id)
            elif "ping" in message:
                await self.send({
                    "type": "websocket.send",
                    "text": json.dumps({"pong": True})
                })
            elif "pong" in message:
                self.pong_received = True
        else:
            print("Invalid message format:", message)

    async def websocket_disconnect(self, event):
        if self.disconnect_handled:  # Only handle disconnect once
            return

        self.is_connected = False  # Set connection status to False when disconnected
        if self.ping_pong_task:
            self.ping_pong_task.cancel()
            try:
                await self.ping_pong_task
            except asyncio.CancelledError:
                pass
            finally:
                self.ping_pong_task = None

        print("WebSocket connection closed")
        if self.user_id is not None:
            await self.set_user_offline(self.user_id)

        self.disconnect_handled = True  # Mark disconnect as handled
