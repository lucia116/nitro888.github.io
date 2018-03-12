let chat	= new function() {
	socket:null,
	this.start	= function(output,input,url,nick='',game='',ch=0) {
		$(input).on('keyup', function (e) {
		    if (e.keyCode == 13 && chat.socket!=null) {
		    		if($(input).val()=="")
		    			return;    		    		
		    		let msg = $(input).val();
		    		nick		= nick.length>5?nick.substring(2,10):nick;
		    		$(input).val('');
		    		chat.socket.emit('chat',{'game':game,'ch':ch,'nick':nick,'msg':msg});
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