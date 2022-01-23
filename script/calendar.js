const data_months = [{name:"STYCZEŃ", qty:31},
                    {name:"LUTY", qty:28}, 
                    {name:"MARZEC", qty:31},
                    {name:"KWIECEŃ", qty:30},
                    {name:"MAJ", qty:31},
                    {name:"CZERWIEC", qty:30},
                    {name:"LIPIEC", qty:31},
                    {name:"SIERPIEŃ", qty:31},              
                    {name:"WRZESIEŃ", qty:30},
                    {name:"PAŹDZIERNIK", qty:31},
                    {name:"LISTOPAD", qty:30},
                    {name:"GRUDZIEŃ", qty:31}];

const date = new Date();
date.setDate(1); 
let current_month = date.getMonth();
let user_data = null;

const calendar = {
        
    _main : document.querySelector('.calendar__page'),
    _months_bar : document.querySelector('.calendar__navi-months-bar'),
    _page_items : null,
    
    create(){

        this._months_bar.textContent=data_months[date.getMonth()].name;
    
            for (i=0; i<42; i++)
            {
                const newItem = document.createElement('div');                

                newItem.className = "calendar__page-item";   
                newItem.dataset.number_day=-1;        
                                                        
                newItem.appendChild(document.createElement('p'));
                newItem.appendChild(document.createElement('span'));
                if (((i+1)%7)===0) newItem.firstChild.style.color='red';
                if (((i+2)%7)===0) newItem.firstChild.style.color='blue';
                this._main.appendChild(newItem);
            }
            this._page_items = [...document.querySelectorAll('.calendar__page-item')];
    },
    
    addClickEvent(){
        function showModal(event){       
            const current_day = event.target.closest('div').dataset.number_day;
            if (current_day!=-1) {
                window_modal.show(this);                            
                if ((user_data.hasOwnProperty(current_month))&&(user_data[current_month].hasOwnProperty(current_day)))
                    window_modal.printList(user_data[current_month][current_day]);
            }
        };

        this._page_items.forEach(item => item.addEventListener('click',showModal));

    },

    updateCalendar()
    {
            this._months_bar.textContent=data_months[current_month].name;
            this._page_items.forEach(el => {el.firstChild.textContent=''; el.lastChild.textContent=''; el.dataset.number_day=-1;} );

            let day = date.getDay();
            if (day===0) day=5; else day-=2;

            for (let i=1; i<=data_months[current_month].qty; i++)  {       
                this._page_items[i+day].firstChild.textContent=`${i}`;    
                
                if ((user_data.hasOwnProperty(current_month))&&(user_data[current_month].hasOwnProperty(i)))
                    this._page_items[i+day].lastChild.textContent=sumHours(user_data[current_month][i]);                

                this._page_items[i+day].dataset.number_day=i; 
            }
    },

   changeUp(){       
        if (current_month<11) {
            current_month++; 
            date.setMonth(current_month);
            this.updateCalendar();
        }
    },
     
    changeDown(){    
        if (current_month>0) {
            current_month--; 
            date.setMonth(current_month);
            this.updateCalendar();
        }
    },
    
};

