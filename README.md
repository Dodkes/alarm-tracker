# alarmTracker

Script created as alarm miss prevention, helps user to speed up & simplify checking process.

How script works:
Script is deployed by putting in web console. Script basically monitors events in console and alerts user, which indicates there is/are important
event/s, that should be taken care of. Script also provides command copy buttons.

How to use it:
- open OBM and select desired view
- put script in web console (F12) and press ENTER
- UI will appear on the left top corner
- script is handled by 2 buttons, after clicking each button, browser will notify you that script is started/stopped
- there is an eventArray that will be fullfilled with important alarms
- once script finds any item of eventArray, it will alert user and stops the script
- for each "command" alarm, the specific copy button is appended
