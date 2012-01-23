/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function(){
    var socket = io.connect('http://localhost:3000');
    
    socket.on('socket_status', function (data) {
        
        $('#status').html(data.socket_status);
        console.log(data.socket_status);
    });
    
    socket.on('mqtt_message', function (data) {
           
           //console.log($('#topic/'+data.topic))
        if($('#topic'+data.topic.replace(/\//g,'')).html())
        {
            $('#topic'+data.topic.replace(/\//g,'')).prepend('<li>'+data.message+'</li>');
            
            if($('#topic'+data.topic.replace(/\//g,'')).children('li').length > 5)
            {
                $('#topic'+data.topic.replace(/\//g,'')).children('li').slice(5).remove();
            }
        }
        else
        {
            $('#topics').append('<li>'+data.topic+' <ul id="topic'+data.topic.replace(/\//g,'')+'"><li>'+data.message+'</li></ul></li>')
        }
           
        console.log(data);
    });
    
});

