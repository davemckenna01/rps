TestCase("TC 1 - check for basic properties required", {
    setUp: function () {
        this.game = game;
    },

    "should have an id prop": function () {

        assertEqual(this.game.hasOwnProperty('id'));

        // assertException(
        //   function(){
        //     var game = that.rps.Game();
        //   },
        //   'Error'
        // );

        // assertNoException(
        //   function(){
        //     var game = that.rps.Game('abc123');
        //   }
        // );    

    }

});