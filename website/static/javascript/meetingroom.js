let tablehead = document.getElementById("tablehead");
let tablebody = document.getElementById("tablebody");
let coWorkdata = [];
let select_table_date = document.getElementById("select_table_date");
let selectdate = document.getElementById("selectdate");
let selectedValue = '';
let alreadyChange = 0;

// รับข้อมูล json จากตาราง CoWork
fetch('http://localhost:3000/meetdata')
        .then(response => response.json())
        .then(data => {
            coWorkdata = data;
            changeTable(smalldevice);
        })
        .catch(error => {
            console.log(error);
        });

// เปลี่ยนตารางเวลาบริการเมื่อขนาดเปลี่ยน
function changeTable(smalldevice) {
    let tablehtml = '';
    let coWorkdata_count = 0;
    let coWorkDate_start, coWorkDate_end, filtercoWorkData, currentTableTime;;
    const selectedDate = document.getElementById("selected_date");
    let date = new Date(), day = date.getDate()-1, month = (date.getMonth() + 1), year = date.getFullYear(), fullDate, firstFullDate;
    let dayString = ''+day, monthString = ''+month;

    if (smalldevice.matches) {
        tablehead.innerHTML = "<tr><th class=\"firsthead\">เวลา</th><th>การจอง</th></tr>";

        //loopแสดงวันปัจจุบัน ถึง14วันถัดไป
        for(let i = 0; i < 14; i++) {
            date.setDate(date.getDate()+1);
            day = date.getDate()-1, month = (date.getMonth() + 1), year = date.getFullYear();
            dayString = ''+day, monthString = ''+month;
            if (monthString.length < 2) monthString = '0' + monthString;
            if (dayString.length < 2) dayString = '0' + dayString;
            fullDate = `${dayString}-${monthString}-${year}`;
            fullDateValue = `${year}-${monthString}-${dayString}`;
            if(i==0)firstFullDate = `${year}-${monthString}-${dayString}`;

            let newOption = document.createElement("option"), newOption2 = document.createElement("option");
            newOption.value = fullDateValue, newOption2.value = fullDateValue;
            newOption.textContent = fullDate, newOption2.textContent = fullDate;
            if(!alreadyChange){
                selectdate.appendChild(newOption);
                select_table_date.appendChild(newOption2);
            }
            if (fullDateValue === selectedDate.innerText) {
                newOption.selected = true;
            }
        }
        
        //ให้เลือกวันแรกในครั้งแรก
        if(selectedValue == '') fullDateValue = firstFullDate;
        else fullDateValue = selectedValue;
        select_table_date.value = fullDateValue;

        //filterข้อมูลตามวันที่ผู้ใช้เลือก
        if(coWorkdata.length != 0){
            filtercoWorkData = coWorkdata.filter(obj => isSameDay(obj.starttime, fullDateValue));
            if(filtercoWorkData.length != 0){
                coWorkDate_start = new Date(filtercoWorkData[coWorkdata_count].starttime);
                coWorkDate_end = new Date(filtercoWorkData[coWorkdata_count].endtime);
            }
        }

        // สร้างตาราง เวลา 9:00-20:00
        for(let i = 0; i < 11; i++) {
            tablehtml += `<tr><td>${i+9}:00-${i+10}:00</td>`;

            // เช็คว่าต้องสร้างช่องสีแดงมั้ย
            if(filtercoWorkData.length != 0){
                if(i==0)currentTableTime = new Date(`${fullDateValue}T0${i + 9}:00:00`);
                else currentTableTime = new Date(`${fullDateValue}T${i + 9}:00:00`);

                if(currentTableTime.getTime() >= coWorkDate_start.getTime() && currentTableTime.getTime() < coWorkDate_end.getTime()){
                    tablehtml += `<td style="background-color: #FF0000;"></td>`;
                }
                else if(currentTableTime.getTime() === coWorkDate_end.getTime()){
                    coWorkdata_count += 1
                        if(coWorkdata_count  < filtercoWorkData.length){
                            coWorkDate_start = new Date(filtercoWorkData[coWorkdata_count].starttime);
                            coWorkDate_end = new Date(filtercoWorkData[coWorkdata_count].endtime);
                        }
                }
                else tablehtml += `<td></td>`;
            }
            else tablehtml += `<td></td>`;
            tablehtml += "</tr>";
        }
        tablebody.innerHTML = tablehtml;
    } else {
        tablehtml += "<tr>";
        // สร้างตารางเวลาแนวนอน 9:00-20:00
        for(let i = 0; i < 12; i++) {
            if(i==0){
                tablehtml += "<th class=\"firsthead\">วัน/เวลา</th>";
            }
            else{
                if(i==1) tablehtml += `<th>0${i+8}:00-${i+9}:00</th>`
                else tablehtml += `<th>${i+8}:00-${i+9}:00</th>`;
            }
        }
        tablehtml += "</tr>";
        tablehead.innerHTML = tablehtml;
    
        tablehtml = '';
        if(coWorkdata.length != 0){
            coWorkDate_start = new Date(coWorkdata[coWorkdata_count].starttime);
            coWorkDate_end = new Date(coWorkdata[coWorkdata_count].endtime);
        }

        // loopวัน14วัน
        for(let i = 0; i < 14; i++) {
            if(i!=0){
                date.setDate(date.getDate()+1);
            }
            day = date.getDate()-1, month = (date.getMonth() + 1), year = date.getFullYear();
            dayString = ''+day, monthString = ''+month;
            if (monthString.length < 2) monthString = '0' + monthString;
            if (dayString.length < 2) dayString = '0' + dayString;
            fullDate = `${dayString}-${monthString}-${year}`;
            fullDateValue = `${year}-${monthString}-${dayString}`;
            if(i==0)firstFullDate = `${year}-${monthString}-${dayString}`;

            tablehtml += "<tr><td>"+`${dayString}-${monthString}-${year}`+"</td>";

            // loopเวลา 09:00-20:00
            for(let j = 0; j < 11; j++) {
                if(coWorkdata.length != 0){
                    // เช็คว่าต้องสร้างช่องสีแดงมั้ย
                    if(j==0){
                        currentTableTime = new Date(`${fullDateValue}T0${j + 9}:00:00`);
                    }
                    else{
                        currentTableTime = new Date(`${fullDateValue}T${j + 9}:00:00`);
                    }
                    if(currentTableTime.getTime() >= coWorkDate_start.getTime() && currentTableTime.getTime() < coWorkDate_end.getTime()){
                        tablehtml += `<td style="background-color: #FF0000;"></td>`;
                    }
                    else if(currentTableTime.getTime() === coWorkDate_end.getTime()){
                        coWorkdata_count += 1;
                        if(coWorkdata_count < coWorkdata.length){
                            coWorkDate_start = new Date(coWorkdata[coWorkdata_count].starttime);
                            coWorkDate_end = new Date(coWorkdata[coWorkdata_count].endtime);
                        }
                    }
                    else tablehtml += `<td></td>`;
                }
                else  tablehtml += `<td></td>`;
            }
            tablehtml += "</tr>";

            let newOption = document.createElement("option");
            newOption.value = fullDateValue;
            newOption.textContent = fullDate;
            if(!alreadyChange){
                selectdate.appendChild(newOption);
                select_table_date.appendChild(newOption2);
            }
            if (fullDateValue === selectedDate.innerText) {
                newOption.selected = true;
            }
        }
        tablebody.innerHTML = tablehtml;
    }
    if(selectedDate.innerText == ''){
        let newOption = document.createElement("option");
        newOption.value = ""
        newOption.textContent = "";
        newOption.disabled = true;
        newOption.selected = true;
        newOption.hidden = true;
        selectdate.appendChild(newOption);
    } else{
        document.getElementById("room_id").disabled = true;
        document.getElementById("selectdate").disabled = true;
        document.getElementById("start-time").disabled = true;
        document.getElementById("end-time").disabled = true;
        document.getElementById("info").disabled = true;
    }
    alreadyChange = 1;
}


