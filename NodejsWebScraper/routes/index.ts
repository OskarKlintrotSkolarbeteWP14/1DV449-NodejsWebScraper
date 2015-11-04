import express = require('express');
import Scraper = require('../models/Scraper');

/*
 * GET home page.
 */
export function index(req: express.Request, res: express.Response) {
    res.render('index', { title: 'Duschskrapan', year: new Date().getFullYear() });
};

export function about(req: express.Request, res: express.Response) {
    res.render('about', { title: 'Om sidan', year: new Date().getFullYear(), message: '' });
};


/*
 * POST home page.
 */
export function scrape(req: express.Request, res: express.Response) {
    var scraper = new Scraper.Scraper(req.body.urlToScrape);
    scraper.test();
    index(req, res);
};
