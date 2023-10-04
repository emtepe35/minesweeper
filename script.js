
var itv;
let saper = {
    width: 10,
    height: 10,
    mines: 10,
    reverse_mines: 0,
    hit_mines: 0,
    table_: [],
    seconds: 0,
    start_time: 0,
    stop_time: 0,
    updateValues: function () {
        saper.width = document.getElementsByName("width")[0].value;
        saper.height = document.getElementsByName("height")[0].value;
        saper.mines = document.getElementsByName("mines")[0].value;
    },
    maxInput: function () {
        let actual_max = parseInt(document.getElementsByName("width")[0].value) * parseInt(document.getElementsByName("height")[0].value) - 1
        document.getElementsByName("mines")[0].max = String(parseInt(document.getElementsByName("width")[0].value) * parseInt(document.getElementsByName("height")[0].value) - 1)
        if (parseInt(document.getElementsByName("mines")[0].value) > actual_max) {
            document.getElementsByName("mines")[0].value = String(actual_max)
        }
    },
    genTab: function () {
        let mins = 0;
        saper.table_ = Array.from(Array(parseInt(saper.height)), () => {
            return new Array(parseInt(saper.width)).fill(0)
        })
        let temp_vals = []
        while (mins < saper.mines) {
            let x = getRandomInt(0, parseInt(saper.width) - 1)
            let y = getRandomInt(0, parseInt(saper.height) - 1)
            if (temp_vals.includes(String(x) + "-" + String(y))) {
                x = getRandomInt(0, parseInt(saper.width) - 1)
                y = getRandomInt(0, parseInt(saper.height) - 1)
            } else {
                saper.table_[y][x] = "*"
                mins++;
            }
            temp_vals.push(String(x) + "-" + String(y))
        }
        saper.countMines()
    },
    countMines: function () {
        for (let x = 0; x < saper.table_[0].length; x++) {
            for (let y = 0; y < saper.table_.length; y++) {
                let count = 0;
                if (saper.table_[y][x] != "*") {
                    for (let a = 0; a < 3; a++) {
                        for (let b = 0; b < 3; b++) {
                            if ((y - 1 + a) >= 0 && (y - 1 + a) < saper.table_.length && (x - 1 + b) >= 0 && (x - 1 + b) < saper.table_[0].length) {
                                if (saper.table_[y - 1 + a][x - 1 + b] == "*") {
                                    count++
                                }
                            }
                        }
                    }
                    saper.table_[y][x] = count
                }
            }
        }
    },
    show: function (x, y) {
        let pom_x = 0
        let pom_y = 0
        if ((y) >= 0 && (y) < saper.table_.length && (x) >= 0 && (x) < saper.table_[0].length) {
            let in_block = document.getElementById(String(x) + "-" + String(y))
            if (in_block.style.backgroundImage == `url("images/klepa.png")` && saper.table_[y][x] != "*") {
                if (saper.table_[y][x] == 0) {
                    in_block.style.backgroundImage = `url("")`
                    in_block.style.backgroundColor = "lightgrey"
                    for (let a_ = 0; a_ < 3; a_++) {
                        for (let b_ = 0; b_ < 3; b_++) {
                            pom_x = x - 1 + a_
                            pom_y = y - 1 + b_
                            saper.show(pom_x, pom_y)
                        }
                    }
                } else {
                    in_block.style.backgroundImage = `url("")`
                    in_block.style.backgroundColor = "lightgrey"
                    in_block.innerHTML = String(saper.table_[y][x])
                    switch (saper.table_[y][x]) {
                        case 1:
                            in_block.style.color = "rgb(51, 102, 255)"
                            break;
                        case 2:
                            in_block.style.color = "green"
                            break;
                        case 3:
                            in_block.style.color = "red"
                            break;
                        case 4:
                            in_block.style.color = "rgb(0, 0, 102)"
                            break;
                        default:
                            in_block.style.color = "black"
                            break;
                    }
                }

            }
        }
    },
    leftClick: function (block_in, x, y) {
        let a
        let b
        block = document.getElementById(String(x) + "-" + String(y))
        if (block.style.backgroundImage == `url("images/klepa.png")`) {
            if (saper.table_[y][x] == "*") {
                block.style.backgroundImage = `url("images/bomb.png")`
                saper.endGame(true, x, y)
            }
            else if (saper.table_[y][x] == 0) {
                saper.show(x, y)
            }
            else {
                saper.show(x, y)
            }
        }
    },
    rightClick: function (block, x, y) {
        if (saper.reverse_mines >= 0) {
            if (block.style.backgroundImage == `url("images/klepa.png")` && saper.reverse_mines > 0) {
                block.style.backgroundImage = `url("images/flaga.png")`
                saper.reverse_mines = saper.reverse_mines - 1
                document.getElementById("bombs_left").innerHTML = String(saper.reverse_mines)
                if (saper.table_[y][x] == "*") {
                    saper.hit_mines++;
                }
            }
            else if (block.style.backgroundImage == `url("images/flaga.png")`) {
                block.style.backgroundImage = `url("images/pyt.png")`
                saper.reverse_mines = saper.reverse_mines + 1
                if (saper.table_[y][x] == "*") {
                    saper.hit_mines--;
                }
                document.getElementById("bombs_left").innerHTML = String(saper.reverse_mines)
            }
            else if (block.style.backgroundImage == `url("images/pyt.png")`) {
                block.style.backgroundImage = `url("images/klepa.png")`
            }
        }
    },
    genGame: function () {
        saper.reverse_mines = saper.mines;
        document.getElementById("options").style.display = "none"
        document.querySelector("#info").style.display = "none"
        document.getElementById("back_btn").style.display = "block"
        document.querySelector("#saper").style.display = "block"
        document.querySelector("#info2").innerHTML = ""
        document.querySelector("#list").innerHTML = ""
        document.getElementById("game").innerHTML = ""
        let bombs_left = document.createElement("div");
        bombs_left.setAttribute("id", "bombs_left");
        bombs_left.style.fontFamily = 'Orbitron';
        bombs_left.style.color = "red"
        bombs_left.innerHTML = String(saper.mines)
        document.getElementById("bmb").appendChild(bombs_left)
        let time_left = document.createElement("div");
        time_left.setAttribute("id", "time_left");
        time_left.style.fontFamily = 'Orbitron';
        time_left.style.color = "red"
        document.getElementById("time").appendChild(time_left)
        let table = document.createElement("table")
        for (let y = 0; y < saper.height; y++) {
            let row = document.createElement("tr")
            for (let x = 0; x < saper.width; x++) {
                let single_block = document.createElement("div")
                single_block.setAttribute("class", "game-block")
                single_block.setAttribute("id", String(x) + "-" + String(y))
                single_block.style.width = "32px"
                single_block.style.height = "32px"
                single_block.style.backgroundImage = `url("images/klepa.png")`
                let td = document.createElement("td")
                td.appendChild(single_block)
                row.appendChild(td)
                single_block.onclick = function () {
                    saper.leftClick(single_block, x, y)
                }
                single_block.oncontextmenu = function () {
                    saper.rightClick(single_block, x, y)
                    saper.checkWinGame();
                    return false;
                }
                single_block.onmousedown = function () {
                    document.querySelector("#wow").style.display = "block";
                    document.querySelector("#calm").style.display = "none";
                }
                single_block.onmouseup = function () {
                    document.querySelector("#wow").style.display = "none";
                    document.querySelector("#calm").style.display = "block";
                }
            }
            table.appendChild(row)
        }
        document.getElementById("game").appendChild(table)
        saper.seconds = 0;
        saper.timeCounter(true);
        saper.genLeaderboard()
        saper.start_time = Date.now();
        if (saper.width >= 10 && saper.height >= 4) {
            document.querySelector("#glasses").style.display = "none"; //           Setting dynamic outline size here
            document.querySelector("#dead").style.display = "none";//
            document.querySelector("#outline").style.width = saper.width * 32 + 30 + "px"//
            document.querySelector("#outline").style.height = saper.height * 32 + 160 + "px" // 
            document.querySelector("#utils").style.width = saper.width * 32 + "px"// 
        }
        if (saper.width > 10) {
            document.querySelector("#emoji").style.marginLeft = (saper.width - 10) * 16 + "px"
        } else {
            document.querySelector("#emoji").style.marginLeft = "10px"
        }
    },
    genLeaderboard: function () {
        document.querySelector("#mode-list").innerHTML = ""
        let cookies = document.cookie.split(";").join("=").split("=")
        for (let x = 0; x < cookies.length; x++) {
            cookies.splice(x, 1)
        }
        cookie_gamemode = []
        cookies.forEach(element => {
            cookie_gamemode.push(element.split(":")[2])
        });
        cookie_gamemode = cookie_gamemode.filter((v, i, a) => a.indexOf(v) === i);
        cookie_gamemode.forEach(element => {
            document.querySelector("#mode-list").innerHTML += `<option value="${element}">${element}</option>`
        });
        for (let i = 0; i < 10; i++) {
            let scorerow = document.createElement("div");
            scorerow.setAttribute("id", "score" + String(i));
            scorerow.setAttribute("class", "score-row");
            document.querySelector("#list").appendChild(scorerow)
        }
        document.querySelector("#btn").onclick = function () {
            let to_print = []
            cookies.forEach(element => {
                if (element.includes(document.querySelector("#mode-list").value)) {
                    to_print.push(element)
                }
            });
            Array.from(document.querySelector("#list").children).forEach(element => {
                element.innerHTML = ""
            });
            to_print.sort((a, b) => {
                return a.split(':')[0].localeCompare(b.split(':')[0], undefined, { numeric: true })
            });
            console.log(to_print)
            for (let i = 0; i < to_print.length; i++) {
                if (i < 10) {
                    document.querySelector("#score" + String(i)).innerHTML = `Nick: ${to_print[i].split(":")[1]} ---- Czas: ${to_print[i].split(":")[0]}s`
                }
            }
        }
    },
    endGame: function (bul, u2, i2) {
        saper.timeCounter(false);
        for (let x = 0; x < saper.table_[0].length; x++) {
            for (let y = 0; y < saper.table_.length; y++) {
                document.getElementById(String(x) + "-" + String(y)).oncontextmenu = function () {
                    return false;
                }
                if (saper.table_[y][x] == "*") {
                    if (bul) {
                        document.getElementById(String(x) + "-" + String(y)).style.backgroundImage = `url("images/pbomb.png")`
                        document.querySelector("#dead").style.display = "block";
                        document.querySelector("#wow").style.display = "none";
                        document.querySelector("#calm").style.display = "none";
                        document.getElementById(String(u2) + "-" + String(i2)).style.backgroundImage = `url("images/bomb.png")`
                    }
                }
                else {
                    document.getElementById(String(x) + "-" + String(y)).onclick = function () {
                        //abc
                    }
                    if (!bul) {
                        saper.show(String(x), String(y))
                    }
                }
            }
        }
        if (bul) {
            document.querySelector("#infobtn").style.display = "none";
            document.querySelector("#info2").innerHTML += "Przegrałeś!<br>"
        }
        document.querySelector("#info").style.display = "block"
        document.querySelector("#info2").innerText += `Twój czas to ${(Date.now() - saper.start_time) / 1000}s`
    },
    checkWinGame: function () {
        if (saper.hit_mines >= saper.mines) {
            document.querySelector("#glasses").style.display = "block";
            document.querySelector("#wow").style.display = "none";
            document.querySelector("#calm").style.display = "none";
            document.querySelector("#info2").innerHTML += "Wygrałeś!<br>"
            document.querySelector("#infobtn").style.display = "block";
            saper.stop_time = Date.now();
            document.querySelector("#namebutton").onclick = function () {
                if (document.querySelector("#pname").value.length >= 1) {
                    saper.cookieModule((saper.stop_time - saper.start_time) / 1000, document.querySelector("#pname").value)
                    saper.resetGame();
                }
            }
            saper.endGame(false)
        }
    },
    cookieModule: function (actual_score, name) {
        document.cookie = `${name}=${actual_score}:${name}:${saper.width}x${saper.height}x${saper.mines}`
        let score_list = document.cookie.replace(/\s/g, '')
        score_list = score_list.split(";").join("=").split("=");
        console.log(score_list)
        for (let x = 0; x < score_list.length; x++) {
            score_list.splice(x, 1)
        }
        score_list.sort((a, b) => {
            return a.split(':')[0].localeCompare(b.split(':')[0])
        });
        console.log(score_list)
    },
    timeCounter: function (start) {
        if (start) {
            count()
            saper.seconds = 0;
        }
        else {
            stopCount()
        }
        function count() {
            itv = setInterval(printTime, 1000);
        }
        function printTime() {
            saper.seconds++
            document.getElementById("time_left").innerHTML = String(saper.seconds)
        }
        function stopCount() {
            clearInterval(itv);
        }
    },
    resetGame: function () {
        saper.timeCounter(false)
        saper.reverse_mines = 0;
        saper.hit_mines = 0;
        document.getElementById("options").style.display = "block"
        document.querySelector("#saper").style.display = "none"
        document.getElementById("back_btn").style.display = "none"
        document.getElementById("game").innerHTML = ""
        document.getElementById("bmb").innerHTML = ""
        document.getElementById("time").innerHTML = ""
        document.getElementById("outline").style.display = "none"
        document.getElementById("start_btn").disabled = false;
    }
}
function startBtn() {
    saper.updateValues()
    saper.genTab()
    saper.genGame()
    document.getElementById("start_btn").disabled = true;
    document.getElementById("outline").style.display = "block"
}
document.getElementById("start_btn").onclick = startBtn;
document.querySelector("#emoji").onclick = function () {
    saper.resetGame();
    startBtn();
}
document.getElementById("back_btn").onclick = function () {
    saper.resetGame();
}
document.getElementsByName("width")[0].oninput = function () {
    saper.maxInput()
}
document.getElementsByName("height")[0].oninput = function () {
    saper.maxInput()
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
