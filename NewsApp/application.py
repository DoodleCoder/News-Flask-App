import requests
import json
from flask import Flask, send_from_directory, jsonify, request
import random
import string
from collections import Counter
from newsapi import NewsApiClient

application = Flask(__name__)

api_key = 'f6cda0c08cd547ae84c68b30b0e17abe'
news_api = NewsApiClient(api_key=api_key)

@application.route('/')
def index():    
    return send_from_directory('templates','index.html')

@application.route('/words')
def remWords():
    f = open('stopwords_en.txt','r')
    stopwords = f.read().splitlines()
    f.close()

    all_news = news_api.get_top_headlines(language='en',page_size=100,sources='fox-news,cnn,abc-news,bbc-news,bbc-sport,buzzfeed,cbc-news,cnbc,crypto-coins-news')['articles']
    punct = string.punctuation
    mapp = str.maketrans('', '', punct)
    words = []
    for i in all_news:
        if i['title']:
            t = i['title'].lower()
            for j in t.split():
                s = j.translate(mapp)
                if s not in stopwords:
                    if s:
                        words.append(s) 
    c = Counter(words)
    freq = c.most_common(30)
    word_dic = []
    word = []
    count = []

    for i in freq:
        word.append(i[0])
        count.append(int(i[1]))
    
    norm = [float(i)/max(count) for i in count]
    for i in range(len(word)):
        word_dic.append({"text": word[i], "size": str(15 + int(norm[i])*25), "test":"haha"})
    
    return jsonify(word_dic)

@application.route('/cnn-news')
def cnnNews():
    c = news_api.get_everything(sources='cnn',language='en',page_size=30)
    cnn = []
    for i in c['articles']:
        author = i['author']
        desc = i['description']
        title = i['title']
        url = i['url']
        urlimg = i['urlToImage']
        pub = i['publishedAt']
        source = i['source']
        if author and desc and title and url and urlimg and pub and source['name'] and source['id']:
            obj = {'img':urlimg,'title':title,'desc':desc,'url':url}
            cnn.append(obj)
    return jsonify(cnn[:4])

@application.route('/fox-news')
def foxNews():
    f = news_api.get_everything(sources='fox-news',language='en',page_size=30)
    fox = []
    for i in f['articles']:
        author = i['author']
        desc = i['description']
        title = i['title']
        url = i['url']
        urlimg = i['urlToImage']
        pub = i['publishedAt']
        source = i['source']
        if author and desc and title and url and urlimg and pub and source['name'] and source['id']:
            obj = {'img':urlimg,'title':title,'desc':desc,'url':url}
            fox.append(obj)
    return jsonify(fox[:4])

@application.route('/top-headlines')
def topHead():
    top_head = news_api.get_top_headlines(country='us',page_size=30)
    top = []
    for i in top_head['articles']:
        author = i['author']
        desc = i['description']
        title = i['title']
        url = i['url']
        urlimg = i['urlToImage']
        pub = i['publishedAt']
        source = i['source']
        if author and desc and title and url and urlimg and pub and source['name']:
            obj = {'img':urlimg,'title':title,'desc':desc,'url':url}
            top.append(obj)
    return jsonify(top[:5])

@application.route('/populate')
def populate():
    cat = request.args.get('category', type=str)
    sources = 0
    if cat == 'all':
        sources = news_api.get_sources(language='en',country='us')['sources']
    else:
        sources = news_api.get_sources(language='en',country='us',category=cat)['sources']
    return jsonify(sources)

@application.route('/search')
def search():
    q = request.args.get('q', type=str)
    fr = request.args.get('from', type=str)
    to = request.args.get('to', type=str)
    cat = request.args.get('cat', type=str)
    src = request.args.get('src', type=str)
    
    if cat == 'all':
        try:
            results = news_api.get_everything(q=q,from_param=fr,to=to,language='en',page_size=30,sort_by='publishedAt')
        except Exception as e:
            return jsonify(['-1',e.get_message()])
    else:
        if src == 'all':
            get_src = news_api.get_sources(language='en',country='us',category=cat)['sources']
            src = ''
            for i in get_src:
                src += i['id'] +','
            src = src[:-1]
        try:
            results = news_api.get_everything(q=q,from_param=fr,to=to,sources=src,language='en',page_size=30,sort_by='publishedAt')
        except Exception as e:
            return jsonify(['-1',e.get_message()])
            

    # if cat == 'all':
    #     results = requests.get('http://newsapi.org/v2/everything?q='+q+'&from='+fr+'&to='+to+'&apiKey='+api_key+'&language=en&pageSize=30&sortBy=publishedAt').json()
    #     if results['status'] == "ok":
    #         try:
    #             results = news_api.get_everything(q=q,from_param=fr,to=to,language='en',page_size=30,sort_by='publishedAt')
    #         except:
    #             return jsonify(results['message'])

    # else:
    #     if src == 'all':
    #         get_src = news_api.get_sources(language='en',country='us',category=cat)['sources']
    #         src = ''
    #         for i in get_src:
    #             src += i['id'] +','
    #         src = src[:-1]

    #     results = requests.get('http://newsapi.org/v2/everything?q='+q+'&from='+fr+'&to='+to+'&sources='+src+'&apiKey='+api_key+'&language=en&pageSize=30&sortBy=publishedAt').json()
    #     if results['status'] == "ok":
    #         try:
    #             results = news_api.get_everything(q=q,from_param=fr,to=to,sources=src,language='en',page_size=30,sort_by='publishedAt')
    #         except:
    #             return jsonify(results['message'])

    res = []
    # if results['status'] ==  "error":
    #     res.append('-1')
    #     res.append(results['message'])
    #     return jsonify(res)

    for i in results['articles']:
        source = i['source']
        if i['title'] and i['author'] and i['description'] and i['url'] and i['urlToImage'] and i['publishedAt'] and source['name']:# and i['source']['id']:
            res.append(i)
    return jsonify(res)

if __name__ == "__main__":
    application.run()
    application.debug = True