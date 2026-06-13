import {CartItem} from './models/CartItem.js';
import {CartItems} from './models/CartItems.js';
import {Product} from './models/Product.js';
import {Products} from './models/Products.js';

const productList = [
  new Product('1', 'EASTER', 100000000000, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop'),
  new Product('2', 'PARADI', 1, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop'),
  new Product('3', 'BIBIBING', 2000, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'),
  new Product('4', 'ZO', 20000000, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop'),
  new Product('5', '6month', 2, 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=200&h=200&fit=crop'),
];

export const products = new Products(productList);

export const cartItems = new CartItems([
  new CartItem('1', productList[0].id, 1),
  new CartItem('2', productList[1].id, 2),
  new CartItem('3', productList[4].id, 98),
]);
