let fruits = []
let game_window

function spawn() {
    let spawned = {}
    spawned.x_pos = Math.random()
    spawned.y_pos = 1.1
    spawned.x_vel = (0.5 - spawned.x_pos)
    spawned.y_vel = -1

    let elem = document.createElement("span")
    elem.innerHTML = "\ud83c\udf4b" // lemon
    elem.style.position = 'absolute'
    game_window.appendChild(elem)
    spawned.elem = elem

    console.log("fruit spawned")
    fruits.push(spawned)
}

function upgrade() {
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
            fruit.elem.remove()
        }

        fruit.elem.style.left = game_window.offsetLeft + fruit.x_pos * game_window.offsetWidth  + "px"
        fruit.elem.style.top  = game_window.offsetTop  + fruit.y_pos * game_window.offsetHeight + "px"
    }
    fruits = remain

    setTimeout(upgrade, 1000)
}

window.onload = function() {
    game_window = document.getElementById("content")
    upgrade()
}

console.log("script loaded")