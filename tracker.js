let check, soundBeep, alarmsContainerArray, date, hour, minute, sec, a, b, c, d, titleIndex, ciIndex, stateIndex
let alarmFound = false
let [criticalColor, majorColor, minorColor] = ['#ed4c81', '#f4ac74', '#f8e860']
const [displayBarColorOn, displayBarColorOff, displayBarColorCritical] = ['rgba(51, 204, 51, 0.7)', 'rgba(51, 204, 255, 0.7)', 'rgba(255, 80, 80, 0.7)']
//////////////////////////////////////////////////////////////JQUERY/////////////////////////////////////////////////////////////////
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js'; // Check https://jquery.com/ for the current version
document.getElementsByTagName('head')[0].appendChild(script);
//////////////////////////////////////////////////////////////JQUERY/////////////////////////////////////////////////////////////////

const eventArray = ['interface down', 'node down', 'SITE DOWN', 'No IP connection', 'Host Connection State', 'DNS check', 'holding time expired']
//MAIN CONTAINER
const container = document.createElement('div')
document.body.appendChild(container)
container.style.cssText = `
                            position: fixed; 
                            top: 0; left: 0; 
                            background-color: rgba(0, 0, 0, 0.8); 
                            box-shadow: 5px 5px 20px black; 
                            color: white; 
                            z-index: 1; 
                            width: 100%; 
                            height: 35px; 
                            border: none;
                            `

const eventDirectoryRefresh = () => {
    a = document.querySelector("#contentFrame").contentWindow.document
    b = a.querySelector('#mashup_frame').contentWindow.document
    c = b.querySelector('#isc_WidgetCanvas_5_widget').firstChild.contentWindow.document
    d = c.querySelector('#table-0_scroll-container')
    if (d === null) {
        d = loopForAlarmsContainer(c)
    }
    alarmsContainerArray = d.children

    titleIndex = getCell('-title')
    ciIndex = getCell('-relatedCi')
    stateIndex = getCell('-lifeCycleState')
}
//if table alarms container is empty, looping over 0 - 9 to find whether it exists and returns existing container
function loopForAlarmsContainer (c) {
    for  (i = 0; i < 10; i++) {
        if (c.querySelector('#table-' + i + '_scroll-container')) {
            return c.querySelector('#table-' + i + '_scroll-container')
        }
    }
}

const startChecking = () => {
    clearInterval(check)
    clearInterval(soundBeep)
    check = setInterval(looping, Number(inputInterval.value) * 1000)
    looping()
}

const stopChecking = () => {
    clearInterval(check)
    clearInterval(soundBeep)
    display.textContent = `READY TO START`
    display.style.backgroundColor = displayBarColorOff
}

const createElement = (elementType, text, backColor, elId, appendedTo, func) => {
    let newElement = document.createElement(elementType)
    newElement.textContent = text
    appendedTo.appendChild(newElement)
    newElement.id = elId
    newElement.style.cssText = `
                                background-color: ${backColor}; 
                                color: white; 
                                display: inline-block; 
                                z-index: 1; 
                                height: auto; 
                                box-sizing: border-box;`
                                
    newElement.addEventListener('click', func)
}
//STOP START BUTTONS
createElement('button', 'STOP', 'red', 'stop', container, stopChecking)
createElement('button', 'START', 'green', 'start', container, startChecking)
const stopButton = document.getElementById('stop')
const handlingButtonsStyle = `
                            background-color: #ff3300; 
                            color: black; 
                            border-radius: 5px; 
                            font-weight: bold; 
                            outline: none; 
                            border: none; 
                            margin-left: 2px;
                            `

stopButton.style.cssText = handlingButtonsStyle
const startButton = document.getElementById('start')
startButton.style.cssText = handlingButtonsStyle
startButton.style.backgroundColor = '#00ff80'

//INPUT
createElement('input', null, 'transparent', 'interval', container, null)
const inputInterval = document.getElementById('interval')
inputInterval.style.cssText = `
                                border: none; 
                                border-bottom: 2px solid black; 
                                outline: none; 
                                width: 60px; 
                                color: #ff3300; 
                                font-weight: bold; 
                                margin-left: 2px;
                            `
inputInterval.value = 60
inputInterval.setAttribute('type', 'number')
//Checkbox <p> element
createElement('p', 'Sound alert', 'black', 'sound-alert', container, null)
document.getElementById('sound-alert').style.fontWeight = 'bold'

