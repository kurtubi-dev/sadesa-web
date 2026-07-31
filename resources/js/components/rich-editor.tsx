import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface RichEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (!editorRef.current) return;
        // Avoid double initialization in React 18/19 strict mode
        if (editorRef.current.querySelector('.ql-editor')) return;

        const quill = new Quill(editorRef.current, {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'clean'],
                ],
            },
            placeholder: placeholder ?? 'Tulis konten di sini…',
        });

        quillRef.current = quill;

        if (value) {
            quill.clipboard.dangerouslyPasteHTML(value);
        }

        quill.on('text-change', () => {
            const html = quill.root.innerHTML;
            onChange(html === '<p><br></p>' ? '' : html);
        });
    }, []);

    return (
        <div className="bg-background rounded-xl border border-input overflow-hidden">
            <div ref={editorRef} className="min-h-[150px] max-h-[300px] overflow-y-auto text-foreground" />
        </div>
    );
}
