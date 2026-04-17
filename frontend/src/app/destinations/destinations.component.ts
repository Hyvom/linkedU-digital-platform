import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-destinations',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './destinations.component.html',
    styleUrl: './destinations.component.css'
})
export class DestinationsComponent {}
