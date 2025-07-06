import os
import json
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPEN_API_KEY")
)

CHAT_GPT_MODEL = "gpt-4"
CHAT_GPT_BRAND_INSTRUCTIONS = """
You are checking if a language model recognizes a brand or website by its **exact name**.
Do not guess or expand abbreviations. Only respond based on the exact input.
Respond in JSON with these keys:
- known: true or false
- summary: a one-sentence summary of what the site is about, or null if unknown
- confidence: high, medium, or low
- reasoning: explain why you answered this way
"""

CHAT_GPT_INSTRUCTIONS = """ 
Answer only with a JSON array of strings (no explanations, no extra text), for example: 

[
  "Prompt 1",
  "Prompt 2",
  ...
]

"""
PROMPTS_NUM = 5


def get_prompts_chatgpt(url: str) -> dict:
    prompt = f"""
    Provide {PROMPTS_NUM} unique queries that potential users might type into ChatGPT or a search engine if they were looking for a website like this: {url}
    These should be questions someone would ask if they wanted to find this exact type of website or service.
    Avoid queries that directly mention this site.
"""
    return ask_chatgpt(prompt)


def get_brand_recognition(url: str) -> dict:
    print(f"Asking for brand recognition of site: {url}")

    response = client.responses.create(
        model=CHAT_GPT_MODEL,
        instructions=CHAT_GPT_BRAND_INSTRUCTIONS,
        input=f"Generate the JSON response for the following site:{url}"
    )

    output = response.output_text
    print("Response from ChatGPT: ", output)

    parsed, error = try_parse_json(output)
    if error:
        print(error)
        return []

    return parsed


def ask_chatgpt(prompt: str) -> dict:
    print("Sending prompt to ChatGPT: ", prompt)

    response = client.responses.create(
        model=CHAT_GPT_MODEL,
        instructions=CHAT_GPT_INSTRUCTIONS,
        input=prompt
    )

    output = response.output_text
    print("Response from ChatGPT: ", output)

    parsed, error = try_parse_json(output)
    if error:
        print(error)
        return []

    return parsed


def try_parse_json(json_string):
    try:
        data = json.loads(json_string)
        return data, None  # Return data and no error
    except json.JSONDecodeError as e:
        return None, f"Invalid JSON: {e}"


def get_optimization_score(html: str) -> dict:
    prompt = """
    You are an expert in SEO and Answer Engine Optimization (AEO).

    You will be given the full HTML content of a website. Analyze how well the content is optimized for Answer Engines like ChatGPT, Google’s Featured Snippets, Bing Chat, and voice assistants.

    Provide a JSON response with the following structure:

    {
    "overall_score": 0-100,  // Numeric score from 0 (poor) to 100 (excellent)
      "summary": "Brief summary of the AEO quality",
      "strengths": [ "List of strong aspects of the content" ],
      "weaknesses": [ "List of weaknesses or missing elements" ],
      "recommendations": [ "Actionable suggestions to improve AEO" ],
      "key_factors": {
    "structured_data": "Good / Missing / Poor",
        "question_answer_format": "Good / Poor / Missing",
        "readability": "Grade level or score",
        "loading_speed_estimate": "Fast / Moderate / Slow",
        "mobile_friendly": "Yes / No / Not enough info",
        "content_depth": "Shallow / Moderate / Deep",
        "keyword_targeting": "Effective / Weak / Missing",
        "semantic_markup": "Good / Poor / Missing"
      }
    }

    Only return the JSON. Do not include explanations or extra commentary.

    Now analyze the following HTML content: 
""" + html

    response = client.responses.create(
        model=CHAT_GPT_MODEL,
        input=prompt
    )

    output = response.output_text
    print("Response from ChatGPT: ", output)

    parsed, error = try_parse_json(output)
    if error:
        print(error)
        return []

    return parsed
