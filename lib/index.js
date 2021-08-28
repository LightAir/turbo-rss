'use strict';

const baseXml = require('xml');

class TR {
    constructor(options, items) {
        options = options || {};

        this.title = options.title || '';
        this.link = options.link || '';
        this.description = options.description || '';
        this.language = options.language || 'ru';
        this.items = [];

        if (Array.isArray(items) && items.length > 0) {
            const self = this;
            items.forEach(function (item) {
                self.item(item);
            });
        }
    }

    xml() {
        return baseXml(this.generateXML(this));
    }

    item(data) {
        data = data || {};
        this.items.push(
            this.itemData(data)
        );

        return this;
    }

    /**
     * Check first argument. If true - push last argument to second argument
     *
     * @param condition
     * @param array
     * @param data
     */
    pushIfConditionTrue(condition, array, data) {
        if (condition) {
            array.push(data);
        }
    }

    /**
     * @param related
     * @param itemValues
     * @param relatedInfinity
     */
    addRelated(related, itemValues, relatedInfinity) {
        const relatedResult = related.map(function (rel) {
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

        this.pushIfConditionTrue(related, itemValues, {'yandex:related': relatedResult});
    }

    /**
     * @param item
     * @param itemValues
     */
    pushGoals(item, itemValues) {
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

    getImageContent(item) {
        if (item.image_url.length > 0) {
            let imageCaption = '';

            if (item.image_caption.length > 0) {
                imageCaption = `<figcaption>${item.image_caption}</figcaption>`;
            }

            return `<figure><img src="${item.image_url}" />${imageCaption}</figure>`;
        }
        return '';
    }

    getSubheading(item) {
        if (item.subheading.length > 0) {
            return `<h2>${item.subheading}</h2>`;
        }

        return '';
    }

    getLinksString(links) {
        return links.map(function (item) {
            return `<a href="${item.link}">${item.text}</a>`;
        }).join('');
    }

    getMenu(item) {
        if (Array.isArray(item.menu) && item.menu.length > 0) {
            return `<menu>${this.getLinksString(item.menu)}</menu>`;
        }

        return '';
    }

    getBreadcrumbs(item) {
        if (Array.isArray(item.breadcrumbs) && item.breadcrumbs.length > 0) {
            return `<div data-block="breadcrumblist">${this.getLinksString(item.breadcrumbs)}</div>`;
        }

        return '';
    }

    /**
     * Items processing
     * @param items
     * @param channel
     */
    itemsProcessing(items, channel) {
        const self = this;
        items.forEach(function (item) {
            const itemValues = [];
            itemValues.push({_attr: {'turbo': item.turboEnabled ? 'true' : 'false'}});
            itemValues.push({link: item.url});

            self.pushIfConditionTrue(item.turboSource, itemValues, {'turbo:source': item.turboSource});
            self.pushIfConditionTrue(item.turboTopic, itemValues, {'turbo:topic': item.turboTopic});
            self.pushIfConditionTrue(item.date, itemValues, {pubDate: new Date(item.date).toUTCString()});
            self.pushIfConditionTrue(item.author, itemValues, {author: item.author});

            const fullContent = `<header>${self.getImageContent(item)}<h1>${item.title}</h1>${self.getSubheading(item)}${self.getMenu(item)}${self.getBreadcrumbs(item)}</header>${item.content}`;

            self.pushGoals(item, itemValues);

            itemValues.push({'turbo:content': {_cdata: fullContent}});

            if (typeof item.related !== 'undefined') {
                self.addRelated(item.related, itemValues, item.relatedInfinity);
            }

            channel.push({item: itemValues});
        });
    }

    /**
     * @param options
     *
     * @returns {{rss: *[]}}
     */
    generateXML(options) {

        const channel = [];

        channel.push({title: {_cdata: options.title}});
        channel.push({link: options.link});
        channel.push({description: {_cdata: options.description}});
        channel.push({language: options.language});

        this.itemsProcessing(options.items, channel);

        const _attr = {
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
    itemData(data) {
        return {
            title: data.title || '', // h1
            subheading: data.subheading || '', // h2
            image_url: data.image_url || '',
            image_caption: data.image_caption || '',
            url: data.url || data.link,
            author: data.author,
            date: data.date || data.pubDate,
            content: data.content,
            menu: data.menu || [],
            breadcrumbs: data.breadcrumbs || [],
            related: data.related,
            relatedInfinity: data.relatedInfinity || false,
            turboSource: data.turboSource || '',
            turboTopic: data.turboTopic || '',
            goals: data.goals || [],
            turboEnabled: data.turboEnabled !== undefined ? data.turboEnabled : true,
        };
    }
}

module.exports = TR;
