let fruits = []
let game_window

function spawn() {
    let spawned = {}
    spawned.x_pos = Math.random()
    spawned.y_pos = 1.1
    spawned.x_vel = (0.5 - spawned.x_pos)
    spawned.y_vel = -1

    let elem = document.createElement("span")
    elem.innerHTML = '\uF34B'
    game_window.appendChild(elem)
    spawned.elem = elem

    console.log("fruit spawned")
    fruits.push(spawned)
}

function upgrade() {
    console.log("upgraded")
    if(fruits.length == 0) {
        spawn()
    }

    let remain = []

    for(let fruit of fruits) {
        fruit.x_pos += fruit.x_vel
        fruit.y_pos += fruit.y_vel
        fruit.y_vel += 0.1

        if(fruit.y_pos < 1 || fruit.y_vel < 0) {
            remain.push(fruit)
        }
        else {
            console.log("fruit despawned")
        }

        fruit.elem["style"].left = fruit.x_pos * game_window.clientWidth
        fruit.elem["style"].top  = fruit.y_pos * game_window.clientHeight
    }
    fruits = remain

    setTimeout(upgrade, 10)
}

window.onload = function() {
    game_window = document.getElementById("content")
    console.log("app started")
    upgrade()
}

console.log("script loaded")