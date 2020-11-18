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
 * @param relatedfinity
 */
function addRelated(related, itemValues, relatedfinity) {
    let relatedResult = related.map(function (rel) {
        return {
            link: [{
                _attr: {
                    'url': rel.link,
                    'img': rel.image_url
                }
            }, rel.text]
        };
    });

    if (relatedfinity) {
        relatedResult.push({
            _attr: {'type': 'infinity'}
        });
    }

    ifTruePush(related, itemValues, {'yandex:related': relatedResult});
}

/**
 * Items processing
 * @param items
 * @param channel
 */
function items(items, channel) {
    items.forEach(function (item) {
        let item_values = [];
        item_values.push({_attr: {'turbo': item.turboEnabled}});
        item_values.push({link: item.url});

        ifTruePush(item.turboSource, item_values, {'turbo:source': item.turboSource});
        ifTruePush(item.turboTopic, item_values, {'turbo:topic': item.turboTopic});
        ifTruePush(item.date, item_values, {pubDate: new Date(item.date).toUTCString()});
        ifTruePush(item.author, item_values, {author: item.author});

        let img = '';
        let menu = '';

        if (item.image_url) {
            img = '<figure><img src="' + item.image_url + '" /></figure>';
        }

        if (Array.isArray(item.menu)) {
            menu = '<menu>' + item.menu.map(function (item) {
                return '<a href="' + item.link + '">' + item.text + '</a>';
            }).join('') + '</menu>';
        }

        let fullContent = '<header>' + img + ' <h1>' + item.title + '</h1>' + menu + '</header>' + item.content;

        if (item.goals.length > 0) {
            item.goals.forEach(goal => item_values.push({
                "turbo:goal": {
                    _attr: {
                        type: goal.type || 'yandex',
                        'turbo-goal-id': goal.id,
                        name: goal.name,
                        id: goal.counter_id,
                    }
                }
            }))
        }

        item_values.push({'turbo:content': {_cdata: fullContent}});

        if (typeof item.related !== 'undefined') {
            addRelated(item.related, item_values, item.relatedfinity);
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
    channel.push({link: data.link});
    channel.push({description: {_cdata: data.description || data.title}});
    channel.push({language: data.language});

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
 * @param data
 * @returns {*}
 */
function itemData(data) {
    return {
        title: data.title || '',
        description: data.description || '',
        image_url: data.image_url,
        url: data.url || data.link,
        author: data.author,
        date: data.date || data.pubDate,
        content: data.content,
        menu: data.menu,
        related: data.related,
        relatedfinity: data.relatedfinity || false,
        turboSource: data.turboSource || '',
        turboTopic: data.turboTopic || '',
        goals: data.goals || [],
        turboEnabled: !data.turboDisabled || false,
    };
}
/**
 * Base function
 * @param options
 * @param items
 * @constructor
 */
function TR(options, items) {
    options = options || {};

    this.title = options.title || '';
    this.link = options.link || '';
    this.description = options.description || '';
    this.language = options.language || 'ru';

    this.items = items || [];

    this.item = function (data) {
        data = data || {};
        this.items.push(itemData(data));
        return this;
    };

    this.xml = function () {
        return xml(generateXML(this));
    };
}

module.exports = TR;
