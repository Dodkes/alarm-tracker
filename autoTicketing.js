let firstFrame = document.getElementById('contentFrame')
let secondFrame = firstFrame.contentWindow.document.getElementById('mashup_frame')
let thirdFrame = secondFrame.contentWindow.document.querySelectorAll('iframe')[5].contentWindow.document
let alarmsContainerArray

function eventDirectioryRefresh () {
    a = document.querySelector("#contentFrame").contentWindow.document
    b = a.querySelector('#mashup_frame').contentWindow.document
    c = b.querySelector("#__gwt_historyFrame").contentWindow.document
    c = b.querySelector('#isc_WidgetCanvas_5_widget').firstChild.contentWindow.document
    d = c.querySelector('#table-0_scroll-container')
    if (d === null) {
        d = loopForAlarmsContainer(c)
    }
    alarmsContainerArray = d.children
}

function runAutoticket () {
    eventDirectioryRefresh()
    for (let i = 0; i < alarmsContainerArray.length; i++) {
        let alarmTextContent = alarmsContainerArray[i].textContent.toLowerCase()
        let text = 'databases missing since last full'
        if (alarmTextContent.includes(text.toLowerCase())) {
            console.log(text)
            createTicket(alarmsContainerArray[i])
            break
        }
    }
}

function createTicket (alarm) {
    alarm.click()
    console.log('%c AUTOTICKET by xZitt - EVENT SELECTED', 'background: black; color: #33cc33; border 1px solid #33cc33')

    setTimeout(() => {
        thirdFrame.querySelector("#lifeState_action-button_WORK_ON_EVENT").click()
        console.log('%c AUTOTICKET by xZitt - EVENT ASSIGNED', 'background: black; color: #33cc33; border 1px solid #33cc33')
    }, 5000);

    setTimeout(() => {
        thirdFrame.querySelector("#mainDetailsPage > div > div.context-panel-page-body.ng-scope > opr-context-panel-template-tile.context-panel-tile.context-panel-template-tile.tile-forwardingButtonTile > opr-ngx-event-browser-details-relate-events > div > div.context-panel-tile-body.interaction > div > button").click()
        console.log('%c AUTOTICKET by xZitt - TRANSFERING EVENT', 'background: black; color: #33cc33; border 1px solid #33cc33')
    }, 10000);

    setTimeout(() => {
        document.querySelector("#btnDialogSubmit").click()
        console.log('%c AUTOTICKET by xZitt - TRANSFERRED TO SNOW', 'background: black; color: #33cc33; border 1px solid #33cc33')
    }, 15000);
}


const controlPanel = document.createElement('div')
controlPanel.style.colo = 'white'
document.body.appendChild(controlPanel)
controlPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'

function elementCreate (elementType, color, backColor, text) {
    element = document.createElement(elementType)
    controlPanel.appendChild(element)
    element.style.backgroundColor = backColor
    element.style.display = 'inline-block'
    element.style.color = color
    element.textContent = text
    element.id = text
}

//Input interval
elementCreate('input', 'red', 'transparent', 'input-interval')
document.getElementById('input-interval').setAttribute('type', 'number')
document.getElementById('input-interval').setAttribute('value', 60)
document.getElementById('input-interval').style.width = '50px'


//Start button
elementCreate('button', 'white', '#9ACD32', 'START')

let dispatchInterval
const startButton = document.getElementById('START')
startButton.addEventListener('click', () => {

    if (startButton.textContent === 'START') {
        startButton.style.backgroundColor = '#FF6347'
        startButton.textContent = 'STOP'
        dispatchInterval = setInterval(() => {
            console.log('%c AUTOTICKET by xZitt - AUTOTICKET SEQUENCE STARTED', 'background: black; color: #33cc33; border 1px solid #33cc33')
            runAutoticket()
        }, Number(document.getElementById('input-interval').value) * 1000);
    } else if (startButton.textContent === 'STOP') {
        clearInterval(dispatchInterval)
        startButton.style.backgroundColor = '#9ACD32'
        startButton.textContent = 'START'
    }
})


const alarms = ['Filesystems/Disks', 'CPU', 'Backup', 'Service']
const buttons = []
alarms.forEach((item)=>{
    elementCreate('button', 'black', '#7FFFD4', item)
    let button = document.getElementById(item)
    buttons.push(button)
    button.addEventListener('click',(event)=>{ addSwitcher(event)})
})

function addSwitcher (event) {
    item = event.target
    console.log(item.style.backgroundColor)
    switch (item.style.backgroundColor){
        case 'rgb(127, 255, 212)': item.style.backgroundColor = 'rgb(14, 54, 40)'
            break
        case 'rgb(14, 54, 40)': item.style.backgroundColor = 'rgb(127, 255, 212)'
            break
        default:
    }
}