/**
 * Created by andrew on 6/14/14.
 */

//Test Code
/*
var testButton = document.getElementById("test");
if(testButton.addEventListener)
    testButton.addEventListener("click", testFunction, false);
else if(testButton.attachEvent)
    testButton.attachEvent("onclick", testFunction);
*/

//Variables
var g;
var GRID_SIZE = 10;
var l = [
    [
        0, 1, 0, 0,
        0, 1, 0, 0,
        0, 1, 1, 0,
        0, 0, 0, 0
    ],

    [
        0, 0, 0, 0,
        1, 1, 1, 0,
        1, 0, 0, 0,
        0, 0, 0, 0
    ],

    [
        0, 1, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 0,
        0, 0, 0, 0
    ],

    [
        0, 0, 0, 0,
        0, 0, 1, 0,
        1, 1, 1, 0,
        0, 0, 0, 0
    ]
];

var s = [
    [
        0, 1, 1, 0,
        1, 1, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ],

    [
        0, 1, 0, 0,
        0, 1, 1, 0,
        0, 0, 1, 0,
        0, 0, 0, 0
    ]

];

var t = [
    [
        0, 1, 0, 0,
        1, 1, 1, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ],
    [
        0, 1, 0, 0,
        0, 1, 1, 0,
        0, 1, 0, 0,
        0, 0, 0, 0
    ],
    [
        0, 0, 0, 0,
        1, 1, 1, 0,
        0, 1, 0, 0,
        0, 0, 0, 0
    ],
    [
        0, 1, 0, 0,
        1, 1, 0, 0,
        0, 1, 0, 0,
        0, 0, 0, 0
    ]
];

var straight = [
    [
        1, 1, 1, 1,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ],
    [
        0, 1, 0, 0,
        0, 1, 0, 0,
        0, 1, 0, 0,
        0, 1, 0, 0
    ]
];

var sq = [
    [
        1, 1, 0, 0,
        1, 1, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ]
];

var possible_pieces = new Array("t", "straight", "s", "sq", "l");

var pieces = {"t":t, "straight":straight, "s":s, "sq":sq, "l":l};

