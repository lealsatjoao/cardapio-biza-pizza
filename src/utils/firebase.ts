import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

// Config do Firebase (projeto "biza pizza", 22/09/2026) — não é segredo, o SDK do Firebase é
// feito pra rodar em código público de app/site. A segurança de verdade vem das Regras do
// Realtime Database: qualquer um pode gravar um pedido novo (".write": true), mas só quem
// estiver logado (conta da loja, criada no console) consegue ler a lista de pedidos
// (".read": "auth != null") — por isso a tela do balcão pede login e a de fazer pedido não.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const db = getDatabase(app)
export const auth = getAuth(app)
