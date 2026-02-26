
import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db, MENU_DB_KEY } from './firebase';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import Logo from './components/Logo';
import { MENU_DATA } from './constants';
import { MenuSection as MenuSectionType } from './types';
import { THEME_CONFIG } from './src/ThemeConfig';
import { CONFIG } from './src/config';

/**
 * THEME MANIFEST: Atyab Modern Oriental
 * ------------------------------------
 * Personality: Professional, High-Contrast, Interactive.
 * Primary Color: #eab308 (Gold/Yellow)
 * Background: Dark (#050505) with Glassmorphism.
 * Typography: Cairo (Arabic-focused Sans-Serif).
 * Key Features: Floating emojis, Haptic feedback, Real-time Firebase sync.
 */

const AtyabLogo = ({ size = "w-16 h-16" }: { size?: string }) => (
  <div className={`${size} relative flex items-center justify-center overflow-hidden rounded-full border-[3px] border-primary shadow-md bg-white dark:bg-zinc-900 mb-4 transform transition-all duration-700 hover:rotate-6 active:scale-95 cursor-pointer p-1`}>
    <Logo />
  </div>
);

const MenuIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const App: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passInput, setPassInput] = useState("");
  
  // التهيئة الأولية من LocalStorage لسرعة التحميل (مفتاح v11)، ثم التحديث من Firebase
  const [menuData, setMenuData] = useState<MenuSectionType[]>(() => {
    const saved = localStorage.getItem('atyab_menu_data_v11');
    // تنظيف النسخ القديمة
    localStorage.removeItem('atyab_menu_data');
    localStorage.removeItem('atyab_menu_data_v2');
    localStorage.removeItem('atyab_menu_data_v3');
    localStorage.removeItem('atyab_menu_data_v4');
    localStorage.removeItem('atyab_menu_data_v5');
    localStorage.removeItem('atyab_menu_data_v6');
    localStorage.removeItem('atyab_menu_data_v7');
    localStorage.removeItem('atyab_menu_data_v8');
    localStorage.removeItem('atyab_menu_data_v9');
    localStorage.removeItem('atyab_menu_data_v10');
    return saved ? JSON.parse(saved) : MENU_DATA;
  });

  const [activeSection, setActiveSection] = useState<string>('');
  const [showBottomCallMenu, setShowBottomCallMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  const navRef = useRef<HTMLDivElement>(null);
  const isManualScrolling = useRef(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Firebase Realtime Sync
  useEffect(() => {
    const menuRef = ref(db, MENU_DB_KEY);
    const unsubscribe = onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMenuData(data);
        localStorage.setItem('atyab_menu_data_v11', JSON.stringify(data));
      } else {
        // إذا كانت قاعدة البيانات فارغة (مفتاح جديد)، قم برفع البيانات المحلية الحالية
        // هذا يضمن تحديث القاعدة بالأصناف والأسعار الجديدة تلقائياً
        set(menuRef, MENU_DATA);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-180px 0px -40% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isManualScrolling.current) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    menuData.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [menuData]);

  useEffect(() => {
    if (activeSection && navRef.current) {
      const activeButton = navRef.current.querySelector(`[data-section-id="${activeSection}"]`);
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeSection]);

  const triggerHaptic = (pattern: number | number[] = 10) => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    triggerHaptic(10);
    setShowCategoriesMenu(false);
    setShowBottomCallMenu(false);
    const target = document.getElementById(id);
    if (target) {
      isManualScrolling.current = true;
      setActiveSection(id);
      const offset = 170;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'auto' });
      setTimeout(() => { isManualScrolling.current = false; }, 100);
    }
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      navRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      triggerHaptic(5);
    }
  };

  const handleLogin = () => {
    if (passInput === CONFIG.ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLogin(false);
      setPassInput("");
      triggerHaptic(30);
    } else {
      alert("⚠️ كلمة السر غير صحيحة");
      triggerHaptic([50, 50, 50]);
    }
  };

  const handleUpdatePrice = (sectionId: string, itemIdx: number, priceIdx: number, newVal: string) => {
    const updated = [...menuData];
    const sectionIdx = updated.findIndex(s => s.id === sectionId);
    if (sectionIdx > -1) {
      updated[sectionIdx].items[itemIdx].prices[priceIdx] = newVal;
      setMenuData(updated);
    }
  };

  const handleToggleTag = (sectionId: string, itemIdx: number, tag: 'isPopular' | 'isSpicy') => {
    const updated = [...menuData];
    const sectionIdx = updated.findIndex(s => s.id === sectionId);
    if (sectionIdx > -1) {
      const currentVal = updated[sectionIdx].items[itemIdx][tag];
      updated[sectionIdx].items[itemIdx][tag] = !currentVal;
      setMenuData(updated);
      triggerHaptic(10);
    }
  };

  const handleDeleteItem = (sectionId: string, itemIdx: number) => {
    const updated = [...menuData];
    const sectionIdx = updated.findIndex(s => s.id === sectionId);
    if (sectionIdx > -1) {
      updated[sectionIdx].items.splice(itemIdx, 1);
      setMenuData(updated);
      triggerHaptic([20, 10, 20]);
    }
  };

  const handleReorderItems = (sectionId: string, itemIdx: number, direction: 'up' | 'down') => {
    const updated = [...menuData];
    const sectionIdx = updated.findIndex(s => s.id === sectionId);
    if (sectionIdx > -1) {
      const items = [...updated[sectionIdx].items];
      if (direction === 'up' && itemIdx > 0) {
        [items[itemIdx], items[itemIdx - 1]] = [items[itemIdx - 1], items[itemIdx]];
      } else if (direction === 'down' && itemIdx < items.length - 1) {
        [items[itemIdx], items[itemIdx + 1]] = [items[itemIdx + 1], items[itemIdx]];
      }
      updated[sectionIdx].items = items;
      setMenuData(updated);
      triggerHaptic(5);
    }
  };

  const saveMenuChanges = () => {
    // Save to Firebase (v11)
    const menuRef = ref(db, MENU_DB_KEY);
    set(menuRef, menuData)
      .then(() => {
        alert("✅ تم حفظ التعديلات ومزامنتها مع جميع الأجهزة");
        setIsAdmin(false);
        triggerHaptic(50);
      })
      .catch((error) => {
        alert("❌ حدث خطأ أثناء الحفظ: " + error.message);
      });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-dark text-zinc-900 dark:text-zinc-200 antialiased selection:bg-yellow-500/30">
      <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onAction={() => triggerHaptic()} />
      
      {isAdmin && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[55] bg-yellow-600 text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-slide-up border border-black/10">
          <span className="font-black text-xs uppercase tracking-widest">وضع التعديل نشط</span>
          <button onClick={saveMenuChanges} className="bg-black text-white px-4 py-1.5 rounded-full font-black text-[10px] active:scale-95 shadow-lg">حفظ التغييرات</button>
          <button onClick={() => setIsAdmin(false)} className="bg-white/20 px-4 py-1.5 rounded-full font-black text-[10px] active:scale-95">إلغاء</button>
        </div>
      )}

      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-dark/95 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 shadow-sm">
        <div className="max-w-2xl mx-auto relative flex items-center group">
          <button onClick={() => scrollNav('right')} className="absolute right-0 z-10 w-10 h-full bg-gradient-to-l from-white dark:from-[#050505] to-transparent flex items-center justify-center text-zinc-400 active:text-yellow-600 transition-all">
            <span className="text-xl rotate-180">‹</span>
          </button>
          <div ref={navRef} className="flex gap-2 overflow-x-auto no-scrollbar px-10 py-4 scroll-smooth">
            {menuData.map((item) => (
              <button
                key={item.id}
                data-section-id={item.id}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-[12px] font-black border transition-all duration-300 ${
                  activeSection === item.id 
                  ? 'bg-yellow-600 text-black border-yellow-500 scale-105 shadow-lg shadow-yellow-600/20' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-500 hover:border-yellow-500/30'
                }`}
              >
                <span className="animate-emoji">{item.emoji || '✨'}</span> {item.title}
              </button>
            ))}
          </div>
          <button onClick={() => scrollNav('left')} className="absolute left-0 z-10 w-10 h-full bg-gradient-to-r from-white dark:from-[#050505] to-transparent flex items-center justify-center text-zinc-400 active:text-yellow-600 transition-all">
            <span className="text-xl">‹</span>
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-5 py-8 pb-48">
        <div className="mb-8 rounded-[1.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 relative overflow-hidden text-right shadow-md reveal-item">
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-1 leading-none italic uppercase tracking-tighter">{CONFIG.BRAND_NAME}</h2>
            <p className="text-primary dark:text-primary text-[10px] font-black uppercase mb-2 tracking-widest">{CONFIG.BRAND_SUBTITLE}</p>
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[9px] font-bold">
              <span>{CONFIG.LOCATION}</span>
            </div>
          </div>
          <div className="absolute -left-4 -bottom-4 text-[80px] opacity-[0.03] rotate-12 animate-emoji">🥨</div>
        </div>

        {menuData.map((section) => (
          <MenuSection 
            key={section.id} 
            section={section} 
            isAdmin={isAdmin}
            onUpdatePrice={handleUpdatePrice}
            onReorder={handleReorderItems}
            onToggleTag={handleToggleTag}
            onDeleteItem={handleDeleteItem}
            onItemSelect={() => {}} 
          />
        ))}

        <footer className="mt-16 pb-12 flex flex-col items-center gap-10 reveal-item">
            <div className="w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 shadow-xl border border-zinc-200 dark:border-white/10 flex flex-col items-center gap-8 text-center">
               <AtyabLogo size="w-20 h-20" />
               <div className="flex flex-col items-center gap-4">
                  <div className="relative p-4 bg-white rounded-[2rem] border-4 border-zinc-50 dark:border-zinc-800 shadow-2xl">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`} alt="QR Code" className="w-44 h-44 md:w-52 md:h-52" />
                  </div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">امسح الكود لمشاركة المنيو</p>
               </div>
               <div className="w-full border-t border-zinc-100 dark:border-white/5 pt-8 space-y-4">
                  <a href={CONFIG.MAPS_LINK} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group transition-transform active:scale-95">
                    <span className="text-3xl mb-2 animate-emoji">📍</span>
                    <h4 className="text-xl font-black text-zinc-900 dark:text-white group-hover:text-primary transition-colors leading-none">موقعنا على الخريطة</h4>
                    <p className="text-sm font-bold text-zinc-500 mt-2">البدرشين - مطعم أطياب</p>
                  </a>
               </div>
            </div>

            <div className="flex flex-col items-center gap-4 opacity-60 hover:opacity-100 transition-opacity text-center px-6">
               <div className="flex flex-col items-center gap-1.5">
                  <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">تصميم وتنفيذ {CONFIG.DESIGNER}</p>
                  <a href={`tel:${CONFIG.DESIGNER_PHONE.replace(/\s/g, '')}`} className="text-[10px] font-black text-primary dark:text-primary tracking-wider tabular-nums">للتواصل {CONFIG.DESIGNER_PHONE}</a>
               </div>
               <button onClick={() => { triggerHaptic(); setShowLogin(true); }} className="text-[9px] font-black text-zinc-400 border border-zinc-200 dark:border-white/10 px-4 py-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">إدارة المنيو</button>
            </div>
        </footer>
      </main>

      {showLogin && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-xl px-8" onClick={() => setShowLogin(false)}>
          <div className="w-full max-w-[320px] bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-2xl border border-white/10 flex flex-col gap-6 relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform font-black"
            >✕</button>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">Admin Portal</h3>
              <p className="text-[10px] font-bold text-zinc-400">ادخل كلمة السر للوصول إلى لوحة التحكم</p>
            </div>
            <input 
              type="password" 
              placeholder="Password" 
              value={passInput} 
              onChange={e => setPassInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-white/5 rounded-xl py-3 px-5 text-center font-black outline-none focus:border-yellow-600 transition-all shadow-inner"
              autoFocus
            />
            <button onClick={handleLogin} className="w-full bg-yellow-600 text-black font-black py-4 rounded-xl text-sm shadow-lg active:scale-95 transition-transform">دخول</button>
          </div>
        </div>
      )}

      {/* Navigation Overlay Backdrops */}
      {(showBottomCallMenu || showCategoriesMenu) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[59]" onClick={() => { setShowBottomCallMenu(false); setShowCategoriesMenu(false); }}></div>
      )}

      {/* Main Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-[60] px-4 pb-8 pt-2 md:hidden">
        <div className="max-w-xl mx-auto glass border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-1 flex items-center justify-around shadow-xl relative">
          
          <a href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER}`} className="flex-1 flex flex-col items-center py-2 text-[#25D366] active:scale-90 transition-transform">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
            <span className="text-[8px] font-black text-zinc-400 mt-0.5">واتساب</span>
          </a>

          <button onClick={() => { setShowBottomCallMenu(!showBottomCallMenu); setShowCategoriesMenu(false); }} className={`flex-1 flex flex-col items-center py-2 active:scale-90 transition-all ${showBottomCallMenu ? 'text-primary' : 'text-zinc-500'}`}>
            <span className="text-xl animate-emoji">📞</span>
            <span className="text-[8px] font-black text-zinc-400 mt-0.5">اتصال</span>
          </button>

          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="bg-primary w-14 h-14 rounded-full flex items-center justify-center text-black shadow-lg -mt-10 border-4 border-white dark:border-dark active:scale-90 z-[63] transition-all">
            <span className="text-lg animate-emoji">🔝</span>
          </button>

          <a href={CONFIG.MAPS_LINK} target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center py-2 text-zinc-500 active:scale-90 transition-transform">
            <span className="text-xl animate-emoji">📍</span>
            <span className="text-[8px] font-black text-zinc-400 mt-0.5">الموقع</span>
          </a>

          <button onClick={() => { setShowCategoriesMenu(true); setShowBottomCallMenu(false); }} className={`flex-1 flex flex-col items-center py-2 active:scale-90 transition-all ${showCategoriesMenu ? 'text-primary' : 'text-zinc-500'}`}>
            <MenuIcon className="w-6 h-6 animate-emoji" />
            <span className="text-[8px] font-black text-zinc-400 mt-0.5">المنيو</span>
          </button>

          {/* Call Menu Overlay */}
          {showBottomCallMenu && (
             <div className="absolute bottom-[calc(100%+1.5rem)] left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up mx-2 z-[62]">
               <div className="px-5 py-3 bg-zinc-50 dark:bg-white/5 border-b border-zinc-100 dark:border-white/5 text-right flex justify-between items-center flex-row-reverse">
                  <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">تواصل</span>
                  <span className="text-lg">📞</span>
               </div>
               {CONFIG.PHONE_NUMBERS.map((p, i) => (
                 <a key={i} href={`tel:${p.number}`} className="flex items-center justify-between px-6 py-4 border-b last:border-0 border-zinc-100 dark:border-white/5 active:bg-yellow-50 transition-colors"><span className="text-[9px] font-black text-zinc-400">{p.label}</span><span className="text-base font-black tabular-nums text-primary">{p.number}</span></a>
               ))}
             </div>
          )}

        </div>
      </nav>

      {/* Grid Menu Overlay (New Design) */}
      {showCategoriesMenu && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-slide-up" onClick={() => setShowCategoriesMenu(false)}>
           <div className="w-full max-w-sm bg-[#18181b] dark:bg-[#09090b] rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-6 text-center border-b border-white/5">
                <h3 className="text-xl font-black text-white">أقسام المنيو</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto no-scrollbar">
                {menuData.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={(e) => handleNavClick(e, item.id)}
                    className="flex flex-row-reverse items-center justify-between bg-[#27272a] hover:bg-[#3f3f46] p-4 rounded-2xl border border-white/5 active:scale-95 transition-all group"
                  >
                    <span className="text-[13px] font-bold text-white group-hover:text-yellow-500 transition-colors">{item.title}</span>
                    <span className="text-xl animate-emoji">{item.emoji}</span>
                  </button>
                ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
