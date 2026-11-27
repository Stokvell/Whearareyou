import { motion, AnimatePresence } from 'framer-motion';
import { Place, categoryLabels, categoryIcons, categoryColors, Category } from '../types';
import { MapPin, Video, Calendar, ChevronRight, Search, Filter } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  places: Place[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ places, selectedPlace, onPlaceSelect, isOpen, onToggle }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterVisited, setFilterVisited] = useState<'all' | 'visited' | 'not-visited'>('all');

  const filteredPlaces = places.filter((place) => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || place.category === filterCategory;
    const matchesVisited = filterVisited === 'all' ||
      (filterVisited === 'visited' && place.visited) ||
      (filterVisited === 'not-visited' && !place.visited);
    return matchesSearch && matchesCategory && matchesVisited;
  });

  const visitedCount = places.filter(p => p.visited).length;
  const totalCount = places.length;
  const percentage = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0;

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-[1000] bg-slate-800/90 backdrop-blur-sm text-white p-3 rounded-xl shadow-lg border border-slate-700"
      >
        <MapPin size={20} />
      </button>

      <AnimatePresence>
        {(isOpen || typeof window === 'undefined' || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed lg:relative z-[999] h-full w-[360px] bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">🏙️</span>
                  Мои места
                </h1>
                <button
                  onClick={onToggle}
                  className="lg:hidden text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-400 mb-1">
                  <span>Посещено</span>
                  <span>{visitedCount} из {totalCount} ({percentage}%)</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
                  />
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Поиск мест..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="px-5 py-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Filter size={14} className="text-slate-500" />
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Фильтры</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as Category | 'all')}
                  className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-300 focus:outline-none focus:border-violet-500"
                >
                  <option value="all">Все категории</option>
                  {(Object.entries(categoryLabels) as [Category, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{categoryIcons[key]} {label}</option>
                  ))}
                </select>
                <select
                  value={filterVisited}
                  onChange={(e) => setFilterVisited(e.target.value as 'all' | 'visited' | 'not-visited')}
                  className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-300 focus:outline-none focus:border-violet-500"
                >
                  <option value="all">Все</option>
                  <option value="visited">✓ Посещённые</option>
                  <option value="not-visited">? Не посещённые</option>
                </select>
              </div>
            </div>

            {/* Places list */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {filteredPlaces.map((place) => (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => onPlaceSelect(place)}
                    className={`p-4 border-b border-slate-800 cursor-pointer transition-all hover:bg-slate-800/50 ${
                      selectedPlace?.id === place.id ? 'bg-slate-800/70 border-l-2 border-l-violet-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                        style={{ backgroundColor: `${categoryColors[place.category]}20` }}
                      >
                        {categoryIcons[place.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white truncate">{place.name}</h3>
                          {place.visited ? (
                            <span className="text-green-400 text-xs">✓</span>
                          ) : (
                            <span className="text-slate-500 text-xs">○</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{place.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                            {categoryLabels[place.category]}
                          </span>
                          {place.videoUrl && (
                            <span className="text-xs flex items-center gap-1 text-red-400">
                              <Video size={10} /> Видео
                            </span>
                          )}
                          {place.visitDate && (
                            <span className="text-xs flex items-center gap-1 text-slate-500">
                              <Calendar size={10} /> {new Date(place.visitDate).toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-600 shrink-0 mt-1" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredPlaces.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <p className="text-3xl mb-2">🔍</p>
                  <p className="text-sm">Ничего не найдено</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
