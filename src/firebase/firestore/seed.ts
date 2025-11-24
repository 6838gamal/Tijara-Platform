
import {
  collection,
  doc,
  writeBatch,
  Firestore,
  serverTimestamp,
} from 'firebase/firestore';

// Mock Data
const users = [
  {
    id: 'awn@gmail.com',
    name: 'Awn Admin',
    email: 'awn@gmail.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 'merchant@awn.com',
    name: 'Fashion Merchant',
    email: 'merchant@awn.com',
    role: 'Merchant',
    status: 'Active',
  },
  {
    id: 'customer@awn.com',
    name: 'Khalid Customer',
    email: 'customer@awn.com',
    role: 'Customer',
    status: 'Active',
  },
];

const stores = [
  {
    id: 'store_1',
    name: 'متجري',
    ownerId: 'merchant@awn.com', // Correct: Owner ID is the merchant's email
    status: 'Active',
    plan: 'Premium',
    image:
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const plans = [
    { id: 'plan_basic', name: 'أساسية', price: 29, features: '50 منتج، تحليلات أساسية', status: 'Active' },
    { id: 'plan_premium', name: 'مميزة', price: 79, features: 'منتجات غير محدودة، تحليلات متقدمة، دعم ذكي', status: 'Active' },
];

const coupons = [
    { id: 'coupon_1', code: 'SUMMER20', type: 'percentage', value: 20, status: 'Active', expiryDate: '2024-12-31' },
];

const products = [
    { id: 'prod_001', name: 'مصباح مكتب عصري', price: 79.99, stock: 100, category: 'category_1', brand: 'brand_1', status: 'Published', isFeatured: true, image: 'https://images.unsplash.com/photo-1543349639-5d393f9a1f2c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 'prod_002', name: 'سماعات رأس لاسلكية', price: 149.99, stock: 50, category: 'category_1', brand: 'brand_2', status: 'Published', isFeatured: true, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 'prod_003', name: 'أصيص زرع سيراميك', price: 49.99, stock: 200, category: 'category_2', brand: 'brand_1', status: 'Draft', isFeatured: false, image: 'https://images.unsplash.com/photo-1592205869329-775b965f80d7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 'prod_004', name: 'ساعة ذكية SE', price: 279.00, stock: 75, category: 'category_1', brand: 'brand_2', status: 'Published', isFeatured: true, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const categories = [
    { id: 'category_1', name: 'إلكترونيات', description: 'أجهزة وأدوات إلكترونية', productCount: 3, parentId: undefined },
    { id: 'category_2', name: 'ديكور منزلي', description: 'قطع ديكور للمنزل', productCount: 1, parentId: undefined },
];

const brands = [
    { id: 'brand_1', name: 'البيت الأنيق', description: 'للمسات عصرية في منزلك', productCount: 2 },
    { id: 'brand_2', name: 'تقنية المستقبل', description: 'أحدث الأجهزة الذكية', productCount: 2 },
];

const orders = [
    { id: 'order_1', customerName: 'أحمد محمود', total: 229.98, status: 'Pending', createdAt: new Date('2023-10-26') },
    { id: 'order_2', customerName: 'سارة علي', total: 79.99, status: 'Shipped', createdAt: new Date('2023-10-25') },
];

const customers = [
    { id: 'cust_1', name: 'أحمد محمود', email: 'ahmed@example.com', totalOrders: 1, totalSpent: 229.98, joinedDate: new Date('2023-10-26') },
    { id: 'cust_2', name: 'سارة علي', email: 'sara@example.com', totalOrders: 1, totalSpent: 79.99, joinedDate: new Date('2023-10-25') },
];

const merchantCoupons = [
    { id: 'mcoupon_1', code: 'SAVE10', type: 'percentage', value: 10, expiryDate: '2024-12-31' },
];

const merchantNotifications = [
    { id: 'mnotif_1', title: 'تخفيضات نهاية الأسبوع', message: 'استمتع بخصم 20% على جميع المنتجات!' },
];

export async function seedDatabase(db: Firestore) {
  const batch = writeBatch(db);

  // Seed users
  users.forEach((user) => {
    const userRef = doc(db, 'users', user.id);
    batch.set(userRef, { ...user, createdAt: serverTimestamp() });
  });

  // Seed plans
  plans.forEach((plan) => {
      const planRef = doc(db, 'plans', plan.id);
      batch.set(planRef, { ...plan, createdAt: serverTimestamp() });
  });

  // Seed coupons
  coupons.forEach((coupon) => {
      const couponRef = doc(db, 'coupons', coupon.id);
      batch.set(couponRef, { ...coupon, createdAt: serverTimestamp() });
  });

  // Seed stores and their subcollections
  for (const store of stores) {
    const storeRef = doc(db, 'stores', store.id);
    batch.set(storeRef, { ...store, createdAt: serverTimestamp() });
    
    products.forEach(p => {
        const prodRef = doc(collection(storeRef, 'products'), p.id);
        batch.set(prodRef, {...p, createdAt: serverTimestamp()});
    });

    categories.forEach(c => {
        const catRef = doc(collection(storeRef, 'categories'), c.id);
        batch.set(catRef, {...c, createdAt: serverTimestamp()});
    });

    brands.forEach(b => {
        const brandRef = doc(collection(storeRef, 'brands'), b.id);
        batch.set(brandRef, {...b, createdAt: serverTimestamp()});
    });

    orders.forEach(o => {
        const orderRef = doc(collection(storeRef, 'orders'), o.id);
        batch.set(orderRef, {...o, createdAt: serverTimestamp()});
    });
    
    customers.forEach(cust => {
        const custRef = doc(collection(storeRef, 'customers'), cust.id);
        batch.set(custRef, {...cust, joinedDate: serverTimestamp()});
    });

    merchantCoupons.forEach(mc => {
        const couponRef = doc(collection(storeRef, 'coupons'), mc.id);
        batch.set(couponRef, {...mc, createdAt: serverTimestamp()});
    });
    
    merchantNotifications.forEach(mn => {
        const notifRef = doc(collection(storeRef, 'notifications'), mn.id);
        batch.set(notifRef, {...mn, sentAt: serverTimestamp()});
    });
  }

  try {
    await batch.commit();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database: ', error);
  }
}
