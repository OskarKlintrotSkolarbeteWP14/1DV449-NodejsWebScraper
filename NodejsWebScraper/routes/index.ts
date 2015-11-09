import express = require('express');
import Scraper = require('../models/Scraper');
import async = require('async');
import Evening = require('../models/Evening');

/*
 * GET home page.
 */
export function index(req: express.Request, res: express.Response, message: Evening.Evening[] = null) {
    if (typeof message == "function")
        res.render('index', { title: 'Duschskrapan', year: new Date().getFullYear(), message: null });
    else 
        res.render('index', { title: 'Duschskrapan', year: new Date().getFullYear(), message: message });
};

export function about(req: express.Request, res: express.Response) {
    res.render('about', { title: 'Om sidan', year: new Date().getFullYear(), message: '' });
};


/*
 * POST home page.
 */
export function scrape(req: express.Request, res: express.Response) {
    let scraper: Scraper.Scraper;
    let evenings: Evening.Evening[];
    async.series([
        (callback) => {
            scraper = new Scraper.Scraper(req.body.urlToScrape, callback);
        }
    ], (err, result) => {
        console.log("New Scraper instantiated");
        evenings = scraper.getPossibleEveningsAndMovies();
        index(req, res, evenings);
    });
};
