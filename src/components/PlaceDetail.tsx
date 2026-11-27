import { motion, AnimatePresence } from 'framer-motion';
import { Place, categoryLabels, categoryIcons, categoryColors } from '../types';
import { X, Video, Calendar, MapPin, ExternalLink, Edit3, Trash2, Check, Star } from 'lucide-react';

interface PlaceDetailProps {
  place: Place;
  onClose: () => void;
  onEdit: (place: Place) => void;
  onDelete: (id: string) => void;
  onToggleVisited: (id: string) => void;
}

export default function PlaceDetail({ place, onClose, onEdit, onDelete, onToggleVisited }: PlaceDetailProps) {
  const color = categoryColors[place.category];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 right-4 z-[1000] w-[380px] max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden"
      >
        {/* Header with gradient */}
        <div
          className="p-5 relative"
          style={{ background: `linear-gradient(135deg, ${color}30, transparent)` }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${color}30` }}
            >
              {categoryIcons[place.category]}
            </div>
            <div className="flex-1 pr-8">
              <h2 className="text-lg font-bold text-white">{place.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor: `${color}20`, color }}>
                {categoryLabels[place.category]}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[50vh] overflow-y-auto">
          <p className="text-sm text-slate-300 leading-relaxed">{place.description}</p>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin size={12} />
            <span>{place.lat.toFixed(4)}, {place.lng.toFixed(4)}</span>
          </div>

          {place.visitDate && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar size={14} className="text-green-400" />
              <span>Посещено: {new Date(place.visitDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          )}

          {place.notes && (
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1">📝 Заметки</p>
              <p className="text-sm text-slate-300">{place.notes}</p>
            </div>
          )}

          {place.videoUrl && (
            <a
              href={place.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors group"
            >
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <Video size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{place.videoTitle || 'Смотреть видео'}</p>
                <p className="text-xs text-red-400 flex items-center gap-1">
                  YouTube <ExternalLink size={10} />
                </p>
              </div>
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-slate-700/50 flex items-center gap-2">
          <button
            onClick={() => onToggleVisited(place.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              place.visited
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {place.visited ? <Check size={16} /> : <Star size={16} />}
            {place.visited ? 'Посещено' : 'Отметить'}
          </button>
          <button
            onClick={() => onEdit(place)}
            className="p-2.5 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 hover:text-white transition-all"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(place.id)}
            className="p-2.5 bg-slate-800 text-slate-400 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
