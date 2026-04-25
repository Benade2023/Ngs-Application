// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'dateInput'
// })
// export class DateInputPipe implements PipeTransform {
//   transform(value: Date | string | null): string {
//     if (!value) return '';
//     const date = new Date(value);
//     if (isNaN(date.getTime())) return '';
//     return date.toISOString().split('T')[0];
//   }
// }