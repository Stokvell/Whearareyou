import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Place, Category, categoryLabels, categoryIcons } from '../types';
import { X, Save, MapPin, Video, Calendar, FileText } from 'lucide-react';

interface PlaceFormProps {
  place?: Place | null;
  initialLat?: number;
  initialLng?: number;
  onSave: (place: Omit<Place, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

export default function PlaceForm({ place, initialLat, initialLng, onSave, onClose }: PlaceFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState(59.9343);
  const [lng, setLng] = useState(30.3351);
  const [category, setCategory] = useState<Category>('other');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [visited, setVisited] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (place) {
      setName(place.name);
      setDescription(place.description);
      setLat(place.lat);
      setLng(place.lng);
      setCategory(place.category);
      setVideoUrl(place.videoUrl || '');
      setVideoTitle(place.videoTitle || '');
      setVisited(place.visited);
      setVisitDate(place.visitDate || '');
      setNotes(place.notes || '');
    } else {
      if (initialLat && initialLng) {
        setLat(initialLat);
        setLng(initialLng);
      }
    }
  }, [place, initialLat, initialLng]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...(place?.id ? { id: place.id } : {}),
      name: name.trim(),
      description: description.trim(),
      lat,
      lng,
      category,
      videoUrl: videoUrl.trim() || undefined,
      videoTitle: videoTitle.trim() || undefined,
      visited,
      visitDate: visitDate || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {place ? '✏️ Редактировать место' : '📍 Новое место'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs text-slate-400 mb-1 block font-medium">Название *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Исаакиевский собор"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-slate-400 mb-1 block font-medium">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание места..."
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-slate-400 mb-1 block font-medium">Категория</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(categoryLabels) as [Category, string][]).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`p-2 rounded-xl text-xs text-center transition-all ${
                    category === key
                      ? 'bg-violet-500/20 border-violet-500 text-violet-300 border'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-lg block mb-0.5">{categoryIcons[key]}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Coordinates */}
          <div>
            <label className="text-xs text-slate-400 mb-1 flex items-center gap-1 font-medium">
              <MapPin size={12} /> Координаты
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                step="0.0001"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
                placeholder="Широта"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
              />
              <input
                type="number"
                step="0.0001"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
                placeholder="Долгота"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">💡 Кликните на карту в режиме добавления</p>
          </div>

          {/* Video */}
          <div className="space-y-3">
            <label className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <Video size={12} /> Видео из влога
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Название видео"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Visit info */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visited}
                onChange={(e) => setVisited(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-violet-500 focus:ring-violet-500"
              />
              <span className="text-sm text-slate-300">Посещено</span>
            </label>
            {visited && (
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-500" />
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-slate-400 flex items-center gap-1 mb-1 font-medium">
              <FileText size={12} /> Заметки
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ваши впечатления, советы..."
              rows={2}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-500 transition-colors flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {place ? 'Сохранить' : 'Добавить'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
