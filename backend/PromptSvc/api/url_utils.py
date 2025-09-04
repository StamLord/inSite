from urllib.parse import urlparse
import tldextract


# https://www.youtube.com/home -> youtube.com
def minimize_url(url: str):
    url = maximize_url(url)  # Required to parse correctly
    parsed = urlparse(url)
    netloc = parsed.netloc.replace('www.', '')
    return netloc


# youtube.com -> https://www.youtube.com/home
def maximize_url(url: str):
    if not url.startswith(('http://', 'https://')):
        if not url.startswith('www.'):
            url = f'www.{url}'
        url = f'https://{url}'
    return url


# www.youtube.com   ->  youtube
# YouTube           ->  YouTube
# youtube.com       ->  youtube
def strip_tld(url: str):
    return strip_tld(url)


# Disable fetching suffix list from internet by setting cache_dir=None
extractor = tldextract.TLDExtract(cache_dir=None)
def normalize_url(url: str):
    url = minimize_url(url)
    ext = extractor(url)
    return ext.domain
