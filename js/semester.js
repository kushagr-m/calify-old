let data = Array.from($('tr'))
    .map(el => el.children)
    .filter(el => el.length == 2)
    .slice(1)
    .map(el => [
        Array.from(el[0].children).map(sp => sp.getAttribute('content')),
        el[1].innerText]
    ),
    semesters = data.filter(arr => arr[1].includes('weeks')),
    breaks = data.filter(arr => arr[1].toLowerCase().replace('-',' ').includes('non teaching'));