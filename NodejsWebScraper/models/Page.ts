import express = require('express');
import cheerio = require('cheerio');

export class Page {
    private _link: string;
    private _body: Cheerio;

    constructor(Link: string, Body: Cheerio) {
        this._link = Link;
        this._body = Body;
    }

    getLink = () => this._link;
    getBody = () => this._body;
}

//export interface Page {
//    constructor(Link: string, Body: Cheerio);
//    getLink: string;
//    getBody: Cheerio;
//}