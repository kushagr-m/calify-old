/*
* Calify: parse.js
* Parses the source code from the unimelb timetable website (https://my.unimelb.edu.au/studentportal/faces/StudentAdmin/Timetable/SubjectTimetable).
* Finds subjects (unit code and unit name), and classes (lectures, tutorials, workshops, practicals, seminars, etc.).
*
* By Kush Mittal https://kushagr.net/
*/


function text_to_el(text) {
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

function getClasses(el, subjects) {
    // Takes the HTML from the unimelb timetable page and returns a list of dicts of the classes on the timetable, ready to convert into any format.
    var panels = el.getElementsByClassName('cssClassInnerPanel');
    var classes = [];
    for (let i = 0; i < panels.length; i++) {
        var code = String(panels[i].getElementsByClassName('cssTtableHeaderPanel')[0].innerHTML).trim();
        var time = String(panels[i].getElementsByClassName('cssTtableClsSlotWhen')[0].innerHTML).trim().replace(', ', '')
        var cla = {
            'code': code,
            'name': subjects[code],
            'class': String(panels[i].getElementsByClassName('cssTtableClsSlotWhat')[0].innerHTML).trim(),
            'day': String(panels[i].getAttribute('id')).slice(31, 34),
            'time': time,
            'location': String(panels[i].getElementsByClassName('cssTtableClsSlotWhere')[0].innerHTML).trim(),
            'time_begin': time.split('-')[0],
            'time_end': time.split('-')[1]
        };
        classes.push(cla)
    }
    return classes;
}