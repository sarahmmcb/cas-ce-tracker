import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenText'
})
export class ShortenTextPipe implements PipeTransform {

  transform(text: string): string {
    if(text.length > 200) {
      return text.slice(0,200) + '...';
    } else {
      return text;
    }
  }
}
