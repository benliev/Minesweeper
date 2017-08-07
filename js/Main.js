(function(){

    var minesweeper = new Minesweeper('table-minesweeper','mines-left','times-elapsed',15,28,70);
    minesweeper.startGame();

    $('#bob').click(function(){
        minesweeper.restartGame();
    });

    $('#beginner').click(function(){
        $("#intermediate").removeClass("pressed");
        $("#expert").removeClass("pressed");
        $("#beginner").addClass("pressed");
        minesweeper.columns = 8;
        minesweeper.rows = 8;
        minesweeper.mines = 10;
        minesweeper.restartGame();
    });

    $('#intermediate').click(function(){
        $("#beginner").removeClass("pressed");
        $("#expert").removeClass("pressed");
        $("#intermediate").addClass("pressed");
        minesweeper.columns = 16;
        minesweeper.rows = 16;
        minesweeper.mines = 40;
        minesweeper.restartGame();
    });

    $('#expert').click(function(){
        $("#intermediate").removeClass("pressed");
        $("#beginner").removeClass("pressed");
        $("#expert").addClass("pressed");
        minesweeper.columns = 31;
        minesweeper.rows = 16;
        minesweeper.mines = 99;
        minesweeper.restartGame();
    });
})();
