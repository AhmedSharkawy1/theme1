
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAQID58uWvh9JPSvWabgyzmUWwRWdOBTfo",
  authDomain: "ezz-elsham-menu.firebaseapp.com",
  databaseURL: "https://ezz-elsham-menu-default-rtdb.firebaseio.com",
  projectId: "ezz-elsham-menu",
  storageBucket: "ezz-elsham-menu.firebasestorage.app",
  messagingSenderId: "420141961588",
  appId: "1:420141961588:web:a440de711fdb3b72585c21"
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// الحصول على مرجع قاعدة البيانات
export const db = getDatabase(app);

// هذا المفتاح خاص بمنيو أطياب فقط لضمان عدم تداخل البيانات مع المنيوهات الأخرى
export const MENU_DB_KEY = 'atyab_menu_data_v11';
