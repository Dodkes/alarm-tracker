let firstFrame = document.getElementById('contentFrame')
let secondFrame = firstFrame.contentWindow.document.getElementById('mashup_frame')
let thirdFrame = secondFrame.contentWindow.document.querySelectorAll('iframe')[5].contentWindow.document

a = document.querySelector("#contentFrame").contentWindow.document
b = a.querySelector('#mashup_frame').contentWindow.document
c = b.querySelector("#__gwt_historyFrame").contentWindow.document
c = b.querySelector('#isc_WidgetCanvas_5_widget').firstChild.contentWindow.document
d = c.querySelector('#table-0_scroll-container')
if (d === null) {
    d = loopForAlarmsContainer(c)
}
alarmsContainerArray = d.children

function runAutoticket () {
    alarmsContainerArray[1].click()
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

const startButton = document.getElementById('START')
startButton.addEventListener('click', () => {

    if (startButton.textContent === 'START') {
        startButton.style.backgroundColor = '#FF6347'
        startButton.textContent = 'STOP'
        runAutoticket()
    } else if (startButton.textContent === 'STOP') {
        startButton.style.backgroundColor = '#9ACD32'
        startButton.textContent = 'START'
    }
})


const alarms = ['Filesystems/Disks', 'CPU', 'Backup', 'Service']
alarms.forEach((item)=>{
    elementCreate('button', 'black', '#7FFFD4', item)
})