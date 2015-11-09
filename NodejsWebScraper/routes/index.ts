import express = require('express');
import Scraper = require('../models/Scraper');
import async = require('async');
import Evening = require('../models/Evening');

var evenings: Evening.Evening[] = null;

/*
 * GET home page.
 */
export function index(req: express.Request, res: express.Response) {
    res.render('index', { title: 'Duschskrapan', year: new Date().getFullYear(), message: evenings });
};

export function about(req: express.Request, res: express.Response) {
    res.render('about', { title: 'Om sidan', year: new Date().getFullYear(), message: '' });
};


/*
 * POST home page.
 */
export function scrape(req: express.Request, res: express.Response) {
    let scraper: Scraper.Scraper;

    async.series([
        (callback) => {
            scraper = new Scraper.Scraper(req.body.urlToScrape, callback);
        }
    ], (err, result) => {
        console.log("New Scraper instantiated");
        evenings = scraper.getPossibleEveningsAndMovies();
        index(req, res);
    });
};
