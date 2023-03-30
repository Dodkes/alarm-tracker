let check, soundBeep, alarmsContainerArray, date, hour, minute, sec, a, b, c, d, titleIndex, ciIndex, stateIndex
let alarmFound = false
const eventArray = ['interface down', 'node down', 'SITE DOWN', 'No IP connection', 'Host Connection State', 'DNS check']
//MAIN CONTAINER
const container = document.createElement('div')
document.body.appendChild(container)
container.style.cssText = 'position: fixed; top: 0; left: 0; background-color: rgba(0, 0, 0, 0.5); color: white; z-index: 1; height: 45px; width: 560px; border-radius: 0 0 30px 0; border: 2px solid black;'

const eventDirectoryRefresh = () => {
    a = document.querySelector("#contentFrame").contentWindow.document
    b = a.querySelector('#mashup_frame').contentWindow.document
    c = b.querySelector('#isc_WidgetCanvas_5_widget').firstChild.contentWindow.document
    d = c.querySelector('#table-0_scroll-container')
    if (d === null) {
        d = c.querySelector("#table-2_scroll-container")
    }
    alarmsContainerArray = d.children

    titleIndex = getCell('-title')
    ciIndex = getCell('-relatedCi')
    stateIndex = getCell('-lifeCycleState')
}

const startChecking = () => {
    display.style.backgroundColor = '#3399ff'
    clearInterval(check)
    clearInterval(soundBeep)
    check = setInterval(looping, Number(inputInterval.value) * 1000)
    looping()
}

const stopChecking = () => {
    clearInterval(check)
    clearInterval(soundBeep)
    display.textContent = 'READY TO START'
    display.style.backgroundColor = '#3399ff'
}

const createElement = (elementType, text, backColor, elId, appendedTo, func) => {
    let newElement = document.createElement(elementType)
    newElement.textContent = text
    appendedTo.appendChild(newElement)
    newElement.id = elId
    newElement.style.cssText = `background-color: ${backColor}; color: white; display: inline-block; z-index: 1; height: auto; box-sizing: border-box;`
    newElement.addEventListener('click', func)
}
//BUTTONS
createElement('button', 'STOP', 'red', 'stop', container, stopChecking)
createElement('button', 'START', 'green', 'start', container, startChecking)

//INPUT
createElement('input', null, 'transparent', 'interval', container, null)
const inputInterval = document.getElementById('interval')
inputInterval.style.cssText = 'border: none; border-bottom: 2px solid black; outline: none; width: 60px; color: lightgreen;'
inputInterval.value = 60
inputInterval.setAttribute('type', 'number')
//Checkbox <p> element
createElement('p', 'Sound alert', 'black', null, container, null)
//Checkbox
createElement('input', null, 'black', 'checkbox', container, null)
const checkBox = document.getElementById('checkbox')
checkBox.setAttribute('type', 'checkbox')
checkBox.checked = true

//DISPLAY
createElement('div', 'READY TO START', '#3399ff', 'display', container, null)
let display = document.getElementById('display')
display.style.border = '2px solid black'

const looping = () => {
    eventDirectoryRefresh()
    display.textContent = checkTime()

    for (let i = 0; i < alarmsContainerArray.length; i++) {
        let content = alarmsContainerArray[i].childNodes[titleIndex].innerText
        let state = alarmsContainerArray[i].childNodes[stateIndex].textContent
        let CI = alarmsContainerArray[i].childNodes[ciIndex]

        for (y of eventArray) {
            if (content.toUpperCase().includes(y.toUpperCase()) && state.includes('Open')){
                alarmFound = true
                foundAlarms(y)
                console.log('%c Found: '+ y, 'background: black; color: #ff9999; border 1px solid red')
            }
        }
        setButton(content, CI)
    }

    if (alarmFound) {
        soundBeep = setInterval(beep, 1000)
        clearInterval(check)
        alarmFound = false
    }
}

function beep () {
    if (checkBox.checked) {
        var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
        snd.play();
    }
}

function checkTime () {
    date = new Date()
    hour = date.getHours()
    minute = date.getMinutes()
    sec = date.getSeconds()
    return 'Alarm check performed: ' + hour + 'h : ' + minute + 'm : ' + sec + 's'
}

function foundAlarms (alarm) {
    display.style.backgroundColor = '#ff3399'
    display.textContent = alarm
}

function getCell (endedID) {
    for (i = 0; i < alarmsContainerArray[0].childNodes.length; i++) {
        if (alarmsContainerArray[0].childNodes[i].id.includes(endedID)) {
            return i
        }
    }
}

//set command buttons
function setButton (title, CI) {
    if (CI.childNodes.length === 3) { //if there is no button/s created
        title = title.toLowerCase()

        if (title.includes('average cpu load is higher')) {
            createElement('button', 'CPU check', 'black', CI.innerText, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_run ' + event.target.id + ' top -b -n1 | less')
                buttonBlink(event.target)
            })
        }

        else if (title.includes('usage of filesystem')) {
            let FS = title.split(' ')
            createElement('button', 'FS check', 'black', CI.innerText, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_run ' + event.target.id + ' df -Ph ' + FS[3])
                buttonBlink(event.target)
            })
        }  

        else if (title.includes('disk space utilization')) {
            let FS = title.split(' ')
            if (FS[6].includes('/')) {
                createElement('button', 'FS check', 'black', CI.innerText, CI, (event) => {
                    navigator.clipboard.writeText('urp_remote_run ' + event.target.id + ' df -Ph ' + FS[6])
                    buttonBlink(event.target)
                })
            }
        }

        else if (title.includes('snmp is not defined as a service')) {
            createElement('button', 'Service check', 'black', CI.innerText, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_run ' + event.target.id + ' service snmpd status')
                buttonBlink(event.target)
            })
        }

        else if (title.includes('host connection state') || 
            title.includes('site down') ||
            title.includes('since more than 600 seconds') ||
            title.includes('node down')) {
                createElement('button', 'Ping', 'black', CI.innerText, CI, (event) => {
                    navigator.clipboard.writeText('ping ' + event.target.id)
                    buttonBlink(event.target)
                })
        }

        else if (title.includes('dns check')) {
            let FS = title.split(' ')
            createElement('button', 'Ping', 'black', FS[3], CI, (event) => {
                navigator.clipboard.writeText('ping ' + event.target.id)
                buttonBlink(event.target)
            })
        }

        else if (title.includes('no ip connection')) {
            let FS = title.split(' ')
            createElement('button', 'Ping', 'black', FS[5], CI, (event) => {
                navigator.clipboard.writeText('ping ' + event.target.id)
                buttonBlink(event.target)
            })
        }

        else if (title.includes('full system backup failed for last')) {
            createElement('button', 'Backup check', 'black', CI.innerText, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_view ' + event.target.id +' /rzoper/bibit/log/bibit_summary.log | grep backup')
                buttonBlink(event.target)
            })
        }

        else if (title.includes('dblog_all on virtualnode') || title.includes('archive system backup failed for last')) {
            createElement('button', 'DB check', 'black', CI.innerText, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_view ' + event.target.id + ' /dcoper/bibit/log/bibit_summary.log | grep dblog')
                buttonBlink(event.target)
            })
        }

        else if (title.includes('pcs error found')) {
            createElement('button', 'PCS check', 'black', CI.innerText, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_run ' + event.target.id + ' pcs status')
                buttonBlink(event.target)
            })
        }

        else if (title.includes('disk inodes usage is')) {
            let FS = title.split(' ')
            createElement('button', 'FS check', 'black', CI.innerText, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_run ' + event.target.id + ' df -k ' + FS[9] + ' -i')
                buttonBlink(event.target)
            })
        }

        //NETWORK COMMAND BUTTONS
        else if (title.includes('interface down') && !title.includes('syslog')) {
            let FS = title.split(' ')
            createElement('button', 'CI', 'black', CI.innerText, CI, (event) => {
                navigator.clipboard.writeText(event.target.id)
                buttonBlink(event.target)
            })
            createElement('button', 'Interface check', 'black', null, CI, (event) => {
                navigator.clipboard.writeText('show interface ' + FS[3])
                buttonBlink(event.target)
            })
        }

        else if (title.includes('interface down') && title.includes('syslog')) {
            let FS = title.split(' ')
            createElement('button', 'CI', 'black', CI.innerText, CI, (event) => {
                navigator.clipboard.writeText(event.target.id)
                buttonBlink(event.target)
            })
            createElement('button', 'Interface check', 'black', null, CI, (event) => {
                navigator.clipboard.writeText('show interface ' + FS[FS.length - 5].substr(1, 8))
                buttonBlink(event.target)
            })
        }

        else if (title.includes('holding time expired')) {
            let FS = title.split(' ')
            createElement('button', 'CI', 'black', CI.innerText, CI, (event) => {
                navigator.clipboard.writeText(event.target.id)
                buttonBlink(event.target)
            })
            createElement('button', 'Interface check', 'black', null, CI, (event) => {
                navigator.clipboard.writeText('show interface ' + FS[FS.length - 6].substr(1, 8))
                buttonBlink(event.target)
            })
        }

        else if (title.includes('reachability up -> down')) {
            let FS = title.split(' ')
            createElement('button', 'CI', 'black', CI.innerText, CI, (event) => {
                navigator.clipboard.writeText(event.target.id)
                buttonBlink(event.target)
            })
            createElement('button', 'Track check', 'black', null, CI, (event) => {
                navigator.clipboard.writeText('show track ' + FS[FS.length - 5])
                buttonBlink(event.target)
            })
        }
    }
}

function buttonBlink (button) {
    button.style.backgroundColor = 'lightgreen'
    setTimeout(() => {
    button.style.backgroundColor = 'black'
    }, 1000);
}