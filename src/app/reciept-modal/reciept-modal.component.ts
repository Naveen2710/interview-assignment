import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reciept-modal',
  templateUrl: './reciept-modal.component.html',
  styleUrls: ['./reciept-modal.component.scss'],
})
export class RecieptModalComponent  implements OnInit {

  @Input() productsData: any;
  @Input() vat: any;
  @Input() discount: any;
  @Input() grandTotal: any;

  date: string = '';
  time: string = '';
  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    const currentDateAndTime: Date = new Date();
    this.time = currentDateAndTime.toTimeString().split(' ')[0];

    const currentDate: Date = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = String(currentDate.getFullYear());
    this.date = `${day}-${month}-${year}`;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
