const MODEL_ID = 'onnx-community/Qwen2.5-0.5B-Instruct';
const MODEL_LIBRARY_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';
const SYSTEM_PROMPT = `Você é o Saíra, um personagem masculino do universo OpyLendas e companheiro de conversa no site.
Use sempre referências masculinas para falar de si. Fale em primeira pessoa, com um jeito acolhedor, curioso e gentil, como em uma conversa natural.
Responda sempre em português do Brasil, com simpatia e de forma clara e breve.
Ajude com perguntas gerais sobre folclore brasileiro e com a navegação do site: Início, Santuário, OpyDiário, Loja, personagens, curiosidades e Sobre nós.
Não invente detalhes da história do Saíra, preços, estoque, prazos, políticas ou outras informações específicas do projeto que não tenham sido fornecidas. Quando não souber algo específico do site, indique a página Fale conosco.
Diferencie fatos conhecidos de versões e interpretações populares das lendas.`;
const MAX_HISTORY_MESSAGES = 10;
const SAIRA_IMAGE = 'assets/Chibis/sairatwink.jpg';

const toggleButton = document.getElementById('opy-chat-toggle');
const panel = document.getElementById('opy-chat-panel');
const closeButton = document.getElementById('opy-chat-close');
const statusElement = document.getElementById('opy-chat-status');
const loadButton = document.getElementById('opy-chat-load');
const messagesElement = document.getElementById('opy-chat-messages');
const form = document.getElementById('opy-chat-form');
const input = document.getElementById('opy-chat-input');
const sendButton = document.getElementById('opy-chat-send');
const clearButton = document.getElementById('opy-chat-clear');

let generator = null;
let isGenerating = false;
let conversation = [{ role: 'system', content: SYSTEM_PROMPT }];
let releaseModelLock = null;

function setStatus(message, state = 'idle') {
  statusElement.textContent = message;
  statusElement.dataset.state = state;
}

function setChatEnabled(enabled) {
  input.disabled = !enabled;
  sendButton.disabled = !enabled;
  clearButton.disabled = !enabled || isGenerating;
  loadButton.classList.toggle('hidden', enabled);
  if (enabled) input.focus();
}

function appendMessage(role, text) {
  const row = document.createElement('div');
  row.className = 'opy-chat-message-row';
  row.dataset.role = role === 'user' ? 'user' : 'assistant';

  if (role !== 'user') {
    const avatar = document.createElement('img');
    avatar.className = 'opy-chat-avatar';
    avatar.src = SAIRA_IMAGE;
    avatar.alt = '';
    row.append(avatar);
  }

  const message = document.createElement('p');
  message.className = 'opy-chat-message';
  message.textContent = text;
  row.append(message);
  messagesElement.append(row);
  messagesElement.scrollTop = messagesElement.scrollHeight;
}

function clearConversation() {
  conversation = [{ role: 'system', content: SYSTEM_PROMPT }];
  messagesElement.replaceChildren();
  appendMessage('assistant', 'Oi! Eu sou o Saíra. Quer conversar sobre o universo OpyLendas, conhecer uma lenda brasileira ou encontrar alguma coisa pelo site?');
}

function describeProgress(progress) {
  if (!progress || typeof progress !== 'object') return;
  if (typeof progress.progress === 'number') {
    const file = progress.file ? ` (${progress.file})` : '';
    setStatus(`Baixando modelo: ${Math.round(progress.progress)}%${file}`, 'loading');
  } else if (progress.status === 'ready') {
    setStatus('Preparando o modelo no navegador...', 'loading');
  }
}

function acquireModelLock() {
  if (!navigator.locks) {
    return Promise.reject(new Error('Este navegador não oferece controle de uso entre abas. Tente uma versão atualizada do Edge ou Chrome.'));
  }

  return new Promise((resolve, reject) => {
    navigator.locks.request('opylendas-local-ai-model', { ifAvailable: true }, async lock => {
      if (!lock) {
        resolve(false);
        return;
      }

      resolve(true);
      await new Promise(release => {
        releaseModelLock = release;
      });
    }).catch(reject);
  });
}

