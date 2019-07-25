/*
* Calify: ical.js.
* Used to convert classes (a list of dicts) into an iCalendar .ics file (as a string).
*
* By Kush Mittal https://kushagr.net/
*/


function classesToICS(classes, options, semStart, lastDay, msBreak) {
    let ical = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:UnimelbCalendarToICS\n";

    let startDate = new Date(semStart),
        lastDayObj = new Date(lastDay),
        msBreakObj = new Date(msBreak);

    let events = classes.map(cla => classToVEVENT(cla, startDate, lastDayObj, msBreakObj, options)).join('');

    return [ical, events, 'END:VCALENDAR\n'].join('');
}

function classToVEVENT(thisclass, startDate, lastDay, msBreak, options) {
    let startday = fdaString(startDate, thisclass['day']),
        dtstamp = dateToX(new Date()) + 'T000000',
        dtstart = startday + 'T' + timeToHours(thisclass['time_begin']) + '00',
        dtend = startday + 'T' + timeToHours(thisclass['time_end']) + '00',
        rrend = dateToX(lastDay),
        rrule = 'FREQ=WEEKLY;UNTIL=' + rrend + 'T000000',
        exdate = fdaString(msBreak, thisclass['day']) + 'T' + timeToHours(thisclass['time_begin']) + '00',
        transp = thisclass['transp']; 

    let title = [];
    if (options['showUnitCode']) {
        title.push(thisclass['code']);
    }
    if (options['showUnitName']) {
        title.push(thisclass['name']);
    }
    title.push(thisclass['class']);
    title = title.join(' ');

    return [
        'BEGIN:VEVENT\nCLASS:PUBLIC\n',
        'DTSTAMP:', dtstamp, '\n',
        'DTSTART;TZID=Australia/Melbourne:', dtstart, '\n',
        'RRULE;TZID=Australia/Melbourne:', rrule, '\n',
        'EXDATE;TZID=Australia/Melbourne:', exdate, '\n',
        'DTEND;TZID=Australia/Melbourne:', dtend, '\n',
        'LOCATION:', thisclass['location'], '\n',
        'SUMMARY:', title, '\n',
        'TRANSP:', transp, '\n',
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