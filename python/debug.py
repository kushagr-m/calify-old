# Parse Unimelb class calendar
# by Kush M https://kushagr.net/

from cal_parse import get_classes, get_subjects
from pprint import pprint as print # Drop in replace print for pretty print

# Open sample HTML file.
with open('python\\sample.html', 'r', encoding='utf-8') as f:
    html = f.read()
    subjects = get_subjects(html)
    classes = get_classes(html, subjects=subjects)
    print(classes)