async function loadModel() {
  if (generator) return;
  loadButton.disabled = true;
  setStatus('Verificando suporte a WebGPU...', 'loading');

  try {
    if (!window.isSecureContext) {
      throw new Error('Para usar a IA, abra o site em HTTPS ou em localhost.');
    }
    if (!navigator.gpu) {
      throw new Error('Este navegador não disponibiliza WebGPU. Tente uma versão atualizada do Edge ou Chrome; o restante do site continua disponível.');
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error('Não foi encontrado um adaptador WebGPU utilizável. Verifique o suporte à GPU no navegador e tente novamente.');
    }

    setStatus('Verificando se outra aba já está usando o modelo...', 'loading');
    if (!await acquireModelLock()) {
      throw new Error('A IA já está em uso em outra aba. Feche a outra aba do site antes de ativar o modelo aqui.');
    }

    setStatus('Carregando a biblioteca e preparando o download do modelo...', 'loading');
    const { env, pipeline } = await import(MODEL_LIBRARY_URL);
    env.allowRemoteModels = true;
    env.allowLocalModels = false;

    generator = await pipeline('text-generation', MODEL_ID, {
      device: 'webgpu',
      dtype: 'q4',
      progress_callback: describeProgress
    });

    setStatus('O Saíra está pronto para conversar. As mensagens são processadas neste navegador.', 'ready');
    setChatEnabled(true);
  } catch (error) {
    console.error('Falha ao carregar o Assistente Opy:', error);
    setStatus(`Não foi possível ativar a IA: ${error.message || 'erro desconhecido'}`, 'error');
    loadButton.disabled = false;
    if (releaseModelLock) {
      releaseModelLock();
      releaseModelLock = null;
    }
  }
}

async function sendMessage(text) {
  if (!generator || isGenerating) return;

  isGenerating = true;
  input.disabled = true;
  sendButton.disabled = true;
  clearButton.disabled = true;
  appendMessage('user', text);
  conversation.push({ role: 'user', content: text });

  const context = [
    conversation[0],
    ...conversation.slice(1).slice(-MAX_HISTORY_MESSAGES)
  ];

  try {
    setStatus('Saíra está pensando...', 'loading');
    const result = await generator(context, {
      max_new_tokens: 160,
      repetition_penalty: 1.1,
      temperature: 0.7,
      top_p: 0.9,
      do_sample: true
    });
    const generated = result?.[0]?.generated_text;
    const answer = Array.isArray(generated)
      ? generated[generated.length - 1]?.content
      : generated;

    if (typeof answer !== 'string' || !answer.trim()) {
      throw new Error('O modelo não retornou uma resposta. Tente novamente.');
    }

    conversation.push({ role: 'assistant', content: answer.trim() });
    appendMessage('assistant', answer.trim());
    setStatus('O Saíra está pronto para conversar. As mensagens são processadas neste navegador.', 'ready');
  } catch (error) {
    conversation.pop();
    console.error('Falha ao gerar resposta no Assistente Opy:', error);
    setStatus(`Não foi possível gerar a resposta: ${error.message || 'erro desconhecido'}`, 'error');
    appendMessage('assistant', 'Não consegui responder desta vez. Tente novamente.');
  } finally {
    isGenerating = false;
    input.disabled = false;
    sendButton.disabled = false;
    clearButton.disabled = false;
    input.focus();
  }
}

toggleButton.addEventListener('click', () => {
  const willOpen = panel.classList.contains('hidden');
  panel.classList.toggle('hidden', !willOpen);
  toggleButton.setAttribute('aria-expanded', String(willOpen));
  if (willOpen) closeButton.focus();
});

closeButton.addEventListener('click', () => {
  panel.classList.add('hidden');
  toggleButton.setAttribute('aria-expanded', 'false');
  toggleButton.focus();
});

loadButton.addEventListener('click', loadModel);

form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text || !generator || isGenerating) return;
  input.value = '';
  sendMessage(text);
});

input.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

clearButton.addEventListener('click', () => {
  if (isGenerating) return;
  clearConversation();
  setStatus('O Saíra está pronto para conversar. As mensagens são processadas neste navegador.', 'ready');
  input.focus();
});

clearConversation();

window.addEventListener('pagehide', () => {
  if (releaseModelLock) {
    releaseModelLock();
    releaseModelLock = null;
  }
});
