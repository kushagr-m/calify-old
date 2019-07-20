# Parse Unimelb class calendar
# by Kush M https://kushagr.net/

from bs4 import BeautifulSoup

def get_subjects(html):
    """Finds all the subjects (codes and names) on a timetable page."""
    bs = BeautifulSoup(html, features='html.parser')
    panels = bs.find_all('div', attrs={'class': 'cssTtableSspNavMasterContainer'})
    subjects = []
    for panel in panels:
        s = BeautifulSoup(str(panel.contents), features='html.parser')
        code = s.find('div', attrs={'class': 'cssTtableRoundBorder'}).find('span').string.strip()
        name = s.find('td', attrs={'class': 'cssTtableSspNavMasterSpkInfo3'}).find('div').string.strip()
        subjects.append((code, name))
    return dict(subjects)

def get_classes(html, subjects = None):
    """Takes the HTML from the unimelb timetable page and returns a list of dicts of the classes on the timetable, ready to convert into any format."""
    # Default value for subjects 
    if not subjects:
        subjects = get_subjects(html)
    # Find all elements that constitute classes on the timetable
    bs = BeautifulSoup(html, features='html.parser')
    panels = bs.find_all('div', attrs={'class': 'cssClassInnerPanel'})
    classes = []
    for panel in panels:
        contents = panel.contents
        # Convert each panel to its own soup object to programatically parse.
        s = BeautifulSoup(str(contents), features='html.parser')
        code = s.find('div', attrs={'class':'cssTtableHeaderPanel'}).string.strip()
        cla = {
            'code': code,
            'name': subjects.get(code),
            'class': s.find('span', attrs={'class':'cssTtableClsSlotWhat'}).string.strip(),
            'day': panel['id'][31:34],
            'time': s.find('span', attrs={'class':'cssTtableClsSlotWhen'}).string.strip().replace(', ', ''),
            'location': s.find('span', attrs={'class':'cssTtableClsSlotWhere'}).string.strip()
        }
        classes.append(cla)

    return classes