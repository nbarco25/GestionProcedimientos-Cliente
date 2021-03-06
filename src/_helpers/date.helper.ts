export class DateHelper{
    public static dateToStr(date:Date):string{
        let oldDate = date;
        let year = oldDate.getFullYear().toString();
        let month = (oldDate.getMonth()+1).toString().length<2?'0'+(oldDate.getMonth()+1).toString():(oldDate.getMonth()+1).toString();
        let day = oldDate.getDate().toString().length<2?'0'+oldDate.getDate().toString():oldDate.getDate().toString();
        let strDate = year+'-'+month+'-'+day;
        return strDate;
    }

    public static getAge(birthdate:Date){
        if(birthdate==null){return 0;}
        let currentDate = new Date();
        let age = currentDate.getFullYear() - birthdate.getFullYear();
        let month = currentDate.getMonth() - birthdate.getMonth();
        if(month < 0 || (month===0 && currentDate.getDate() < birthdate.getDate())){
            age--;
        }
        return age;
    }

    public static getMaxDate(actualDate:Date){
        actualDate.setFullYear(actualDate.getFullYear()-18);
        return actualDate;
    }

    public static getFecha(fechaHora:string){
        return fechaHora.substr(0,fechaHora.indexOf(' '));
    }
    public static getHora(fechaHora:string){
        return fechaHora.substr(fechaHora.indexOf(' ')+1);
    }
}