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
        alarmsContainerArray[18].click()
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

//Run script here
runAutoticket()