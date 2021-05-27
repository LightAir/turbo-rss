'use strict';

const xml = require('xml');

/**
 * Check first argument. If true - push last argument to second argument
 *
 * @param condition
 * @param array
 * @param data
 */
function pushIfConditionTrue(condition, array, data) {
    if (condition) {
        array.push(data);
    }
}

/**
 * @param related
 * @param itemValues
 * @param relatedInfinity
 */
function addRelated(related, itemValues, relatedInfinity) {
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

    if (relatedInfinity) {
        relatedResult.push({
            _attr: {'type': 'infinity'}
        });
    }

    pushIfConditionTrue(related, itemValues, {'yandex:related': relatedResult});
}

/**
 * @param item
 * @param itemValues
 */
function pushGoals(item, itemValues) {
    if (item.goals.length > 0) {
        item.goals.forEach(goal => itemValues.push({
            'turbo:goal': {
                _attr: {
                    type: goal.type || 'yandex',
                    'turbo-goal-id': goal.id,
                    name: goal.name,
                    id: goal.counter_id,
                }
            }
        }));
    }
}

/**
 * Items processing
 * @param items
 * @param channel
 */
function items(items, channel) {
    items.forEach(function (item) {
        let itemValues = [];
        itemValues.push({_attr: {'turbo': item.turboEnabled ? 'true' : 'false'}});
        itemValues.push({link: item.url});

        pushIfConditionTrue(item.turboSource, itemValues, {'turbo:source': item.turboSource});
        pushIfConditionTrue(item.turboTopic, itemValues, {'turbo:topic': item.turboTopic});
        pushIfConditionTrue(item.date, itemValues, {pubDate: new Date(item.date).toUTCString()});
        pushIfConditionTrue(item.author, itemValues, {author: item.author});

        let img = '', menu = '';

        if (item.image_url) {
            if (!item.image_caption) img = '<figure><img src="' + item.image_url + '" /></figure>';
            else img = '<figure><img src="' + item.image_url + '" /><figcaption>' + item.image_caption + '</figcaption></figure>';
        }

        if (Array.isArray(item.menu)) {
            menu = '<menu>' + item.menu.map(function (item) {
                return '<a href="' + item.link + '">' + item.text + '</a>';
            }).join('') + '</menu>';
        }

        let fullContent = '<header>' + img + ' <h1>' + item.title + '</h1>' + menu + '</header>' + item.content;

        pushGoals(item, itemValues);

        itemValues.push({'turbo:content': {_cdata: fullContent}});

        if (typeof item.related !== 'undefined') {
            addRelated(item.related, itemValues, item.relatedfinity);
        }

        channel.push({item: itemValues});
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
        image_caption: data.image_caption,
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
        turboEnabled: data.turboEnabled !== undefined ? data.turboEnabled: true,
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
