var rps = function() {

return {

	initCommon: function(){
	},
		
	initCreateBtn : function (){
		$('#createGame').one('click', this.createGame);
	},

	createGame : function (e){
		e.preventDefault();

		$.ajax({
			url: '/create',
			type: 'POST',
			dataType: 'json',
			//context: some dom element,
			complete: function(res, status){
				if (res.status == 200) {
					var data = $.parseJSON(res.responseText);
					window.location.href='/game/' + data.id;
				}
			}
		});


		return false;		
	}
	
}
}();
