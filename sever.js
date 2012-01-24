var http			= require("http");
var fs				= require("fs");
var express			= require("express");
//var mqtt                        = require('mqttjs');
var mqtt                        = require('mqttjs');
var sys                         = require('sys');
var net                         = require('net');
var app_version                 = "0.0.1";
var app_port                    = 3000;
var app 			= express.createServer();
var controller                  = require("./util/controller");
var io                          = require('socket.io').listen(app);
var spawn                       = require('child_process').spawn;
var client                      = '';

app.configure(function(){
    app.use(express.logger({
        format: ':method :url :status'
    }));
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
    app.set('view engine', 'jade');
    app.register('.html', require('jade'));
});

app.use(express.favicon());



app.get('/', function(req, res){
    res.render('index.jade', {
        locals : {
            pageTitle : "MQTT Browser"
         
        }
    });
});

app.post('/broker', function(req, res){
    
    var ip = req.param('address', null);
    var topic = "$SYS/#";
    
    
        
    res.render('broker.jade', {
        locals : {
            pageTitle : "MQTT Browser",
            broker : ip
        }
    });
    
    io.sockets.on('connection', function (socket) {
    
        socket.emit('socket_status', {
            'socket_status': 'Connected to socket.io'
        });
    
        client = mqtt.createClient(1883, ip)
           
        client.connect({
            keepalive: 3000,
            client : 'MQTT Browser',
            clean : 1
        });

        client.on('connack', function(packet) {
            if (packet.returnCode === 0) {
                    
                socket.emit('socket_status', {
                    'socket_status' : 'Connected to '+ip
                });
                    
                client.subscribe({
                    topic: topic
                });
            } 
            else 
            {
                console.log('connack error %d', packet.returnCode);
                process.exit(-1);
            }
        });

        client.on('publish', function(packet) {
            io.sockets.emit('mqtt_message',{
                topic: String(packet.topic), 
                message : String(packet.payload)
            });
                
        //console.log('%s\t%s', packet.topic, packet.payload);
        });

        client.on('close', function() {
            //client = null;
            });

        client.on('error', function(e) {
            console.log('error %s', e);
        //process.exit(-1);
        });
        
        socket.on('disconnect', function(){
            client.disconnect();
            console.log('disconnected');
        });
    });
    
    
});

app.get('/topic', function(req, res){
    res.send('O Hai');
});


app.listen(3000);