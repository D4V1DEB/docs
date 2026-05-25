import { useEffect, useMemo, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import { Extension } from '@tiptap/core'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

function getRandomColor() {
  const colors = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706', '#dc2626']
  return colors[Math.floor(Math.random() * colors.length)]
}

const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {}
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
            parseHTML: (element) => ({
              fontSize: element.style.fontSize || null,
            }),
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize }).run()
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize: null }).run()
        },
    }
  },
})

function getWebsocketUrl() {
  if (typeof window === 'undefined') {
    return 'ws://localhost:1234'
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.hostname}:1234`
}

export default function App() {
  const ydoc = useMemo(() => new Y.Doc(), [])
  const provider = useMemo(() => {
    return new WebsocketProvider(getWebsocketUrl(), 'lab-docs', ydoc)
  }, [ydoc])
  const [connectionStatus, setConnectionStatus] = useState('connecting')

  useEffect(() => {
    const handleStatus = ({ status }) => {
      setConnectionStatus(status)
    }

    provider.on('status', handleStatus)
    return () => {
      provider.off('status', handleStatus)
    }
  }, [provider])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        undoRedo: false,
      }),
      TextStyle,
      FontSize,
      Collaboration.configure({
        document: provider.doc,
      }),
      CollaborationCaret.configure({
        provider,
        user: {
          name: `Usuario ${Math.floor(Math.random() * 1000)}`,
          color: getRandomColor(),
        },
      }),
    ],
    content: '',
  })

  if (!editor) {
    return <div className="page-shell">Cargando editor...</div>
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="room-status">
          <span className={`status-dot status-${connectionStatus}`} />
          <span>lab-docs</span>
        </div>
      </header>

      <div className="toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>
          Negrita
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}>
          Cursiva
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''}>
          Subrayado
        </button>

        <span className="separator" />

        <button type="button" onClick={() => editor.chain().focus().setFontSize('14px').run()}>
          + size
        </button>
        <button type="button" onClick={() => editor.chain().focus().setFontSize('12px').run()}>
          - size
        </button>
      </div>

      <main className="editor-card">
        <EditorContent editor={editor} />
      </main>
    </div>
  )
}
