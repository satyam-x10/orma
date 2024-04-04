import moment from "moment";

export const phoneValidator = (phone: string): boolean => {
    let phoneRegex = /^[0-9]+$/;
    return phoneRegex.test(phone);
}

export const getTime = (time: string) => {
    const someTimeInThePast: moment.Moment = moment(time);
    const relativeTime: string = someTimeInThePast.fromNow();
    return relativeTime;
}