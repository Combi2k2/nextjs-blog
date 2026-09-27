'use client';

import { useState, useDeferredValue, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import BlogView from './BlogView';
import { saveBlogDraft } from '@/actions/studio-crud';

interface BlogFormProps {
    initialData?: {
        id?: string;
        title: string;
        content: string;
        excerpt: string;
        tags: string[];
        published?: boolean;
        updatedAt?: string;
    };
    onSubmit: (formData: FormData) => Promise<void>;
    isSubmitting: boolean;
    error: string;
}

type ViewMode = 'edit' | 'split' | 'preview';
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type StoredDraft = {
    title: string;
    content: string;
    excerpt: string;
    tags: string;
    draftId: string | null;
    lastModifiedAt: number;
    syncedAt: number | null;
};

const IDLE_MS = 15_000;

function keyFor(id: string | null) {
    return id ? `blog-draft-${id}` : 'blog-draft-new';
}

export default function BlogForm({ initialData, onSubmit, isSubmitting, error }: BlogFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
    const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
    const [mode, setMode] = useState<ViewMode>('edit');
    const [draftId, setDraftId] = useState<string | null>(initialData?.id ?? null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [restore, setRestore] = useState<StoredDraft | null>(null);

    // Deferred values for split-mode preview
    const deferredTitle = useDeferredValue(title);
    const deferredContent = useDeferredValue(content);
    const deferredTags = useDeferredValue(tags);

    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const skipFirstWriteRef = useRef(true);
    const skipFirstFlushRef = useRef(true);
    const draftIdRef = useRef<string | null>(initialData?.id ?? null);

    // Keep draftIdRef in sync so the flush callback (defined once) sees the latest id.
    useEffect(() => { draftIdRef.current = draftId; }, [draftId]);

    // ---- MOUNT: default to split on wide screens ----
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.innerWidth >= 1024) setMode('split');
    }, []);

    // ---- MOUNT: check localStorage for unsynced changes ----
    // Compare content, not timestamps. Timestamps mix client and DB clocks and
    // fire false positives on even small clock skew.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const key = keyFor(initialData?.id ?? null);
        const raw = localStorage.getItem(key);
        if (!raw) return;
        try {
            const saved: StoredDraft = JSON.parse(raw);
            const dbTitle = initialData?.title || '';
            const dbContent = initialData?.content || '';
            const dbExcerpt = initialData?.excerpt || '';
            const dbTags = initialData?.tags?.join(', ') || '';
            const isSameAsDb =
                saved.title === dbTitle
                && saved.content === dbContent
                && saved.excerpt === dbExcerpt
                && saved.tags === dbTags;
            if (isSameAsDb) {
                localStorage.removeItem(key);
            } else {
                setRestore(saved);
            }
        } catch {
            localStorage.removeItem(key);
        }
        // Intentionally run once on mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRestore = () => {
        if (!restore) return;
        setTitle(restore.title);
        setContent(restore.content);
        setExcerpt(restore.excerpt);
        setTags(restore.tags);
        if (restore.draftId && !draftId) setDraftId(restore.draftId);
        setRestore(null);
    };

    const handleDiscardRestore = () => {
        if (!restore) return;
        const key = keyFor(initialData?.id ?? null);
        localStorage.removeItem(key);
        setRestore(null);
    };

    // ---- LOCALSTORAGE: mirror form state on every change ----
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (skipFirstWriteRef.current) {
            skipFirstWriteRef.current = false;
            return;
        }
        if (restore) return; // Don't clobber a pending-restore snapshot
        const draft: StoredDraft = {
            title, content, excerpt, tags,
            draftId,
            lastModifiedAt: Date.now(),
            syncedAt: null, // updated by flushToDb
        };
        // Preserve syncedAt if we already have one from a previous save
        try {
            const raw = localStorage.getItem(keyFor(draftId));
            if (raw) {
                const prev: StoredDraft = JSON.parse(raw);
                draft.syncedAt = prev.syncedAt;
            }
        } catch { /* ignore */ }
        localStorage.setItem(keyFor(draftId), JSON.stringify(draft));
    }, [title, content, excerpt, tags, draftId, restore]);

    // ---- FLUSH: idle-triggered DB sync ----
    const flushToDb = async () => {
        setSaveStatus('saving');
        try {
            const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
            const currentId = draftIdRef.current;
            const result = await saveBlogDraft(currentId, {
                title, content, excerpt, tags: tagArray,
            });
            const syncedAt = new Date(result.updatedAt).getTime();

            // On first sync from create mode, migrate localStorage key: new → <id>
            if (!currentId) {
                const oldRaw = localStorage.getItem('blog-draft-new');
                localStorage.removeItem('blog-draft-new');
                if (oldRaw) {
                    try {
                        const prev: StoredDraft = JSON.parse(oldRaw);
                        prev.draftId = result.id;
                        prev.syncedAt = syncedAt;
                        localStorage.setItem(`blog-draft-${result.id}`, JSON.stringify(prev));
                    } catch { /* ignore */ }
                }
                setDraftId(result.id);
                draftIdRef.current = result.id;
            } else {
                // Update syncedAt on the existing key
                try {
                    const raw = localStorage.getItem(`blog-draft-${currentId}`);
                    if (raw) {
                        const prev: StoredDraft = JSON.parse(raw);
                        prev.syncedAt = syncedAt;
                        localStorage.setItem(`blog-draft-${currentId}`, JSON.stringify(prev));
                    }
                } catch { /* ignore */ }
            }
            setSaveStatus('saved');
        } catch (err) {
            console.error('Draft save failed:', err);
            setSaveStatus('error');
        }
    };

    // Schedule idle flush on every change
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (skipFirstFlushRef.current) {
            skipFirstFlushRef.current = false;
            return;
        }
        if (restore) return;
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => { flushToDb(); }, IDLE_MS);
        return () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
        // flushToDb intentionally excluded — it reads latest state via closure/refs.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, content, excerpt, tags, restore]);

    // "Saved" status auto-dims after 2s
    useEffect(() => {
        if (saveStatus !== 'saved') return;
        const t = setTimeout(() => setSaveStatus('idle'), 2000);
        return () => clearTimeout(t);
    }, [saveStatus]);

    const handleManualSave = async () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        await flushToDb();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        const formData = new FormData(e.currentTarget);
        // Prefer the effective draftId (may have been set by auto-save in create mode)
        if (draftId) formData.append('id', draftId);
        // Clear localStorage optimistically. If publish fails, the next edit repopulates it.
        localStorage.removeItem(keyFor(draftId));
        localStorage.removeItem('blog-draft-new');
        await onSubmit(formData);
    };

    const previewTagArray = deferredTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const modes: { key: ViewMode; label: string }[] = [
        { key: 'edit', label: 'Edit' },
        { key: 'split', label: 'Split' },
        { key: 'preview', label: 'Preview' },
    ];

    const segmentedControl = (
        <div className="inline-flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
            {modes.map((m, i) => (
                <button
                    key={m.key}
                    type="button"
                    onClick={() => setMode(m.key)}
                    className={
                        'px-4 py-2 text-sm font-medium transition-colors '
                        + (mode === m.key
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700')
                        + (i > 0 ? ' border-l border-gray-300 dark:border-gray-600' : '')
                    }
                >
                    {m.label}
                </button>
            ))}
        </div>
    );

    const saveStatusLabel = {
        idle: draftId ? 'Draft saved' : 'Not saved yet',
        saving: 'Saving…',
        saved: 'Saved just now',
        error: 'Save failed',
    }[saveStatus];

    const saveStatusColor = saveStatus === 'error'
        ? 'text-red-500'
        : saveStatus === 'saving'
            ? 'text-gray-500'
            : 'text-gray-400 dark:text-gray-500';

    const isDraft = initialData?.published === false || (!initialData?.id && draftId !== null);
    const publishLabel = isSubmitting
        ? (initialData?.id ? 'Updating…' : 'Publishing…')
        : (initialData?.id
            ? (initialData.published === false ? 'Publish' : 'Update')
            : 'Publish');

    const formSection = (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Blog Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter a captivating title"
                />
            </div>

            <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Blog Summary
                </label>
                <input
                    type="text"
                    id="summary"
                    name="summary"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="A brief summary of your blog"
                />
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Blog Content
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={mode === 'split' ? 24 : 15}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono"
                    placeholder="Write your blog post using Markdown..."
                />
            </div>

            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags
                </label>
                <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="technology, coding, nextjs, etc."
                />
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <div className="flex items-center justify-between gap-3">
                <span className={`text-sm ${saveStatusColor}`}>{saveStatusLabel}</span>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => router.push('/studio/blogs')}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleManualSave}
                        disabled={saveStatus === 'saving' || isSubmitting}
                        className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                        Save Draft
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {publishLabel}
                    </button>
                </div>
            </div>
        </form>
    );

    const previewPanel = (
        <BlogView
            title={deferredTitle || 'Blog Title'}
            content={deferredContent || 'Blog content will appear here...'}
            tags={previewTagArray.length > 0 ? previewTagArray : ['example']}
            date={new Date()}
        />
    );

    return (
        <div className={mode === 'split' ? 'px-4 py-8 pt-24' : 'container mx-auto px-4 py-8 pt-24'}>
            <div className="flex items-center justify-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-center">
                    {initialData?.id ? 'Edit Blog' : 'Create New Blog'}
                </h1>
                {isDraft && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        Draft
                    </span>
                )}
            </div>
            <div className="flex justify-center mb-6">
                {segmentedControl}
            </div>

            {restore && (
                <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-3">
                    <div className="text-sm text-amber-900 dark:text-amber-100">
                        Unsaved changes found from{' '}
                        <span className="font-medium">
                            {new Date(restore.lastModifiedAt).toLocaleString()}
                        </span>.
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleDiscardRestore}
                            className="px-3 py-1.5 text-sm rounded-md text-amber-900 dark:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                        >
                            Discard
                        </button>
                        <button
                            type="button"
                            onClick={handleRestore}
                            className="px-3 py-1.5 text-sm rounded-md bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            Restore
                        </button>
                    </div>
                </div>
            )}

            {mode === 'edit' && formSection}

            {mode === 'split' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="min-w-0">{formSection}</div>
                    <div className="min-w-0 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-auto">
                        {/* Spacer matches the "Blog Title" label so the preview aligns with the title input */}
                        <div className="hidden lg:block text-sm font-medium mb-1 invisible" aria-hidden="true">
                            Preview
                        </div>
                        {previewPanel}
                    </div>
                </div>
            )}

            {mode === 'preview' && (
                <div className="max-w-4xl mx-auto">{previewPanel}</div>
            )}
        </div>
    );
}