const window_modal = {    
   
    _main : document.querySelector('.calendar__modal'),
    _input : document.querySelector('.calendar__modal-input'),
    _day_field : document.querySelector('.calendar__modal-day-field'),
    _list : document.querySelector('.calendar__modal-list'),
     owner : null,

    show(owner) {
       this.owner = owner;
       this._day_field.textContent = this.owner.firstChild.textContent;
       this._main.style.display='flex';
    },
    
    createListItem(text_value) { 
        const li_item = document.createElement('li');
        const li_btn = document.createElement('button');
        const li_icon_del = document.createElement('span');  
        const li_text  = document.createTextNode(text_value);                       
        
        
        li_icon_del.className='material-icons';
        li_icon_del.classList.add('delete_span');
        li_icon_del.textContent='delete';                                        
        
        li_btn.className="btn";      
        li_btn.addEventListener('click', e => {          
            const index = user_data[current_month][this._day_field.textContent].indexOf(e.target.closest('li').lastChild.textContent);
            user_data[current_month][this._day_field.textContent].splice(index,1);
            e.target.closest('li').remove();            
            });      

        li_btn.appendChild(li_icon_del);
        
        li_item.className="calendar__modal-list-item";
        li_item.appendChild(li_btn);
        li_item.appendChild(li_text);      

        this._list.appendChild(li_item); 
    },

    printList(list) { 
        list.forEach(el => this.createListItem(el) )
    },

    addToList(){
       
        const current_day = this._day_field.textContent;
        const text_item = convertInputData(this._input.value);

        if (text_item!=-1) {

            this.createListItem(text_item);
                
            if (!user_data.hasOwnProperty(current_month)) { 
                const new_month = {};
                new_month[current_day] = [text_item];      
                user_data[current_month]=new_month;            
            }
            else
                if (!user_data[current_month].hasOwnProperty(current_day))                
                user_data[current_month][current_day]=[text_item];                                          
                else 
                user_data[current_month][current_day].push(text_item);
                console.log(user_data);
        }
        else 
            alert('Niepoprawny format');
    },

    hide(){                      
        this.owner.lastChild.textContent=sumHours(user_data[current_month][this.owner.dataset.number_day]); 
        this._day_field.textContent = '';
        this._main.style.display='none';        
        this.owner = null;   
        this._list.textContent='';
        console.log(user_data);
                 
    }
   
};

function createTimeObj(time){

    if (isNaN(time)) return -1;

    let hour,minute;
    switch (time.length){

        case 1:
            hour=time[0];
            minute='00';
            break;

        case 2:
            if (time<=24) { hour=time; minute='00';}
                else {hour=time[0]; minute=(time[1]<6) ? `${time[1]}0`:'00'}
            break;    

        case 3:
            
            if (time[1]<6) {hour=time[0]; minute=time.slice(1,3)} 
            else
            {
                const temp_hour=time.slice(0,2);
                if (temp_hour<24) {
                    hour=temp_hour;
                    minute=(time[2]<6)?`${time[2]}0`:'00';
                }
                else
                {
                    hour=time[0];
                    minute = (time[2]<6)? `${time[2]}0`:'00';
                }
            }
            break;

        default:
            const temp_hour=time.slice(0,2);
            const temp_minute=time.slice(2,4);
            if (temp_hour<24) 
            {    
                hour=temp_hour;
                minute=(temp_minute<60) ? `${temp_minute}`:'00';
            }
            else
            {
                hour=time[0];
                temp_minute=time.slice(1,3);
                minute = (temp_minute<60) ? `${temp_minute}` : '00';
            }                    
    }       
    return {hour:hour, minute:minute};
}


function convertInputData(text_input){
    
    index = text_input.indexOf('-');
    if (index==-1) return -1;

    const start_text = text_input.slice(0,index);
    const end_text = text_input.slice(index+1,text_input.length);

    const start = createTimeObj(start_text);
    const end = createTimeObj(end_text);

    if ((start==-1)||(end==-1)) return -1;
       
    return `${start.hour}:${start.minute} - ${end.hour}:${end.minute}`;
}

function calcQtyHour(text_input)
{
    
    let qty_hour = parserInt(text_input.slice(0,2))-parserInt(text_input.slice(3,5)); 
    if (qty_hour<0) qty_hour=24+qty_hour;
    if ((end.minute<start.minute)&&(qty_hour>0)) qty_hour--;

    return;
}

function sumHours(list)
{
    
    let sum = 0;

    list.forEach(function(item){sum+=parseInt(item[item.length-2])}) ;
    
    if (sum===0) return ''; else return  sum;

}

localStorage.removeItem('OvCountData');

if (localStorage.OvCountData) user_data=JSON.parse(localStorage.getItem('OvCountData'));
    else user_data={}; 

calendar.create();
calendar.addClickEvent();
calendar.updateCalendar();


document.body.addEventListener('mousedown', function(event) {
    if ((window_modal._main.style.display==='flex')&&(!window_modal._main.contains(event.target))) window_modal.hide();              

});

document.body.addEventListener('keydown', function(event) { if (event.key==='Escape') window_modal.hide();    });
window.addEventListener('beforeunload',function(){localStorage.setItem('OvCountData',JSON.stringify(user_data))});


