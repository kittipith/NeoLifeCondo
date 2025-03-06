let tablehead = document.getElementById("tablehead");
let tablebody = document.getElementById("tablebody");
let coWorkdata = [];
let select_table_date = document.getElementById("select_table_date");
let selectdate = document.getElementById("selectdate");
let selectedValue = '';
let small_alreadyChange = 0, big_alreadyChange = 0;
let coworkname = document.getElementById("coworkname");
// รับข้อมูล json จากตาราง CoWork
fetch(`http://localhost:3000/meetdata/${coworkname.innerText}`)
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
    const selectedDate = document.getElementById("selected_date");
    let tablehtml = '';
    let coWorkdata_count = 0;
    let coWorkDate_start, coWorkDate_end, filtercoWorkData, currentTableTime;
    let date = new Date(), day = date.getDate()-1, month = (date.getMonth() + 1), year = date.getFullYear(), fullDate, firstFullDate;
    let dayString = ''+day, monthString = ''+month;

    switch(coworkname.innerText) { 
        case 'badminton':
            coworkname.innerText = 'สนามแบดมินตัน';
            break;
        case 'meeting':
            coworkname.innerText = 'ห้องประชุม';
            break;
        case 'basketball':
            coworkname.innerText = 'สนามบาส';
            break;
        case 'theater':
            coworkname.innerText = 'ห้องดูหนัง';
            break;
        default:
            coworkname.innerText = coworkname.innerText;
    }
    
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
            if(!big_alreadyChange){
                selectdate.appendChild(newOption);
            }
            if(!small_alreadyChange){
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
        if(coWorkdata && coWorkdata.length != 0){
            filtercoWorkData = coWorkdata.filter(obj => isSameDay(obj.starttime, fullDateValue));
            if(filtercoWorkData && filtercoWorkData.length != 0){
                coWorkDate_start = new Date(filtercoWorkData[coWorkdata_count].starttime);
                coWorkDate_end = new Date(filtercoWorkData[coWorkdata_count].endtime);
            }
        }

        // สร้างตาราง เวลา 9:00-20:00
        for(let i = 0; i < 11; i++) {
            tablehtml += `<tr><td>${i+9}:00-${i+10}:00</td>`;

            // เช็คว่าต้องสร้างช่องสีแดงมั้ย
            if(filtercoWorkData && filtercoWorkData.length != 0){
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
        small_alreadyChange = 1;
        big_alreadyChange = 1;
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
        if(coWorkdata && coWorkdata.length != 0){
            coWorkDate_start = new Date(coWorkdata[coWorkdata_count].starttime);
            coWorkDate_end = new Date(coWorkdata[coWorkdata_count].endtime);
        }

        // loopวัน14วัน
        for(let i = 0; i < 14; i++) {
            date.setDate(date.getDate()+1);
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
                    if(i==0 && j==0){
                        while(coWorkDate_start.getTime() < currentTableTime.getTime()){
                            coWorkdata_count += 1;
                            if(coWorkdata_count < coWorkdata.length){
                                coWorkDate_start = new Date(coWorkdata[coWorkdata_count].starttime);
                                coWorkDate_end = new Date(coWorkdata[coWorkdata_count].endtime);
                            }
                        }
                    }
                    if(currentTableTime.getTime() >= coWorkDate_start.getTime() && currentTableTime.getTime() < coWorkDate_end.getTime()){
                        tablehtml += `<td style="background-color: #FF0000;"></td>`;
                    }
                    else if(currentTableTime.getTime() >= coWorkDate_end.getTime()){
                        coWorkdata_count += 1;
                        if(coWorkdata_count < coWorkdata.length){
                            coWorkDate_start = new Date(coWorkdata[coWorkdata_count].starttime);
                            coWorkDate_end = new Date(coWorkdata[coWorkdata_count].endtime);
                        }
                        if(currentTableTime.getTime() >= coWorkDate_start.getTime() && currentTableTime.getTime() < coWorkDate_end.getTime()){
                            tablehtml += `<td style="background-color: #FF0000;"></td>`;
                        }
                        else tablehtml += `<td></td>`;
                    }
                    else tablehtml += `<td></td>`;
                }
                else  tablehtml += `<td></td>`;
            }
            tablehtml += "</tr>";

            let newOption = document.createElement("option"), newOption2 = document.createElement("option");
            newOption.value = fullDateValue;
            newOption.textContent = fullDate;
            if(!big_alreadyChange){
                selectdate.appendChild(newOption);
            }
            if (fullDateValue === selectedDate.innerText) {
                newOption.selected = true;
            }
        }
        tablebody.innerHTML = tablehtml;
        big_alreadyChange = 1;
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
        document.getElementById("room_number").disabled = true;
        document.getElementById("selectdate").disabled = true;
        document.getElementById("start-time").disabled = true;
        document.getElementById("end-time").disabled = true;
        document.getElementById("info").disabled = true;
        document.getElementById("savedata").disabled = true;
    }
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
});

