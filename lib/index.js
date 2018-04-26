'use strict';

const xml = require('xml');

function ifTruePush(bool, array, data) {
    if (bool) {
        array.push(data);
    }
}

function generateXML(data) {

    let channel = [];

    channel.push({title: {_cdata: data.title}});
    channel.push({link: data.link || 'http://github.com/LightAir/turbo-rss'});
    channel.push({description: {_cdata: data.description || data.title}});
    channel.push({language: 'ru'});

    data.items.forEach(function (item) {

        let item_values = [];

        item_values.push({_attr: {'turbo': 'true'}});

        item_values.push({link: item.url});
        item_values.push({'turbo:source': item.url});

        ifTruePush(item.date, item_values, {pubDate: new Date(item.date).toGMTString()});
        ifTruePush(item.author, item_values, {author: item.author});

        let img = '';
        let menu = '';

        if (item.image_url) {
            img = '<figure><img src="' + item.image_url + '" /></figure>';
        }

        if (item.menu) {
            menu = '<menu>' + item.menu + '</menu>';
        }

        let fullContent = '<header>' + img + ' <h1>' + item.title + '</h1>' + menu + '</header>' + item.content;

        item_values.push({'turbo:content': {_cdata: fullContent}});
        channel.push({item: item_values});

    });

    let _attr = {
        'xmlns:yandex': 'http://news.yandex.ru',
        'xmlns:media': 'http://search.yahoo.com/mrss/',
        'xmlns:turbo': 'http://turbo.yandex.ru',
        version: '2.0'
    };

    return {
        rss: [
            {_attr: _attr},
            {channel: channel}
        ]
    };
}

function YTurbo(options, items) {
    options = options || {};

    this.title = options.title || 'Untitled';
    this.description = options.description || '';
    this.link = options.link;
    this.items = items || [];

    this.item = function (options) {
        options = options || {};
        let item = {
            title: options.title || 'No title',
            description: options.description || '',
            image_url: options.image_url,
            url: options.url,
            author: options.author,
            date: options.date || options.pubDate,
            content: options.content,
            menu: options.menu
        };

        this.items.push(item);
        return this;
    };

    this.xml = function () {
        return xml(generateXML(this));
    };
}

module.exports = YTurbo;
