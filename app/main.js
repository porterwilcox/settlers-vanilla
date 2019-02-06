let scores = ['-', '-','-','-','-','-','-','-','-','-','-','-','-','-','-'] //default to new game

let count = 0 //keeps track of what turn you're on

//calculates cummulative score for final result
function scoreKeepr() {
    let total = 0
    scores.forEach(s => {
        if (s != '-') {
            total += parseFloat(s)
        }
    })
    return total
}

//draws the score boxes to the screen
function drawScores() {
    let t = ''
    scores.forEach((s, i) => {
    let bgDynam = 'bg-light'
    if (i == count) {
        bgDynam = 'bg-warning'
    }
    let fColor = 'text-black'
    if (s < 0) {
        fColor = 'text-danger'
    }
    let modAbled = ''
    if (i <= count) {
        modAbled = `onclick="openModal(${i})" data-target="#dynam-mod" data-toggle="modal"`
    }
    t += `
    <div class="col-2" ${modAbled}>
        <h6 class="border border-primary text-center dropwdown-toggle m0 ${bgDynam} ${fColor}">${s}</h6>
    </div>
    `
    })

    t += `<div class="col-2"><h4 class="text-center">=</h4></div>`
    t += `
        <div class="col-4">
            <h4 class="border border-secondary text-center dropwdown-toggle">${scoreKeepr()}</h4>
        </div>
        `

    document.getElementById('scores').innerHTML = t
}
drawScores()

let squareTotal //global scope variable representing the active score value

//modal content for particular score
function openModal(i) {
let modT = ''
let defVal = scores[i] == '-' ? 0 : scores[i]
squareTotal = defVal
modT += `
<div class="modal" id="dynam-mod">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="d-flex justify-content-center my-3" id="mod-points"></div>
            <div class="d-flex justify-content-around">
                <div class="btn btn-danger" data-dismiss="modal">X</div>
                <button class="btn btn-primary" onclick="updateScore(${i})">Save and Update</button>
            </div>
        </div>
    </div>
</div>
`
document.getElementById("mod-here").innerHTML = modT
drawModPoints()
}

//handles redrawing of point value after simple data changes
function drawModPoints() {
    document.getElementById('mod-points').innerHTML = `
    <button class="btn btn-primary" onclick="showVal(-1)"><i class="fas fa-minus"></i></button>
    <h4 class="mx-2" id="defVal">${squareTotal}</h4>
    <button class="btn btn-primary" onclick="showVal(1)"><i class="fas fa-plus"></i></button>
    `
}

//handles simple data changes of active score point value
function showVal(n) {
    squareTotal+=n
    drawModPoints()
}

//saves and updates the new score to the global scores array
function updateScore(i) {
    if (!squareTotal) return
    $('#dynam-mod').modal('hide')
    scores[i] = squareTotal
    if (count == i) {
        count++
    }
    drawScores()
}

//canvas scripts
let canvas = document.getElementById('my-canvas') //get canvas
let ctx = canvas.getContext('2d') //declare 2d canvas type
let canvasHistory = []

//set both touch and mouse event listeners for multidevice functionality
canvas.addEventListener('touchstart', setPosition)
canvas.addEventListener('mousedown', setPosition)
canvas.addEventListener('touchend', function() {setPosition(event, true)})
canvas.addEventListener('mouseup', function() {setPosition(event, true)})

//global variables for holding positions of events
let s = {x: 0, y: 0}
let f = {x: 0, y: 0}

//update data of a position variable
function setPosition(e, isEnd) {
    let x
    let y
    if (e.clientX || e.clientX == 0) {
        x = e.clientX
        y = e.clientY
    } else {
        x = e.touches[0] ? e.touches[0].clientX : e.changedTouches[0].clientX
        y = e.touches[0] ? e.touches[0].clientY : e.changedTouches[0].clientY
    }
    if (!isEnd) {
        s.x = (x - e.target.offsetLeft) / (e.target.offsetWidth/300)
        s.y = (y - e.target.offsetParent.offsetTop) / (e.target.offsetHeight/150)
    } else {
        f.x = (x - e.target.offsetLeft) / (e.target.offsetWidth/300)
        f.y = (y - e.target.offsetParent.offsetTop) / (e.target.offsetHeight/150)
        draw()
    }
}

//draw the users desired line between the two points
function draw() {  
    canvasHistory.push(canvas.toDataURL())
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(f.x, f.y);
    ctx.lineWidth = 1;
    ctx.closePath()
    ctx.stroke();
  }

//canvas controls
function resetCanvas() {
    canvasHistory = []
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}
function undo() {
    if (!canvasHistory.length) return
    let canvasImg = new Image(canvas.width, canvas.height)
    canvasImg.src = canvasHistory.pop()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    canvasImg.onload = () => {ctx.drawImage(canvasImg, 0, 0)}
}

//pwa
let deferredPrompt;
let nativeDownloadBtn = document.querySelector(".native-download")

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  nativeDownloadBtn.style.display = 'block';
});

nativeDownloadBtn.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    nativeDownloadBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });