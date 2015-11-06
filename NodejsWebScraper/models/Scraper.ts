import express = require('express');
import request = require('request');
import cheerio = require('cheerio');
import url = require('url');
import async = require('async');
import Page = require('../models/Page');

export class Scraper {
    private pagesToScrape: string[] = ["calendar", "cinema", "dinner"];

    private url: string;
    private allLinks: string[] = new Array();
    private allBodys: Cheerio[] = new Array();

    private allPages: Array<Page.Page> = new Array<Page.Page>();

    private tempForScrapeLinks: string[] = new Array();
    private tempForScrapeBody: Cheerio;

    constructor(url: string, callback) {
        this.url = this.fixLastSlashOnUrl(url);
        // Async pattern for reference
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
                        //console.log(value.getLink());
                        //console.log(value.getBody().toString());
                    }
                });
                console.log("All: " + this.getDatesFromCalendar(bodys)); // Gets an array; [friday, saturday, sunday]
                callback();
            },
            (callback) => {
                //this.allPages.forEach((value: Page.Page) => {
                //    console.log(value.getLink());
                //});
                callback();
            },
        ], (err, result) => {
            callback();
        });
        /* // Async pattern for reference
         * async.series([
         *     (callback) => {
         *     }
         * ], (err, result) => { 
         * 
         * });
         */

        
    }
    log(): any {
        return this.tempForScrapeLinks;
        return this.allBodys;
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
                    // async.each since we need to use this.scrapeLinks() again
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
                    //console.log(a);
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

        async.each(this.tempForScrapeLinks,
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
                        console.log(err);
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
}