$(document).ready(function() {
    var elements = document.getElementsByClassName("tris-grid");
    var grid = elements[0];
    var table = document.createElement("table");
    for(var row = 1; row<=GRID_SIZE; row++){
        var tr = document.createElement("tr");
        tr.setAttribute('id', 'row'+row);
        for(var col = 1; col<=GRID_SIZE; col++){
            var td = document.createElement("td");
            td.setAttribute('id', 'col'+col);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    grid.appendChild(table);
    g = new Game(new Piece(possible_pieces[Math.floor(Math.random()*possible_pieces.length)]));
});

/**
 * Game Class
 * @param starterPiece
 * @constructor
 */
function Game(starterPiece){
    this.pieces = new Array();
    this.currentPiece = starterPiece;
    this.time = 30;
    this.currentPiece.generatePiece(1,4);

    /*setInterval(function(){
        var timer = document.getElementById('tris-timer');
        if(this.time==null){
            this.time=30;
        }
        if(this.time==0){
            this.time = 30;
        }
        timer.innerHTML = '0:'+(this.time--);
    },1000);*/
}

Game.prototype.generateNewPiece = function(){
    var piece = new Piece(possible_pieces[Math.floor(Math.random()*possible_pieces.length)]);
    this.currentPiece = piece;
    this.currentPiece.generatePiece(1,4);
}

Game.prototype.snapCurrentPiece = function(direction){

    switch(direction){
        case 'd':
            var r = this.increasePieceBy();
            this.currentPiece.moveRowBy(r);
            this.generateNewPiece();
            break;
    }

    this.pieces.push(this.currentPiece);
}

//checks the last occupied row under the piece and returns the amount to increase the piece by
Game.prototype.increasePieceBy = function(){
    var row, col;
    var lastRow = 10;
    var lowestRow = 1;
    var difference = lastRow-lowestRow;
    for(var p=0; p<this.currentPiece.tiles.length; p++){
        lastRow = 10;
        //Get the lowest row in the piece
        if(this.currentPiece.tiles[p].row>lowestRow){
            lowestRow=this.currentPiece.tiles[p].row;
        }

        row = this.currentPiece.tiles[p].row;
        col = this.currentPiece.tiles[p].col;
        for(var rows=row+1; rows<=GRID_SIZE; rows++){
            var tr = document.getElementById("row"+rows);
            if(tr.children[col-1].children.length>0 && tr.children[col-1].children[0].getAttribute('id')!='active' && lastRow>rows-1){
                lastRow = rows-1;
                break;
            }
        }
        if(lastRow-row<difference){
            difference = lastRow-row;
        }
    }
    return difference;
}

Game.prototype.rotateCurrentPiece = function() {
    this.currentPiece.rotate();
}

/**
 * Piece Class
 * @param color
 * @param type
 * @constructor
 */
function Piece(type){
    this.type = type;
    switch(type){
        case "straight":
            this.color = "white";
            break;
        case "t":
            this.color = "#9bc9ed";
            break;
        case "s":
            this.color = "#B2B2B2";
            break;
        case "sq":
            this.color = "#4467B6";
            break;
        case "l":
            this.color = "black";
            break;
    }
}

Piece.prototype.generatePiece = function(row, col) {
    this.row = row;
    this.col = col;
    this.orientation = 0;
    var tiles = [];
    var count = 0;
    var p = pieces[this.type];

    //first check if the piece can be placed there
    for(var i=0; i<p[0].length; i++){
        if(p[0][i]==1 && (document.getElementById('row'+(row+Math.floor(i/4))).children[col+(i%4)-1].children.length>0 && document.getElementById('row'+(row+Math.floor(i/4))).children[col+(i%4)-1].children[0].getAttribute('id')=='occupied')){
            return;
        }
    }

    for(var i=0; i<p[0].length; i++){
        if(p[0][i]==1){
            tiles[count] = new Tile(this.color, row+Math.floor(i/4), col+(i%4));
            tiles[count].generateTile();
            count++;
        }
    }

    this.tiles = tiles;
}

Piece.prototype.canMove = function(direction) {
    if (direction == 'l') {
        var r = null;
        var c = null;
        for(var i=0; i<this.tiles.length; i++) {
            if (this.tiles[i].col - 1 <= 0) {
                return false;
            }
            r = document.getElementById('row'+this.tiles[i].row);
            c = null;
            if(this.tiles[i].col-2>=0) {
                c = r.children[this.tiles[i].col - 2];
            }

            if(c!=null && c.children.length>0){
                if(c.children[0].getAttribute('id')=='occupied'){
                    return false;
                }
            }
        }
        return true;
    } else if (direction == 'u') {
        var r = null;
        var c = null;
        for(var i=0; i<this.tiles.length; i++) {
            if (this.tiles[i].row - 1 <= 0) {
                return false;
            }

            if(this.tiles[i].row-1>=0) {
                r = document.getElementById('row' + (this.tiles[i].row - 1));
                c = r.children[this.tiles[i].col-1];
            }

            if(r!=null && c!=null && c.children.length>0){
                if(c.children[0].getAttribute('id')=='occupied'){
                    return false;
                }
            }

        }
        return true;
    } else if (direction == 'r') {
        var r = null;
        var c = null;
        for(var i=0; i<this.tiles.length; i++) {
            if (this.tiles[i].col + 1 > GRID_SIZE) {
                return false;
            }

            r = document.getElementById('row'+this.tiles[i].row);
            c = null;
            if(this.tiles[i].col+1<GRID_SIZE) {
                c = r.children[this.tiles[i].col];
            }

            if(c!=null && c.children.length>0){
                if(c.children[0].getAttribute('id')=='occupied'){
                    return false;
                }
            }
        }
        return true;
    } else if (direction == 'd') {
        var r = null;
        var c = null;
        for(var i=0; i<this.tiles.length; i++) {
            if (this.tiles[i].row + 1 > GRID_SIZE) {
                return false;
            }

            if(this.tiles[i].row+1<=GRID_SIZE) {
                r = document.getElementById('row' + (this.tiles[i].row + 1));
                c = r.children[this.tiles[i].col-1];
            }

            if(r!=null && c!=null && c.children.length>0){
                if(c.children[0].getAttribute('id')=='occupied'){
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}

Piece.prototype.moveRowBy = function(row){
    for (var i = 0; i < this.tiles.length; i++) {
        var parent = this.tiles[i].parent;
        parent.removeChild(parent.childNodes[0]);
        this.tiles[i].row+=row;
        this.tiles[i].showTile(false, true, 'pulse');
    }
}

Piece.prototype.moveLeft = function(){
    if(this.canMove('l')) {
        this.col--;
        for (var i = 0; i < this.tiles.length; i++) {
            var parent = this.tiles[i].parent;
            parent.removeChild(parent.childNodes[0]);
            this.tiles[i].col--;
            this.tiles[i].showTile();
        }
    }
}

Piece.prototype.moveUp = function(){
    if(this.canMove('u')) {
        this.row--;
        for (var i = 0; i < this.tiles.length; i++) {
            var parent = this.tiles[i].parent;
            parent.removeChild(parent.childNodes[0]);
            this.tiles[i].row--;
            this.tiles[i].showTile();
        }
    }
}

Piece.prototype.moveRight = function(){
    if(this.canMove('r')) {
        this.col++;
        for (var i = 0; i < this.tiles.length; i++) {
            var parent = this.tiles[i].parent;
            parent.removeChild(parent.childNodes[0]);
            this.tiles[i].col++;
            this.tiles[i].showTile();
        }
    }
}

Piece.prototype.moveDown = function(){
    if(this.canMove('d')) {
        this.row++;
        for (var i = 0; i < this.tiles.length; i++) {
            var parent = this.tiles[i].parent;
            parent.removeChild(parent.childNodes[0]);
            this.tiles[i].row++;
            this.tiles[i].showTile();
        }
    }
}

Piece.prototype.canRotate = function(){
    var tempOrientation = this.orientation;
    var row, col;
    var count = 0;

    var p = pieces[this.type];

    tempOrientation = (tempOrientation+1)%p.length;
    for(var i=0; i<p[tempOrientation].length; i++){
        if(p[tempOrientation][i]==1){
            row = document.getElementById("row"+(this.row+Math.floor(i/4)));
            col = row.childNodes[this.col+(i%4)-1];
            if(col.childNodes.length>0){
                var div = col.childNodes[0];
                if(div.getAttribute('id')=='occupied') {
                    return false;
                }

            }
            count++;
        }
    }
    return true;
}

Piece.prototype.rotate = function(){
    var count = 0;

    var p = pieces[this.type];
    if(!this.canRotate()){
        return;
    }

    this.orientation = (this.orientation+1)%p.length;
    for(var i=0; i<p[this.orientation].length; i++){
        if(p[this.orientation][i]==1){
            var parent = this.tiles[count].parent;
            parent.removeChild(parent.childNodes[0]);
            this.tiles[count] = new Tile(this.color, this.row+Math.floor(i/4), this.col+(i%4));
            this.tiles[count].generateTile();
            count++;
        }
    }
}

/** Tile Class
 *
 * @param color
 * @constructor
 */

//Specify color in hex or by name
function Tile(color, row, col)
{
    this.color = color;
    this.row = row;
    this.col = col;
}

//Indexed starting at 1
Tile.prototype.generateTile = function() {
    var tr = document.getElementById("row"+this.row);
    var td = tr.children[this.col-1];
    this.parent = td;

    var tile = document.createElement('div');
    tile.style.backgroundColor = this.color;
    tile.setAttribute('class', 'tris-tile animated bounceIn');
    tile.setAttribute('id', 'active');
    td.appendChild(tile);
}

//Indexed starting at 1
Tile.prototype.showTile = function(active, occupied, animation) {

    if(typeof(active)==='undefined') active = true;
    if(typeof(animation)==='undefined') animation = 'fadeIn';

    var tr = document.getElementById("row" + this.row);
    var td = tr.children[this.col - 1];
    this.parent = td;

    var tile = document.createElement('div');
    tile.style.backgroundColor = this.color;
    if (active) {
        tile.setAttribute('id', 'active');
    } else if(occupied){
        tile.setAttribute('id', 'occupied');
    }
    tile.setAttribute('class', 'tris-tile animated '+animation);
    td.appendChild(tile);
}


$(document).keydown(function(event) {
    if ( event.which == 37 ) {
        event.preventDefault();
        g.currentPiece.moveLeft();
    } else if (event.which == 38){
        event.preventDefault();
        g.currentPiece.moveUp();
    } else if (event.which == 39){
        event.preventDefault();
        g.currentPiece.moveRight();
    } else if (event.which == 40){
        event.preventDefault();
        g.currentPiece.moveDown();
    } else if (event.which == 32){
        event.preventDefault();
        g.snapCurrentPiece('d');
    } else if (event.which == 16){

        g.rotateCurrentPiece();
    }
});