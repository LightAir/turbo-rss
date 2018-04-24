## WIP

## turbo-rss

[![Build Status](https://travis-ci.org/LightAir/turbo-rss.svg)](https://travis-ci.org/lightair/turbo-rss)
![npm](https://img.shields.io/npm/v/npm.svg)
![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)


>RSS based, feed generator for Yandex turbo.

>WARNING! Work In Progress

### Usage

#### Create a new feed

```js
var TR = require('turbo-rss');

var feed = new TS(feedOptions);
```

##### `feedOptions`

 * `title` **string** Title of your site or feed
 * `description` _optional_ **string** A short description of the feed.
 * `author` _optional_  **string**  If included it is the name of the item's creator.
 * `link` **url string** Url to the site that the feed is for.
 * `pubDate` _optional_ **Date object or date string** The publication date for content in the feed
 
#### Add items to a feed

An item can be used for a blog entry, project update, log entry, etc.  Your RSS feed
can have any number of items. Most feeds use 20 or fewer items.

```js
feed.item(itemOptions);
```

##### itemOptions

 * `title` **string** Title of this particular item.
 * `image_url` **url string** Link to header image
 * `url` **url string** Url to the item. This could be a blog entry.
 * `author` _optional_  **string**  If included it is the name of the item's creator.
 If not provided the item author will be the same as the feed author.  This is typical
 except on multi-author blogs.
 * `date` **string** The date and time of when the item was created.  Feed
 readers use this to determine the sort order. Some readers will also use it to determine
 * `content` **string** Content
 
##### Feed XML

```js
var xml = feed.xml();
```

This returns the XML as a string.

>maybe later...
>`indent` _optional_ **boolean or string** What to use as a tab. Defaults to no tabs (compressed).
>For example you can use `'\t'` for tab character, or `'  '` for two-space tabs. If you set it to
>`true` it will use four spaces.

## Example Usage

```js
var RSS = require('rss');

/* lets create feed */
var feed = new RSS({
    title: 'title',
    description: 'description',
    link: 'http://example.com', // site url
    author: 'LightAir',
    pubDate: 'May 20, 2012 04:00:00 GMT'
});

/* loop over data and add to feed */
feed.item({
    title:  'item title',
    image_url: 'http://example.com/example.png',
    url: 'http://example.com/article4?this&that', // link to the item
    author: 'LightAir', // optional - defaults to feed author property
    date: 'May 27, 2012',
    content: '<p>hello</p>'
});

// cache the xml to send to clients
var xml = feed.xml();
```

### Contributing

Contributions to the project are welcome. Feel free to fork and improve.
I do my best accept pull requests in a timely manor, especially when tests and updated docs
are included.

## Tests

Tests included use Mocha. Use `npm test` to run the tests.

```sh
$ npm test
```
