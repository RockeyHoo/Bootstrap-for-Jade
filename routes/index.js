sql = require('mssql');
/*
 * GET home page.
 */

var brand = 'Wechat';
var copyright = 'RockeyHoo';

// DB conf
var config = {
    user: 'sa',
    password: 'WWWqqassetcom2014',
    server: '121.42.42.197',
    database: 'test'
};

exports.index = function (req, res) {
    res.redirect('/listMedia');
};

exports.listMedia = function (req, res) {
    console.log("listMedia : begin ");
    var qry = "select * from wechat_medias";
    var connection = new sql.Connection(config, function (err) {
        var request = new sql.Request(connection);
        request.query(qry, function (err, data) {
            console.log("query Date =>" + data);
            res.render('listMedia', {title: 'Home', id: 'listMedia', data: data, brand: brand, copyright: copyright})
        });
    });
};

exports.about = function (req, res) {
    res.render('about', {title: 'About', id: 'about', brand: brand, copyright: copyright})
};
