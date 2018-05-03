## WIP

## turbo-rss

[![Build Status](https://travis-ci.org/LightAir/turbo-rss.svg)](https://travis-ci.org/LightAir/turbo-rss)
![npm](https://img.shields.io/npm/v/npm.svg)
![Packagist](https://img.shields.io/packagist/l/doctrine/orm.svg)


>Генератор RSS разметки для сервиса Турбо-страницы

>ПРЕДУПРЕЖДЕНИЕ! Работа в процессе

### Использование

#### Создание канала

```js
var TR = require('turbo-rss');

var feed = new TR(feedOptions);
```

##### `Опции канала`

 * `title` **string** Название RSS-канала.
 * `description` _optional_ **string** Описание канала одним предложением. Не используйте HTML-разметку..
 * `author` _optional_  **string**  If included it is the name of the item's creator. **(Будет удалено)**
 * `link` **url string** Домен сайта, данные которого транслируются..
 * `pubDate` _optional_ **Date object or date string** The publication date for content in the feed **(Будет удалено)**
 
 *Будет добавлено в новых версиях turbo:analytics, turbo:adNetwork*
 
#### Добавление страницы в канал
```js
feed.item(itemOptions);
```

##### itemOptions

 * `title` **string** Заголовок страницы.
 * `image_url` **url string** Адрес изображения, которое используется в качестве обложки. Изображение может быть в любом формате.
 * `url` **url string** URL страницы сайта, для которой нужно сформировать Турбо-страницу.
 * `author` _optional_  **string**  Автор статьи, размещенной на странице.
 * `date` **string** Время публикации контента на сайте источника.
 * `content` **string** Содержимое страницы
 
 *Будет добавлено в новых версиях turbo:source, turbo:topic, yandex:related, menu, pubDate как алиас date*
 
##### Получение XML

```js
var xml = feed.xml();
```
Вернёт XML как строку.

## Пример использования

```js
var TR = require('turbo-rss');

/* lets create feed */
var feed = new TR({
    title: 'title',
    description: 'description',
    link: 'http://example.com',
});

/* loop over data and add to feed */
feed.item({
    title:  'item title',
    image_url: 'http://example.com/example.png',
    url: 'http://example.com/article4?this&that',
    author: 'LightAir',
    date: 'May 27, 2012',
    content: '<p>hello</p>'
});

// cache the xml to send to clients
var xml = feed.xml();
```

## Тестирование

Для запуска тестов выполните `npm test`. На текущий момен покрытие тестами не 100%

```sh
$ npm test
```
