
import React from 'react';
import { MenuSection as MenuSectionType, MenuItem } from '../types';

interface Props {
  section: MenuSectionType;
  isFirst?: boolean;
  isAdmin?: boolean;
  onItemSelect: (item: MenuItem, section: MenuSectionType) => void;
  onUpdatePrice?: (sectionId: string, itemIdx: number, priceIdx: number, newVal: string) => void;
  onReorder?: (sectionId: string, itemIdx: number, direction: 'up' | 'down') => void;
  onToggleTag?: (sectionId: string, itemIdx: number, tag: 'isPopular' | 'isSpicy') => void;
  onDeleteItem?: (sectionId: string, itemIdx: number) => void;
}

/**
 * MenuSection Component
 * --------------------
 * Renders a category of menu items with a header image, title, and interactive list.
 * Uses glassmorphism for the list container and smooth animations for items.
 */
const MenuSection: React.FC<Props> = ({ 
  section, 
  isFirst, 
  isAdmin, 
  onUpdatePrice, 
  onReorder,
  onToggleTag,
  onDeleteItem
}) => {
  const isNumeric = (val: string) => /^\d+$/.test(val.trim());

  return (
    <section id={section.id} className="mb-6 scroll-mt-[170px]" aria-labelledby={`${section.id}-heading`}>
      {/* Category Header Card */}
      <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-4 shadow-2xl border border-zinc-200 dark:border-white/5 bg-zinc-200 dark:bg-zinc-900 reveal-item group">
        <img
          src={section.image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading={isFirst ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
        <div className="absolute bottom-6 right-6 left-6 text-right">
          <div className="flex flex-col gap-1">
            <span className="text-primary font-black text-[10px] tracking-[0.2em] uppercase">فئة القائمة</span>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-2xl leading-none animate-emoji">{section.emoji}</span>
              <h2 id={`${section.id}-heading`} className="text-2xl font-black text-white leading-none">{section.title}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Items List Container (Glassmorphism) */}
      <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-xl rounded-[2rem] p-4 md:p-6 border border-zinc-200 dark:border-white/10 shadow-xl reveal-item">
        <div className="divide-y divide-zinc-100 dark:divide-white/5">
          {section.items.map((item, idx) => {
            const hasManyPrices = item.prices.length >= 3;
            
            return (
              <div 
                key={idx} 
                className={`py-2 group transition-all -mx-2 px-2 rounded-2xl border border-transparent flex gap-2
                  ${hasManyPrices ? 'flex-col' : 'items-center justify-between'}
                  ${isAdmin ? '' : 'hover:bg-primary/5 dark:hover:bg-primary/5 hover:border-primary/10 dark:hover:border-primary/10'}`}
              >
                {isAdmin && (
                  <div className={`flex items-center gap-2 shrink-0 ${hasManyPrices ? 'order-first mb-1 self-end' : ''}`}>
                    <div className="flex flex-col gap-1">
                      <button onClick={(e) => { e.stopPropagation(); onReorder?.(section.id, idx, 'up'); }} className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-black transition-all text-[10px]">▲</button>
                      <button onClick={(e) => { e.stopPropagation(); onReorder?.(section.id, idx, 'down'); }} className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-primary hover:text-black transition-all text-[10px]">▼</button>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(confirm('هل تريد حذف هذا العنصر؟')) onDeleteItem?.(section.id, idx); }}
                      className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                )}

                <div className={`flex flex-col gap-0.5 flex-1 min-w-0 text-right ${hasManyPrices ? 'w-full pr-0' : 'pr-1'}`}>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <div className="flex items-center gap-1 order-1">
                      {isAdmin ? (
                        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onToggleTag?.(section.id, idx, 'isPopular'); }}
                            className={`p-1 rounded-md transition-all ${item.isPopular ? 'bg-primary text-black shadow-sm' : 'text-zinc-400'}`}
                          >
                            <span className="text-[10px]">⭐</span>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onToggleTag?.(section.id, idx, 'isSpicy'); }}
                            className={`p-1 rounded-md transition-all ${item.isSpicy ? 'bg-red-500 text-white shadow-sm' : 'text-zinc-400'}`}
                          >
                            <span className="text-[10px]">🌶️</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          {item.isPopular && <span className="bg-primary text-black text-[8px] font-black px-1.5 py-0.5 rounded-md animate-popular">مميز</span>}
                          {item.isSpicy && <span className="animate-spicy text-xs leading-none">🌶️</span>}
                        </>
                      )}
                    </div>
                    <span className="text-zinc-900 dark:text-zinc-100 font-black text-lg leading-tight group-hover:text-primary transition-colors order-2 text-right w-full">
                      {item.name}
                    </span>
                  </div>
                  {item.description && (
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold leading-tight line-clamp-2">
                      {item.description}
                    </span>
                  )}
                </div>
                
                <div className={`${hasManyPrices ? 'grid grid-cols-3 gap-1.5 w-full mt-1' : 'flex gap-2 items-end shrink-0'}`}>
                  {item.prices.map((price, pIdx) => (
                    <div key={pIdx} className={`flex flex-col items-center gap-0.5 
                      ${hasManyPrices 
                        ? 'bg-zinc-100 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-white/10 rounded-xl py-1.5 px-1' 
                        : ''}`}
                    >
                      {item.labels && item.labels[pIdx] ? (
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-tighter mb-0.5">
                          {item.labels[pIdx]}
                        </span>
                      ) : (
                        section.subtitles && section.subtitles[pIdx] && (
                           <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-tighter mb-0.5">
                            {section.subtitles[pIdx]}
                           </span>
                        )
                      )}
                      
                      <div className={`${hasManyPrices ? '' : 'px-2 py-1 min-w-[45px] rounded-xl border transition-all flex items-center justify-center gap-1 shadow-sm'}
                        ${!hasManyPrices && isAdmin ? 'bg-primary/10 border-primary/30' : ''} 
                        ${!hasManyPrices && !isAdmin ? 'bg-zinc-100 dark:bg-zinc-800/80 group-hover:bg-white dark:group-hover:bg-zinc-800 border-zinc-200 dark:border-white/5 group-hover:border-primary/40' : ''}
                      `}>
                          {isAdmin && onUpdatePrice ? (
                            <input 
                              type="text" 
                              value={price} 
                              onClick={e => e.stopPropagation()}
                              onChange={e => onUpdatePrice(section.id, idx, pIdx, e.target.value)}
                              className="w-10 bg-transparent text-center font-black text-primary outline-none text-xs"
                            />
                          ) : (
                            <>
                              {isNumeric(price) ? (
                                <div className="flex items-center justify-center gap-0.5">
                                  <span className={`${hasManyPrices ? 'text-primary dark:text-primary text-lg' : 'text-primary text-base'} font-black leading-none tabular-nums`}>{price}</span>
                                  <span className={`${hasManyPrices ? 'text-primary/60 dark:text-primary/60 text-[9px]' : 'text-zinc-500 text-[8px]'} font-black`}>ج</span>
                                </div>
                              ) : (
                                <span className="text-primary font-black text-[9px] text-center leading-tight">{price}</span>
                              )}
                            </>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
