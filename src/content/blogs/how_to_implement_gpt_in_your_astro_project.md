---
title: '🚀🤖 GPT Chatbots using Astro & OpenAI API'
description: 'This workshop offers Python developers a practical guide to integrating GPT models within web applications using FastAPI. Participants will learn how to easily fine-tune GPT models for specific uses, dynamically render chat messages using HTMX, and implement security measures against prompt injection. The session offers hands-on experience and valuable tips for efficient GPT integration, including the use of tools like Streamlit and Chainforge. You will leave with the knowledge and resources necessary to implement GPT in your own web projects.'
---
Companies are seeking GPT integrations. Are you taking advantage of these opportunities?

`{% block description %}`

This workshop offers Python developers a practical guide to integrating GPT models within web applications using FastAPI. Participants will learn how to easily fine-tune GPT models for specific uses, dynamically render chat messages using HTMX, and implement security measures against prompt injection. The session offers hands-on experience and valuable tips for efficient GPT integration, including the use of tools like Streamlit and Chainforge. You will leave with the knowledge and resources necessary to implement GPT in your own web projects.

`{% endblock description %}`

`{% block steps %}`

1. Clone GitHub repo with existing boilerplate built with TailwindCSS & DaisyUI (10-15 mins)
2. Fine-tune a GPT model (20-30 min)
    - Generate a set of responses using `gpt-4`.
    - Format responses as a `.jsonl` file.
    - Use file to fine-tune a `gpt-3.5-turbo` model.
3. Create endpoint to access fine-tuned model & render GPT-generated chat messages as HTML partials (20-30 min)

`{% if time_permits %}`
4. Explore function-calling features for the GPT model. (20-30 min)
5. Implement security practices to prevent prompt injection. (20-30 min)
6. Briefly introduce some valuable Python projects: (10-15 min)
    - Streamlit: Create chat UIs much faster than this workshop's method (some limitations apply).
    - ChainForge: A web-based tool for efficient prompt engineering.

`{% endif %}`

`{% endblock steps %}`


`{% block notes %}`

1. We're using FastAPI in this workshop, but if you know any other web framework like Django or Flask, you're okay!
2. We'll save time by beginning with a project that's already set up. It includes a chat interface with placeholder messages.
3. I will show a pre-fine-tuned model because fine-tuning on OpenAI's servers can take 20-40 minutes.
4. You will have access to a public repository with all the steps. It might also have special branches for Django and Flask integrations.

`{% endblock notes %}`