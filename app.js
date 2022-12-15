let scale = 100;
let center_aligne = [window.innerWidth / 2, window.innerHeight / 2];
let _2d_points = [];
let angle = 2;
let or = 0;
var canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;     // equals window dimension
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
ctx.beginPath();

const rotation_y = (angle) => {
    let v = [
        [Math.cos(angle), 0, Math.sin(angle)],
        [0, 1, 0],
        [-1 * Math.sin(angle), 0, Math.cos(angle)]
    ]
    return v;
}

const rotation_z = (angle) => {
    let v = [
        [Math.cos(angle), - Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1],
    ]
    return v;
}

const rotation_x = (angle) => {
    let v = [
        [1, 0, 0],
        [0, Math.cos(angle), - Math.sin(angle)],
        [0, Math.sin(angle), Math.cos(angle)],
    ]
    return v;
}

const circule = (x, y, ctx) => {
    ctx.beginPath();
    ctx.ellipse(x, y, 10, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#000"
    ctx.fill();
}

const draw_line = (x1, y1, x2, y2,) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#484848';
    ctx.stroke();
}

const main = function async() {
    points = [];

    points.push([[-1], [-1], [1]])
    points.push([[1], [-1], [1]])
    points.push([[1], [1], [1]])
    points.push([[-1], [1], [1]])
    points.push([[-1], [-1], [-1]])
    points.push([[1], [-1], [-1]])
    points.push([[1], [1], [-1]])
    points.push([[-1], [1], [-1]])

    projection_matrix = [
        [1, 0, 0],
        [0, 1, 0]
    ];
    draw();
}();
function bonse() {
    if (or == 0) {
        if (center_aligne[1] - 10 > 220)
            center_aligne[1] -= 10;
        else
            or = 1;
        return 0;
    }
    if (or == 1) {
        if (center_aligne[1] + 10 < window.innerHeight - 220)
            center_aligne[1] += 10;
        else
            or = 0;
        return 0;
    }
}
function draw() {
    angle += .054;
    if (angle >= 360)
        angle = 0;
    bonse();
    console.log(`${center_aligne[1]} ${window.innerHeight}\n`)

    setTimeout(() => {
        draw_after_delay(angle);
    }, 1 * 32)
};

function draw_after_delay(angle) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    _2d_points = [];
    points.map(point => {
        rotated2d = [];
        rotated2d = multiplyMatrix(rotation_y(angle), point);
        rotated2d = multiplyMatrix(rotation_z(angle), rotated2d)
        rotated2d = multiplyMatrix(rotation_x(angle), rotated2d)
        projected2d = multiplyMatrix(projection_matrix, rotated2d);
        _2d_points.push({
            x: (projected2d[0][0] * scale) + center_aligne[0], y: (projected2d[1][0] * scale) + center_aligne[1]
        })
        circule((projected2d[0][0] * scale) + center_aligne[0], (projected2d[1][0] * scale) + center_aligne[1], ctx);
    })
    for (let k = 0; k < 4; k++) {

        draw_line(_2d_points[k].x, _2d_points[k].y, _2d_points[((k + 1) % 4)].x, _2d_points[((k + 1) % 4)].y)
        ctx.fill();
        draw_line(_2d_points[k + 4].x, _2d_points[k + 4].y, _2d_points[((k + 1) % 4) + 4].x, _2d_points[((k + 1) % 4) + 4].y)

        draw_line(_2d_points[k].x, _2d_points[k].y, _2d_points[k + 4].x, _2d_points[k + 4].y)
    }
    draw();
}
function multiplyMatrix(matrix1, matrix2) {
    // check if the matrix1 columns = matrix2 rows
    if (matrix1[0].length !== matrix2.length) {
        return matrix1;
    }
    let result = [];
    for (let i = 0; i < matrix1.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix2[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < matrix1[0].length; k++) {
                sum += matrix1[i][k] * matrix2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}