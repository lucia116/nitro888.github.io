let chat	= new function() {
	socket:null,
	this.start	= function(output,input,url,game='',ch=0) {
		$(input).on('keyup', function (e) {
		    if (e.keyCode == 13 && chat.socket!=null) {
		    		if($(input).val()=="")
		    			return;    		    		
		    		let message = $(input).val();
		    		$(input).val('');
		    		chat.socket.emit('chat',{game:game,ch:ch,msg:message});
		    }
		});
		chat.socket	= io(url);
    		chat.socket.on('chat', function(data) {	    			
    			$(output).append($('<li>').html(data));
	    		$(output).scrollTop($(output)[0].scrollHeight);
    		});
    		chat.socket.on('chatMe', function(data) {	    			
    			$(output).append($('<li>').html('<b>'+data+'</b>'));
	    		$(output).scrollTop($(output)[0].scrollHeight);
    		});
	}
}