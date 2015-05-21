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
            res.render('listMedia', {title: 'Home', id: '/listMedia', data: data, brand: brand, copyright: copyright})
        });
    });
};

exports.view = function (req, res) {
    var id = req.params.id;
    var qry = "select * from wechat_medias where id=" + id;
    console.log("sql = " + qry);
    var connection = new sql.Connection(config, function (err) {
        var request = new sql.Request(connection);
        request.query(qry, function (err, list) {
            res.render('view', {title: 'Home', id: '/listMedia', data: list[0], brand: brand, copyright: copyright})
        });
    });
};

exports.about = function (req, res) {
    res.render('about', {title: 'About', id: '/about', brand: brand, copyright: copyright})
};

exports.theme2 = function (req, res) {
    res.render('theme2', {title: 'About', id: '/theme', brand: brand, copyright: copyright})
};

exports.new = function (req, res) {
    res.render('new', {title: 'new', id: '/new', brand: brand, copyright: copyright})
};