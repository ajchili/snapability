from bs4 import BeautifulSoup
import json
import flask
import requests

def parse_twitter_post(request):
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)
    
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
        results = soup.find_all('div', {'class': 'AdaptiveMedia-photoContainer'})
        image = results[0].find('img')
        response = flask.jsonify({
            'tweet': post,
            'src': image['src']
        })
        response.headers.set('Access-Control-Allow-Origin', '*')
        response.headers.set('Access-Control-Allow-Methods', 'OPTIONS, POST')
        response.headers.set('Access-Control-Allow-Headers', '*')
        return response
    else:
        return 'Missing post url!'