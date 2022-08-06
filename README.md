# alarmChecker
Checking alarms on console with alert function once critical is found. Therefore no need to watch console.

In my job there are hundreds of alarms in console. Many of them are irrelevant.
Because of this, it is easy to miss important events. To prevent missing I have made this script.

To use this script, it has to be put in web console. Script basically monitors events in console and alerts user by sound, which indicates there is/are important
event/s, that should be taken care of.

How it works:
- open OBM and select desired view
- put script in console and press ENTER
- 2 buttons (STOP, START) will occur on the left top
- script is handled by these 2 buttons, after clicking each button, browser will alert you that script is started/stopped
- there is an eventArray that will be filled with important alarms
- once script meet any item of eventArray, it will alert user
