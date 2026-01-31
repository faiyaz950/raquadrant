'use client';

import { useState, useEffect, useRef } from 'react';
import { getCollection, addDocument, updateDocument, removeDocument, toFirestore, COLLECTIONS } from '@/lib/firestore';
import type { HeroSlide, IntroPoint, Testimonial, Partner, FeaturedProject } from '@/lib/firestore-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2, Upload, X } from 'lucide-react';
import { getFirebaseClient } from '@/lib/firebase';
import { uploadHeroSlideImage, validateImageFile } from '@/lib/storage';
import Image from 'next/image';

type TabKey = 'hero' | 'intro' | 'testimonials' | 'partners' | 'projects';

const ICON_OPTIONS = ['Zap', 'Handshake', 'Globe', 'BrainCircuit', 'ShieldCheck', 'Users', 'Award', 'CheckSquare', 'Sun', 'BarChart3', 'Leaf', 'Battery'];

export default function AdminHomePage() {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [introPoints, setIntroPoints] = useState<IntroPoint[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ open: boolean; tab: TabKey; item?: HeroSlide | IntroPoint | Testimonial | Partner | FeaturedProject }>({ open: false, tab: 'hero' });

  const db = getFirebaseClient()?.db;
  const canEdit = !!db;

  function load() {
    if (!db) return;
    setLoading(true);
    setError(null);
    Promise.all([
      getCollection<HeroSlide>(COLLECTIONS.HERO_SLIDES),
      getCollection<IntroPoint>(COLLECTIONS.INTRO_POINTS),
      getCollection<Testimonial>(COLLECTIONS.TESTIMONIALS),
      getCollection<Partner>(COLLECTIONS.PARTNERS),
      getCollection<FeaturedProject>(COLLECTIONS.FEATURED_PROJECTS),
    ])
      .then(([h, i, t, p, proj]) => {
        setHeroSlides(h);
        setIntroPoints(i);
        setTestimonials(t);
        setPartners(p);
        setProjects(proj);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  if (!canEdit) {
    return (
      <div className="rounded-lg bg-amber-500/20 p-4 text-amber-200">
        Firebase not configured. Add <code className="rounded bg-slate-700 px-1">NEXT_PUBLIC_FIREBASE_*</code> env vars.
      </div>
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
      <h1 className="font-headline text-2xl font-bold text-white mb-2">Home Page Content</h1>
      <p className="text-slate-400 mb-6">Manage hero slides, intro points, testimonials, partners, and featured projects.</p>
      {error && (
        <div className="mb-4 rounded-lg bg-red-500/20 p-4 text-red-300">{error}</div>
      )}
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="hero">Hero Slides</TabsTrigger>
          <TabsTrigger value="intro">Intro Points</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="hero" className="space-y-4">
          <HeroList
            items={heroSlides}
            onAdd={() => setDialog({ open: true, tab: 'hero' })}
            onEdit={(item) => setDialog({ open: true, tab: 'hero', item })}
            onDelete={async (id) => {
              if (id) await removeDocument(COLLECTIONS.HERO_SLIDES, id);
              load();
            }}
          />
        </TabsContent>
        <TabsContent value="intro" className="space-y-4">
          <IntroList
            items={introPoints}
            onAdd={() => setDialog({ open: true, tab: 'intro' })}
            onEdit={(item) => setDialog({ open: true, tab: 'intro', item })}
            onDelete={async (id) => {
              if (id) await removeDocument(COLLECTIONS.INTRO_POINTS, id);
              load();
            }}
          />
        </TabsContent>
        <TabsContent value="testimonials" className="space-y-4">
          <TestimonialList
            items={testimonials}
            onAdd={() => setDialog({ open: true, tab: 'testimonials' })}
            onEdit={(item) => setDialog({ open: true, tab: 'testimonials', item })}
            onDelete={async (id) => {
              if (id) await removeDocument(COLLECTIONS.TESTIMONIALS, id);
              load();
            }}
          />
        </TabsContent>
        <TabsContent value="partners" className="space-y-4">
          <PartnerList
            items={partners}
            onAdd={() => setDialog({ open: true, tab: 'partners' })}
            onEdit={(item) => setDialog({ open: true, tab: 'partners', item })}
            onDelete={async (id) => {
              if (id) await removeDocument(COLLECTIONS.PARTNERS, id);
              load();
            }}
          />
        </TabsContent>
        <TabsContent value="projects" className="space-y-4">
          <ProjectList
            items={projects}
            onAdd={() => setDialog({ open: true, tab: 'projects' })}
            onEdit={(item) => setDialog({ open: true, tab: 'projects', item })}
            onDelete={async (id) => {
              if (id) await removeDocument(COLLECTIONS.FEATURED_PROJECTS, id);
              load();
            }}
          />
        </TabsContent>
      </Tabs>

      <HomeEditDialog
        dialog={dialog}
        onClose={() => setDialog((d) => ({ ...d, open: false }))}
        onSaved={() => {
          setDialog((d) => ({ ...d, open: false }));
          load();
        }}
        iconOptions={ICON_OPTIONS}
      />
    </div>
  );
}

function HeroList({ items, onAdd, onEdit, onDelete }: { items: HeroSlide[]; onAdd: () => void; onEdit: (i: HeroSlide) => void; onDelete: (id: string) => void }) {
  return (
    <div>
      <Button onClick={onAdd} className="mb-4 bg-orange-600 hover:bg-orange-500"><Plus className="mr-2 h-4 w-4" />Add Slide</Button>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white truncate">{i.title} – {i.subtitle}</p>
              <p className="text-sm text-slate-400 truncate">{i.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => onEdit(i)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => i.id && onDelete(i.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntroList({ items, onAdd, onEdit, onDelete }: { items: IntroPoint[]; onAdd: () => void; onEdit: (i: IntroPoint) => void; onDelete: (id: string) => void }) {
  return (
    <div>
      <Button onClick={onAdd} className="mb-4 bg-orange-600 hover:bg-orange-500"><Plus className="mr-2 h-4 w-4" />Add Point</Button>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">{i.title}</p>
              <p className="text-sm text-slate-400 truncate">{i.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => onEdit(i)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" className="text-red-400" onClick={() => i.id && onDelete(i.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialList({ items, onAdd, onEdit, onDelete }: { items: Testimonial[]; onAdd: () => void; onEdit: (i: Testimonial) => void; onDelete: (id: string) => void }) {
  return (
    <div>
      <Button onClick={onAdd} className="mb-4 bg-orange-600 hover:bg-orange-500"><Plus className="mr-2 h-4 w-4" />Add Testimonial</Button>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-300 line-clamp-2">{i.quote}</p>
              <p className="mt-1 font-medium text-white">{i.name}, {i.role}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => onEdit(i)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" className="text-red-400" onClick={() => i.id && onDelete(i.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnerList({ items, onAdd, onEdit, onDelete }: { items: Partner[]; onAdd: () => void; onEdit: (i: Partner) => void; onDelete: (id: string) => void }) {
  return (
    <div>
      <Button onClick={onAdd} className="mb-4 bg-orange-600 hover:bg-orange-500"><Plus className="mr-2 h-4 w-4" />Add Partner</Button>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">{i.title}</p>
              <p className="text-sm text-slate-400 truncate">{i.description}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => onEdit(i)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" className="text-red-400" onClick={() => i.id && onDelete(i.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectList({ items, onAdd, onEdit, onDelete }: { items: FeaturedProject[]; onAdd: () => void; onEdit: (i: FeaturedProject) => void; onDelete: (id: string) => void }) {
  return (
    <div>
      <Button onClick={onAdd} className="mb-4 bg-orange-600 hover:bg-orange-500"><Plus className="mr-2 h-4 w-4" />Add Project</Button>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">{i.title}</p>
              <p className="text-sm text-slate-400">{i.location} · {i.capacity} · {i.type}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={() => onEdit(i)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" className="text-red-400" onClick={() => i.id && onDelete(i.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeEditDialog({
  dialog,
  onClose,
  onSaved,
  iconOptions,
}: {
  dialog: { open: boolean; tab: TabKey; item?: HeroSlide | IntroPoint | Testimonial | Partner | FeaturedProject };
  onClose: () => void;
  onSaved: () => void;
  iconOptions: string[];
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string | number>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!dialog.open) return;
    setUploadError(null);
    setUploadProgress(0);
    const item = dialog.item as Record<string, unknown> | undefined;
    if (item) {
      const f: Record<string, string | number> = {};
      Object.entries(item).forEach(([k, v]) => {
        if (k !== 'id' && (typeof v === 'string' || typeof v === 'number')) f[k] = v;
        if (k === 'rating' && typeof v === 'number') f[k] = v;
      });
      setForm(f);
    } else {
      if (dialog.tab === 'hero') setForm({ image: '', title: '', subtitle: '', description: '', order: 0 });
      if (dialog.tab === 'intro') setForm({ iconName: 'Zap', title: '', description: '', paragraph: '', image: '', order: 0 });
      if (dialog.tab === 'testimonials') setForm({ quote: '', name: '', role: '', location: '', rating: 5, order: 0 });
      if (dialog.tab === 'partners') setForm({ iconName: 'Award', title: '', description: '', order: 0 });
      if (dialog.tab === 'projects') setForm({ image: '', title: '', location: '', capacity: '', type: '', order: 0 });
    }
  }, [dialog.open, dialog.tab, dialog.item]);

  async function handleHeroImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError(null);
    setUploadProgress(0);
    const err = validateImageFile(file);
    if (err) {
      setUploadError(err);
      return;
    }
    setUploading(true);
    try {
      const url = await uploadHeroSlideImage(file, (percent) => setUploadProgress(percent));
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  function handleRemoveHeroImage() {
    setForm((f) => ({ ...f, image: '' }));
    setUploadError(null);
    fileInputRef.current?.value && (fileInputRef.current.value = '');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const item = dialog.item as { id?: string } | undefined;
      const order = typeof form.order === 'number' ? form.order : parseInt(String(form.order), 10) || 0;
      const data = toFirestore({ ...form, order } as Record<string, unknown>);

      if (dialog.tab === 'hero') {
        if (item?.id) await updateDocument(COLLECTIONS.HERO_SLIDES, item.id, data);
        else await addDocument(COLLECTIONS.HERO_SLIDES, data);
      }
      if (dialog.tab === 'intro') {
        if (item?.id) await updateDocument(COLLECTIONS.INTRO_POINTS, item.id, data);
        else await addDocument(COLLECTIONS.INTRO_POINTS, data);
      }
      if (dialog.tab === 'testimonials') {
        if (item?.id) await updateDocument(COLLECTIONS.TESTIMONIALS, item.id, data);
        else await addDocument(COLLECTIONS.TESTIMONIALS, data);
      }
      if (dialog.tab === 'partners') {
        if (item?.id) await updateDocument(COLLECTIONS.PARTNERS, item.id, data);
        else await addDocument(COLLECTIONS.PARTNERS, data);
      }
      if (dialog.tab === 'projects') {
        if (item?.id) await updateDocument(COLLECTIONS.FEATURED_PROJECTS, item.id, data);
        else await addDocument(COLLECTIONS.FEATURED_PROJECTS, data);
      }
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const title = dialog.tab === 'hero' ? 'Hero Slide' : dialog.tab === 'intro' ? 'Intro Point' : dialog.tab === 'testimonials' ? 'Testimonial' : dialog.tab === 'partners' ? 'Partner' : 'Featured Project';

  return (
    <Dialog open={dialog.open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-white">{dialog.item ? 'Edit' : 'Add'} {title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {dialog.tab === 'hero' && (
            <>
              <div className="space-y-2">
                <Label className="text-slate-300">Slide image (PNG, WebP, JPG, JPEG)</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.webp,.jpg,.jpeg,image/png,image/webp,image/jpeg"
                  className="hidden"
                  onChange={handleHeroImageSelect}
                  disabled={uploading}
                />
                {form.image ? (
                  <div className="relative rounded-lg border border-slate-600 overflow-hidden bg-slate-700/50">
                    <div className="relative aspect-video w-full max-h-48">
                      <Image src={String(form.image)} alt="Slide preview" fill className="object-cover" sizes="400px" unoptimized />
                    </div>
                    <div className="flex items-center justify-between p-2 border-t border-slate-600">
                      <span className="text-xs text-slate-400 truncate max-w-[200px]">{String(form.image).slice(0, 50)}…</span>
                      <Button type="button" variant="ghost" size="sm" className="text-red-400 hover:text-red-300 shrink-0" onClick={handleRemoveHeroImage} disabled={uploading}>
                        <X className="h-4 w-4 mr-1" /> Remove image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-slate-600 bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                      {uploading ? `Uploading… ${uploadProgress}%` : 'Choose image'}
                    </Button>
                    {uploading && (
                      <div className="h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
                        <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}
                  </div>
                )}
                {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}
              </div>
              <div><Label className="text-slate-300">Title</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.title || ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Subtitle</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.subtitle || ''} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Description</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
            </>
          )}
          {dialog.tab === 'intro' && (
            <>
              <div><Label className="text-slate-300">Icon</Label><select className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white" value={form.iconName || 'Zap'} onChange={(e) => setForm((f) => ({ ...f, iconName: e.target.value }))}>{iconOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
              <div><Label className="text-slate-300">Title</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.title || ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Description</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Paragraph</Label><Textarea className="mt-1 bg-slate-700 border-slate-600" value={form.paragraph || ''} onChange={(e) => setForm((f) => ({ ...f, paragraph: e.target.value }))} rows={3} /></div>
              <div><Label className="text-slate-300">Image URL</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.image || ''} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} /></div>
            </>
          )}
          {dialog.tab === 'testimonials' && (
            <>
              <div><Label className="text-slate-300">Quote</Label><Textarea className="mt-1 bg-slate-700 border-slate-600" value={form.quote || ''} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} rows={3} /></div>
              <div><Label className="text-slate-300">Name</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.name || ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Role</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.role || ''} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Location</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.location || ''} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Rating (1-5)</Label><Input type="number" min={1} max={5} className="mt-1 bg-slate-700 border-slate-600" value={form.rating ?? 5} onChange={(e) => setForm((f) => ({ ...f, rating: parseInt(e.target.value, 10) || 5 }))} /></div>
            </>
          )}
          {dialog.tab === 'partners' && (
            <>
              <div><Label className="text-slate-300">Icon</Label><select className="mt-1 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white" value={form.iconName || 'Award'} onChange={(e) => setForm((f) => ({ ...f, iconName: e.target.value }))}>{iconOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
              <div><Label className="text-slate-300">Title</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.title || ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Description</Label><Textarea className="mt-1 bg-slate-700 border-slate-600" value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} /></div>
            </>
          )}
          {dialog.tab === 'projects' && (
            <>
              <div><Label className="text-slate-300">Image URL</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.image || ''} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Title</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.title || ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Location</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.location || ''} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Capacity</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.capacity || ''} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} /></div>
              <div><Label className="text-slate-300">Type</Label><Input className="mt-1 bg-slate-700 border-slate-600" value={form.type || ''} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} placeholder="Commercial / Residential / Infrastructure" /></div>
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
