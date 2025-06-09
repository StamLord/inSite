from urllib.parse import urlparse


def minimize_url(url: str):
    url = maximize_url(url)  # Required to parse correctly
    parsed = urlparse(url)
    netloc = parsed.netloc.replace('www.', '')
    return netloc


def maximize_url(url: str):
    if not url.startswith(('http://', 'https://')):
        if not url.startswith('www.'):
            url = f'www.{url}'
        url = f'https://{url}'
    return url

