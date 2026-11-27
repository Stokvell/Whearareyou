import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import PlaceDetail from './components/PlaceDetail';
import PlaceForm from './components/PlaceForm';
import { Place } from './types';
import { initialPlaces } from './data';
import { Plus, MapPin } from 'lucide-react';

function getStoredPlaces(): Place[] {
  try {
    const stored = localStorage.getItem('spb-places');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading places:', e);
  }
  return initialPlaces;
}

function savePlaces(places: Place[]) {
  try {
    localStorage.setItem('spb-places', JSON.stringify(places));
  } catch (e) {
    console.error('Error saving places:', e);
  }
}

export default function App() {
  const [places, setPlaces] = useState<Place[]>(getStoredPlaces);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newPlaceCoords, setNewPlaceCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    savePlaces(places);
  }, [places]);

  const handlePlaceClick = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setNewPlaceCoords({ lat, lng });
    setIsAddingMode(false);
    setShowForm(true);
    setEditingPlace(null);
  }, []);

  const handleSavePlace = (placeData: Omit<Place, 'id'> & { id?: string }) => {
    if (placeData.id) {
      // Edit existing
      setPlaces(prev => prev.map(p => p.id === placeData.id ? { ...p, ...placeData } as Place : p));
      setSelectedPlace({ ...selectedPlace!, ...placeData } as Place);
    } else {
      // Add new
      const newPlace: Place = {
        ...placeData,
        id: Date.now().toString(),
      };
      setPlaces(prev => [...prev, newPlace]);
    }
    setShowForm(false);
    setEditingPlace(null);
    setNewPlaceCoords(null);
  };

  const handleDeletePlace = (id: string) => {
    if (confirm('Удалить это место?')) {
      setPlaces(prev => prev.filter(p => p.id !== id));
      setSelectedPlace(null);
    }
  };

  const handleToggleVisited = (id: string) => {
    setPlaces(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, visited: !p.visited };
        if (!p.visited) {
          updated.visitDate = new Date().toISOString().split('T')[0];
        }
        return updated;
      }
      return p;
    }));
    setSelectedPlace(prev => {
      if (prev && prev.id === id) {
        const updated = { ...prev, visited: !prev.visited };
        if (!prev.visited) {
          updated.visitDate = new Date().toISOString().split('T')[0];
        }
        return updated;
      }
      return prev;
    });
  };

  const handleEdit = (place: Place) => {
    setEditingPlace(place);
    setShowForm(true);
    setSelectedPlace(null);
  };

  const handleStartAdding = () => {
    setIsAddingMode(true);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-950">
      {/* Sidebar */}
      <Sidebar
        places={places}
        selectedPlace={selectedPlace}
        onPlaceSelect={handlePlaceClick}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Map area */}
      <div className="flex-1 relative">
        <MapComponent
          places={places}
          selectedPlace={selectedPlace}
          onPlaceClick={handlePlaceClick}
          onMapClick={handleMapClick}
          isAddingMode={isAddingMode}
        />

        {/* Adding mode indicator */}
        <AnimatePresence>
          {isAddingMode && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-violet-600/90 backdrop-blur-sm text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-medium">Кликните на карту, чтобы добавить место</span>
              <button
                onClick={() => setIsAddingMode(false)}
                className="text-white/70 hover:text-white text-xs ml-2 underline"
              >
                Отмена
              </button>
            </div>
          )}
        </AnimatePresence>

        {/* Add button */}
        {!isAddingMode && !showForm && (
          <button
            onClick={handleStartAdding}
            className="absolute bottom-6 right-6 z-[1000] bg-violet-600 hover:bg-violet-500 text-white p-4 rounded-2xl shadow-lg shadow-violet-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="text-sm font-medium hidden sm:inline">Добавить место</span>
          </button>
        )}

        {/* Stats badge */}
        <div className="absolute top-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-xl px-4 py-2 flex items-center gap-2">
          <MapPin size={14} className="text-violet-400" />
          <span className="text-xs text-slate-300">
            <span className="font-bold text-white">{places.filter(p => p.visited).length}</span>
            <span className="text-slate-500"> / {places.length}</span>
          </span>
        </div>
      </div>

      {/* Place Detail Panel */}
      <AnimatePresence>
        {selectedPlace && !showForm && (
          <PlaceDetail
            place={selectedPlace}
            onClose={() => setSelectedPlace(null)}
            onEdit={handleEdit}
            onDelete={handleDeletePlace}
            onToggleVisited={handleToggleVisited}
          />
        )}
      </AnimatePresence>

      {/* Place Form Modal */}
      <AnimatePresence>
        {showForm && (
          <PlaceForm
            place={editingPlace}
            initialLat={newPlaceCoords?.lat}
            initialLng={newPlaceCoords?.lng}
            onSave={handleSavePlace}
            onClose={() => {
              setShowForm(false);
              setEditingPlace(null);
              setNewPlaceCoords(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
