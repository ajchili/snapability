from bs4 import BeautifulSoup
import requests

def parse_twitter_post(request):
    if request.data and 'post' in [request.data]:
        post = request.data['post']
        r = requests.get(post)
        soup = BeautifulSoup(r.text, 'html.parser')
        results = soup.find_all('img')
        return results
    else:
        return 'Missing post url!'
