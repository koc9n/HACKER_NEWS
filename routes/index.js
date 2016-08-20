var express = require('express');
var router = express.Router();
var newsSrvc = require('../services/NewsSrvc');
var moment = require('moment');

/**
 * Get main page with news list
 */
router.get('/', function (req, res, next) {
    newsSrvc.getNews()
        .then(function (result) {
            res.render('index', {news: result, moment: moment});
        })
        .catch(function (e) {
            next(e);
        });
});

/**
 * Remove news by id
 */
router.get('/news/:id/delete', function (req, res, next) {
    newsSrvc.deleteNews(req.params.id)
        .then(function () {
            res.redirect('/');
        })
        .catch(function (e) {
            next(e);
        });
});

module.exports = router;
