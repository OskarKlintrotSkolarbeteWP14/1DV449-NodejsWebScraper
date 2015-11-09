import express = require('express');

export class Evening {
    private _time: string;
    private _day: number;
    private _movie: string;

    constructor(Time: string, Day: number, Movie: string) {
        this._time = Time;
        this._day = Day;
        this._movie = Movie;
    }

    getTime = () => this._time;
    getDay = () => this._day;
    getMovie = () => this._movie;
}