'use strict';

var express = require('express'),
    path = require('path'),
    _ = require('underscore'),
    oa = require('./server/utils/oauth'),
    app = express(),
    CoinLaundry = require('./server/coinlaundryApp'),
    db = require('./server/db/context').db;

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({ 
    key: 'coinlaundry', 
    secret: 'theleague', 
    proxy: true 
}));

app.use(app.router);
app.use(express.static('C:\\Users\\IBM_ADMIN\\Projects\\champions-club\\public\\auction'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.coinlaundry = new CoinLaundry(app, db);

var server = app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
