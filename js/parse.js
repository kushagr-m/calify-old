/*
* Calify: parse.js
* Parses the source code from the unimelb timetable website (https://my.unimelb.edu.au/studentportal/faces/StudentAdmin/Timetable/SubjectTimetable).
* Finds subjects (unit code and unit name), and classes (lectures, tutorials, workshops, practicals, seminars, etc.).
*
* By Kush Mittal https://kushagr.net/
*/


function text_to_el(text) {
    // remove scripts - https://stackoverflow.com/questions/6659351/removing-all-script-tags-from-html-with-js-regular-expression
    const SCRIPT_RE = /<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script\s*>/gi;
    while (SCRIPT_RE.test(text)) {
        text = text.replace(SCRIPT_RE, '');
    };
    // creates html element without adding it to the document.
    var el = document.createElement('html');
    el.innerHTML = text;
    return el;
}

function getSubjects(el) {
    // Finds all the subjects (codes and names) on a timetable page.
    var panels = el.getElementsByClassName('cssTtableSspNavMasterContainer');
    var subjects = {};
    for (let i = 0; i < panels.length; i++) {
        let code = panels[i].getElementsByClassName('cssTtableRoundBorder')[0].getElementsByTagName('span')[0].innerHTML;
        let name = panels[i].getElementsByClassName('cssTtableSspNavMasterSpkInfo3')[0].firstChild.innerHTML;
        name = String(name).trim();
        subjects[code] = name;
    };
    return subjects;
};

function getClasses(el, subjects, options) {
    // Takes the HTML from the unimelb timetable page and returns a list of dicts of the classes on the timetable, ready to convert into any format.
    var panels = el.getElementsByClassName('cssClassInnerPanel');
    var classes = [];
    for (let i = 0; i < panels.length; i++) {
        var code = String(panels[i].getElementsByClassName('cssTtableHeaderPanel')[0].innerHTML).trim();
        var time = String(panels[i].getElementsByClassName('cssTtableClsSlotWhen')[0].innerHTML).trim().replace(', ', '');
        var className = String(panels[i].getElementsByClassName('cssTtableClsSlotWhat')[0].innerHTML).trim();

        // Option - if user does not want class number shown in event titles.
        if (!options['showClassNumber']) {
            const classNum_re =  / \(\d+\)$/gis;
            className = className.replace(classNum_re, '');
        }
        var location = String(panels[i].getElementsByClassName('cssTtableClsSlotWhere')[0].innerHTML).trim()

        // Option - if user does not want campus name in event titles.
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
        if (campuses.includes(location.split(' ')[0])) {
            location = location.split(' ').slice(1, location.length - 1).join(' ');
        };

        let transp = "OPAQUE";
        if (options['transpLectures']) {
            transp = (className.toLowerCase().includes("lecture")) ? "TRANSPARENT" : "OPAQUE"
        }

        var cla = {
            'code': code,
            'name': subjects[code],
            'class': className,
            'day': String(panels[i].getAttribute('id')).slice(31, 34),
            'time': time,
            'location': location,
            'time_begin': time.split('-')[0],
            'time_end': time.split('-')[1],
            'transp': transp
        };
        classes.push(cla)
    }
    return classes;
}