import * as vscode from 'vscode';
import * as https from 'https';

enum BaseType {
    boolean = 'boolean',
    integer = 'number',
    long = 'number',
    double = 'number',
    float = 'number',
    int = 'number',
    short = 'number',
    char = 'string',
    string = 'string',
    date = 'date'
}


let cacheDoc = '';
const getDoc = async (path: string) => {
    const pathReg = /^[a-zA-Z]+(\/)?$/g;
    if (!pathReg.test(path)) {
        vscode.window.showErrorMessage('非法路径，请重试!');
        return;
    }
    vscode.window.showInformationMessage('查询中，等下哈...', 'q');
    const origninDoc = await fetchDoc(path);
    const vitrulDoc = buildVitrulDoc(origninDoc);

    cacheDoc = vitrulDoc;

    const what = await vscode.window.showQuickPick(['1', '2', '3']);
    if (what) {
        const uri = vscode.Uri.parse('think:' + what + '.js');
        console.log(uri, 'url');
        // calls back into the provider
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc, { preview: false });
        cacheDoc = '';
    }
};

const fetchDoc = async (path: string): Promise<string> => {
    const res = await new Promise((resolve) => {
        https.get('https://api.uomg.com/api/rand.qinghua?format=json', (res) => {
            res.on('data', (d) => {
                resolve(d.toString());
            });
        }).on('error', (e) => {
            resolve('');
        });
    });
    return String(res);
};

const buildVitrulDoc = (origninDoc: string): string => {
    // TODO build FROM TYPE
    return origninDoc;
};

export default function apix(ctx: vscode.ExtensionContext) {
    const { subscriptions } = ctx;
    const textEditorDisposable = vscode.commands.registerTextEditorCommand('developx.apix', (textEditor: vscode.TextEditor) => {
        if (!textEditor) {
            return;
        }
        const { document, selection } = textEditor;
        const path = document.getText(selection);
        getDoc(path);
    });
    subscriptions.push(textEditorDisposable);

    // https://api.uomg.com/api/rand.qinghua?format=json
    const myScheme = 'think';
    const myProvider = new class implements vscode.TextDocumentContentProvider {
        // emitter and its event
        onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
        onDidChange = this.onDidChangeEmitter.event;
        provideTextDocumentContent(uri: vscode.Uri) {
            return cacheDoc;
        }
    };
    const textDocumentDisposable = vscode.workspace.registerTextDocumentContentProvider(myScheme, myProvider);
    subscriptions.push(textDocumentDisposable);
};