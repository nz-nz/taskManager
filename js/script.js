let btnElem = document.querySelector('.btn');
let deadlineDateInputElem = document.getElementById('deadline_date');
let deadline_descriptionInputElem = document.getElementById('deadline_description');
let id;

try{
    id = +localStorage.getItem('id');
}catch (e) {
    localStorage.setItem('id', '');
    id = +localStorage.getItem('id');
}

btnElem.addEventListener('click', ()=>{
    console.log(id);
    let isActive = btnElem.classList.value.includes('active');
    if (isActive){
        let valueDate = deadlineDateInputElem.value;
        let valueDescr = deadline_descriptionInputElem.value;
        let map = {'id': id, 'deadline_date': valueDate, 'deadline_description': valueDescr,
        'time_to_the_end': (Date.parse(valueDate) - Date.now()), 'color': {'r': 0, 'g': 255, 'b': 0}};
        localStorage.setItem(String(id), JSON.stringify(map));
        console.log(map);
        console.log(localStorage.getItem(String(id)));
        render(map);
        setTimeout(()=>{
                deadlineDateInputElem.value = '';
                deadline_descriptionInputElem.value = '';
            },
            2000)

    }else{
        console.log('empty inputs')
    }
    localStorage.setItem('id', String(id+=1));
    console.log(localStorage.getItem('id'));
});

addEventListener('input', ()=>{
    let valueDate = deadlineDateInputElem.value;
    let valueDescr = deadline_descriptionInputElem.value;
    if (valueDate != '' & valueDescr != ''){
        btnElem.classList.add('active');
    }else {
        btnElem.classList.remove('active');
    }
});

function render(json) {

    let postRoot = document.querySelector('#root');
    let divElem = document.createElement('div');
    let closeBtn = document.createElement('div');

    closeBtn.addEventListener('click', function(){remove(this)});

    divElem.classList.add('postFrame');
    divElem.id = json['id'];
    closeBtn.classList.add('close_btn');
    for (let key in json){
        if (key === 'color' || key === 'id'){
            continue
        }
        let elem = document.createElement('p');
        elem.innerHTML = `<b>${key}</b> : ${json[key]}`;
        elem.classList.add(key);
        divElem.appendChild(elem);
    }
    divElem.appendChild(closeBtn);
    postRoot.appendChild(divElem);
}

function renderOnStart() {
    let keys = Object.keys(localStorage);
    console.log(keys);
    for (let key in keys){
        if (keys[key] === 'id'){
            continue;
        }
        console.log(keys[key]);
        let json = JSON.parse(localStorage.getItem(String(keys[key])));
        render(json);
    }
}

function reRender() {
    // console.log('hey');
    let allPosts = [...document.querySelectorAll('.postFrame')];
    allPosts.forEach((item)=>{
        let renderElem = document.getElementById(item.id);
        let json = JSON.parse(localStorage.getItem(String(item.id)));
        // console.log(json);
        let milliseconds = Date.parse(json['deadline_date']) - Date.now();
        if (milliseconds <= (1*24*60*60*1000)){

            changeColor(milliseconds, json);
        }
        let r = JSON.parse(localStorage.getItem(String(item.id)))['color']['r'];

        let g = JSON.parse(localStorage.getItem(String(item.id)))['color']['g'];
        let b = JSON.parse(localStorage.getItem(String(item.id)))['color']['b'];
        // console.log(`${r}  ${g}  ${b}`);
        renderElem.style.backgroundColor = `rgb(${r},${g},${b})`;
        let timeObj = convertMS(milliseconds);
        // console.log(timeObj);
        item.children[2].innerHTML = `<b>time_to_the_end</b> : ${timeObj.day}d ${timeObj.hour}h ${timeObj.minute}m ${timeObj.seconds}s`;
    })
}

function convertMS( milliseconds ) {
    let day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
}

function changeColor(milliseconds, json) {

    // rgb(255, 255, 0)
    // 255+255 = 510
    // 1*24*60*60/510 = 169412

    let colorDescr = Math.round(milliseconds/169412);
    // console.log(colorDescr);

    if  (colorDescr > 255){

        json['color']['r'] = colorDescr - 255;
        json['color']['g'] = 255;

    } else if (colorDescr <= 255) {

        json['color']['r'] = 255;
        json['color']['g'] = colorDescr;

    }
    // console.log(json);
    localStorage.setItem( String(json['id']), JSON.stringify(json));

}

function remove(obj){
    let id = obj.parentElement.id;
    obj.parentElement.remove();
    localStorage.removeItem(id);
}

renderOnStart();
reRender();
setInterval(()=>{reRender()}, 1000);