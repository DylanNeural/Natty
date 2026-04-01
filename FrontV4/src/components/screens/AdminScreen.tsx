import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Users, Refrigerator, Shield, Plus, Trash2, Star } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import {
  adminCreateFridge,
  adminDeleteFridge,
  adminDeleteUser,
  adminGetFridges,
  adminGetOverview,
  adminGetUsers,
  adminUpdateFridge,
  adminUpdateUserPremium,
  AdminFridge,
  AdminOverview,
  AdminUser,
} from '../../services/apiService';

interface AdminScreenProps {
  onBack: () => void;
}

type TabKey = 'users' | 'fridges';

const AdminScreen = ({ onBack }: AdminScreenProps) => {
  const [tab, setTab] = useState<TabKey>('users');
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [fridges, setFridges] = useState<AdminFridge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newFridge, setNewFridge] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
  });

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const [ov, usersRes, fridgesRes] = await Promise.all([
        adminGetOverview(),
        adminGetUsers(),
        adminGetFridges(),
      ]);
      setOverview(ov);
      setUsers(usersRes.users || []);
      setFridges(fridgesRes.fridges || []);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors du chargement admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const premiumCount = useMemo(
    () => users.filter((u) => u.isPremium).length,
    [users]
  );

  const handleTogglePremium = async (user: AdminUser) => {
    try {
      await adminUpdateUserPremium(user.id, !user.isPremium);
      await refresh();
    } catch (err: any) {
      setError(err?.message || 'Impossible de modifier ce compte');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await adminDeleteUser(id);
      await refresh();
    } catch (err: any) {
      setError(err?.message || 'Impossible de supprimer cet utilisateur');
    }
  };

  const handleCreateFridge = async () => {
    const lat = Number(newFridge.lat);
    const lng = Number(newFridge.lng);
    if (!newFridge.name || !newFridge.address || Number.isNaN(lat) || Number.isNaN(lng)) {
      setError('Nom, adresse, latitude et longitude sont requis');
      return;
    }

    try {
      await adminCreateFridge({
        name: newFridge.name,
        address: newFridge.address,
        lat,
        lng,
      });
      setNewFridge({ name: '', address: '', lat: '', lng: '' });
      await refresh();
    } catch (err: any) {
      setError(err?.message || 'Impossible de créer le frigo');
    }
  };

  const handleToggleFridgeOpen = async (fridge: AdminFridge) => {
    try {
      await adminUpdateFridge(fridge.id, { isOpen: !fridge.isOpen });
      await refresh();
    } catch (err: any) {
      setError(err?.message || 'Impossible de mettre à jour le frigo');
    }
  };

  const handleDeleteFridge = async (id: string) => {
    if (!window.confirm('Supprimer ce frigo ?')) return;
    try {
      await adminDeleteFridge(id);
      await refresh();
    } catch (err: any) {
      setError(err?.message || 'Impossible de supprimer ce frigo');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[100svh] bg-natty-beige p-6 pt-safe pb-32 space-y-6">
      <header className="flex items-center justify-between">
        <button onClick={onBack} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <ChevronLeft />
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-black text-natty-teal">Admin Console</h1>
          <p className="text-xs text-natty-charcoal/50 font-medium">Gestion plateforme Natty</p>
        </div>
      </header>

      <Card className="p-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3 text-center">
          <Users className="mx-auto mb-1 text-natty-teal" size={18} />
          <p className="text-xl font-black text-natty-teal">{overview?.usersCount ?? users.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-natty-charcoal/50">Users</p>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center">
          <Star className="mx-auto mb-1 text-natty-orange" size={18} />
          <p className="text-xl font-black text-natty-orange">{overview?.premiumUsersCount ?? premiumCount}</p>
          <p className="text-[10px] uppercase tracking-wider text-natty-charcoal/50">Premium</p>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center">
          <Refrigerator className="mx-auto mb-1 text-natty-lime" size={18} />
          <p className="text-xl font-black text-natty-teal">{overview?.fridgesCount ?? fridges.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-natty-charcoal/50">Frigos</p>
        </div>
      </Card>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('users')}
          className={`flex-1 h-11 rounded-2xl font-black text-sm ${tab === 'users' ? 'bg-natty-teal text-white' : 'bg-white text-natty-charcoal/70'}`}
        >
          Utilisateurs
        </button>
        <button
          onClick={() => setTab('fridges')}
          className={`flex-1 h-11 rounded-2xl font-black text-sm ${tab === 'fridges' ? 'bg-natty-teal text-white' : 'bg-white text-natty-charcoal/70'}`}
        >
          Frigos
        </button>
      </div>

      {error && (
        <Card className="p-4 border border-red-200 bg-red-50 text-red-700 text-sm font-semibold">
          {error}
        </Card>
      )}

      {loading ? (
        <div className="py-12 text-center text-natty-charcoal/50 font-bold">Chargement admin...</div>
      ) : null}

      {!loading && tab === 'users' && (
        <section className="space-y-3">
          {users.map((u) => (
            <Card key={u.id} className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-natty-teal/10 text-natty-teal flex items-center justify-center">
                <Shield size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{u.name}</p>
                <p className="text-xs text-natty-charcoal/50 truncate">{u.email}</p>
              </div>
              <button
                onClick={() => handleTogglePremium(u)}
                className={`px-3 h-9 rounded-xl text-xs font-black ${u.isPremium ? 'bg-natty-lime text-natty-teal' : 'bg-natty-charcoal/10 text-natty-charcoal/70'}`}
              >
                {u.isPremium ? 'Premium' : 'Standard'}
              </button>
              <button
                onClick={() => handleDeleteUser(u.id)}
                className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center"
                aria-label="Supprimer utilisateur"
              >
                <Trash2 size={16} />
              </button>
            </Card>
          ))}
        </section>
      )}

      {!loading && tab === 'fridges' && (
        <section className="space-y-4">
          <Card className="p-4 space-y-3">
            <h3 className="font-black text-natty-teal text-sm uppercase tracking-wider">Ajouter un frigo</h3>
            <input
              value={newFridge.name}
              onChange={(e) => setNewFridge((s) => ({ ...s, name: e.target.value }))}
              placeholder="Nom"
              className="w-full h-11 px-4 rounded-xl bg-white border border-black/10 outline-none"
            />
            <input
              value={newFridge.address}
              onChange={(e) => setNewFridge((s) => ({ ...s, address: e.target.value }))}
              placeholder="Adresse"
              className="w-full h-11 px-4 rounded-xl bg-white border border-black/10 outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={newFridge.lat}
                onChange={(e) => setNewFridge((s) => ({ ...s, lat: e.target.value }))}
                placeholder="Latitude"
                className="w-full h-11 px-4 rounded-xl bg-white border border-black/10 outline-none"
              />
              <input
                value={newFridge.lng}
                onChange={(e) => setNewFridge((s) => ({ ...s, lng: e.target.value }))}
                placeholder="Longitude"
                className="w-full h-11 px-4 rounded-xl bg-white border border-black/10 outline-none"
              />
            </div>
            <Button onClick={handleCreateFridge} variant="primary" className="w-full h-11 flex items-center justify-center gap-2">
              <Plus size={16} /> Ajouter
            </Button>
          </Card>

          {fridges.map((f) => (
            <Card key={f.id} className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-natty-lime/30 text-natty-teal flex items-center justify-center">
                <Refrigerator size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{f.name}</p>
                <p className="text-xs text-natty-charcoal/50 truncate">{f.address}</p>
              </div>
              <button
                onClick={() => handleToggleFridgeOpen(f)}
                className={`px-3 h-9 rounded-xl text-xs font-black ${f.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}
              >
                {f.isOpen ? 'Ouvert' : 'Fermé'}
              </button>
              <button
                onClick={() => handleDeleteFridge(f.id)}
                className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center"
                aria-label="Supprimer frigo"
              >
                <Trash2 size={16} />
              </button>
            </Card>
          ))}
        </section>
      )}
    </motion.div>
  );
};

export default AdminScreen;
