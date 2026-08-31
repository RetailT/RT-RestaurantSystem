import React, { useEffect, useState } from 'react';

export default function ItemNoteModal({ item, onSave, onClose }) {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(item?.note || '');
  }, [item]);

  if (!item) return null;

  function handleSave() {
    onSave(item.pCode, text.trim());
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-rt-surface border border-rt-border rounded-2xl shadow-panel p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display font-semibold text-lg text-rt-text">Add a note</h2>
          <button onClick={onClose} className="text-rt-muted hover:text-rt-text text-xl leading-none">
            ✕
          </button>
        </div>
        <p className="text-xs text-rt-muted mb-3 truncate">{item.description}</p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. no onions, extra spicy, less ice…"
          rows={3}
          autoFocus
          maxLength={200}
          className="w-full rounded-lg bg-rt-surfacealt border border-rt-border text-rt-text placeholder:text-rt-muted/70 px-3 py-2 text-sm focus:border-rt-orange-500 outline-none resize-none"
        />
        <div className="flex justify-end mt-1 mb-4">
          <span className="text-[10px] text-rt-muted">{text.length}/200</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-rt-border text-rt-text font-semibold py-2 hover:bg-rt-surfacealt"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-rt-orange-500 hover:bg-rt-orange-600 text-black font-display font-bold py-2 shadow-glow"
          >
            Save note
          </button>
        </div>
      </div>
    </div>
  );
}