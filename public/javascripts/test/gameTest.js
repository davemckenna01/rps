TestCase("TC 1 - Game() constructor", {
  setUp: function () {
    this.rps = new RPS();
  },

  "test constructor must take 1 arg, a game id": function () {

    var that = this;

    assertException(
      function(){
        var game = that.rps.Game();
      },
      'Error'
    );

    assertNoException(
      function(){
        var game = that.rps.Game('abc123');
      }
    );    

  },

  "test only one Game should ever be created": function () {

    var that = this;

    var game1 = that.rps.Game('abc123');

    assertException(
      function(){
        var game2 = that.rps.Game('abc456');
      },
      'Error'
    );

  },


});