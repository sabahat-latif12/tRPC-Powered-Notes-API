import React, { useState } from 'react';
import { trpc } from './trpc';

function App() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const notesQuery = trpc.notes.getAll.useQuery({ page: 1, limit: 20 });
  const createNote = trpc.notes.create.useMutation({
    onSuccess: () => notesQuery.refetch(),
  });
  const deleteNote = trpc.notes.delete.useMutation({
    onSuccess: () => notesQuery.refetch(),
  });

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    await createNote.mutateAsync({
      title,
      content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setTitle('');
    setContent('');
    setTags('');
  };

  return (
    <div style={{ maxWidth: 800, margin: '24px auto', padding: 16, fontFamily: 'system-ui' }}>
      <h1>Notes</h1>

      <form onSubmit={onCreate} style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <button type="submit" disabled={createNote.isPending}>Create</button>
      </form>

      {notesQuery.isLoading ? (
        <p>Loading...</p>
      ) : notesQuery.error ? (
        <pre style={{ color: 'crimson' }}>{String(notesQuery.error.message)}</pre>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
          {notesQuery.data?.notes.map((n) => (
            <li key={n.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{n.title}</h3>
                <button onClick={() => n.id && deleteNote.mutate({ id: String(n.id) })} disabled={deleteNote.isPending}>Delete</button>
              </div>
              <p style={{ whiteSpace: 'pre-wrap' }}>{n.content}</p>
              {n.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {n.tags.map((t: string) => (
                    <span key={t} style={{ background: '#f2f2f2', padding: '2px 8px', borderRadius: 999, fontSize: 12 }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;