//Checkbox
createElement('input', null, 'black', 'checkbox', container, null)
const checkBox = document.getElementById('checkbox')
checkBox.setAttribute('type', 'checkbox')
checkBox.checked = true
document.getElementById('checkbox').style.cssText = 'margin-left: 2px;'

//DISPLAY
createElement('div', 'READY TO START', 'none', 'display', container, null)
const display = document.getElementById('display')
display.style.cssText = `
                        font-weight: bold; 
                        border-radius: 3px;
                        margin-left: 2px; 
                        padding: 0 5px 0 5px;
                        text-align: center;
                        border-bottom: 1px solid black;
                        background-color: ${displayBarColorOff};
                        `
const looping = () => {
    eventDirectoryRefresh()
    display.textContent = checkTime()
    display.style.backgroundColor = displayBarColorOn


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

        if (ignoreList.length !== 0 && state.includes('Open')) {
            ignoreList.forEach(element => {
                ignore(element.ci, element.title)
            })
        }
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
    // return 'RUNNING: Last check - ' + hour + 'h : ' + minute + 'm : ' + sec + 's'
    return `RUNNING: Last check - ${hour} h : ${minute} m : ${sec} s`
}

function foundAlarms (alarm) {
    display.style.backgroundColor = displayBarColorCritical
    display.textContent = `STOPPED: ${alarm}`
}

function getCell (endedID) {
    for (i = 0; i < alarmsContainerArray[0].childNodes.length; i++) {
        if (alarmsContainerArray[0].childNodes[i].id.includes(endedID)) {
            return i
        }
    }
}

