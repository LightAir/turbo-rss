'use strict';

const xml = require('xml');

/**
 * Check first argument. If true - push last argument to second argument
 * @param condition
 * @param array
 * @param data
 */
function ifTruePush(condition, array, data) {
    if (condition) {
        array.push(data);
    }
}

/**
 * @param related
 * @param itemValues
 */
function addRelated(related, itemValues) {
    ifTruePush(related, itemValues, {
        'yandex:related': related.map(
            function (rel) {
                return {
                    link: [{
                        _attr: {
                            'url': rel.link,
                            'img': rel.image_url
                        }
                    }, rel.text]
                };
            }
        )
    });
}

/**
 * Items processing
 * @param items
 * @param channel
 */
function items(items, channel) {
    items.forEach(function (item) {
        let item_values = [];
        item_values.push({_attr: {'turbo': 'true'}});
        item_values.push({link: item.url});
        item_values.push({'turbo:source': item.url});

        ifTruePush(item.date, item_values, {pubDate: new Date(item.date).toUTCString()});
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

        if (typeof item.related !== 'undefined') {
            addRelated(item.related, item_values);
        }

        channel.push({item: item_values});
    });
}

/**
 * @param data
 * @returns {{rss: *[]}}
 */
function generateXML(data) {

    let channel = [];

    channel.push({title: {_cdata: data.title}});
    channel.push({link: data.link || 'http://github.com/LightAir/turbo-rss'});
    channel.push({description: {_cdata: data.description || data.title}});
    channel.push({language: 'ru'});

    items(data.items, channel);

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

/**
 * Base function
 * @param options
 * @param items
 * @constructor
 */
function YTurbo(options, items) {
    options = options || {};

    this.title = options.title || 'Untitled';
    this.description = options.description || '';
    this.link = options.link;
    this.items = items || [];

    this.item = function (data) {
        data = data || {};
        let item = {
            title: data.title || 'No title',
            description: data.description || '',
            image_url: data.image_url,
            url: data.url,
            author: data.author,
            date: data.date || data.pubDate,
            content: data.content,
            menu: data.menu,
            related: data.related
        };

        this.items.push(item);
        return this;
    };

    this.xml = function () {
        return xml(generateXML(this));
    };
}

module.exports = YTurbo;
