/**
 * Construct a MineCase
 * @param element of DOM
 * @param row the number of the row
 * @param column the number of the column
 * @constructor
 */
function MineCase(element,row,column) {

    this.STATE_CLOSE = 0;
    this.STATE_OPEN = 1;
    this.STATE_FLAG = 2;

    this.element = $(element);
    this.column = column;
    this.row = row;

    this.isMined = false;
    this.number = 0;
    this.state = this.STATE_CLOSE;
}
/**
 * Open the mine case
 */
MineCase.prototype.open = function () {
    this.element.removeClass('flagged');
    if(this.number > 0){
        this.element.text(this.number);
        // class open-3 for number >= 3
        this.element.addClass('open-'+(this.number >= 3 ? 3 : this.number));
    } else{
        this.element.addClass('open');
    }
    this.state = this.STATE_OPEN;
};

/**
 * Put a flag in the mine case
 */
MineCase.prototype.changeFlag = function(){
    if(this.isNotOpen()){
        if(this.isFlag()){
            this.element.removeClass('flagged');
            this.state = this.STATE_CLOSE;
        } else {
            this.element.addClass('flagged');
            this.state = this.STATE_FLAG;
        }
    }
};

/**
 * Return true if the state of the mine case is closed
 * @returns {boolean}
 */
MineCase.prototype.isClose = function(){
    return this.state == this.STATE_CLOSE;
};

/**
 * Return true if the state of the mine case is flagged
 * @returns {boolean}
 */
MineCase.prototype.isFlag = function(){
    return this.state == this.STATE_FLAG;
};

/**
 * Return true if the mine case is not open (flag or close)
 * @returns {boolean}
 */
MineCase.prototype.isNotOpen = function(){
    return !this.isOpen();
};

/**
 * Return true if the state of the mine case is opened
 * @returns {boolean}
 */
MineCase.prototype.isOpen = function(){
    return this.state == this.STATE_OPEN;
};