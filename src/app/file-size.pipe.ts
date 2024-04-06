import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileSize',
    standalone: true,
})
export class FileSizePipe implements PipeTransform {
    transform(value?: number): string {
        if (!value || value === 0) return '0 Bytes';

        let sizeTier = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        let i = Math.floor(Math.log(value) / Math.log(1024));
        return `${parseFloat((value / Math.pow(1024, i)).toFixed(2))} ${sizeTier[i]}`;
    }
}
