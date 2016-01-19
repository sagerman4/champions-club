'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    logger = require('morgan'),
    favicon = require('serve-favicon'),
    path = require('path'),
    _ = require('underscore'),
    app = express(),
    ServerApp = require('./server/app');

// all environments
app.set('port', process.env.PORT || 3000);
app.use(favicon('./favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({
  extended: true
}));
app.use(methodOverride());
app.use(cookieParser());
app.use(cookieSession({ 
    key: 'championsclub', 
    secret: 'theleague', 
    proxy: true 
}));

app.use(app.router);
app.use(express.static('C:\\Users\\IBM_ADMIN\\Projects\\champions-club\\public\\auction'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.serverApp = new ServerApp(app);

var server = app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