let smalldevice = window.matchMedia("(max-width: 768px)");

smalldevice.addEventListener("change", function() {
    changeTable(smalldevice);
});
const select_option = document.getElementById('select_table_date');
select_option.addEventListener('change', function() {
    selectedValue = select_option.value;
    changeTable(smalldevice);
});

// เช็คเวลา
document.getElementById('start-time').addEventListener('change', function() {
    let timeValue = this.value; 
    let hours = timeValue.split(':')[0]; 
    let updatedTime = hours + ":00"; 
    this.value = updatedTime; 
    const minTime = "09:00";
    const maxTime = "20:00";
    if (timeValue < minTime) {
        this.value = minTime; 
    } 
    else if (timeValue > maxTime) {
        this.value = maxTime; 
    }
});

// เช็คไว้filterตอนจอเล็ก
function isSameDay(date1, date2) {
    const date1String = date1.split(' ')[0];
    return date1String === date2;
}

// บังคับให้เลือกเฉพาะชั่วโมง
document.getElementById('end-time').addEventListener('change', function() {
    let timeValue = this.value; 
    let hours = timeValue.split(':')[0];
    let updatedTime = hours + ":00"; 
    this.value = updatedTime;
    const minTime = "09:00";
    const maxTime = "20:00";
    if (timeValue < minTime) {
        this.value = minTime; 
    } else if (timeValue > maxTime) {
        this.value = maxTime;
    }
});

// alertถ้าผู้ใช้เลือกเวลาไม่ถูก
function validateTimes() {
    const startTime = document.getElementById('start-time').value;
    const end_Time = document.getElementById('end-time').value;
    if (startTime && end_Time && startTime >= end_Time) {
        alert("เวลาเริ่มต้นและเวลาสิ้นสุดไม่ถูกต้อง");
        document.getElementById('end-time').value = '';
    }
}

// ปุ่มแก้ไขข้อมูล
function editData() {
    document.getElementById("room_id").disabled = false;
        document.getElementById("selectdate").disabled = false;
        document.getElementById("start-time").disabled = false;
        document.getElementById("end-time").disabled = false;
        document.getElementById("info").disabled = false;
}