from bs4 import BeautifulSoup
import requests
import lxml


def scrape_site(url: str):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "lxml")
    cleaned = get_clean_soup(soup)

    return cleaned


def get_clean_soup(soup):
    # Remove script and style elements
    for element in soup(["script", "style", "noscript"]):
        element.decompose()

    text = soup.get_text(separator="\n")
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    return "\n".join(lines)
