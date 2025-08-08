import { JSX, useState } from 'react';
import { Copy, Check } from 'lucide-react';

// Types and interfaces
interface CodeSnippetProps {
    code: string;
    language?: string;
    title?: string;
    showLineNumbers?: boolean;
    maxHeight?: string;
    className?: string;
}

type SupportedLanguage =
    | 'javascript'
    | 'typescript'
    | 'python'
    | 'html'
    | 'css'
    | 'json'
    | 'bash'
    | 'jsx'
    | 'tsx'
    | 'sql'
    | 'yaml'
    | 'markdown';

type LanguageColorMap = Record<string, string>;

const CodeSnippet: React.FC<CodeSnippetProps> = ({
    code,
    language = 'javascript',
    title = '',
    showLineNumbers = true,
    maxHeight = '400px',
    className = ''
}) => {
    const [copied, setCopied] = useState<boolean>(false);

    const copyToClipboard = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (fallbackErr) {
                console.error('Fallback copy failed:', fallbackErr);
            }
            document.body.removeChild(textArea);
        }
    };

    const getLanguageColor = (lang: string): string => {
        const colors: LanguageColorMap = {
            javascript: 'text-yellow-400',
            typescript: 'text-blue-400',
            python: 'text-green-400',
            html: 'text-orange-400',
            css: 'text-purple-400',
            json: 'text-gray-300',
            bash: 'text-green-300',
            jsx: 'text-cyan-400',
            tsx: 'text-cyan-400',
            sql: 'text-pink-400',
            yaml: 'text-red-400',
            markdown: 'text-gray-300'
        };
        return colors[lang.toLowerCase()] || 'text-gray-300';
    };

    const formatCode = (codeString: string): JSX.Element[] => {
        const lines = codeString.split('\n');
        return lines.map((line: string, index: number) => (
            <div key={index} className="flex">
                {showLineNumbers && (
                    <span className="select-none text-gray-500 text-sm mr-4 w-8 flex-shrink-0 text-right">
                        {index + 1}
                    </span>
                )}
                <span className="flex-1">
                    {line.length === 0 ? '\u00A0' : line}
                </span>
            </div>
        ));
    };

    return (
        <div className={`bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden ${className} `}>
            {/* Header */}
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    {title && (
                        <span className="text-gray-300 text-sm font-medium">{title}</span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-md bg-gray-700 ${getLanguageColor(language)}`}>
                        {language.toUpperCase()}
                    </span>
                </div>

                <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    title="Copy code"
                    aria-label="Copy code to clipboard"
                >
                    {copied ? (
                        <>
                            <Check size={14} className="text-green-400" />
                            <span className="text-green-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code Content */}
            <div
                className="p-4 overflow-auto font-mono text-sm text-gray-100 leading-relaxed [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-thumb]:bg-neutral-700"
                style={{ maxHeight }}
            >
                <pre className="whitespace-pre-wrap">
                    {formatCode(code)}
                </pre>
            </div>
        </div>
    );
};

export default CodeSnippet;
export type { CodeSnippetProps, SupportedLanguage };