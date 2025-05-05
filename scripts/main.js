let fruits = []
let game_window

let base_vel = 0.001
let gravity = 0.75 * base_vel * base_vel

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

    let elem = document.createElement("span")
    elem.innerHTML = fruit_emojis[Math.floor(Math.random() * fruit_emojis.length)]
    elem.className = 'fruit'
    game_window.appendChild(elem)
    spawned.elem = elem
    elem.cutted = false
    elem.onmouseenter = () => {
        if(elem.cutted || !playing)
            return
        elem.innerHTML = '+1'
        elem.style.fontFamily = 'Bonzai'
        elem.cutted = true
        score += 1
    }

    fruits.push(spawned)
}

let score = 0
let fruit_count = 5
let hp = 5
let last_tick
let playing = true

function upgrade() {
    if(!playing)
        return
    let delta = Date.now() - last_tick
    last_tick = Date.now()

    if(fruits.length < fruit_count) {
        spawn()
    }

    let remain = []
    for(let fruit of fruits) {
        fruit.x_pos += fruit.x_vel * delta
        fruit.y_pos += fruit.y_vel * delta
        fruit.y_vel += gravity * delta

        if(fruit.y_pos < 1 || fruit.y_vel < 0) {
            remain.push(fruit)
        }
        else {
            if(!fruit.elem.cutted) {
                hp--
                if(hp == 0)
                    playing = false
            }
            fruit.elem.remove()
        }

        fruit.elem.style.left = fruit.x_pos * game_window.clientWidth  + "px"
        fruit.elem.style.top  = fruit.y_pos * game_window.clientHeight + "px"
    }
    fruits = remain

    document.getElementById("score").innerHTML = score
    document.getElementById("hp").innerHTML = "❤".repeat(hp)
}

function getCookie(name) {
    return document.cookie.split("; ").find((row) => row.startsWith(name + "="))?.split('=')[1]
}

window.onload = function() {
    game_window = document.getElementById("content")

    let save_form = document.getElementById("save_rec")
    save_form.onsubmit = (event) => {
        event.preventDefault()
        let feedback = document.getElementById("feedback")
        if(playing) {
            feedback.innerHTML = "Сначала доиграйте"
            return
        }
        
        let name = document.getElementById("name").value
        let prev = getCookie(name)
        let output
        if(prev === null || Number(prev) < score) {
            output = `Новый рекорд! "${name}" - ${score}`
            document.cookie = `${name}=${score}; expires=Fri, 31 Dec 9999 23:59:59 GMT;`
        }
        else
            output = `Лучший счет "${name}" - ${prev}`

        feedback.innerHTML = output
    }

    last_tick = Date.now();
    setInterval(upgrade, 10)
}
