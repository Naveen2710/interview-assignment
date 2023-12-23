import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { RecieptModalComponent } from '../reciept-modal/reciept-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  productData = [
    {
      "name": "Laptop",
      "price": 1200,
      "category": "Electronics",
      "description": "Powerful laptop with high-speed processor and long battery life.",
      "quantity": 1,
      "backgroundColor": '#E1F5FE'
    },
    {
      "name": "Smartphone",
      "price": 800,
      "category": "Electronics",
      "description": "Latest smartphone model with advanced camera features and sleek design.",
      "quantity": 1,
      "backgroundColor": '#FFF8E1'
    },
    {
      "name": "Running Shoes",
      "price": 100,
      "category": "Sports",
      "description": "Comfortable and durable running shoes suitable for long-distance runs.",
      "quantity": 1,
      "backgroundColor": '#FCE4EC'
    },
    {
      "name": "Sneakers",
      "price": 90,
      "category": "Fashion",
      "description": "Trendy sneakers designed for both style and comfort.",
      "quantity": 1,
      "backgroundColor": '#F0F4C3'
    },
    {
      "name": "Television",
      "price": 1000,
      "category": "Electronics",
      "description": "Smart TV with 4K resolution and built-in streaming apps for entertainment.",
      "quantity": 1,
      "backgroundColor": '#D1C4E9'
    },
    {
      "name": "Cookware Set",
      "price": 120,
      "category": "Home Appliances",
      "description": "High-quality cookware set with non-stick coating for easy cooking and cleaning.",
      "quantity": 1,
      "backgroundColor": '#FFECB3'
    },
    {
      "name": "Perfume",
      "price": 80,
      "category": "Beauty",
      "description": "Luxurious perfume with a captivating fragrance for men and women.",
      "quantity": 1,
      "backgroundColor": '#D7CCC8'
    },
    {
      "name": "Fitness Tracker",
      "price": 60,
      "category": "Sports",
      "description": "Wearable fitness tracker to monitor steps, heart rate, and sleep patterns.",
      "quantity": 1,
      "backgroundColor": '#FFCDD2'
    },
    {
      "name": "Jacket",
      "price": 110,
      "category": "Fashion",
      "description": "Warm and stylish jacket suitable for winter weather conditions.",
      "quantity": 1,
      "backgroundColor": '#B2EBF2'
    },
    {
      "name": "Desktop Computer",
      "price": 1500,
      "category": "Electronics",
      "description": "High-performance desktop computer with advanced graphics and storage options.",
      "quantity": 1,
      "backgroundColor": '#D1F2EB'
    },
    {
      "name": "Handbag",
      "price": 90,
      "category": "Fashion",
      "description": "Designer handbag with spacious compartments and elegant design.",
      "quantity": 1,
      "backgroundColor": '#F8BBD0'
    },
    {
      "name": "Camera",
      "price": 700,
      "category": "Electronics",
      "description": "Digital camera with high-resolution sensor and interchangeable lenses.",
      "quantity": 1,
      "backgroundColor": '#C5E1A5'
    },
    {
      "name": "Treadmill",
      "price": 800,
      "category": "Sports",
      "description": "Home treadmill with adjustable speed and incline settings for effective workouts.",
      "quantity": 1,
      "backgroundColor": '#FFAB91'
    },
    {
      "name": "Sunglasses",
      "price": 120,
      "category": "Fashion",
      "description": "Designer sunglasses with UV protection and stylish frames.",
      "quantity": 1,
      "backgroundColor": '#B3E5FC'
    },
    {
      "name": "Blender",
      "price": 50,
      "category": "Home Appliances",
      "description": "Powerful blender for making smoothies, soups, and other delicious recipes.",
      "quantity": 1,
      "backgroundColor": '#F1F8E9'
    }
  ];


  subTotal = 0;
  grandTotal = 0;
  totalItems = 0;
  vatValue = 0;
  discountValue = 0;
  vat = 0;
  discount = 0;

  addedProducts: Record<string, any>[] = [];
  addedProducts$: BehaviorSubject<Record<string, any>[]> = new BehaviorSubject<Record<string, any>[]>(this.addedProducts);

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
  ) {
    this.addedProducts$.subscribe(products => {
      this.totalItems = 0;
      this.subTotal = 0;
      products.map(item => {
        this.totalItems += item['quantity'];
        this.subTotal += item['quantity'] * item['price'];
      });
      if(!this.totalItems) {
        this.vatValue = 0;
        this.discountValue = 0;
      }
      this.caclGrandTotal();
    });
  }

  addProduct(item: Record<string, any>) {
    const index = this.addedProducts.indexOf(item);
    if(index !== -1) {
      item['quantity'] ++;
    }else {
      this.addedProducts.push(item);
    }
    this.addedProducts$.next(this.addedProducts);
  }

  removeProduct(index: number) {
    this.addedProducts.splice(index, 1);
    this.addedProducts$.next(this.addedProducts);
    if(!this.addedProducts.length) this.resetPanel();
  }

  decrease(item: Record<string, any>) {
    if(item['quantity'] > 1) item['quantity']--;
    this.addedProducts$.next(this.addedProducts);
  }

  increase(item: Record<string, any>) {
    item['quantity']++;
    this.addedProducts$.next(this.addedProducts);
  }

  calculate(event: any, variable: string) {
    if(event.target.value > 100 && variable === 'discount') event.target.value = 100;
    variable === 'vat' ? this.vat = event.target.value : this.discount = event.target.value;
    this.caclGrandTotal();
  }

  caclGrandTotal() {
    this.grandTotal = this.subTotal + (this.subTotal * (this.vat - this.discount)) /100;
  }

  resetPanel() {
    this.addedProducts = [];
    this.productData.map(item => item['quantity'] = 1);
    this.vat = 0;
    this.discount = 0;
    this.addedProducts$.next(this.addedProducts);
  }

  async recieptPreview() {
    if(!this.totalItems) {
      const message = 'Please add some products first before proceeding';
      const toast = await this.toastCtrl.create({
        position: 'top',
        message,
        color: 'danger',
        duration: 3000,
        cssClass: 'errorAlert',
        mode: 'ios'
      });
      await toast.present();
      return;
    }

    const modal = await this.modalCtrl.create({
      cssClass: 'recieptModal',
      component: RecieptModalComponent,
      componentProps: {
        productsData: this.addedProducts,
        vat: this.vat,
        discount: this.discount,
        grandTotal: this.grandTotal
      }
    })
    modal.present();

    const close = await modal.onDidDismiss();
    if(close) {
      const message = 'Reciept generated successfully';

      this.resetPanel();
      const toast = await this.toastCtrl.create({
        position: 'top',
        message,
        color: 'success',
        duration: 2000,
        mode: 'ios'
      });
      await toast.present();
    }
  }
}
