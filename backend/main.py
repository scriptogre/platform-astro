import asyncio
import json

from dotenv import load_dotenv
import openai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from jinja2 import Environment, FileSystemLoader
from openai import AsyncOpenAI
from starlette.websockets import WebSocket

from prompts import GIGACHAD_SYSTEM_PROMPT

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
    max_age=86400
)

environment = Environment(loader=FileSystemLoader("templates/"))
user_message_template = environment.get_template("UserMessage.html")
gigachad_message_template = environment.get_template("GigaChadMessage.html")


@app.websocket("/chatroom")
async def chatroom_ws_endpoint(websocket: WebSocket):
    await websocket.accept()

    # Initialize the conversation history
    conversation_history = []

    while True:
        data = await websocket.receive_text()
        data = json.loads(data)

        user_message = data["message"]

        # Add user message to the conversation history
        conversation_history.append({"role": "user", "content": user_message})

        # Add user message
        await websocket.send_text(
            user_message_template.render(
                message=user_message
            )
        )

        await asyncio.sleep(0.5)

        # Send typing indicator
        await websocket.send_text(
            gigachad_message_template.render(
                message='<span class="loading loading-dots loading-sm"></span>'
            )
        )

        # Construct the prompt for GPT-3
        system_prompt = {
            "role": "system",
            "content": GIGACHAD_SYSTEM_PROMPT,
        }

        # Include the system message and the entire conversation in the GPT-3 call
        messages_to_send = [system_prompt] + conversation_history

        try:
            # Make the GPT call
            client = AsyncOpenAI()
            response = await client.chat.completions.create(
                model="ft:gpt-3.5-turbo-0613:personal::7teyZSgg", messages=messages_to_send, temperature=1
            )

            gigachad_message = response.choices[0].message.content

            # Append the new bot response to the conversation history
            conversation_history.append({"role": "assistant", "content": gigachad_message})

            # Send the Giga Chad message
            await websocket.send_text(
                gigachad_message_template.render(message=gigachad_message)
            )
        except (
                openai.BadRequestError,
                openai.APIConnectionError,
                openai.APITimeoutError,
                openai.AuthenticationError,
        ):
            await websocket.send_text(
                gigachad_message_template.render(
                    message="Sorry, the Giga Chad is busy right now. Try again later."
                )
            )
