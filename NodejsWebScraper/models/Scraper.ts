import express = require('express');
import request = require('request');
import cheerio = require('cheerio');
import url = require('url');
import async = require('async');
import Page = require('../models/Page');
import Evening = require('../models/Evening');

export class Scraper {
    private pagesToScrape: string[] = ["calendar", "cinema", "dinner"];

    private url: string;
    private allLinks: string[] = new Array();
    private allBodys: Cheerio[] = new Array();

    private allPages: Array<Page.Page> = new Array<Page.Page>(); // A page consits of a link and a body

    /*
     *  Four variables used for storing temperate data. If using `return` `callback()` won't be called
     *  and if using `callback()` we block `return`. Hence the reason for not using pure functions.
     */
    private tempForScrapeLinks: string[] = new Array();
    private tempForScrapeBody: Cheerio;
    private tempForCinema: JSON;
    private tempDaysForCinema: boolean[] = new Array();

    private possibleEvenings: Evening.Evening[] = new Array();

    constructor(url: string, callback) {
        this.url = this.fixLastSlashOnUrl(url);
        async.series([
            (callback) => {
                this.init(callback);
            }
        ], (err, result) => {
            if (err)
                console.log(err);
            callback();
        });
         
    }

    getPossibleEveningsAndMovies(): any {
        return this.possibleEvenings;
    }

    private init(callback): void {
        async.series([
            (callback) => {
                this.scrapeAllLinks(callback);
            },
            (callback) => {
                this.scrapeAllBodys(callback);
            },
            (callback) => {
                let bodys: Cheerio[] = new Array();
                this.allPages.forEach((value: Page.Page) => {
                    if (value.getLink().indexOf(this.pagesToScrape[0]) >= 0) {
                        bodys.push(value.getBody());
                    }
                });
                this.tempDaysForCinema = this.getDatesFromCalendar(bodys);
                callback();
            },
            (callback) => {
                let cinema: Cheerio = this.getBody(this.allPages, this.pagesToScrape[1]);
                if (cinema != undefined)
                    this.getMoviesFromCinema(this.tempDaysForCinema, cinema, callback);
                else
                    callback();
            },
            (callback) => {
                let dinner: Cheerio = this.getBody(this.allPages, this.pagesToScrape[2]);
                if (dinner != undefined)
                    this.getMatchMoviesAndDinner(this.tempForCinema, dinner, callback);
                else
                    callback();
            },
        ], (err, result) => {
            callback();
        });
    }

    private getBody(array: Page.Page[], linkToFind: string): Cheerio {
        let ret: Cheerio;
        array.forEach((value: Page.Page, index: number, array: Page.Page[]) => {
            if (value.getLink().indexOf(linkToFind) > -1)
                ret = value.getBody();
        });
        return ret;
    }

    private scrapeAllLinks(callback): void{

        async.series([
            // Scrapes links from page
            (callback) => {
                this.scrapeLinks(this.url, callback);
            },
            // Scrapes links one level down
            (callback) => {
                if (this.tempForScrapeLinks)
                    // async.each since we need to use this.scrapeLinks() again UPDATE: .sync is parallell
                    async.each(this.tempForScrapeLinks,
                        (item: string, callback) => {
                                async.series([
                                    // Scrape links
                                    (callback) => {
                                        this.scrapeLinks(item, callback);
                                    },
                                    (callback) => {
                                        if (this.tempForScrapeLinks)
                                            this.tempForScrapeLinks.forEach((value: string, index, array) => {
                                                if (this.tempForScrapeLinks.indexOf(value) == -1)
                                                    this.tempForScrapeLinks.push(value);
                                            });
                                        callback();
                                    },
                                    // Add links
                                    (err) => {
                                        callback();
                                }]);
                        },
                        (err) => {
                            callback();
                        });
            }
        ],
            (err, result) => {
                callback();
            });
    }

    private scrapeLinks(urlToScrape, callback): void {
        urlToScrape = this.fixLastSlashOnUrl(urlToScrape);
        let hrefs: string[] = new Array();

        request(urlToScrape, (error, response, html) => {
            console.log("request sent");
            if (!error) {
                let $ = cheerio.load(html);

                $('a').each((index, element) => {
                    let a: any = $(element);
                    a = url.resolve(urlToScrape, a.attr("href"));
                    hrefs.push(a);
                });
            } else {
                console.log(error);
            }
            hrefs.forEach((value: string) => { this.tempForScrapeLinks.push(value) });
            if (typeof callback == "function")
                callback();
        });
    }

