import json
from url_utils import normalize_url


# 1st -> 100, 2nd -> 90, 10th -> 10
def get_score(url: str, prompt: str, answers: list) -> int:
    place = 0
    url = normalize_url(url).lower()

    for i, a in enumerate(answers):
        a = a.lower()
        if url in a:
            place = i + 1
            break

    if place == 0:
        return 0

    if place == 1:
        return 100

    n = len(answers)
    if n == 1:
        return 100 if place == 1 else 0

    score = int(((n - place) / (n - 1)) * 100)
    return score
