/**
 * Construct a Minesweeper games
 * @param idMinesweeper of the element to append the table
 * @param idMinesLeft of the element mines-left
 * @param idTimesElapsed of the element times-elapsed
 * @param columns number of columns to display
 * @param rows  number of rows to display
 * @param mines number of mines
 * @constructor
 */
function Minesweeper(idMinesweeper,idMinesLeft,idTimesElapsed,rows,columns,mines){
    this.rows = rows;
    this.columns = columns;
    this.mines = mines;
    this.$minesweeper = $('#'+idMinesweeper);
    this.$mineLeft = $('#'+idMinesLeft);
    this.$timesElapsed = $('#'+idTimesElapsed);
    this.minefields = [];
    this.isFinished = false;
    this.timer = false;
    this.counterMineLeft = mines;
    this.isDead = false;

    this.$mineLeft.text(mines);
    this.$timesElapsed.text(0);
}

/**
 * Restart Minesweeper
 */
Minesweeper.prototype.restartGame = function(){
    // reset values
    this.isFinished = false;
    this.isDead = false;
    this.minefields = [];
    this.stopTimer();
    this.counterMineLeft = this.mines;
    this.$mineLeft.text(this.counterMineLeft);
    this.changeBob('smile');
    this.$mineLeft.text(this.counterMineLeft);
    this.$timesElapsed.text(0);
    this.startGame();
};

/**
 * Make the grid and put mines
 */
Minesweeper.prototype.startGame = function(){

    // locale variables
    var row;
    var column;
    var mineCase;
    var $this = this;

    // make the grid
    var table = $('<table class="table-minesweeper">');
    for(row = 0; row < this.rows; row++){
        var tr = $('<tr>');
        this.minefields.push([]);
        for(column = 0; column < this.columns; column++){
            var td = $('<td class="case">');
            mineCase = new MineCase(td,row,column);
            this.minefields[row].push(mineCase);
            tr.append(td);
            (function(mineCase){
                td.click(function () {
                    $this.startTimer();
                    if(!$this.isFinished && mineCase.isClose())
                        $this.mineCaseClicked(mineCase);
                });
                td.contextmenu(function(){
                   if(!$this.isFinished && mineCase.isNotOpen()){
                       $this.mineCaseRightClicked(mineCase);
                   }
                    return false;
                });
            })(mineCase);
        }
        table.append(tr);
    }
    this.$minesweeper.children().remove();
    this.$minesweeper.append(table);

    // put the mines
    var minePlaced = 0;
    while(minePlaced < this.mines) {
        var randColumn = randBetween(0,this.columns);
        var randRow = randBetween(0,this.rows);
        mineCase = this.minefields[randRow][randColumn];
        if (!mineCase.isMined) {
            mineCase.isMined = true;
            minePlaced++;
        }
    }

    // put numbers
    for(row = 0; row < this.rows; row++){
        for(column = 0; column< this.columns; column++) {
            if (!this.minefields[row][column].isMined) {
                var number = 0;
                // if mine is left
                if (column - 1 >= 0 && this.minefields[row][column-1].isMined)
                    number++;
                // if mine is right
                if (column + 1 < this.columns && this.minefields[row][column+1].isMined)
                    number++;
                // if mine is top
                if (row - 1 >= 0 && this.minefields[row-1][column].isMined)
                    number++;
                // if mine is bottom
                if (row + 1 < this.rows && this.minefields[row+1][column].isMined)
                    number++;
                // if mine is bottom left
                if (row - 1 >= 0 && column - 1 >= 0 && this.minefields[row-1][column-1].isMined)
                    number++;
                // if mine is bottom right
                if (row - 1 >= 0 && column + 1 < this.columns && this.minefields[row-1][column+1].isMined)
                    number++;
                //if mine is top left
                if (row + 1 < this.rows && column - 1 >= 0 && this.minefields[row+1][column-1].isMined)
                    number++;
                //if mine is top right
                if (row + 1 < this.rows && column + 1 < this.columns && this.minefields[row+1][column+1].isMined)
                    number++;
                this.minefields[row][column].number = number;
            }
        }
    }
};

/**
 * Start the timer
 */
Minesweeper.prototype.startTimer = function(){
    var $this = this;
    if(!this.timer){
        this.timer=setInterval(function(){
            $this.$timesElapsed.text(parseInt($this.$timesElapsed.text())+1);
        },1000);
    }
};

/**
 * Stop the timer
 */
Minesweeper.prototype.stopTimer = function () {
    clearInterval(this.timer);
    this.timer = false;
};

/**
 * Display all mines
 */
Minesweeper.prototype.displayMines = function(){
    for(var row = 0; row < this.rows; row++){
        for(var column = 0; column< this.columns; column++){
            if(this.minefields[row][column].isMined){
                this.minefields[row][column].element.addClass('mine');
            }
        }
    }
};

