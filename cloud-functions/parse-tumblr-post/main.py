from bs4 import BeautifulSoup
import json
import requests

def parse_tumblr_post(request):
    content_type = request.headers['content-type']
    if content_type == 'application/json':
        post = request.json.get('post')
    elif content_type == 'application/octet-stream':
        post = request.data
    elif content_type == 'text/plain':
        post = request.data
    elif content_type == 'application/x-www-form-urlencoded':
        post = request.form.get('post')
    else:
        raise ValueError("Unknown content type: {}".format(content_type))

    if post is not None:
        r = requests.get(post)
        soup = BeautifulSoup(r.text, 'html.parser')
        results = soup.find_all('div', {'class': 'photo-wrapper-inner'})
        image = results[0].find('img')
        response = {
            'post': post,
            'src': image['src']
        }
        return str(response)
    else:
        return 'Missing post url!'