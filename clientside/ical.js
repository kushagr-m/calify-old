// `BEGIN:VCALENDAR
// VERSION:2.0
// PRODID:-//hacksw/handcal//NONSGML v1.0//EN
// BEGIN:VEVENT
// UID:uid1@example.com
// DTSTAMP:19970714T170000Z
// ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com
// DTSTART:19970714T170000Z
// DTEND:19970715T035959Z
// SUMMARY:Bastille Day Party
// GEO:48.85299;2.36885
// END:VEVENT
// END:VCALENDAR`

// timezone info from https://github.com/mcpower/icallate/blob/gh-pages/index.html

function classesToICS(classes, semStart, lastDay, msBreak) {
    var ical = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:UnimelbCalendarToICS\n";

    var startDate = new Date(semStart)
    var lastDay = new Date(lastDay)
    var msBreak = new Date(msBreak)
    // var events = '';
    // for (let i = 0; i < classes.length; i++) {
    //     var cla = classes[i];
    //     events += classToVEVENT(cla, startDate, lastDay, msBreak);
    // };
    var events = classes.map(cla => classToVEVENT(cla, startDate, lastDay, msBreak)).join('');

    var final = ical + events + 'END:VCALENDAR\n'
    return final;
}

function classToVEVENT(thisclass, startDate, lastDay, msBreak) {
    // class: "Lecture 1 (4)"
    // code: "MAST10006"
    // day: "Mon"
    // location: "Parkville Redmond Barry 101 (Lyle Theatre)"
    // name: "Calculus 2"
    // time: "3:15 pm-4:15 pm"
    // time_begin: "3:15 pm"
    // time_end: "4:15 pm"
    // 
    // BEGIN:VEVENT
    // CLASS:PUBLIC
    // DESCRIPTION:Lecture 1 (4)
    // DTSTART;TZID=Australia/Melbourne:20190729T151500
    // RRULE:FREQ=WEEKLY;UNTIL=20191027T000000
    // EXDATE;TZID=Australia/Melbourne:20180402T151500
    // DTEND;TZID=Australia/Melbourne:20190729T161500
    // LOCATION:Parkville Redmond Barry 101 (Lyle Theatre)
    // SUMMARY;LANGUAGE=en-us:MAST10006 Calculus 2 Lecture 1 (4)
    // TRANSP:TRANSPARENT
    // END:VEVENT
    var startday = fdaString(startDate, thisclass['day']);
    var DTSTAMP = dateToX(new Date()) + 'T000000';
    var DTSTART = startday + 'T' + timeToHours(thisclass['time_begin']) + '00';
    var DTEND = startday + 'T' + timeToHours(thisclass['time_end']) + '00';
    var rrend = dateToX(lastDay);
    var RRULE = 'FREQ=WEEKLY;UNTIL=' + rrend + 'T000000';
    var EXDATE = fdaString(msBreak, thisclass['day']) + 'T' + timeToHours(thisclass['time_begin']) + '00';
    var SUMMARY = thisclass['code'] + ' ' + thisclass['name'] + ' ' + thisclass['class'];
    var TRANSP = (thisclass['class'].toLowerCase().includes("lecture")) ? "TRANSPARENT" : "OPAQUE"; 

    var vevent = 'BEGIN:VEVENT\nCLASS:PUBLIC\n';
    vevent += 'DTSTAMP:' + DTSTAMP + '\n';
    vevent += 'DESCRIPTION:' + thisclass['class'] + '\n';
    vevent += 'DTSTART;TZID=Australia/Melbourne:' + DTSTART + '\n';
    vevent += 'RRULE;TZID=Australia/Melbourne:' + RRULE + '\n';
    vevent += 'EXDATE;TZID=Australia/Melbourne:' + EXDATE + '\n';
    vevent += 'DTEND;TZID=Australia/Melbourne:' + DTEND + '\n';
    vevent += 'LOCATION:' + thisclass['location'] + '\n';
    vevent += 'SUMMARY:' + SUMMARY + '\n';
    vevent += 'TRANSP:' + TRANSP + '\n';
    vevent += 'END:VEVENT\n'
    return vevent;
}

function firstDayAfter(date, day) {
    // date is Date() object. day is 3 letter code
    var dayDict = {
        "mon": 1,
        "tue": 2,
        "wed": 3,
        "thu": 4,
        "fri": 5
    };
    var dayOffset = dayDict[String(day).toLowerCase()];
    // https://codereview.stackexchange.com/a/33648
    date = new Date(date.getTime());
    date.setDate(date.getDate() - 1);
    date.setDate(date.getDate() + (dayOffset + 7 - date.getDay()) % 7);
    return date;
}

function fdaString(date, day) {
    // Accounts for user being in a different time zone
    var fda = firstDayAfter(date, day);
    return dateToX(fda);
}

function dateToX(date) {
    d = date.toLocaleString("en-AU", { timeZone: 'Australia/Melbourne' })
    var dmy = d.split(', ')[0].split('/');
    return dmy.reverse().join('');
}

function timeToHours(time) {
    var ts = time.split(' ');
    var hours = parseInt(ts[0].replace(':', ''));
    if (ts[1] === 'pm' && hours != 1200) {
        hours += 1200;
    };
    return hours;
}