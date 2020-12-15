## turbo-rss

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a0d1268e1f064b31a2d4c8d52a9754e0)](https://app.codacy.com/gh/LightAir/turbo-rss?utm_source=github.com&utm_medium=referral&utm_content=LightAir/turbo-rss&utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/6525d2aabf20185b68b6/maintainability)](https://codeclimate.com/github/LightAir/turbo-rss/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6525d2aabf20185b68b6/test_coverage)](https://codeclimate.com/github/LightAir/turbo-rss/test_coverage)
[![Build Status](https://travis-ci.org/LightAir/turbo-rss.svg)](https://travis-ci.org/LightAir/turbo-rss)
[![npm](https://img.shields.io/badge/npm%20package-1.0.7-blue.svg?longCache=true&style=flat)](https://www.npmjs.com/package/turbo-rss)
![license](https://img.shields.io/packagist/l/doctrine/orm.svg?longCache=true&style=flat)

>Генератор RSS разметки для сервиса Турбо-страницы https://yandex.ru/support/webmaster/turbo/connection.html

### Использование

#### Создание канала

```js
var TR = require('turbo-rss');

var feed = new TR(feedOptions);
```

##### `Опции канала`

 * `title` **string** Название RSS-канала.
 * `link` **url string** Домен сайта, данные которого транслируются.
 * `description` _optional_ **string** Описание канала одним предложением. Не используйте HTML-разметку.
 * `language` _optional_ **string** Язык статьи по стандарту ISO 639-1. По умолчанию ru.
 
 *Будет добавлено в новых версиях turbo:analytics, turbo:adNetwork, на текущий момент можно добавить в интерфейсе Яндекс Вебмастер*
 
#### Добавление страницы в канал
```js
feed.item(itemOptions);
```

##### itemOptions

 * `title` **string** Заголовок страницы.
 * `image_url` _optional_ **url string** Адрес изображения, которое используется в качестве обложки. Изображение может быть в любом формате.
 * `link` **url string** URL страницы сайта, для которой нужно сформировать Турбо-страницу.
 * `author` _optional_  **string**  Автор статьи, размещенной на странице.
 * `date` или `pubDate` **string** Время публикации контента на сайте источника. Передается в формате RFC-822.
 * `content` **string** Содержимое страницы
 * `menu` _optional_ **array** Внимание! Меню будет отображаться только в том случае, если в настройках на странице Яндекс Вебмастер -> Турбо-страницы -> Настройки, содержимое 'Меню Турбо-страниц' пустое!
 * `related` _optional_ **array** Аффилированные ссылки `yandex:related` в конце статьи. Вы можете разместить ссылки на другие ресурсы или настроить отображение непрерывной ленты статей, реализованной, например с помощью AJAX.
 * `relatedfinity` _optional_  **bool** Непрерывная лента статей
 * `turboSource` _optional_ **string** URL страницы-источника, который можно передать в Яндекс.Метрику.
 * `turboTopic` _optional_ **string** Заголовок страницы, который можно передать в Яндекс.Метрику.
 * `goals` _optional_ **array** массив типа: { _id_ - внутренний идентификатор цели (turbo-goal-id), _name_ - имя цели, _counter_id_ - id счётчика яндекс-метрики }
 * `turboEnabled`_optional_ **bool** Принудительная установка атрибута "turbo". По умолчанию true. Установка в false позволит скрыть отображение турбо-страницы
###### menu array
  menu должен содержать массив объектов со следующими опциями:
  
  * `link` **url string** ссылка
  * `text` **string** текст ссылки. не должен содержать html
 
###### related array
  related должен содержать массив объектов со следующими опциями:
  
  * `link` **url string** ссылка на статью
  * `image_url` **url string** ссылка на изображение к статье
  * `text` **string** текст ссылки. Не должен содержать html
 
##### Получение XML

```js
var xml = feed.xml();
```
Вернёт XML как строку.

## Пример использования

```js
var TR = require('turbo-rss');

var feed = new TR({
    title: 'title',
    description: 'description',
    link: 'http://example.com',
});

feed.item({
    title:  'item title',
    image_url: 'http://example.com/example.png',
    url: 'http://example.com/article4?this&that',
    author: 'LightAir',
    date: 'May 27, 2012',
    content: '<p>hello</p>',
    goals: [{
        type: "yandex",
        id: "turbo-goal-id",
        counter_id: "12345",
        name: "order",
    }],
    menu: [{
          link: 'http://example.com/',
          text: 'Главная'
        }, {
          link: 'http://example.com/about',
          text: 'О сайте'
        }]
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

var xml = feed.xml();
```

## Тестирование

Для запуска тестов выполните `npm test`.

```sh
$ npm test
```

## Спасибо

@jahglow

@vvmspace

@crackosok