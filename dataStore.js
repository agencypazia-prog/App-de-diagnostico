import fs from 'fs';
import path from 'path';

/**
 * Persistence layer for `empresas` and `conversaciones`.
 *
 * Backend is chosen with DATA_BACKEND:
 *  - "firestore" (recommended for Cloud Run / any multi-instance or redeployed environment —
 *    local disk there is ephemeral and not shared across instances)
 *  - "local" (default) — flat JSON files under ./data, fine for single-machine dev/testing.
 *
 * Firestore auth uses Application Default Credentials: on Cloud Run this is automatic via the
 * service account attached to the service (needs the "Cloud Datastore User" role); locally, set
 * GOOGLE_APPLICATION_CREDENTIALS to a service account key, or run the Firestore emulator and set
 * FIRESTORE_EMULATOR_HOST.
 */

const BACKEND = (process.env.DATA_BACKEND || 'local').toLowerCase();

function createLocalBackend(dataDir) {
  const EMPRESAS_FILE = path.join(dataDir, 'empresas.json');
  const CONVERSACIONES_FILE = path.join(dataDir, 'conversaciones.json');

  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  function readTable(file) {
    try {
      if (!fs.existsSync(file)) return [];
      const parsed = JSON.parse(fs.readFileSync(file, 'utf-8'));
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error reading table', file, err);
      return [];
    }
  }

  function writeTable(file, list) {
    fs.writeFileSync(file, JSON.stringify(list, null, 2), 'utf-8');
  }

  function upsert(file, item) {
    const list = readTable(file);
    const index = list.findIndex((row) => row.id === item.id);
    if (index >= 0) list[index] = item;
    else list.unshift(item);
    writeTable(file, list);
    return item;
  }

  return {
    async listEmpresas() {
      return readTable(EMPRESAS_FILE);
    },
    async getEmpresa(id) {
      return readTable(EMPRESAS_FILE).find((e) => e.id === id) || null;
    },
    async saveEmpresa(item) {
      return upsert(EMPRESAS_FILE, item);
    },
    async deleteEmpresa(id) {
      writeTable(EMPRESAS_FILE, readTable(EMPRESAS_FILE).filter((e) => e.id !== id));
    },
    async listConversaciones(empresaId) {
      const all = readTable(CONVERSACIONES_FILE);
      return empresaId ? all.filter((c) => c.empresaId === empresaId) : all;
    },
    async getConversacion(idOrEmpresaId) {
      const all = readTable(CONVERSACIONES_FILE);
      return (
        all.find((c) => c.id === idOrEmpresaId) ||
        all.find((c) => c.empresaId === idOrEmpresaId) ||
        null
      );
    },
    async saveConversacion(item) {
      return upsert(CONVERSACIONES_FILE, item);
    },
    async deleteConversacionesByEmpresa(empresaId) {
      writeTable(
        CONVERSACIONES_FILE,
        readTable(CONVERSACIONES_FILE).filter((c) => c.empresaId !== empresaId)
      );
    },
  };
}

async function createFirestoreBackend() {
  const { initializeApp, applicationDefault, getApps } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');

  if (getApps().length === 0) {
    initializeApp({
      credential: applicationDefault(),
      projectId: process.env.FIRESTORE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || undefined,
    });
  }

  const db = getFirestore();
  // Fields like submittedAt/createdAt are often genuinely absent (a conversation
  // that hasn't been submitted yet) and end up as `undefined` after the object is
  // assembled server-side. The Firestore client rejects `undefined` values by
  // default instead of just omitting them — treat "not set" as "omit the field".
  db.settings({ ignoreUndefinedProperties: true });
  const empresas = db.collection('empresas');
  const conversaciones = db.collection('conversaciones');

  return {
    async listEmpresas() {
      const snap = await empresas.get();
      return snap.docs.map((d) => d.data());
    },
    async getEmpresa(id) {
      const doc = await empresas.doc(id).get();
      return doc.exists ? doc.data() : null;
    },
    async saveEmpresa(item) {
      await empresas.doc(item.id).set(item);
      return item;
    },
    async deleteEmpresa(id) {
      await empresas.doc(id).delete();
    },
    async listConversaciones(empresaId) {
      const query = empresaId ? conversaciones.where('empresaId', '==', empresaId) : conversaciones;
      const snap = await query.get();
      return snap.docs.map((d) => d.data());
    },
    async getConversacion(idOrEmpresaId) {
      const byId = await conversaciones.doc(idOrEmpresaId).get();
      if (byId.exists) return byId.data();
      const snap = await conversaciones.where('empresaId', '==', idOrEmpresaId).limit(1).get();
      return snap.empty ? null : snap.docs[0].data();
    },
    async saveConversacion(item) {
      await conversaciones.doc(item.id).set(item);
      return item;
    },
    async deleteConversacionesByEmpresa(empresaId) {
      const snap = await conversaciones.where('empresaId', '==', empresaId).get();
      await Promise.all(snap.docs.map((d) => d.ref.delete()));
    },
  };
}

export async function createDataStore(dataDir) {
  if (BACKEND === 'firestore') {
    console.log('DataStore: usando Firestore.');
    return createFirestoreBackend();
  }
  console.log('DataStore: usando archivos locales en', dataDir, '(no apto para Cloud Run en producción; usa DATA_BACKEND=firestore).');
  return createLocalBackend(dataDir);
}
