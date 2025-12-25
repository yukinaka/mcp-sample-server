#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
// サンプルデータ
const sampleNotes = {
    "welcome": "Welcome to MCP Sample Server!",
    "example": "This is an example note.",
};
// MCPサーバーの作成
const server = new Server({
    name: "mcp-sample-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
// ツールのリスト定義
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_current_time",
                description: "現在の時刻を取得します",
                inputSchema: {
                    type: "object",
                    properties: {
                        timezone: {
                            type: "string",
                            description: "タイムゾーン (例: Asia/Tokyo, UTC)",
                        },
                    },
                },
            },
            {
                name: "calculate",
                description: "簡単な計算を実行します（加算、減算、乗算、除算）",
                inputSchema: {
                    type: "object",
                    properties: {
                        operation: {
                            type: "string",
                            enum: ["add", "subtract", "multiply", "divide"],
                            description: "実行する演算",
                        },
                        a: {
                            type: "number",
                            description: "最初の数値",
                        },
                        b: {
                            type: "number",
                            description: "2番目の数値",
                        },
                    },
                    required: ["operation", "a", "b"],
                },
            },
        ],
    };
});
// ツールの実行
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
        case "get_current_time": {
            const timezone = args?.timezone || "UTC";
            const now = new Date();
            const timeString = now.toLocaleString("ja-JP", {
                timeZone: timezone,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            return {
                content: [
                    {
                        type: "text",
                        text: `現在時刻 (${timezone}): ${timeString}`,
                    },
                ],
            };
        }
        case "calculate": {
            const { operation, a, b } = args;
            let result;
            switch (operation) {
                case "add":
                    result = a + b;
                    break;
                case "subtract":
                    result = a - b;
                    break;
                case "multiply":
                    result = a * b;
                    break;
                case "divide":
                    if (b === 0) {
                        throw new Error("0で除算できません");
                    }
                    result = a / b;
                    break;
                default:
                    throw new Error(`不明な演算: ${operation}`);
            }
            return {
                content: [
                    {
                        type: "text",
                        text: `計算結果: ${a} ${operation} ${b} = ${result}`,
                    },
                ],
            };
        }
        default:
            throw new Error(`不明なツール: ${name}`);
    }
});
// リソースのリスト定義
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: Object.keys(sampleNotes).map((key) => ({
            uri: `note:///${key}`,
            name: `Note: ${key}`,
            mimeType: "text/plain",
            description: `サンプルノート: ${key}`,
        })),
    };
});
// リソースの読み取り
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    const match = uri.match(/^note:\/\/\/(.+)$/);
    if (!match) {
        throw new Error(`無効なURI: ${uri}`);
    }
    const noteId = match[1];
    const content = sampleNotes[noteId];
    if (!content) {
        throw new Error(`ノートが見つかりません: ${noteId}`);
    }
    return {
        contents: [
            {
                uri,
                mimeType: "text/plain",
                text: content,
            },
        ],
    };
});
// サーバーの起動
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP Sample Server が起動しました");
}
main().catch((error) => {
    console.error("サーバーエラー:", error);
    process.exit(1);
});
