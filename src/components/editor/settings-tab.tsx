"use client";

import { Block, BLOCK_TYPES } from "@/lib/blocks";

interface SettingsTabProps {
  selectedBlock: Block | undefined;
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
}

export function SettingsTab({ selectedBlock, blocks, setBlocks }: SettingsTabProps) {
  if (!selectedBlock) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        <p>No block selected</p>
        <p className="text-sm mt-2">Select a block to edit its settings</p>
      </div>
    );
  }

  const updateBlockContent = (updates: any) => {
    setBlocks(
      blocks.map((b) =>
        b.id === selectedBlock.id ? { ...b, content: { ...b.content, ...updates } } : b
      )
    );
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Block Settings</h3>
      <div className="space-y-4">
        {selectedBlock.type === BLOCK_TYPES.HERO && (
          <HeroSettings content={selectedBlock.content as any} onChange={updateBlockContent} />
        )}
        {selectedBlock.type === BLOCK_TYPES.TEXT && (
          <TextSettings content={selectedBlock.content as any} onChange={updateBlockContent} />
        )}
        {selectedBlock.type === BLOCK_TYPES.IMAGE && (
          <ImageSettings content={selectedBlock.content as any} onChange={updateBlockContent} />
        )}
        {selectedBlock.type === BLOCK_TYPES.BUTTON && (
          <ButtonSettings content={selectedBlock.content as any} onChange={updateBlockContent} />
        )}
        {selectedBlock.type === BLOCK_TYPES.FOOTER && (
          <FooterSettings content={selectedBlock.content as any} onChange={updateBlockContent} />
        )}
      </div>
    </div>
  );
}

function HeroSettings({ content, onChange }: { content: any; onChange: (updates: any) => void }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
        <input
          type="text"
          value={content.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
        <input
          type="text"
          value={content.subtitle || ""}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button Text</label>
        <input
          type="text"
          value={content.buttonText || ""}
          onChange={(e) => onChange({ buttonText: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button URL</label>
        <input
          type="url"
          value={content.buttonUrl || ""}
          onChange={(e) => onChange({ buttonUrl: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
    </>
  );
}

function TextSettings({ content, onChange }: { content: any; onChange: (updates: any) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text Content</label>
      <textarea
        value={content.text || ""}
        onChange={(e) => onChange({ text: e.target.value })}
        rows={6}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
    </div>
  );
}

function ImageSettings({ content, onChange }: { content: any; onChange: (updates: any) => void }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
        <input
          type="url"
          value={content.src || ""}
          onChange={(e) => onChange({ src: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Text</label>
        <input
          type="text"
          value={content.alt || ""}
          onChange={(e) => onChange({ alt: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link URL</label>
        <input
          type="url"
          value={content.link || ""}
          onChange={(e) => onChange({ link: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
    </>
  );
}

function ButtonSettings({ content, onChange }: { content: any; onChange: (updates: any) => void }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button Text</label>
        <input
          type="text"
          value={content.text || ""}
          onChange={(e) => onChange({ text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button URL</label>
        <input
          type="url"
          value={content.url || ""}
          onChange={(e) => onChange({ url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
    </>
  );
}

function FooterSettings({ content, onChange }: { content: any; onChange: (updates: any) => void }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
        <input
          type="text"
          value={content.companyName || ""}
          onChange={(e) => onChange({ companyName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
        <input
          type="text"
          value={content.address || ""}
          onChange={(e) => onChange({ address: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
        <input
          type="tel"
          value={content.phone || ""}
          onChange={(e) => onChange({ phone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input
          type="email"
          value={content.email || ""}
          onChange={(e) => onChange({ email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>
    </>
  );
}
