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
    
    // Option - if user does not want class number shown in event titles.
    let title = [];
    if (options['showUnitCode']) { // Option - show subject code in event title, ex. MAST10006
        title.push(thisclass['code']);
    }
    if (options['showUnitName']) { // Option - show subject name in event title, ex. Calculus 2
        title.push(thisclass['name']);
    }
    // Option - don't show clas number in event title, ex. 'Practical 1 (10)' / 'Practical 1'
    const classNum_re = / \(\d+\)$/gis;
    title.push( // Replace regex matches if user has selected to not show class number, otherwise don't replace.
        (!options['showClassNumber']) ? thisclass['class'].replace(classNum_re, '') : thisclass['class']
    );
    title = title.join(' ');

    // Option - Show campus name in event titles.
    switch (String(options['showCampus']).toLowerCase()) {
        case 'none':
            var campuses = ['Parkville', 'Southbank', 'Burnley', 'Creswick', 'Dookie', 'Werribee', 'Shepparton'];
            break;
        case 'parkville':
            var campuses = ['Parkville'];
            break;
        case 'southbank':
            var campuses = ['Southbank'];
            break;
        default:
            var campuses = [];
            break;
    };
    var location = thisclass['location'];
    if (campuses.includes(location.split(' ')[0])) {
        location = location.split(' ').slice(1, location.length - 1).join(' ');
    };

    // Option - make Lecture classes transparent / free.
    let transp = (options['transpLectures'] && thisclass['class'].toLowerCase().includes("lecture")) ? "TRANSPARENT" : "OPAQUE";

    // Calculate other variables and values.
    let startday = fdaString(startDate, thisclass['day']),
        dtstamp = dateToX(new Date()) + 'T000000',
        dtstart = startday + 'T' + timeToHours(thisclass['time_begin']) + '00',
        dtend = startday + 'T' + timeToHours(thisclass['time_end']) + '00',
        rrend = dateToX(lastDay),
        rrule = 'FREQ=WEEKLY;UNTIL=' + rrend + 'T000000',
        exdate = fdaString(msBreak, thisclass['day']) + 'T' + timeToHours(thisclass['time_begin']) + '00',
        desc = (options['showDesc']) ? String([ thisclass['code'], thisclass['name'], thisclass['class'], thisclass['location']].join(' ')) : '';

    return [
        'BEGIN:VEVENT\nCLASS:PUBLIC\n',
        'DTSTAMP:', dtstamp, '\n',
        'DTSTART;TZID=Australia/Melbourne:', dtstart, '\n',
        'RRULE:', rrule, '\n',
        'EXDATE;TZID=Australia/Melbourne:', exdate, '\n',
        'DTEND;TZID=Australia/Melbourne:', dtend, '\n',
        'LOCATION:', location, '\n',
        'SUMMARY:', title, '\n',
        'DESCRIPTION:', desc, '\n',
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