/**
 * Open mine case and their neighbours
 * @param mineCase mine case to open
 */
Minesweeper.prototype.openMineCase = function(mineCase){
    var $this = this;

    /**
     * Private function if mineCase is not open this neighbours
     * @param row of the mine case
     * @param column of the mine case
     */
    function openNeighbourMineCase(row,column){
        var mineCase = $this.minefields[row][column];
        //if the case is flagged or closed I reveal this neighbour
        if(mineCase.number==0 && mineCase.isNotOpen()){
            $this.openMineCase(mineCase);
        }
        mineCase.open();
        if(mineCase.isFlag()){
            $this.counterMineLeft++;
            $this.$mineLeft.text($this.counterMineLeft);
        }
    }

    if(!mineCase.isMined){
        if(mineCase.isFlag()){
            this.counterMineLeft++;
            this.$mineLeft.text(this.counterMineLeft);
        }

        mineCase.open();
    }

    if(mineCase.number == 0){

        // if not mine on left
        if (mineCase.column - 1 >= 0 && !this.minefields[mineCase.row][mineCase.column-1].isMined)
            openNeighbourMineCase(mineCase.row,mineCase.column-1);

        // if not mine on right
        if (mineCase.column + 1 < this.columns && !this.minefields[mineCase.row][mineCase.column+1].isMined)
            openNeighbourMineCase(mineCase.row,mineCase.column+1);

        // if not mine on top
        if (mineCase.row - 1 >= 0 && !this.minefields[mineCase.row-1][mineCase.column].isMined)
            openNeighbourMineCase(mineCase.row-1,mineCase.column);

        // if not mine on bottom
        if (mineCase.row + 1 < this.rows && !this.minefields[mineCase.row+1][mineCase.column].isMined)
            openNeighbourMineCase(mineCase.row+1,mineCase.column);

        // if not mine on bottom left
        if (mineCase.row - 1 >= 0 && mineCase.column - 1 >= 0 && !this.minefields[mineCase.row-1][mineCase.column-1].isMined)
            openNeighbourMineCase(mineCase.row-1,mineCase.column-1);

        // if not mine on bottom right
        if (mineCase.row - 1 >= 0 && mineCase.column + 1 < this.columns && !this.minefields[mineCase.row-1][mineCase.column+1].isMined)
            openNeighbourMineCase(mineCase.row-1,mineCase.column+1);

        // if not mine on top left
        if (mineCase.row + 1 < this.rows && mineCase.column - 1 >= 0 && !this.minefields[mineCase.row+1][mineCase.column-1].isMined)
            openNeighbourMineCase(mineCase.row+1,mineCase.column-1);

        // if not mine on top right
        if (mineCase.row + 1 < this.rows && mineCase.column + 1 < this.columns && !this.minefields[mineCase.row+1][mineCase.column+1].isMined)
            openNeighbourMineCase(mineCase.row+1,mineCase.column+1);
    }
};

/**
 * This method must be use when user click on a td
 * @param mineCase mine case clicked
 */
Minesweeper.prototype.mineCaseClicked = function(mineCase){
    if(mineCase.isMined){
        this.displayMines();
        this.isDead = true;
        this.isFinished = true;
        mineCase.element.css('background-color','red');
    } else {
        this.openMineCase(mineCase);
    }
    this.gameOver();
};

/**
 * This method must be use when user right click on a td
 * @param mineCase mine case right clicked
 */
Minesweeper.prototype.mineCaseRightClicked = function(mineCase){
    mineCase.changeFlag();
    if(mineCase.isFlag()){
        this.counterMineLeft--;
    } else{
        this.counterMineLeft++;
    }
    this.$mineLeft.text(this.counterMineLeft);
    this.gameOver();
};

Minesweeper.prototype.gameOver = function(){
    if(this.isFinish()){
        if(this.isDead){
            this.changeBob("dead");
        }else {
            this.changeBob('winner');
        }
        this.stopTimer();
    }
};

/**
 * Check if the party is finish
 * @returns {boolean}
 */
Minesweeper.prototype.isFinish = function(){
    if(!this.isFinished){
        for(var row =0; row < this.rows;row++){
            for(var column=0; column < this.columns; column++){
                var mineCase = this.minefields[row][column];
                if( (!mineCase.isMined && mineCase.isFlag()) || (mineCase.isMined && !mineCase.isFlag()) || (!mineCase.isMined && mineCase.isClose())){
                    return false;
                }
            }
        }
        this.isFinished = true;
    }
    return this.isFinished;
};

Minesweeper.prototype.changeBob = function(clazz){
    $('#bob').removeClass().addClass(clazz);
};