class Fruit {
    x_pos: number
    y_pos: number
    x_vel: number
    y_vel: number

    elem: Element
}

let fruits: Array<Fruit> = []
let game_window: Element

function spawn() {
    let spawned = new Fruit()
    spawned.x_pos = Math.random()
    spawned.y_pos = 1.1
    spawned.x_vel = (0.5 - spawned.x_pos)
    spawned.y_vel = -1

    let elem = document.createElement("span")
    elem.innerHTML = '\uF34B'
    spawned.elem = elem

    fruits.push(spawned)
}

function upgrade() {
    if(fruits.length == 0) {
        spawn()
    }

    let remain : Array<Fruit> = []

    for(let fruit of fruits) {
        fruit.x_pos += fruit.x_vel
        fruit.y_pos += fruit.y_vel
        fruit.y_vel += 0.1

        if(fruit.y_pos < 1 || fruit.y_vel < 0) {
            remain.push(fruit)
        }

        fruit.elem["style"].left = fruit.x_pos * game_window.clientWidth
        fruit.elem["style"].top  = fruit.y_pos * game_window.clientHeight
    }
    fruits = remain

    setTimeout(upgrade, 10)
}

window.onload = function() {
    game_window = document.getElementById("content")!
    upgrade()
}