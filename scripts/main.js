let fruits = []
let game_window

let cut_parts = []
let cut_size = 20
let cut_shrink = 10

let cut_pos_x
let cut_pos_y

let base_vel
let gravity = () => 0.75 * base_vel * base_vel
let acc = 1e-5

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
let playing = false

function upgrade() {
    if(!playing)
        return
    let delta = Date.now() - last_tick
    last_tick = Date.now()
    base_vel += acc * base_vel * delta

    for(let part of cut_parts) {
        part.size -= cut_shrink * delta
        part.style.width = part.size + "px"
        part.style.height = part.size + "px"
        part.style.borderRadius = part.size / 2 + "px"

        if(part.size <= 0) {
            part.size = cut_size
            part.left = cut_pos_x
            part.top  = cut_pos_y
        }
    }

    if(fruits.length < fruit_count) {
        spawn()
    }

    let remain = []
    for(let fruit of fruits) {
        fruit.x_pos += fruit.x_vel * delta
        fruit.y_pos += fruit.y_vel * delta
        fruit.y_vel += gravity() * delta

        if(fruit.y_pos < 1 || fruit.y_vel < 0) {
            remain.push(fruit)
        }
        else {
            if(!fruit.elem.cutted) {
                hp--
                if(hp == 0)
                    gameOver()
            }
            fruit.elem.remove()
        }

        fruit.elem.style.left = fruit.x_pos * game_window.clientWidth  + "px"
        fruit.elem.style.top  = fruit.y_pos * game_window.clientHeight + "px"
    }
    fruits = remain

    document.getElementById("score").innerHTML = score
    document.getElementById("hp").innerHTML = hp > 0 ? "❤".repeat(hp) : ""
}

let record_table

function updateTable() {
    let records = []
    for(let record of document.cookie.split("; "))
        records.push(record.split('='))
    records.sort((a, b) => [b[1] - a[1], a[0] - b[0]])
    records.slice(0, 10)
    
    record_table.innerHTML = ""
    for(let record of records) {
        let tr = document.createElement("tr")
        record_table.appendChild(tr)

        let name = document.createElement("td")
        name.innerHTML = record[0]
        tr.appendChild(name)
        
        let score = document.createElement("td")
        score.innerHTML = record[1]
        tr.appendChild(score)
    }
}

function start() {
    let replay = document.getElementById("replay")
    replay.style.display = "none"

    for(let fruit of fruits) {
        fruit.elem.remove()
    }
    fruits = []

    hp = 5
    score = 0
    last_tick = Date.now()
    base_vel = 1e-3

    for(let size = cut_size; i > 0; i -= cut_shrink / 100) {
        let part = document.createElement("span")
        part.className = "cut_part"

        part.left = cut_pos_x + "px"
        part.top  = cut_pos_y + "px"

        part.size = size
        part.style.width = size + "px"
        part.style.height = size + "px"
        part.style.borderRadius = size / 2 + "px"

        game_window.appendChild(part)
        cut_parts.push(part)
    }

    playing = true
}

function gameOver() {
    playing = false
    let replay = document.getElementById("replay")
    replay.style.display = ""

    for(let part of cut_parts) {
        part.remove()
    }
}

window.onload = function() {
    game_window = document.getElementById("content")
    game_window.onmousemove = (event) => {
        cut_pos_x = event.clientX
        cut_pos_y = event.clientY
    }

    let save_form = document.getElementById("save_rec")
    save_form.onsubmit = (event) => {
        event.preventDefault()
        let feedback = document.getElementById("feedback")
        if(playing) {
            feedback.innerHTML = "Сначала доиграйте"
            return
        }
        
        let name = document.getElementById("name").value
        let prev = document.cookie.split("; ").find((row) => row.startsWith(name + "="))?.split('=')[1]
        let output
        if(prev === undefined || Number(prev) < score) {
            output = `Новый рекорд! "${name}" - ${score}`
            document.cookie = `${name}=${score}; expires=Fri, 31 Dec 9999 23:59:59 GMT;`
            updateTable()
        }
        else
            output = `Лучший счет "${name}" - ${prev}`

        feedback.innerHTML = output
    }

    record_table = document.getElementById("record_table")
    updateTable()

    document.getElementById("showtable").onclick = () => {
        let desc = document.getElementById("records_desc");
        if(desc.style.display === "block")
            desc.style.display = "none"
        else
            desc.style.display = "block"
    }

    document.getElementById("replay").onclick = start

    last_tick = Date.now()
    setInterval(upgrade, 10)
}
