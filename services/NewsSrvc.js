/**
 * Created by koc9n on 8/20/2016 AD.
 */
var moment = require('moment');
var Promise = require("bluebird");
var rp = Promise.promisifyAll(require('request-promise'));

module.exports.updateNews = function () {
    return Promise.resolve(rp(
        {
            "uri": "http://hn.algolia.com/api/v1/search_by_date?query=nodejs",
            "json": true
        }))
        .then(function (result) {
            var newsPromises = [];
            var newsList = result.hits;

            for (var i = 0; i < newsList.length; i++) {
                var newsFromAPI = {
                    title: newsList[i].title || newsList[i].story_title,
                    author: newsList[i].author,
                    url: newsList[i].url || newsList[i].story_url,
                    publishedAt: newsList[i].created_at
                };
                if (newsFromAPI.title && newsFromAPI.url) { //case when both urls and titles are not null
                    News.findOne({
                            author: newsFromAPI.author,
                            title: newsFromAPI.title
                        }).exec()
                        .bind({newsFromAPI: newsFromAPI})
                        .then(
                            function (newsFromDB) {
                                if (!!newsFromDB && !newsFromDB.deleted) {
                                    newsPromises.push(newsFromDB.update(this.newsFromAPI));
                                } else {
                                    newsPromises.push(News.create(this.newsFromAPI));
                                }
                            }
                        );
                }
            }
            return Promise.all(newsPromises).tap(console.log(moment().format("LLL") + " News updated. "));
        })
};

module.exports.getNews = function () {
    return News.find({deleted: false}).sort({publishedAt: -1});
};

module.exports.deleteNews = function (id) {
    return News.findById(id)
        .then(function(news) {
            return news.update({deleted: true});
        })
};




