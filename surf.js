var WIDTH = 1000;
var HEIGHT = 300;


var background = document.getElementById("canvas-background");
background.width = WIDTH;
background.height = HEIGHT;
var bCtx = background.getContext("2d");


var canvas = document.getElementById("canvas1");
canvas.width = WIDTH;
canvas.height = HEIGHT;
canvas.onmousedown = myDown;
canvas.onmouseup = myUp;
canvas.onmousemove = myMove;

var ctx = canvas.getContext("2d");
var BB = canvas.getBoundingClientRect();
var offsetX = BB.left;
var offsetY = BB.top;



// drag related variables
var dragok = false;
var startX;
var startY;
var rescaling;
var padding = 40
var points;

class Point {
    r = 5
    isDragging = false
    children = []
    exists = true
    freedom = [1, 1]
    number = -1

    constructor(x, y, rang) {
        this.x = x;
        this.y = y;
        this.rang = rang
    }

    plot() {
        if (this.exists) {
            if (this.rang != 0) {
                ctx.fillStyle = "#A0A0A0";
            } else {
                ctx.fillStyle = "#444444";
            }
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }
    pair() {
        return [this.x, this.y]
    }
    update(dx, dy) {
        this.x += dx * this.freedom[0]
        this.y += dy * this.freedom[1]
    }
}



var board = JSON.parse('{    "0":    {        "is_in": ["y", "z"],        "freedom": [0, 0, 1],        "coordinates": [0, 0, 0.9758333333333338],        "tangents":        {            "z":            {                "after": [0, 0.22],                "before": [0, 0]            },            "y":            {                "before": [0.13, -0.35],                "after": [0, 0]            }        }    },    "1":    {        "is_in": ["z"],        "freedom": [1, 0, 1],        "coordinates": [0.11, 1.0, 0.23],        "tangents":        {            "z":            {                "before": [-0.03, -0.12],                "after": [0.05, 0.17]            },            "x":            {                "before": [0, 0.16],                "after": [0, -0.1]            }        }    },    "2":    {        "is_in": ["z", "x"],        "freedom": [0, 0, 1],        "coordinates": [0.5, 1.0, 0.24263888888888893],        "tangents":        {            "z":            {                "before": [-0.22, 0.02],                "after": [0.24, -0.03]            },            "x":            {                "before": [0, 0.15],                "after": [0, -0.14]            }        }    },    "3":    {        "is_in": ["z", "y"],        "freedom": [0, 0, 1],        "coordinates": [1, 0, 1.6700000000000002],        "tangents":        {            "z":            {                "before": [-0.03, 0.72],                "after": [0, 0]            },            "y":            {                "after": [-0.05, -1.08],                "before": [0, 0]            }        }    },    "4":    {        "is_in": ["x", "y"],        "freedom": [0, 0, 0],        "coordinates": [0.5, 0, 0],        "tangents":        {            "y":            {                "after": [-0.3, 0.24],                "before": [0.28, 0.1]            },            "x":            {                "before": [0.37, 0],                "after": [0, 0]            }        }    },    "5":    {        "is_in": ["y"],        "freedom": [0, 0, 1],        "coordinates": [1, 0, 1.8711111111111112],        "tangents":        {            "y":            {                "before": [-0.06, -0.69],                "after": [0, 0]            }        }    },    "6":    {        "is_in": ["x", "y"],        "freedom": [0, 0, 0],        "coordinates": [0.5, 0, 1.0000000000000004],        "tangents":        {            "y":            {                "before": [-0.17, -0.1],                "after": [0.29, 0.07]            },            "x":            {                "after": [0.49, -0.03],                "before": [0, 0]            }        }    },    "7":    {        "is_in": ["y"],        "freedom": [0, 0, 1],        "coordinates": [0, 0, 1.2899999999999996],        "tangents":        {            "y":            {                "after": [0.22, -0.14],                "before": [0, 0]            }        }    },    "8":    {        "is_in": ["x"],        "freedom": [0, 1, 1],        "coordinates": [0.5, 0.9088888888888889, 0.6194444444444446],        "tangents":        {            "x":            {                "before": [-0.08, 0.11],                "after": [0.06, -0.07]            }        }    },    "9":    {        "is_in": ["x"],        "freedom": [0, 1, 1],        "coordinates": [0.5, 0.9533333333333335, -0.04472222222222234],        "tangents":        {            "x":            {                "before": [0.03, 0.07],                "after": [-0.11, 0]            }        }    },    "10":    {        "is_in": ["x0"],        "freedom": [0, 0, 0],        "coordinates": [0.11, 0, 1.0],        "tangents":        {            "x":            {                "after": [0.37, 0],                "before": [0, 0]            }        }    },    "11":    {        "is_in": ["x0"],        "freedom": [0, 1, 1],        "coordinates": [0.11, 0.55, 0.5468518518518518],        "tangents":        {            "x":            {                "before": [-0.03, 0.1],                "after": [0.03, -0.09]            }        }    },    "12":    {        "is_in": ["x0"],        "freedom": [0, 1, 1],        "coordinates": [0.11, 0.59, 0],        "tangents":        {            "x":            {                "before": [0.01, 0.07],                "after": [-0.2, 0]            }        }    },    "13":    {        "is_in": ["x0"],        "freedom": [0, 0, 0],        "coordinates": [0.5, 0, 0],        "tangents":        {            "x":            {                "before": [0.18, 0],                "after": [0, 0]            }        }    },    "length": 225,    "width": 27.3,    "thickness": 7.2,    "cut_x0": 0.2,    "cut_x": 0.5}');
var axis = 'z';
var rescaling = 0
var x_factor, y_factor;


var orders = {
    'z': [0, 1, 2, 3],
    'y': [7, 6, 5, 3, 4, 0],
    'x': [6, 8, 2, 9, 4],
    'x0': [10, 11, 1, 12, 13]
}
var currentOrder;

// call to draw the scene

initialize(axis);

function initialize(axis, currentOrders = null) {
    drawCoordinates();
    [x_factor, y_factor] = get2D(axis, [board['length'], board['width'], board['thickness']])
    rescaling = Math.max(x_factor / WIDTH, y_factor / HEIGHT)
    rescaling = 0.9 / rescaling
    if (!currentOrders) {
        currentOrders = orders[axis]
    }
    currentOrder = currentOrders
    points = boardToPoints(axis, currentOrders, board);
    draw();
}

function read3Coordinates(axis, point) {
    var [x, y] = get2D(axis, point['coordinates']);
    var [before_x, before_y] = point['tangents'][axis]['before'];
    var [after_x, after_y] = point['tangents'][axis]['after'];
    return [[before_x + x, before_y + y],
            [x, y],
            [after_x + x, after_y + y]]
}

function commit(output=true) {
    var new_board = pointsToBoard(axis, points, currentOrder)
    if (output) {
        var output = document.getElementById("json_output");
        output.innerHTML = JSON.stringify(new_board)
    }
    board = new_board
    initialize(axis)
}

function changeAxis(currentAxis) {
    if (currentAxis == 'x0') {
        initialize('x', orders['x0'])
        axis = 'x'
    } else {
        initialize(currentAxis)
        axis = currentAxis
    }
    draw()
}

function drawaxis(points) {
    ctx.lineWidth = 2;
    ctx.fillStyle = "rgba(45, 252, 194, 0.3)";
    ctx.beginPath()
    ctx.moveTo(...points[1].pair());
    for (var i = 1; i < points.length - 3; i += 3) {
        ctx.bezierCurveTo(...points[i + 1].pair(), ...points[i + 2].pair(), ...points[i + 3].pair());
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
}

function drawPoints(points) {
    ctx.lineWidth = 1;
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        if (point.rang == 0) {
            ctx.beginPath();
            ctx.moveTo(...point.pair());
            if (points[i - 1].exists) {
                ctx.lineTo(...points[i - 1].pair());
            }
            ctx.moveTo(...point.pair());
            if (points[i + 1].exists) {
                ctx.lineTo(...points[i + 1].pair());
            }
            ctx.stroke();
        }
        point.plot()
    }
}

function updateCoordinates(axis, coordinates, updates) {
    var [x, y, z] = coordinates;
    var [new_x, new_y] = from(updates);
    if (axis == 'x') {
        return [x, new_x, new_y];
    } else if (axis == 'y') {
        return [new_x, y, new_y];
    } else if (axis == 'z') {
        return [new_x, new_y, z];
    }
}

function pointsToBoard(axis, points, order) {
    var new_board = JSON.parse(JSON.stringify(board))
    for (var i = 0; i < order.length; i++) {
        var point = points[3 * i + 1];
        var [x, y] = from(point.pair());
        [x, y] = [round(x), round(y)]
        new_board[point.number]['coordinates'] = updateCoordinates(axis, new_board[point.number]['coordinates'], point.pair());
        var [s_x, s_y] = from(points[3 * i].pair());
        new_board[point.number]['tangents'][axis]['before'] = [round(s_x - x), round(s_y - y)];
        [s_x, s_y] = from(points[3 * i + 2].pair());
        new_board[point.number]['tangents'][axis]['after'] = [round(s_x - x), round(s_y - y)];
    }
    return adjustCuts(new_board)
}

function adjustCuts(board) {
    const x_cut = board['cut_x']
    orders['x'].forEarch((p, i) => {
        p['coordinates'][0] = x_cut;
    });
    const x0_cut = board['cut_x0']
    orders['x0'].forEarch((p, i) => {
        p['coordinates'][0] = x0_cut;
    });
    return board
}

function round(value) {
    return Math.round(value * 100) / 100
}

function boardToPoints(axis, order, board) {
    var points = []
    for (var i = 0; i < order.length; i++) {
        var point = board[order[i]]
        var [x, y] = get2D(axis, point['coordinates']);
        var new_point = new Point(...to([x, y]), 0);
        new_point.freedom = get2D(axis, point['freedom']);
        new_point.number = order[i]

        var [before_x, before_y] = point['tangents'][axis]['before'];
        var sub_point = new Point(...to([before_x + x, before_y + y]), 1)
        sub_point.exists = !(before_x == 0 && before_y == 0)
        if (!sub_point.exists) {
            sub_point.freedom = new_point.freedom;
        }
        points.push(sub_point);

        points.push(new_point);

        var [after_x, after_y] = point['tangents'][axis]['after'];
        sub_point = new Point(...to([after_x + x, after_y + y]), -1);
        sub_point.exists = !(after_x == 0 && after_y == 0);
        if (!sub_point.exists) {
            sub_point.freedom = new_point.freedom;
        }
        points.push(sub_point);
    }
    return points
}

function to([x, y]) {
    if (axis !== null) {
        y *= y_factor
        y *= -rescaling
        y += HEIGHT - padding
        x *= x_factor
        x *= rescaling
        x += padding
        return [x, y]
    } else {
        throw "axis not initialized";
    }
}

function from([x, y]) {
    if (axis !== null) {
        y -= HEIGHT - padding
        y /= -rescaling
        y /= y_factor
        x -= padding
        x /= rescaling
        x /= x_factor
        return [x, y]
    } else {
        throw "axis not initialized";
    }
}

function get2D(axis, point) {
    var [x, y, z] = point
    if (axis == 'x') {
        return [y, z]
    } else if (axis == 'y') {
        return [x, z]
    } else if (axis == 'z') {
        return [x, y]
    }
}

function drawCoordinates() {
    bCtx.lineWidth = 1;
    bCtx.beginPath();
    bCtx.moveTo(padding, 0);
    bCtx.lineTo(padding, HEIGHT - padding);
    bCtx.lineTo(WIDTH, HEIGHT - padding);
    bCtx.stroke();
    bCtx.lineWidth = 2;
}

function drawPosition(mx, my) {
    bCtx.clearRect(0.75 * WIDTH, 0, WIDTH, 0.20 * HEIGHT);
    bCtx.font = "15px Arial";
    var [p_x, p_y] = from([mx, my])
    bCtx.fillText(mx.toFixed(2).toString() + " " + my.toFixed(2).toString(), 0.85 * WIDTH, 0.20 * HEIGHT);
    bCtx.fillText(p_x.toFixed(2).toString() + " " + p_y.toFixed(2).toString(), 0.85 * WIDTH, 0.10 * HEIGHT);
}

// clear the canvas
function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

// redraw the scene
function draw() {
    clear();
    drawaxis(points);
    drawPoints(points);
}


// handle mousedown events
function myDown(e) {
    BB = canvas.getBoundingClientRect();
    offsetX = BB.left;
    offsetY = BB.top;

    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY);

