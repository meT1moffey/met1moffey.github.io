let fruits = []
let game_window

let base_vel = 0.003
let gravity = base_vel * base_vel

function spawn() {
    let spawned = {}
    spawned.x_pos = Math.random()
    spawned.y_pos = 1
    spawned.x_vel = base_vel * (0.5 - spawned.x_pos)
    spawned.y_vel = -base_vel * (0.9 + 0.2 * Math.random())

    let elem = document.createElement("span")
    elem.innerHTML = "\ud83c\udf4b" // lemon
    elem.className = 'fruit'
    game_window.appendChild(elem)
    spawned.elem = elem

    console.log("fruit spawned")
    fruits.push(spawned)
}

let frameDelay = 10

function upgrade() {
    if(fruits.length == 0) {
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
            fruit.elem.remove()
        }

        fruit.elem.style.left = fruit.x_pos * game_window.clientWidth  + "px"
        fruit.elem.style.top  = fruit.y_pos * game_window.clientHeight + "px"
        console.log(fruit)
    }
    fruits = remain

    setTimeout(upgrade, frameDelay)
}

window.onload = function() {
    game_window = document.getElementById("content")
    upgrade()
}

console.log("script loaded")