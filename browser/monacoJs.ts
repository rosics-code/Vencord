/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import "./patch-worker";

import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";

declare global {
    const baseUrl: string;
    const getCurrentJs: () => Promise<string>;
    const setJs: (js: string) => void;
    const getTheme: () => string;
}

const BASE = "/vendor/monaco/vs";

self.MonacoEnvironment = {
    getWorkerUrl(_moduleId: unknown, label: string) {
        const path = label === "typescript" || label === "javascript"
            ? "/language/typescript/ts.worker.js"
            : "/editor/editor.worker.js";
        return new URL(BASE + path, baseUrl).toString();
    }
};

getCurrentJs().then(js => {
    const editor = monaco.editor.create(
        document.getElementById("container")!,
        {
            value: js,
            language: "javascript",
            theme: getTheme(),
        }
    );
    editor.onDidChangeModelContent(() =>
        setJs(editor.getValue())
    );
    window.addEventListener("resize", () => {
        editor.layout();
    });
});
