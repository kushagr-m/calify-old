/*
* Calify: ical.js.
* Used to convert classes (a list of dicts) into an iCalendar .ics file (as a string).
*
* By Kush Mittal https://kushagr.net/
*/


function classesToICS(classes, semStart, lastDay, msBreak) {
    let ical = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:UnimelbCalendarToICS\n";

    let startDate = new Date(semStart),
        lastDay = new Date(lastDay),
        msBreak = new Date(msBreak);

    let events = classes.map(cla => classToVEVENT(cla, startDate, lastDay, msBreak)).join('');

    return [ical, events, 'END:VCALENDAR\n'].join('');
}

function classToVEVENT(thisclass, startDate, lastDay, msBreak) {
    let startday = fdaString(startDate, thisclass['day']),
        DTSTAMP = dateToX(new Date()) + 'T000000',
        DTSTART = startday + 'T' + timeToHours(thisclass['time_begin']) + '00',
        DTEND = startday + 'T' + timeToHours(thisclass['time_end']) + '00',
        rrend = dateToX(lastDay),
        RRULE = 'FREQ=WEEKLY;UNTIL=' + rrend + 'T000000',
        EXDATE = fdaString(msBreak, thisclass['day']) + 'T' + timeToHours(thisclass['time_begin']) + '00',
        SUMMARY = thisclass['code'] + ' ' + thisclass['name'] + ' ' + thisclass['class'],
        TRANSP = thisclass['transp']; 

    return [
        'BEGIN:VEVENT\nCLASS:PUBLIC\n',
        'DTSTAMP:', DTSTAMP, '\n',
        'DTSTART;TZID=Australia/Melbourne:', DTSTART, '\n',
        'RRULE;TZID=Australia/Melbourne:', RRULE, '\n',
        'EXDATE;TZID=Australia/Melbourne:', EXDATE, '\n',
        'DTEND;TZID=Australia/Melbourne:', DTEND, '\n',
        'LOCATION:', thisclass['location'], '\n',
        'SUMMARY:', SUMMARY, '\n',
        'TRANSP:', TRANSP, '\n',
        'END:VEVENT\n'
    ].join('')

}

function firstDayAfter(date, day) {
    // date is Date() object. day is 3 letter code
    let dayDict = {
        "mon": 1,
        "tue": 2,
        "wed": 3,
        "thu": 4,
        "fri": 5
    };
    let dayOffset = dayDict[String(day).toLowerCase()];
    // https://codereview.stackexchange.com/a/33648
    date = new Date(date.getTime());
    date.setDate(date.getDate() - 1);
    date.setDate(date.getDate() + (dayOffset + 7 - date.getDay()) % 7);
    return date;
}

function fdaString(date, day) {
    // Accounts for user being in a different time zone
    return dateToX(firstDayAfter(date, day));
}

function dateToX(date) {
    return date.toLocaleString("en-AU", { timeZone: 'Australia/Melbourne' })
        .split(', ')[0]
        .split('/')
        .reverse()
        .join('');
}

function timeToHours(time) {
    let ts = time.split(' ');
    let hours = parseInt(ts[0].replace(':', ''));
    if (ts[1] === 'pm' && hours != 1200) {
        hours += 1200;
    };
    return hours;
}