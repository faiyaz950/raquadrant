'use client';

import { useState, useEffect } from 'react';
import { getCollection, addDocument, updateDocument, removeDocument, toFirestore, COLLECTIONS } from '@/lib/firestore';
import type { AboutStat, WhatSetsApart, Leadership } from '@/lib/firestore-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { getFirebaseClient } from '@/lib/firebase';

const ICON_OPTIONS = ['Award', 'Users', 'Zap', 'TrendingUp', 'Wrench', 'Factory', 'ShieldCheck', 'HeartHandshake', 'CheckCircle2', 'Target', 'Eye', 'Compass'];

export default function AdminAboutPage() {
  const [stats, setStats] = useState<AboutStat[]>([]);
  const [setsApart, setSetsApart] = useState<WhatSetsApart[]>([]);
  const [leadership, setLeadership] = useState<Leadership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ open: boolean; tab: 'stats' | 'setsApart' | 'leadership'; item?: AboutStat | WhatSetsApart | Leadership }>({ open: false, tab: 'stats' });

  const db = getFirebaseClient()?.db;
  const canEdit = !!db;

  function load() {
    if (!db) return;
    setLoading(true);
    setError(null);
    Promise.all([
      getCollection<AboutStat>(COLLECTIONS.ABOUT_STATS),
      getCollection<WhatSetsApart>(COLLECTIONS.WHAT_SETS_APART),
      getCollection<Leadership>(COLLECTIONS.LEADERSHIP),
    ])
      .then(([s, a, l]) => {
        setStats(s);
        setSetsApart(a);
        setLeadership(l);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [!!db]);

  if (!canEdit) {
    return (
      <div className="rounded-lg bg-amber-500/20 p-4 text-amber-200">Firebase not configured.</div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold text-white mb-2">About Page Content</h1>
      <p className="text-slate-400 mb-6">Manage stats, what sets us apart, and leadership.</p>
      {error && <div className="mb-4 rounded-lg bg-red-500/20 p-4 text-red-300">{error}</div>}
      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="setsApart">What Sets Us Apart</TabsTrigger>
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
        </TabsList>
        <TabsContent value="stats" className="space-y-4">
          <Button onClick={() => setDialog({ open: true, tab: 'stats' })} className="mb-4 bg-orange-600 hover:bg-orange-500"><Plus className="mr-2 h-4 w-4" />Add Stat</Button>
          <div className="space-y-2">
            {stats.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                <div><p className="font-medium text-white">{i.value} – {i.label}</p><p className="text-sm text-slate-400">{i.iconName}</p></div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setDialog({ open: true, tab: 'stats', item: i })}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={async () => { if (i.id) await removeDocument(COLLECTIONS.ABOUT_STATS, i.id); load(); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="setsApart" className="space-y-4">
          <Button onClick={() => setDialog({ open: true, tab: 'setsApart' })} className="mb-4 bg-orange-600 hover:bg-orange-500"><Plus className="mr-2 h-4 w-4" />Add Item</Button>
          <div className="space-y-2">
            {setsApart.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                <div className="min-w-0 flex-1"><p className="font-medium text-white">{i.title}</p><p className="text-sm text-slate-400 truncate">{i.description}</p></div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setDialog({ open: true, tab: 'setsApart', item: i })}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={async () => { if (i.id) await removeDocument(COLLECTIONS.WHAT_SETS_APART, i.id); load(); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="leadership" className="space-y-4">
          <Button onClick={() => setDialog({ open: true, tab: 'leadership' })} className="mb-4 bg-orange-600 hover:bg-orange-500"><Plus className="mr-2 h-4 w-4" />Add Leader</Button>
          <div className="space-y-2">
            {leadership.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                <div className="min-w-0 flex-1"><p className="font-medium text-white">{i.name}</p><p className="text-sm text-slate-400">{i.role}</p></div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setDialog({ open: true, tab: 'leadership', item: i })}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={async () => { if (i.id) await removeDocument(COLLECTIONS.LEADERSHIP, i.id); load(); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AboutEditDialog
        dialog={dialog}
        onClose={() => setDialog((d) => ({ ...d, open: false }))}
        onSaved={() => { setDialog((d) => ({ ...d, open: false })); load(); }}
        iconOptions={ICON_OPTIONS}
      />
    </div>
  );
}

function AboutEditDialog({
  dialog,
  onClose,
  onSaved,
  iconOptions,
}: {
  dialog: { open: boolean; tab: 'stats' | 'setsApart' | 'leadership'; item?: AboutStat | WhatSetsApart | Leadership };
  onClose: () => void;
  onSaved: () => void;
  iconOptions: string[];
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string | number>>({});

  useEffect(() => {
    if (!dialog.open) return;
    const item = dialog.item as Record<string, unknown> | undefined;
    if (item) {
      const f: Record<string, string | number> = {};
      Object.entries(item).forEach(([k, v]) => {
        if (k !== 'id' && (typeof v === 'string' || typeof v === 'number')) f[k] = v;
      });
      setForm(f);
    } else {
      if (dialog.tab === 'stats') setForm({ iconName: 'Award', value: '', label: '', order: 0 });
      if (dialog.tab === 'setsApart') setForm({ iconName: 'Wrench', title: '', description: '', order: 0 });
      if (dialog.tab === 'leadership') setForm({ name: '', role: '', image: '', bio: '', order: 0 });
    }
  }, [dialog.open, dialog.tab, dialog.item]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const item = dialog.item as { id?: string } | undefined;
      const data = toFirestore({ ...form, order: typeof form.order === 'number' ? form.order : parseInt(String(form.order), 10) || 0 } as Record<string, unknown>);
      if (dialog.tab === 'stats') {
        if (item?.id) await updateDocument(COLLECTIONS.ABOUT_STATS, item.id, data);
        else await addDocument(COLLECTIONS.ABOUT_STATS, data);
      }
      if (dialog.tab === 'setsApart') {
        if (item?.id) await updateDocument(COLLECTIONS.WHAT_SETS_APART, item.id, data);
        else await addDocument(COLLECTIONS.WHAT_SETS_APART, data);
      }
      if (dialog.tab === 'leadership') {
        if (item?.id) await updateDocument(COLLECTIONS.LEADERSHIP, item.id, data);
        else await addDocument(COLLECTIONS.LEADERSHIP, data);
      }
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const titles = { stats: 'Stat', setsApart: 'What Sets Us Apart', leadership: 'Leadership' };
  const title = titles[dialog.tab];

  return (
    <Dialog open={dialog.open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-white">{dialog.item ? 'Edit' : 'Add'} {title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {dialog.tab === 'stats' && (
            <>
              <div><Label className="text-slate-300">Icon</Label><select className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white" value={form.iconName || 'Award'} onChange={(e) => setForm((f) => ({ ...f, iconName: e.target.value }))}>{iconOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
              <div><Label className="text-slate-300">Value</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.value || ''} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} placeholder="500+" /></div>
              <div><Label className="text-slate-300">Label</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.label || ''} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="Projects Completed" /></div>
            </>
          )}
          {dialog.tab === 'setsApart' && (
            <>
              <div><Label className="text-slate-300">Icon</Label><select className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white" value={form.iconName || 'Wrench'} onChange={(e) => setForm((f) => ({ ...f, iconName: e.target.value }))}>{iconOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
              <div><Label className="text-slate-300">Title</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.title || ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Description</Label><Textarea className="mt-1 bg-slate-700 border-slate-600" value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} /></div>
            </>
          )}
          {dialog.tab === 'leadership' && (
            <>
              <div><Label className="text-slate-300">Name</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.name || ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Role</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.role || ''} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Image URL</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.image || ''} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Bio</Label><Textarea className="mt-1 bg-slate-700 border-slate-600" value={form.bio || ''} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={6} /></div>
            </>
          )}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="bg-orange-600 hover:bg-orange-500">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
