#!/usr/bin/env node

import { spawn } from 'child_process';
import { stdin, stdout } from 'process';

// MCPサーバーを起動
const server = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'inherit']
});

let messageId = 1;

// JSON-RPCメッセージを送信する関数
function sendRequest(method, params = {}) {
  const request = {
    jsonrpc: '2.0',
    id: messageId++,
    method,
    params
  };
  server.stdin.write(JSON.stringify(request) + '\n');
}

// サーバーからのレスポンスを処理
let buffer = '';
server.stdout.on('data', (data) => {
  buffer += data.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop() || '';

  lines.forEach(line => {
    if (line.trim()) {
      try {
        const response = JSON.parse(line);
        console.log('Response:', JSON.stringify(response, null, 2));
      } catch (e) {
        console.log('Raw output:', line);
      }
    }
  });
});

// 初期化
setTimeout(() => {
  console.log('\n=== Initializing MCP Server ===');
  sendRequest('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  });
}, 500);

// ツール一覧を取得
setTimeout(() => {
  console.log('\n=== Listing Tools ===');
  sendRequest('tools/list');
}, 1500);

// ツールを実行
setTimeout(() => {
  console.log('\n=== Calling get_current_time ===');
  sendRequest('tools/call', {
    name: 'get_current_time',
    arguments: { timezone: 'Asia/Tokyo' }
  });
}, 2500);

setTimeout(() => {
  console.log('\n=== Calling calculate ===');
  sendRequest('tools/call', {
    name: 'calculate',
    arguments: { operation: 'multiply', a: 12, b: 8 }
  });
}, 3500);

// リソース一覧を取得
setTimeout(() => {
  console.log('\n=== Listing Resources ===');
  sendRequest('resources/list');
}, 4500);

// リソースを読み取り
setTimeout(() => {
  console.log('\n=== Reading Resource ===');
  sendRequest('resources/read', {
    uri: 'note:///welcome'
  });
}, 5500);

// 終了
setTimeout(() => {
  console.log('\n=== Test Complete ===');
  server.kill();
  process.exit(0);
}, 6500);
