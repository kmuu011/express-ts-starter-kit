import express from "express";

const ranStr = 'qwertyuiopasdfghjklzxcvbnm0123456789';
const dayStrList = ['일', '월', '화', '수', '목', '금', '토'];

export class Utility {
  public static createRandomString(length: number = 32): string {
    let ranString = '';
    for (let i = 0; i < length; i++) {
      ranString += ranStr[Math.floor(Math.random() * ranStr.length)];
    }
    return ranString;
  }

  public static dateToObject(dateValue?: Date): {
    year: string;
    month: string;
    date: string;
    day: number;
    dayStr: string;
    hour: string;
    minute: string;
    second: string;
  } {
    dateValue = dateValue ? dateValue : new Date();

    const year = dateValue.getFullYear().toString();
    const month = (dateValue.getMonth() + 1).toString().padStart(2, '0');
    const date = dateValue.getDate().toString().padStart(2, '0');
    const day = dateValue.getDay();
    const dayStr = dayStrList[day];
    const hour = dateValue.getHours().toString().padStart(2, '0');
    const minute = dateValue.getMinutes().toString().padStart(2, '0');
    const second = dateValue.getSeconds().toString().padStart(2, '0');

    return { year, month, date, day, dayStr, hour, minute, second };
  }

  public static getIpUserAgent = (req: express.Request) => {
    const {
      "user-agent": userAgent,
    } = req.headers;
    const ip = (req.headers["x-forwarded-for"] || req.headers.ip) || '';
    const filteredIp = ip.constructor !== String ? (ip[0] || '') : ip;
    const filteredUserAgent = userAgent || '';

    return {
      ip: filteredIp,
      userAgent: filteredUserAgent,
    }
  }
}