//set buttons
function setButton (baseTitle, CI) {
    if (CI.childNodes.length === 3) { //if there is no button/s created
        title = baseTitle.toLowerCase()
        //ticket open check
        
        if (title.includes('no ip connection')) {
            splitTitle = title.split(' ')
            openedTicketCI = splitTitle[5]
        } else if (title.includes('dns check')) {
            splitTitle = title.split(' ')
            openedTicketCI = splitTitle[3]
        } else {
            openedTicketCI = CI.innerText
        }

        let commandCI = CI.innerText

        createElement('button', 'T', 'grey', openedTicketCI, CI, (event) => {
            window.open('https://boehringer.service-now.com/incident_list.do?sysparm_first_row=1&sysparm_query=state%3d1%5eORstate%3d2%5eORstate%3d3%5eGOTO123TEXTQUERY321%3d' + event.target.id + '+&sysparm_query_encoded=state%3d1%5eORstate%3d2%5eORstate%3d3%5eGOTO123TEXTQUERY321%3dtzoas00018+&sysparm_view=')
        })

        //commands copy buttons
        if (title.includes('average cpu load is higher')) {
            createElement('button', 'CPU check', 'black', commandCI, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_run ' + event.target.id + ' top -b -n1 | less')
                buttonBlink(event.target)
            })
        }

        else if (title.includes('usage of filesystem')) {
            let FS = title.split(' ')
            createElement('button', 'FS check', 'black', commandCI, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_run ' + event.target.id + ' df -Ph ' + FS[3])
                buttonBlink(event.target)
            })
        }  

        else if (title.includes('mongo-db: usage of filsystem is over')) {
            let FS = title.split(' ')
            createElement('button', 'FS check', 'black', commandCI, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_run ' + event.target.id + ' df -Ph ' + FS[10])
                buttonBlink(event.target)
            })
        }

        else if (title.includes('disk space utilization')) {
            let FS = title.split(' ')
            if (FS[6].includes('/')) {
                createElement('button', 'FS check', 'black', commandCI, CI, (event) => {
                    navigator.clipboard.writeText('urp_remote_run ' + event.target.id + ' df -Ph ' + FS[6])
                    buttonBlink(event.target)
                })
            }
        }

        else if (title.includes('snmp is not defined as a service')) {
            createElement('button', 'Service check', 'black', commandCI, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_run ' + event.target.id + ' service snmpd status')
                buttonBlink(event.target)
            })
        }

        else if (title.includes('host connection state') || 
            title.includes('site down') ||
            title.includes('since more than 600 seconds') ||
            title.includes('node down')) 
            {
                createElement('button', 'Ping', 'black', commandCI, CI, (event) => {
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

        else if (title.includes('event id 5719')) {
            createElement('button', 'Ping', 'black', commandCI ,CI, (event) => {
                navigator.clipboard.writeText('ping ' + event.target.id)
                buttonBlink(event.target)
            })
        }

        else if (title.includes('full system backup failed for last')) {
            createElement('button', 'Backup check', 'black', commandCI, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_view ' + event.target.id +' /rzoper/bibit/log/bibit_summary.log | grep backup')
                buttonBlink(event.target)
            })
        }

        else if (title.includes('dblog_all on virtualnode') || title.includes('archive system backup failed for last')) {
            createElement('button', 'DB check', 'black', commandCI, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_view ' + event.target.id + ' /dcoper/bibit/log/bibit_summary.log | grep dblog')
                buttonBlink(event.target)
            })
        }

        else if (title.includes('pcs error found')) {
            createElement('button', 'PCS check', 'black', commandCI, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_run ' + event.target.id + ' pcs status')
                buttonBlink(event.target)
            })
        }

        else if (title.includes('disk inodes usage is')) {
            let FS = title.split(' ')
            createElement('button', 'FS check', 'black', commandCI, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_run ' + event.target.id + ' df -k ' + FS[9] + ' -i')
                buttonBlink(event.target)
            })
        }

        else if (title.includes('num wal files:')) {
            createElement('button', 'WAL check', 'black', commandCI, CI, (event) => {
                navigator.clipboard.writeText('urp_remote_run ' + event.target.id + ' ls /var/lib/edb/as10/data/pg_wal/ | wc -l')
                buttonBlink(event.target)
            })
        }
        //WEBSITE CHECK BUTTONS
        else if (title.includes('http response code for url') || title.includes('ok & no_errors not found')) {
            let FS = baseTitle.split(' ')
            createElement('button', 'URL check', 'black', FS[6], CI, (event) => {
                window.open(event.target.id)
            })
        }

        else if (title.includes('bad http response received for')) {
            let FS = baseTitle.split(' ')
            createElement('button', 'URL check', 'black', FS[5], CI, (event) => {
                window.open(event.target.id)
            })
        }

        else if (title.includes('url check was not successfull for')) {
            let FS = baseTitle.split(' ')
            createElement('button', 'URL check', 'black', FS.at(-1), CI, (event) => {
                window.open(event.target.id)
            })
        }

        else if (title.includes('error: http output code for')) {
            let FS = baseTitle.split(' ')
            createElement('button', 'URL check', 'black', FS.at(-3), CI, (event) => {
                window.open(event.target.id)
            })
        }

        //NETWORK COMMAND BUTTONS
        else if (title.includes('interface down') && !title.includes('syslog')) {
            let FS = title.split(' ')
            createElement('button', 'CI', 'black', commandCI, CI, (event) => {
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
            createElement('button', 'CI', 'black', commandCI, CI, (event) => {
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
            createElement('button', 'CI', 'black', commandCI, CI, (event) => {
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
            createElement('button', 'CI', 'black', commandCI, CI, (event) => {
                navigator.clipboard.writeText(event.target.id)
                buttonBlink(event.target)
            })
            createElement('button', 'Track check', 'black', null, CI, (event) => {
                navigator.clipboard.writeText('show track ' + FS[FS.length - 5])
                buttonBlink(event.target)
            })
        }

        else if (title.includes('is disassociated from controller') && !title.includes('rate correlation for')) {
            let FS = title.split(' ')
            createElement('button', 'Ping', 'black', commandCI, CI, (event) => {
                navigator.clipboard.writeText('ping ' + FS[2])
                buttonBlink(event.target)
            })
        }

        else if (title.includes('rate correlation for apdisassociated: access point')) {
            let FS = title.split(' ')
            createElement('button', 'Ping', 'black', commandCI, CI, (event) => {
                navigator.clipboard.writeText('ping '+ FS[6])
                buttonBlink(event.target)
            })
        }

        else if (title.includes('cluster consistency check: error')) {
            createElement('button', 'CCC check', 'black', commandCI, CI, (event) => {
                navigator.clipboard.writeText(`urp_remote_run ${commandCI} ccc`)
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

eventDirectoryRefresh()

//IGNORE LIST CODE
let ignoreList
let currentDay

if (!Number(localStorage.getItem('1TOC-ignorelist-currentDay'))) {
    currentDay = new Date().getDate()
    localStorage.setItem('1TOC-ignorelist-currentDay', JSON.stringify(currentDay))
} else {
    currentDay = JSON.parse(localStorage.getItem('1TOC-ignorelist-currentDay'))
}

(!localStorage.getItem('1TOC-ignorelist')) ? ignoreList = [] : ignoreList = JSON.parse(localStorage.getItem('1TOC-ignorelist'))
if (currentDay !== new Date().getDate()) {
    ignoreList = []
    localStorage.setItem('1TOC-ignorelist-currentDay', JSON.stringify(new Date().getDate()))
    localStorage.removeItem('1TOC-ignorelist')
}

let ignoreListContainer = document.createElement('div')
container.appendChild(ignoreListContainer)
ignoreListContainer.style.cssText = `
                                    position: fixed; 
                                    top:0; 
                                    right: 0;
                                    `

createElement('input', '', 'transparent', 'inputCI', ignoreListContainer, () => copyCI('inputCI'))
const inputCI = document.getElementById('inputCI')
inputCI.placeholder = 'CI input'
createElement('input', '', 'transparent', 'inputTitle', ignoreListContainer, () => copyCI('inputTitle'))
const inputTitle = document.getElementById('inputTitle')
inputTitle.placeholder = 'Title input'

function copyCI (elementID) {
    let inputValue = document.getElementById(elementID).value
    navigator.clipboard.writeText(inputValue)
}

const ignoreListInputs = [inputCI, inputTitle]
ignoreListInputs.forEach(element => {
  element.style.outline = 'none'
  element.style.border = '2px solid red'
  element.style.fontWeight = 'bold'
  element.style.borderRadius = '5px'
  element.style.marginRight = '2px'
  element.style.cursor = 'pointer'
  element.oninput = () => {
    if (element.value == '') {
        element.style.border = '2px solid red'
    } else {
        element.style.border = '2px solid green'
        if (element !== inputTitle) return
        else {
            element.title = element.value
        }
    }
  }
})

d.addEventListener('click', (e) => {
    let lengthArray = e.target.innerText.split(' ')
    if (lengthArray.length === 1) {
        inputCI.value = e.target.innerText
        inputCI.style.border = '2px solid green'
    } else {
        inputTitle.value = e.target.innerText
        inputTitle.title = e.target.innerText
        inputTitle.style.border = '2px solid green'
    }
})

createElement('button', 'Add to ignore list', '#00ff80', 'addIgnorelistButton', ignoreListContainer, () => {
    let CI = document.getElementById('inputCI').value
    let title = document.getElementById('inputTitle').value

    if (CI == '' || title == '') {
        alert('Enter CI and Title')
    } else {
        if (!confirm('Add alarm to ignore list?')) return
        else {
            for (x of ignoreList) {
                if (x.ci === CI && x.title === title) return alert('Alarm already present in ignore list')
            }
                ignoreList.push({ci: CI, title: title})
                localStorage.setItem('1TOC-ignorelist', JSON.stringify(ignoreList))
                ignore(CI, title)
                alert('Alarm added to ignore list')
        }
    }
})
//View ignore list
const viewIgnorelistContainer = document.createElement('div')

viewIgnorelistContainer.style.cssText = `
                                        background-color: rgba(0, 0, 0, 0.7); 
                                        color: white; 
                                        position: absolute; 
                                        top: 50%; 
                                        left: 50%; 
                                        padding: 30px; 
                                        transform: translate(-50%, -50%); 
                                        display: none; 
                                        max-height: 80%; 
                                        overflow: auto; 
                                        border-radius: 5px;
                                        border: 2px solid ${displayBarColorOff};
                                        `

document.body.appendChild(viewIgnorelistContainer)

createElement('button', 'View ignore list', '#87CEFA', 'viewIgnorelistButton', ignoreListContainer, () => {
    document.getElementById('viewIgnorelistButton').disabled = true
    if (ignoreList.length === 0) {
        viewIgnorelistContainer.innerText = 'Ignore list is empty '
    } else {
        ignoreList.forEach(element => {

            let container = document.createElement('div')
            viewIgnorelistContainer.appendChild(container)
            container.style.cssText = `
                                        border: 1px solid #87CEFA; 
                                        border-radius: 5px; 
                                        margin-bottom: 5px; 
                                        padding: 5px;
                                        `
            createElement('span',' ' + element.ci + ' ', 'transparent', element.ci, container, null)
            document.getElementById(element.ci).style.cssText = `
                                                                font-weight: bold; 
                                                                color: #87CEFA;
                                                                `
            createElement('span', element.title, 'transparent', element.title, container, null)
            createElement('button', 'Remove', '#007acc', element.ci, container,(e) => {
                document.getElementById(element.ci).parentElement.remove()
                ignoreList.forEach((element, index) => {
                    if (e.target.id === element.ci && e.target.previousSibling.innerText === element.title) {
                        ignoreList.splice(index, 1)
                        localStorage.setItem('1TOC-ignorelist', JSON.stringify(ignoreList))

                        for (alarm of alarmsContainerArray) {
                            if (alarm.innerText.includes(element.ci) && alarm.innerText.includes(element.title)) {
                                let upperCaseAlarm = alarm.className.toUpperCase()

                                if (upperCaseAlarm.includes('CRITICAL')) {
                                    alarm.style.backgroundColor = criticalColor
                                }
                                else if (upperCaseAlarm.includes('MAJOR')) {
                                    alarm.style.backgroundColor = majorColor
                                }
                                else if (upperCaseAlarm.includes('MINOR')) {
                                    alarm.style.backgroundColor = minorColor
                                }
                            }
                        }
                    }
                })
                if (ignoreList.length === 0) {
                    viewIgnorelistContainer.style.display = 'none'
                    document.getElementById('viewIgnorelistButton').disabled = false
                }

            })
        })
    }

    $(viewIgnorelistContainer).slideDown()
    $('#viewIgnorelistButton').css({
        'background-color' : '#87CEFA',
        'color' : 'black'
    })
    createElement('button', 'Close', '#666699', 'ignorelistCloseButton', viewIgnorelistContainer, () => {
        document.getElementById('viewIgnorelistButton').disabled = false
        viewIgnorelistContainer.style.display = 'none'
            while (viewIgnorelistContainer.firstChild) {
                viewIgnorelistContainer.removeChild(viewIgnorelistContainer.firstChild)
            }
    })
})

createElement('button', 'Reset ignore list', '#ff3300', 'resetIgnorelistButton', ignoreListContainer, () => {
    if (!confirm('Reset ignore list?')) return
    else {
        localStorage.clear('')
        ignoreList = []
        resetAlarmsColors ()
        alert('Ignore list deleted')
    }
})

function resetAlarmsColors () {
    for (alarm of alarmsContainerArray) {
        if (alarm.style.backgroundColor == 'grey') {
            let alarmClassNameToUpperCase = alarm.className.toUpperCase()

            if (alarmClassNameToUpperCase.includes('CRITICAL')) {
                alarm.style.backgroundColor = criticalColor
            } else if (alarmClassNameToUpperCase.includes('MAJOR')) {
                alarm.style.backgroundColor = majorColor
            } else if (alarmClassNameToUpperCase.includes('MINOR')) {
                alarm.style.backgroundColor = minorColor
            }
        }
    }
}

let ignoreListButtons = [document.getElementById('addIgnorelistButton'), document.getElementById('viewIgnorelistButton'), document.getElementById('resetIgnorelistButton')]
ignoreListButtons.forEach(element => {
    element.style.color = 'black'
    element.style.fontWeight = 'bold'
    element.style.border = 'none'
    element.style.outline = 'none'
    element.style.borderRadius = '2px'
    element.style.margin = '0 2px 0 2px'
})

function ignore (ci, title) {
    for (alarm of alarmsContainerArray) {
        if (alarm.innerText.includes(ci) && alarm.innerText.includes(title)) {
            alarm.style.backgroundColor = 'grey'
        }
    }
}

/////////////////////////////////////////////////////JQUERY VISUALISATIONS & ANIMATIONS////////////////////////////////////////////

hoverButtons ('#start', 'black', '#00ff80')
hoverButtons ('#stop', 'black', '#ff3300')

hoverButtons ('#viewIgnorelistButton', 'black', '#87CEFA')
hoverButtons ('#addIgnorelistButton', 'black', '#00ff80')
hoverButtons ('#resetIgnorelistButton', 'black', '#ff3300')


function hoverButtons (buttonId, color, backgroundColor) {
    $(buttonId).hover( function (){
        $(buttonId).css({
            'background-color' : color,
            'color' : backgroundColor,
        })
    },
        function () {
            $(buttonId).css({
                'background-color' : backgroundColor,
                'color' : color,
            })
        }
    )
}