    // test each shape to see if mouse is inside
    dragok = false;
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        var dx = p.x - mx;
        var dy = p.y - my;
        // test if the mouse is inside this circle
        if (dx * dx + dy * dy < p.r * p.r && p.exists) {
            dragok = true;
            p.isDragging = true;
            if (p.rang == 0) {
                points[i - 1].isDragging = true;
                points[i + 1].isDragging = true;
            }
        }
        // decide if the shape is a rect or circle               

    }
    // save the current mouse position
    startX = mx;
    startY = my;
}


// handle mouseup events
function myUp(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // clear all the dragging flags
    dragok = false;
    for (var i = 0; i < points.length; i++) {
        points[i].isDragging = false;
    }
}


// handle mouse moves
function myMove(e) {
    // if we're dragging anything.
    var mx = parseInt(e.clientX - offsetX);
    var my = parseInt(e.clientY - offsetY);
    if (dragok) {

        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position

        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mx - startX;
        var dy = my - startY;

        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            if (p.isDragging) {
                p.update(dx, dy)
            }
        }

        // redraw the scene with the new rect positions
        draw();

        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;

    }
    drawPosition(mx, my)
}

function toCanvasCoordinates(x, y) {
    y *= -rescaling
    y += HEIGHT - padding
    x *= rescaling
    x += padding
    return [x, y]
}

