var RPS = function() {

	var gameCreated = false;

	this.HomePage = function(){
		
		this.initCreateBtn = function(){
			$('#createGame').one('click', this.createGame);
		};

		this.createGame = function(e){
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
		};

	};

	this.Game = function(id){

		if (gameCreated){
			throw new Error('Only 1 Game may be instantiated.');
		}

    if (arguments.length <= 0 || typeof arguments[0] != 'string' ){
      throw new Error('Game() takes exactly 1 string arg ');
    }

    if (!gameCreated){
    	gameCreated = true;
    }


	};

};