// alertถ้าผู้ใช้กรอกไม่ถูก
function validateForm() {
    let startTime = document.getElementById('start-time').value;
    let end_Time = document.getElementById('end-time').value;
    let room_number = document.getElementById("room_number").value;
    let room_id = document.getElementById("room_id").value;
    let selectdate = document.getElementById("selectdate").value;
    startTime_ = startTime.split(':');
    end_Time_ = end_Time.split(':');

    startTime_ = new Date(0, 0, 0, startTime_[0], startTime_[1]);
    end_Time_ = new Date(0, 0, 0, end_Time_[0], end_Time_[1]);
    const differenceInMs = Math.abs(end_Time_ - startTime_);
    const differenceInHours = differenceInMs / (1000 * 60 * 60);
    console.log(differenceInHours);

    startTime_compare = new Date(`${selectdate}T${startTime}:00`);
    end_Time_compare = new Date(`${selectdate}T${end_Time}:00`);
    
    let minAllowedTime = new Date(`${selectdate}T09:00:00`);
    let maxAllowedTime = new Date(`${selectdate}T20:00:00`);

    if (startTime && end_Time && (startTime_compare < minAllowedTime || startTime_compare > maxAllowedTime || end_Time_compare < minAllowedTime || end_Time_compare > maxAllowedTime)) {
        alert("เวลาที่เลือกต้องอยู่ระหว่าง 09:00 ถึง 20:00");
        return false;
    }
    if (startTime && end_Time && startTime >= end_Time) {
        alert("เวลาเริ่มต้นและเวลาสิ้นสุดไม่ถูกต้อง");
        return false;
    }
    if(selectdate === ''){
        alert("กรุณากรอกวันที่");
        return false;
    }
    if (room_number === ''){
        alert("กรุณากรอกหมายเลขห้อง");
        return false;
    }
    if (startTime === '' || end_Time === ''){
        alert("กรุณากรอกเวลาให้ครบ");
        return false;
    }
    if (differenceInHours > 2){
        alert("สามารถเลือกเวลาได้ไม่เกิน 2 ชัวโมง");
        return false;
    }
    if(coWorkdata && coWorkdata.length != 0){
        console.log(coWorkdata);
        const isConflict = coWorkdata.some(data => {
            if(data.room_id != room_id || room_id === '') {
                let cowork_starttime = new Date(data.starttime);
                let cowork_endtime = new Date(data.endtime);
                if ((cowork_starttime < end_Time_compare) && (startTime_compare < cowork_endtime)) {
                    alert("ไม่สามารถจองเวลานี้ได้ เนื่องจากมีการจองไว้แล้ว");
                    return true; 
                }
            }
            return false;
        });
        if (isConflict) {
            return false;
        }
    }
    Swal.fire({
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500
      });
    return true;
}

// ปุ่มแก้ไขข้อมูล
function editData() {
    document.getElementById("room_number").disabled = false;
    document.getElementById("selectdate").disabled = false;
    document.getElementById("start-time").disabled = false;
    document.getElementById("end-time").disabled = false;
    document.getElementById("info").disabled = false;
    document.getElementById("savedata").disabled = false;
    document.getElementById("meetingdetail").action = "/user/editcowork";
}