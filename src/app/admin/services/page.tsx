'use client';

import { useState, useEffect } from 'react';
import { getCollection, addDocument, updateDocument, removeDocument, toFirestore, COLLECTIONS } from '@/lib/firestore';
import type { ServiceItem, ScopeOfWorkItem, ExecutionProcessItem } from '@/lib/firestore-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { getFirebaseClient } from '@/lib/firebase';

const ICON_OPTIONS = ['Sun', 'BarChart3', 'Zap', 'LayoutPanelTop', 'FileText', 'Truck', 'HardHat', 'ShieldCheck', 'TrendingUp', 'Clock', 'Star', 'Users'];

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [scopeOfWork, setScopeOfWork] = useState<ScopeOfWorkItem[]>([]);
  const [execution, setExecution] = useState<ExecutionProcessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ open: boolean; tab: 'services' | 'scope' | 'execution'; item?: ServiceItem | ScopeOfWorkItem | ExecutionProcessItem }>({ open: false, tab: 'services' });

  const db = getFirebaseClient()?.db;
  const canEdit = !!db;

  function load() {
    if (!db) return;
    setLoading(true);
    setError(null);
    Promise.all([
      getCollection<ServiceItem>(COLLECTIONS.SERVICES),
      getCollection<ScopeOfWorkItem>(COLLECTIONS.SCOPE_OF_WORK),
      getCollection<ExecutionProcessItem>(COLLECTIONS.EXECUTION_PROCESS),
    ])
      .then(([s, sc, e]) => {
        setServices(s);
        setScopeOfWork(sc);
        setExecution(e);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [!!db]);

  if (!canEdit) {
    return <div className="rounded-lg bg-amber-500/20 p-4 text-amber-200">Firebase not configured.</div>;
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
      <h1 className="font-headline text-2xl font-bold text-white mb-2">Services Page Content</h1>
      <p className="text-slate-400 mb-6">Manage services, scope of work, and execution process.</p>
      {error && <div className="mb-4 rounded-lg bg-red-500/20 p-4 text-red-300">{error}</div>}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="scope">Scope of Work</TabsTrigger>
          <TabsTrigger value="execution">Execution Process</TabsTrigger>
        </TabsList>
        <TabsContent value="services" className="space-y-4">
          <Button onClick={() => setDialog({ open: true, tab: 'services' })} className="mb-4 bg-orange-600 hover:bg-orange-500"><Plus className="mr-2 h-4 w-4" />Add Service</Button>
          <div className="space-y-2">
            {services.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                <div className="min-w-0 flex-1"><p className="font-medium text-white">{i.title}</p><p className="text-sm text-slate-400 truncate">{i.description}</p></div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setDialog({ open: true, tab: 'services', item: i })}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={async () => { if (i.id) await removeDocument(COLLECTIONS.SERVICES, i.id); load(); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="scope" className="space-y-4">
          <Button onClick={() => setDialog({ open: true, tab: 'scope' })} className="mb-4 bg-orange-600 hover:bg-orange-500"><Plus className="mr-2 h-4 w-4" />Add Phase</Button>
          <div className="space-y-2">
            {scopeOfWork.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                <div className="min-w-0 flex-1"><p className="font-medium text-white">{i.phase}</p><p className="text-sm text-slate-400 truncate">{i.content}</p></div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setDialog({ open: true, tab: 'scope', item: i })}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={async () => { if (i.id) await removeDocument(COLLECTIONS.SCOPE_OF_WORK, i.id); load(); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="execution" className="space-y-4">
          <Button onClick={() => setDialog({ open: true, tab: 'execution' })} className="mb-4 bg-orange-600 hover:bg-orange-500"><Plus className="mr-2 h-4 w-4" />Add Step</Button>
          <div className="space-y-2">
            {execution.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                <div className="min-w-0 flex-1"><p className="font-medium text-white">{i.name}</p><p className="text-sm text-slate-400 truncate">{i.description}</p><p className="text-xs text-slate-500">{i.duration}</p></div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setDialog({ open: true, tab: 'execution', item: i })}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={async () => { if (i.id) await removeDocument(COLLECTIONS.EXECUTION_PROCESS, i.id); load(); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <ServicesEditDialog
        dialog={dialog}
        onClose={() => setDialog((d) => ({ ...d, open: false }))}
        onSaved={() => { setDialog((d) => ({ ...d, open: false })); load(); }}
        iconOptions={ICON_OPTIONS}
      />
    </div>
  );
}

function ServicesEditDialog({
  dialog,
  onClose,
  onSaved,
  iconOptions,
}: {
  dialog: { open: boolean; tab: 'services' | 'scope' | 'execution'; item?: ServiceItem | ScopeOfWorkItem | ExecutionProcessItem };
  onClose: () => void;
  onSaved: () => void;
  iconOptions: string[];
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string | number | string[]>>({});

  useEffect(() => {
    if (!dialog.open) return;
    const item = dialog.item as Record<string, unknown> | undefined;
    if (item) {
      const f: Record<string, string | number | string[]> = {};
      Object.entries(item).forEach(([k, v]) => {
        if (k === 'id') return;
        if (Array.isArray(v)) f[k] = v;
        else if (typeof v === 'string' || typeof v === 'number') f[k] = v;
      });
      setForm(f);
    } else {
      if (dialog.tab === 'services') setForm({ idKey: 'residential', title: '', description: '', features: '', stats: '', capacity: '', roi: '', gradient: 'from-orange-400 to-amber-500', iconName: 'Sun', image: '', order: 0 });
      if (dialog.tab === 'scope') setForm({ phase: '', iconName: 'LayoutPanelTop', content: '', details: '', color: 'orange', image: '', order: 0 });
      if (dialog.tab === 'execution') setForm({ name: '', description: '', iconName: 'Sun', duration: '', color: 'from-orange-400 to-amber-500', order: 0 });
    }
  }, [dialog.open, dialog.tab, dialog.item]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const item = dialog.item as { id?: string } | undefined;
      let data: Record<string, unknown> = { ...form, order: typeof form.order === 'number' ? form.order : parseInt(String(form.order), 10) || 0 };
      if (dialog.tab === 'services') {
        data.features = typeof form.features === 'string' ? form.features.split('\n').filter(Boolean) : (form.features || []);
        data.stats = typeof form.stats === 'string' ? form.stats.split('\n').filter(Boolean) : (form.stats || []);
      }
      if (dialog.tab === 'scope') {
        data.details = typeof form.details === 'string' ? form.details.split('\n').filter(Boolean) : (form.details || []);
      }
      const firestoreData = toFirestore(data);
      if (dialog.tab === 'services') {
        if (item?.id) await updateDocument(COLLECTIONS.SERVICES, item.id, firestoreData);
        else await addDocument(COLLECTIONS.SERVICES, firestoreData);
      }
      if (dialog.tab === 'scope') {
        if (item?.id) await updateDocument(COLLECTIONS.SCOPE_OF_WORK, item.id, firestoreData);
        else await addDocument(COLLECTIONS.SCOPE_OF_WORK, firestoreData);
      }
      if (dialog.tab === 'execution') {
        if (item?.id) await updateDocument(COLLECTIONS.EXECUTION_PROCESS, item.id, firestoreData);
        else await addDocument(COLLECTIONS.EXECUTION_PROCESS, firestoreData);
      }
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const title = dialog.tab === 'services' ? 'Service' : dialog.tab === 'scope' ? 'Scope Phase' : 'Execution Step';

  return (
    <Dialog open={dialog.open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-white">{dialog.item ? 'Edit' : 'Add'} {title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {dialog.tab === 'services' && (
            <>
              <div><Label className="text-slate-300">ID Key (residential/commercial/infrastructure)</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.idKey || ''} onChange={(e) => setForm((f) => ({ ...f, idKey: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Title</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.title || ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Description</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Features (one per line)</Label><Textarea className="mt-1 bg-slate-700 border-slate-600" value={Array.isArray(form.features) ? form.features.join('\n') : (form.features || '')} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} rows={4} /></div>
              <div><Label className="text-slate-300">Stats (one per line)</Label><Textarea className="mt-1 bg-slate-700 border-slate-600" value={Array.isArray(form.stats) ? form.stats.join('\n') : (form.stats || '')} onChange={(e) => setForm((f) => ({ ...f, stats: e.target.value }))} rows={2} /></div>
              <div><Label className="text-slate-300">Capacity</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.capacity || ''} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} /></div>
              <div><Label className="text-slate-300">ROI</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.roi || ''} onChange={(e) => setForm((f) => ({ ...f, roi: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Gradient (Tailwind classes)</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.gradient || ''} onChange={(e) => setForm((f) => ({ ...f, gradient: e.target.value }))} placeholder="from-orange-400 to-amber-500" /></div>
              <div><Label className="text-slate-300">Icon</Label><select className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white" value={form.iconName || 'Sun'} onChange={(e) => setForm((f) => ({ ...f, iconName: e.target.value }))}>{iconOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
              <div><Label className="text-slate-300">Image URL</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.image || ''} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} /></div>
            </>
          )}
          {dialog.tab === 'scope' && (
            <>
              <div><Label className="text-slate-300">Phase</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.phase || ''} onChange={(e) => setForm((f) => ({ ...f, phase: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Icon</Label><select className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white" value={form.iconName || 'LayoutPanelTop'} onChange={(e) => setForm((f) => ({ ...f, iconName: e.target.value }))}>{iconOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
              <div><Label className="text-slate-300">Content</Label><Textarea className="mt-1 bg-slate-700 border-slate-600" value={form.content || ''} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={3} /></div>
              <div><Label className="text-slate-300">Details (one per line)</Label><Textarea className="mt-1 bg-slate-700 border-slate-600" value={Array.isArray(form.details) ? form.details.join('\n') : (form.details || '')} onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))} rows={4} /></div>
              <div><Label className="text-slate-300">Color (orange/amber/yellow)</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.color || ''} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Image URL</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.image || ''} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} /></div>
            </>
          )}
          {dialog.tab === 'execution' && (
            <>
              <div><Label className="text-slate-300">Name</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.name || ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Description</Label><Textarea className="mt-1 bg-slate-700 border-slate-600" value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} /></div>
              <div><Label className="text-slate-300">Icon</Label><select className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white" value={form.iconName || 'Sun'} onChange={(e) => setForm((f) => ({ ...f, iconName: e.target.value }))}>{iconOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
              <div><Label className="text-slate-300">Duration</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.duration || ''} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="1-2 days" /></div>
              <div><Label className="text-slate-300">Color (Tailwind gradient)</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.color || ''} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} placeholder="from-orange-400 to-amber-500" /></div>
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
