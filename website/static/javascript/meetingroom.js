let meetingtable = document.getElementById("meetingtable");
let tablehead = document.getElementById("tablehead");
let tablebody = document.getElementById("tablebody");
    // เปลี่ยนตารางตอน max-width: 768px
    function changeTable(smalldevice) {
        if (smalldevice.matches) {
            tablehead.innerHTML = '';
            tablebody.innerHTML = '';
            let tablehtml = "<tr><th class=\"firsthead\">เวลา</th><th>การจอง</th></tr>";
            tablehead.innerHTML = tablehtml;
            tablehtml = '';
            for(let i = 0; i < 11; i++) {
                tablehtml += `<tr><td>${i+9}:00-${i+10}:00</td>`;
                tablehtml += `<td "></td>`; // รอใส่sql
                tablehtml += "</tr>";
            }
            tablebody.innerHTML = tablehtml;
            let date = new Date()
            let day = date.getDate();
            let month = (date.getMonth() + 1);
            let year = date.getFullYear();
            let dayString = ''+day;
            let monthString = ''+month;
            let fullDate = `${day}-${month}-${year}`;
            let selectdate = document.getElementById("selectdate");
            for(let i = 0; i < 14; i++) {
                if(i!=0){
                    date.setDate(date.getDate()+1);
                }
                day = date.getDate();
                month = (date.getMonth() + 1);
                year = date.getFullYear();
                dayString = ''+day;
                monthString = ''+month;
                if (monthString.length < 2) monthString = '0' + monthString;
                if (dayString.length < 2) dayString = '0' + dayString;
                fullDate = `${dayString}-${monthString}-${year}`;
                let newOption = document.createElement("option");
                newOption.value = fullDate;
                newOption.textContent = fullDate;
                selectdate.appendChild(newOption);
            }
        } else {
          let tablehtml = "<tr>";
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
        
            let date = new Date();
            let day = date.getDate();
            let month = (date.getMonth() + 1);
            let year = date.getFullYear();
            let dayString = ''+day;
            let monthString = ''+month;
            let fullDate = `${day}-${month}-${year}`;
            console.log(fullDate);
            tablehtml = '';
            for(let i = 0; i < 14; i++) {
                console.log(i);
                if(i!=0){
                    date.setDate(date.getDate()+1);
                }
                day = date.getDate();
                month = (date.getMonth() + 1);
                year = date.getFullYear();
                dayString = ''+day;
                monthString = ''+month;
                if (monthString.length < 2) monthString = '0' + monthString;
                if (dayString.length < 2) dayString = '0' + dayString;
                tablehtml += "<tr><td>"+`${dayString}-${monthString}-${year}`+"</td>";
                for(let j = 0; j < 11; j++) {
                    tablehtml += `<td style=""></td>`; // รอใส่sql
                }
                tablehtml += "</tr>";
            }
            tablebody.innerHTML = tablehtml;
        }
    }
    
    let smalldevice = window.matchMedia("(max-width: 768px)");
    
    changeTable(smalldevice);
    
    smalldevice.addEventListener("change", function() {
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

    function validateTimes() {
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;
        if (startTime && endTime && startTime >= endTime) {
            alert("เวลาเริ่มต้นและเวลาสิ้นสุดไม่ถูกต้อง");
            document.getElementById('end-time').value = '';
        }
    }