/**
 * Created by koc9n on 8/20/2016 AD.
 */
module.exports = {
    updatedAt: {type: Date, default: Date.now()},
    createdAt: {type: Date, default: Date.now()},
    publishedAt: Date,
    title: String,
    author: String,
    url: String,
    deleted: {type: Boolean, default: false}
};