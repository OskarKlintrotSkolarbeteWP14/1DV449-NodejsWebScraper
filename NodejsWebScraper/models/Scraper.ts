import express = require('express');
import request = require('request');
import cheerio = require('cheerio');

export class Scraper {
    private url: string;
    constructor(url: string) {
        this.url = url;

        this.scrape();
    }
    test() {
        console.log(this.url);
    }
    scrape() {
        request('http://www.imdb.com/title/tt1229340/', function (error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);

                var title, release, rating;
                var json = { title: "", release: "", rating: "" };

                $('.header').filter(function () {
                    var data = $(this);
                    title = data.children().first().text();
                    release = data.children().last().children().text();

                    json.title = title;
                    json.release = release;

                    return true;
                })

                $('.star-box-giga-star').filter(function () {
                    var data = $(this);
                    rating = data.text();

                    json.rating = rating;

                    return true;
                })
            }

            console.log(json);
        });
    }
}