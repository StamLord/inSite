from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin
import lxml


def scrape_site(url: str):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "lxml")
    cleaned = get_clean_soup(soup)

    technical_scan = {
        "robots": get_robots_txt(url),
        "meta_robots": get_meta_robots_tag(soup),
        "canonical": get_canonical(url, soup),
        "structured_data": get_structured_data(soup),
        "title": get_title(soup),
        "description": get_meta_description(soup)
    }

    return cleaned, technical_scan


def get_clean_soup(soup):
    # Remove script and style elements
    for element in soup(["script", "style", "noscript", "iframe", "svg", "meta", "link"]):
        element.decompose()

    text = soup.get_text(separator="\n")
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    return "\n".join(lines)


def get_robots_txt(url):
    try:
        robots_url = urljoin(url, "/robots.txt")
        response = requests.get(robots_url, timeout=3)

        if "Disallow: /" in response.text:
            return "Disallows crawling"
        else:
            return "Allows crawling"
    except:
        return "Not Found / Unreachable"


def get_meta_robots_tag(soup):
    robots_meta = soup.find("meta", attrs={"name": "robots"})

    if robots_meta and "noindex" in robots_meta.get("content", "").lower():
        return "Noindex - Invisible to search engines and LLM!"

    return "Indexed"


def get_canonical(url, soup):
    canonical = soup.find("link", rel="canonical")
    if canonical and canonical.get("href") in url:
        return "Canonical URL: " + canonical.get("href")
    elif canonical:
        return "Canonical points to different domain: " + canonical.get("href")
    else:
        return "Missing"


def get_structured_data(soup):
    if soup.find("script", type="application/ld+json"):
        return "Present"
    return "Missing"


def get_title(soup):
    return "Found" if soup.title and soup.title.string.strip() else "Missing"


def get_meta_description(soup):
    return "Found" if soup.find("meta", attrs={"name": "description"}) else "Missing"