function fromCanvasCoordinates(x, y) {
    y -= padding - HEIGHT
    y /= -rescaling
    x -= padding
    x /= rescaling
    return [x, y]
}

// require.undef('surf_widget');

// define('surf_widget', ["@jupyter-widgets/base"], function(widgets) {

//     var SurfView = widgets.DOMWidgetView.extend({

//         // Render the view.
//         render: function() {
//             this.canvas = document.createElement('canvas');
//             this.canvas.id = 'canvas';
//             this.canvas.width = WIDTH;
//             this.canvas.height = HEIGHT;
//             // listen for mouse events
//             canvas = this.canvas;
//             ctx = canvas.getContext("2d");
//             BB = canvas.getBoundingClientRect();
//             offsetX = BB.left;
//             offsetY = BB.top;
//             points = this.model.get('points')

//             console.log(this.model.get('test1'))

//             rescaling = 0
//             for (var i = 0; i < points.length; i++) {
//                 rescaling = Math.max(rescaling, points[i][0] / WIDTH, points[i][1] / HEIGHT)
//             }
//             rescaling = 0.9 / rescaling

//             local_points = []

//             this.canvas.onmousedown = myDown;
//             this.canvas.onmouseup = myUp;
//             this.canvas.onmousemove = myMove;

//             for (var i = 0; i < points.length; i++) {
//                 var [x_new, y_new] = toCanvasCoordinates(points[i][0], points[i][1])
//                 var current_point = new Point(x_new, y_new, points[i][2])

//                 current_point.frozenX = !!points[i][3]
//                 current_point.frozenY = !!points[i][4]
//                 local_points.push(current_point);
//             }

//             for (var i = 0; i < local_points.length; i++) {
//                 var current_point = local_points[i]
//                 if (current_point.rang != 0) {
//                     local_points[i + current_point.rang].children.push(-1 * current_point.rang)
//                 }
//             }

//             // call to draw the scene
//             draw();


//             this.el.appendChild(this.canvas);

//             // Python -> JavaScript update
//             // this.model.on('change:value', this.value_changed, this);

//             // JavaScript -> Python update
//             // this.email_input.onchange = this.input_changed.bind(this);
//         },

//         value_changed: function() {
//             this.email_input.value = this.model.get('value');
//         },

//         input_changed: function() {
//             this.model.set('value', this.email_input.value);
//             this.model.save_changes();
//         },
//     });

//     return {
//         SurfView: SurfView
//     };
// });

