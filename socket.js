let socket	= new function() {
	this.io	=null,
	this.start	= function(output,input,url,callback,nick='',game='',ch=0) {
		nick		= nick.length>5?nick.substring(2,10):nick;
		$(input).on('keyup', function (e) {
		    if (e.keyCode == 13 && socket.io!=null) {
		    		if($(input).val()=="")
		    			return;    		    		
		    		let msg = $(input).val();
		    		$(input).val('');
		    		socket.io.emit('chat',{'game':game,'ch':ch,'nick':nick,'msg':msg});
		    }
		});
		socket.io	= io(url);
    		socket.io.on('chat', function(data) {	    			
    			$(output).append($('<li>').html(data));
	    		$(output).scrollTop($(output)[0].scrollHeight);
    		});
    		socket.io.on('chatMe', function(data) {	    			
    			$(output).append($('<li>').html('<b>'+data+'</b>'));
	    		$(output).scrollTop($(output)[0].scrollHeight);
    		});
    		socket.io.on('schedule', function(data) {
    			callback(data);
    		});
	},
	this.schedule	= function () {
		socket.io.emit('schedule');	
	}
}