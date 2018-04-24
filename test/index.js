// prova is a wrapper for tape
// use npm run test:browser to run tests in a browser
var test = require('tape');

var YTurbo = require('..');

var includeFolder = require('include-folder');
var expectedOutput = includeFolder(__dirname + '/expectedOutput', /.*\.xml$/);

require('mockdate').set('Wed, 10 Dec 2014 19:04:57 GMT');

test('empty feed', function(t) {
    t.plan(2);
    var feed = new YTurbo();
    t.equal(feed.xml(), expectedOutput.default.trim());
    feed.item();
    t.equal(feed.xml(), expectedOutput.defaultOneItem.trim());
});

test('default item', function(t) {

    t.plan(1);

    var feed = new YTurbo({
        title: 'title',
        description: 'description',
        link: 'http://example.com/rss.xml',
        site_url: 'http://example.com'
    });

    feed.item({});

    t.equal(feed.xml(), expectedOutput.defaultItem.trim());
});
