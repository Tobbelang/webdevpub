export class Clock {

    constructor(hour = 0, minute = 0, second = 0) {
        if(hour <= 24 && hour > 0) {
            this.hour = hour;
        } else {
        throw Error("Timmar måste vara mellan 0 och 24");
        }
            
        if(minute <= 60 && minute > 0){
            this.minute = minute;
        } else {
        throw Error("Minuter måste vara mellan 0 och 60");
        }
        if(second <= 60 && second > 0){
            this.second = second;
        } else {
        throw Error("Sekunder måste vara mellan 0 och 60");
        }
        this.activateAlarm = false;
    }
    
    setAlarm(hour, minute, second){
        this.Alarmhour = hour; 
        this.Alarmminute = minute;
        this.alarmsecond = second;
        let alarmIsActive = true
    }
    activateAlarm(){
        this.alarm = true;
    }
    deactivateAlarm(){
        this.alarm = false;
    } 

    setTime(hour, minute, second) {
        if(hour <= 24 && hour > 0) {
            this.hour = hour;
        } else {
        throw Error("Timmar måste vara mellan 0 och 24");
        }
            
        if(minute <= 60 && minute > 0){
            this.minute = minute;
        } else {
        throw Error("Minuter måste vara mellan 0 och 60");
    }
    if(second <= 60 && second > 0){
        this.second = second;
    } else {
    throw Error("Sekunder måste vara mellan 0 och 60");
}
}
    tick() {
        let clock = new Clock(1,1,1);
        let second = clock.timeSecond
        if(second <= 60 && second > 0){
        this.second++;
        }
        if (this.second == 60) {
            this.second = 0;
            this.minute += 1;
        }
        if (this.minute == 60) {
            this.minute = 0;
            this.hour += 1;
        }
        if (this.hour == 24) {
            this.hour = 0;
        }
        if(this.alarm = true){
            if(this.hour == this.Alarmhour && this.minute == this.Alarmminute && this.second == this.alarmsecond){
            alert("ALARM!!!");
            console.log("ALARM!!!");
            }
        }
    }
    spola() {
        this.hour++;
        if (this.second == 60) {
            this.second = 0;
            this.minute += 1;
        }
        if (this.minute == 60) {
            this.minute = 0;
            this.hour += 1;
        }
        if (this.hour == 24) {
            this.hour = 0;
        }
    }
    get timeHour() {
        return this.hour.toString().padStart(2, '0')
    }
    get timeMinute() {
        return this.minute.toString().padStart(2, '0')
    }
    get timeSecond() {
        return this.second.toString().padStart(2, '0')
    }
}
