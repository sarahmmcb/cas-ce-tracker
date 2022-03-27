import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenText'
})
export class ShortenTextPipe implements PipeTransform {

  transform(text: string, length: number = 200): string {
    if(text.length > length) {
      return text.slice(0, length) + '...';
    } else {
      return text;
    }
  }
}
