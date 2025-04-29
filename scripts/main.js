let fruits = []
let game_window

let base_vel = 0.002
let gravity = 0.67 * base_vel * base_vel

let fruit_emojis = [
    "\ud83c\udf4b", // lemon
    "\ud83c\udf4e", // red apple
    "\ud83c\udf50", // pear
    "\ud83c\udf51", // pear
    "\ud83c\udf53", // strawberry
]

function spawn() {
    let spawned = {}
    let x_peak = 0.2 + 0.6 * Math.random()
    let x_offset = Math.random() * 0.4 - 0.2
    spawned.x_pos = x_peak + x_offset
    spawned.y_pos = 1.05
    spawned.x_vel = -base_vel * x_offset
    spawned.y_vel = -base_vel * (0.9 + 0.2 * Math.random())

    let box = document.createElement("div")
    box.className = 'fruit-box'
    game_window.appendChild(box)
    spawned.box = box

    let elem = document.createElement("span")
    elem.innerHTML = fruit_emojis[Math.floor(Math.random() * fruit_emojis.length)]
    elem.className = 'fruit'
    box.appendChild(elem)
    spawned.elem = elem

    console.log("fruit spawned")
    fruits.push(spawned)
}

let frameDelay = 16 // 60 fps
let fruit_count = 3

function upgrade() {
    if(fruits.length < fruit_count) {
        spawn()
    }

    let remain = []

    for(let fruit of fruits) {
        fruit.x_pos += fruit.x_vel * frameDelay
        fruit.y_pos += fruit.y_vel * frameDelay
        fruit.y_vel += gravity * frameDelay

        if(fruit.y_pos < 1 || fruit.y_vel < 0) {
            remain.push(fruit)
        }
        else {
            console.log("fruit despawned")
            fruit.box.remove()
        }

        fruit.elem.style.left = game_window.clientLeft + fruit.x_pos * game_window.clientWidth  + "px"
        fruit.elem.style.top  = game_window.clientTop  + fruit.y_pos * game_window.clientHeight + "px"
    }
    fruits = remain
}

window.onload = function() {
    game_window = document.getElementById("content")
    setInterval(upgrade, frameDelay)
}

console.log("script loaded")