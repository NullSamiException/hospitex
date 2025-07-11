import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {Table, TableModule} from 'primeng/table';
import {ProgressBarModule} from 'primeng/progressbar';
import {CustomerService} from '@/pages/service/customer.service';
import {Router} from '@angular/router';
import {Customer} from '@/types/customer';
import {ButtonModule} from 'primeng/button';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';

@Component({
    selector: 'user-list',
    standalone: true,
    imports: [CommonModule, TableModule, InputTextModule, ProgressBarModule, ButtonModule, IconField, InputIcon],
    template: `<div class="card">
        <p-table
            #dt
            [value]="customers"
            [paginator]="true"
            paginatorDropdownAppendTo="body"
            [rows]="10"
            [showCurrentPageReport]="true"
            responsiveLayout="scroll"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            [rowsPerPageOptions]="[10, 25, 50]"
            [globalFilterFields]="['name', 'country.name', 'representative.name']"
        >
            <ng-template #caption>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <p-icon-field class="w-full sm:w-80 order-1 sm:order-none">
                        <p-inputicon class="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Global Search" class="w-full" />
                    </p-icon-field>
                    <button (click)="navigateToCreateUser()" pButton outlined class="w-full sm:w-auto flex-order-0 sm:flex-order-1" icon="pi pi-user-plus" label="Add New"></button>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th pSortableColumn="name" class="white-space-nowrap" style="width:23%">Name <p-sortIcon field="name"></p-sortIcon></th>
                    <th pSortableColumn="country.name" class="white-space-nowrap" style="width:23%">Country <p-sortIcon field="country.name"></p-sortIcon></th>
                    <th pSortableColumn="date" class="white-space-nowrap" style="width:23%">Join Date <p-sortIcon field="date"></p-sortIcon></th>
                    <th pSortableColumn="representative.name" class="white-space-nowrap" style="width:23%">
                        Created By
                        <p-sortIcon field="representative.name"></p-sortIcon>
                    </th>
                    <th pSortableColumn="activity" class="white-space-nowrap">Activity <p-sortIcon field="activity"></p-sortIcon></th>
                </tr>
            </ng-template>
            <ng-template #body let-customer>
                <tr>
                    <td>{{ customer.name }}</td>
                    <td>
                        <div class="flex items-center gap-2">
                            <img src="/demo/images/flag/flag_placeholder.png" [class]="'flag flag-' + customer.country.code" class="mr-2" />
                            <span class="image-text">{{ customer.country.name }}</span>
                        </div>
                    </td>
                    <td>{{ customer.date | date: 'MM/dd/yyyy' }}</td>
                    <td>
                        <div class="inline-flex align-items-center">
                            <img [alt]="customer.representative.name" src="/demo/images/avatar/{{ customer.representative.image }}" class="w-8 h-8 mr-2" />
                            <span>{{ customer.representative.name }}</span>
                        </div>
                    </td>
                    <td>
                        <p-progressBar [value]="customer.activity" [showValue]="false" [style]="{ height: '.5rem' }"></p-progressBar>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    providers: [CustomerService]
})
export class UserList {
    customers: Customer[] = [];

    constructor(
        private customerService: CustomerService,
        private router: Router
    ) {}

    ngOnInit() {
        this.customerService.getCustomersLarge().then((customers) => (this.customers = customers));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    navigateToCreateUser() {
        this.router.navigate(['profile/create']);
    }
}
