const darkModecolor = '#3e4444'
d.parentElement.style.backgroundColor = darkModecolor

const rightPanel = b.querySelectorAll('iframe')[3].contentWindow.document

const OBMfragments = [
    c.querySelector("#table-0_body_pinned"),
    c.querySelector("#oprEventBrowser_0_browserFooter > opr-ngx-table-footer > section.statistics"),
    c.querySelector("#oprEventBrowser_0_browserFooter > opr-ngx-table-footer"),
    c.querySelector("#oprEventBrowser_0_browserFooter > opr-ngx-table-footer > section:nth-child(2)"),
    document.querySelector("#oprMasthead_0_breadcrumbs"),
    b.querySelector("#isc_14"),
    b.querySelector("#isc_5"),
    b.querySelector("#isc_31"),
    b.querySelector("#isc_30"),
]


b.querySelector("#isc_15").style.backgroundColor = '#202424'
b.querySelector("#isc_15").style.color = '#F8F8FF'



const criticalityIcons = c.querySelector("#oprEventBrowser_0_browserFooter > opr-ngx-table-footer > section:nth-child(2) > opr-ngx-item-toggle-bar > div:nth-child(1)").children
const criticalityIcons_2 = c.querySelector("#oprEventBrowser_0_browserFooter > opr-ngx-table-footer > section:nth-child(2) > opr-ngx-item-toggle-bar > div:nth-child(2)").children
const criticalityIcons_3 = c.querySelector("#oprEventBrowser_0_browserFooter > opr-ngx-table-footer > section:nth-child(2) > opr-ngx-item-toggle-bar > div:nth-child(4)").children
const criticalityIcons_4 = c.querySelector("#oprEventBrowser_0_browserFooter > opr-ngx-table-footer > section:nth-child(2) > opr-ngx-item-toggle-bar > div:nth-child(3)").children

pushToArray(criticalityIcons)
pushToArray(criticalityIcons_2)
pushToArray(criticalityIcons_3)
pushToArray(criticalityIcons_4)


function pushToArray (array) {
    for (x of array) {
        OBMfragments.push(x)
    }
}

OBMfragments.forEach(fragment => {
    fragment.style.backgroundColor = darkModecolor
    fragment.style.color = '#F8F8FF'
})