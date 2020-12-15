// prova is a wrapper for tape
// use npm run test:browser to run tests in a browser
const test = require('tape');
const TR = require('..');

const includeFolder = require('include-folder');
const expectedOutput = includeFolder(__dirname + '/expectedOutput', /.*\.xml$/);

const baseOptions = {
    title: 'title',
    description: 'description',
    link: 'http://example.com/rss.xml',
    site_url: 'http://example.com'
};

const relatedOptions = [{
    link: 'http://example.com/related/post1',
    image_url: 'http://example.com/i/img1.jpg',
    text: 'related link text 1'
}, {
    link: 'http://example.com/related/post2',
    image_url: 'http://example.com/i/img2.jpg',
    text: 'related link text 2'
}];

require('mockdate').set('Wed, 10 Dec 2014 19:04:57 GMT');

test('empty feed', function (t) {
    t.plan(2);
    let feed = new TR();
    t.equal(feed.xml(), expectedOutput.default.trim());
    feed.item();
    t.equal(feed.xml(), expectedOutput.defaultOneItem.trim());
});

test('default item', function (t) {
    t.plan(1);
    let feed = new TR(baseOptions);

    feed.item({});

    t.equal(feed.xml(), expectedOutput.defaultItem.trim());
});

test('related item', function (t) {
    t.plan(1);
    let feed = new TR(baseOptions);

    feed.item({
        title: 'item title',
        image_url: 'http://example.com/example.png',
        url: 'http://example.com/article4?this&that',
        author: 'LightAir',
        date: 'May 27, 2018 00:00 AM',
        menu: '<a href="http://example.com/page1.html">Текст ссылки</a> <a href="http://example.com/page2.html">Текст ссылки</a>',
        content: '<p>hello</p>',
        related: relatedOptions
    });

    t.equal(feed.xml(), expectedOutput.relatedItem.trim());
});

test('related item', function (t) {
    t.plan(1);
    let feed = new TR(baseOptions);

    feed.item({
        title: 'item title',
        image_url: 'http://example.com/example.png',
        url: 'http://example.com/article4?this&that',
        author: 'LightAir',
        date: 'May 27, 2018 00:00 AM',
        content: '<p>hello</p>',
        relatedfinity: true,
        related: relatedOptions
    });

    t.equal(feed.xml(), expectedOutput.relatedItemInfinity.trim());
});

test('menu', function (t) {
    t.plan(1);
    let feed = new TR(baseOptions);

    feed.item({
        title: 'item title',
        image_url: 'http://example.com/example.png',
        url: 'http://example.com/article4?this&that',
        author: 'LightAir',
        date: 'May 27, 2018 00:00 AM',
        content: '<p>hello</p>',
        relatedfinity: true,
        menu: [{
            link: 'http://example.com/',
            text: 'Главная',
        }, {
            link: 'http://example.com/about',
            text: 'О сайте',
        }],
        related: relatedOptions
    });

    feed.item({});

    t.equal(feed.xml(), expectedOutput.menu.trim());
});

test('goals',  function (t) {
    t.plan(1);
    let feed = new TR(baseOptions);

    feed.item({
        title: 'item title',
        image_url: 'http://example.com/example.png',
        url: 'http://example.com/article4?this&that',
        author: 'vvm.space',
        date: 'May 27, 2018 00:00 AM',
        menu: '<a href="http://example.com/page1.html">Текст ссылки</a> <a href="http://example.com/page2.html">Текст ссылки</a>',
        goals: [{
            type: 'yandex',
            id: 'turbo-goal-id',
            counter_id: '12345',
            name: 'order',
        }],
        content: '<p>hello</p>',
        related: relatedOptions
    });

    t.equal(feed.xml(), expectedOutput.goal.trim());
});