    private fixLastSlashOnUrl(url: string): string {
        if (url.slice(-1) == "/" || url.slice(-1) == "l")
            return url;
        else
            return url + "/";
    }

    private scrapeAllBodys(callback): void {
        let pages: Page.Page[] = new Array<Page.Page>();

        async.each(this.tempForScrapeLinks, // UPDATE: .each is parallell
            (item: string, callback) => {
                async.series([
                    (callback) => {
                        this.scrapeBody(item, callback);
                    },
                    (callback) => {
                        this.allPages.push(new Page.Page(item, this.tempForScrapeBody));
                        callback();
                    },
                    (err) => {
                        callback();
                    },
                ]);
            },
            (err) => {
                callback();
            });
    }

    private scrapeBody(urlToScrape: string, callback): void {
        urlToScrape = this.fixLastSlashOnUrl(urlToScrape);

        request(urlToScrape, (error, response, html) => {
            console.log("request sent");
            if (!error) {
                let $ = cheerio.load(html);
                this.tempForScrapeBody = $('html');
            } else {
                console.log(error);
            }
            callback();
        });
    }

    private getDatesFromCalendar(bodys: Cheerio[]): boolean[] {
        let ret: boolean[] = [true, true, true];

        bodys.forEach((item: Cheerio, index: number) => {
            let $ = cheerio.load(item.toString());
            let tempBool: boolean[] = new Array();

            $('tbody').children('tr').children('td').each((index: number, element: CheerioElement) => {
                if ($(element).text().toLowerCase() != "ok")
                    ret[index] = false;
            });
        });
        return ret;
    }

    private getMoviesFromCinema(possibleDays: boolean[], cinema: Cheerio, callback): void {
        let $ = cheerio.load(cinema.toString());
        let movies: string[] = new Array();
        let days: string[] = new Array();
        let avalibleMovies: string[][];
        let tempMovieObject: any[] = new Array();

        let getOptions = (tag: string): string[] => {
            let ret: string[] = new Array();
            $(tag).children('option').each((index: number, element: CheerioElement) => {
                if ($(element).val())
                    ret.push($(element).text());
            });
            return ret;
        };

        let getURL = (day: string, movie: string): string => this.url + "cinema/check?day=" + day + "&movie=" + movie;

        let getJSON = (url: string, day: number, callback) => {
            request(url, (error, response, html) => {
                console.log("request sent");
                if (!error) {
                    JSON.parse(html).filter(m => m.status).forEach((item: Movie) => {
                        tempMovieObject.push({
                            "time": item.time,
                            "day": day - 1,
                            "movie": movies[+item.movie - 1]
                        });
                    });
                } else {
                    console.log(error);
                }
                callback();
            });
        };

        movies = getOptions('select#movie');
        days = getOptions('select#day');

        async.forEachOf(possibleDays,
            ((item: boolean, index: number, callback) => {
                if (item) {
                    let day: string = ("0" + (index + 1)).slice(-2);
                    async.forEachOf(movies,
                        ((item: string, index: number, callback) => {
                            let movie: string = ("0" + (index + 1)).slice(-2);
                            let url = getURL(day, movie);
                            getJSON(url, +day, callback); 
                        }),
                        (err) => {
                            this.tempForCinema = JSON.parse(JSON.stringify(tempMovieObject)); // TS ugly hack
                            callback()
                        });
                } else
                    callback()
            }),
            (err) => {
                callback()
            });
    }

    private getMatchMoviesAndDinner(movies: JSON, dinner: Cheerio, callback): void {
        let $ = cheerio.load(dinner.toString());
        let htmlElements: string[] = ['.WordSection2', '.WordSection4', '.WordSection6'];
        let days: any[] = new Array();

        htmlElements.forEach((item: string, index: number, array: string[]) => {
            $(item).children('p').children('input').siblings('span').each((key: number, element: CheerioElement) => {
                days.push({
                    "day": index,
                    "time": $(element).text().slice(0, 2)
                    });
            });
        });

        days.forEach((item: any) => {
            // Really ugly fulhack in order to build it and publish to Azure
            JSON.parse(JSON.stringify(movies)).filter(m => m.day == item.day && (+m.time.slice(0, 2) + 2) <= +item.time).forEach((value: Movie) => {
                this.possibleEvenings.push(new Evening.Evening(value.time, +value.day, value.movie));
            });
        });

        callback();
    }
}