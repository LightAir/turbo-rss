## WIP

## turbo-rss

[![Maintainability](https://api.codeclimate.com/v1/badges/6525d2aabf20185b68b6/maintainability)](https://codeclimate.com/github/LightAir/turbo-rss/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6525d2aabf20185b68b6/test_coverage)](https://codeclimate.com/github/LightAir/turbo-rss/test_coverage)
[![Build Status](https://travis-ci.org/LightAir/turbo-rss.svg)](https://travis-ci.org/LightAir/turbo-rss)
[![npm](https://img.shields.io/badge/npm%20package-1.0.7-blue.svg?longCache=true&style=flat)](https://www.npmjs.com/package/turbo-rss)
![license](https://img.shields.io/packagist/l/doctrine/orm.svg?longCache=true&style=flat)

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
 * `related` _optional_ **array** Аффилированные ссылки `yandex:related` в конце статьи.
 * `relatedfinity` _optional_  **bool** Непрерывная лента статей
 
 *Будет добавлено в новых версиях turbo:source, turbo:topic, menu, pubDate как алиас date*
 
###### related array
  related должен содержать массив объектов со следующими опциями:
  
  * `link` **string** ссылка на статью'
  * `image_url` **string** ссылка на изображение к статье
  * `text` **string** текст ссылки
 
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
    content: '<p>hello</p>',
    related: [{
      link: 'http://example.com/related/post1',
      image_url: 'http://example.com/i/img1.jpg',
      text: 'related link text 1'
    }, {
      link: 'http://example.com/related/post2',
      image_url: 'http://example.com/i/img2.jpg',
      text: 'related link text 2'
    }]
});

// cache the xml to send to clients
var xml = feed.xml();
```

## Тестирование

Для запуска тестов выполните `npm test`. На текущий момен покрытие тестами не 100%

```sh
$ npm test
```
