import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { MongoClient, type Db, type Document } from "mongodb"

import {
  SEED_BOOKINGS,
  SEED_REVIEWS,
  SEED_STUDIOS,
  SEED_USERS,
} from "./seed"
import type { Booking, Review, Studio, User } from "./types"

export type CollectionName = "studios" | "bookings" | "users" | "reviews"

type DocMap = {
  studios: Studio
  bookings: Booking
  users: User
  reviews: Review
}

type Store = {
  [K in CollectionName]: DocMap[K][]
}

const DATA_DIR = path.join(process.cwd(), ".data")
const DATA_FILE = path.join(DATA_DIR, "studiospace.json")

type GlobalCache = {
  __studioStore?: Promise<Store>
  __studioMongo?: Promise<Db | null>
  __studioMongoSeeded?: boolean
  __studioWrite?: Promise<void>
}

const globalCache = globalThis as unknown as GlobalCache

function seedStore(): Store {
  return {
    studios: structuredClone(SEED_STUDIOS),
    bookings: structuredClone(SEED_BOOKINGS),
    users: structuredClone(SEED_USERS),
    reviews: structuredClone(SEED_REVIEWS),
  }
}

async function loadStore(): Promise<Store> {
  try {
    const raw = await readFile(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw) as Partial<Store>
    const seed = seedStore()
    return {
      studios: parsed.studios ?? seed.studios,
      bookings: parsed.bookings ?? seed.bookings,
      users: parsed.users ?? seed.users,
      reviews: parsed.reviews ?? seed.reviews,
    }
  } catch {
    return seedStore()
  }
}

function getStore(): Promise<Store> {
  globalCache.__studioStore ??= loadStore()
  return globalCache.__studioStore
}

async function persistStore(store: Store) {
  const write = async () => {
    try {
      await mkdir(DATA_DIR, { recursive: true })
      await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8")
    } catch {
      // The in-memory store still works when the filesystem is read-only.
    }
  }

  const previous = globalCache.__studioWrite ?? Promise.resolve()
  globalCache.__studioWrite = previous.then(write, write)
  await globalCache.__studioWrite
}

async function getMongoDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI
  if (!uri) return null

  globalCache.__studioMongo ??= (async () => {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    })
    await client.connect()
    const db = client.db(process.env.MONGODB_DB ?? "studioSpace")

    if (!globalCache.__studioMongoSeeded) {
      const seed = seedStore()
      await Promise.all(
        (Object.keys(seed) as CollectionName[]).map(async (name) => {
          const collection = db.collection(name)
          const count = await collection.countDocuments({}, { limit: 1 })
          if (count === 0) {
            await collection.insertMany(
              seed[name] as unknown as Document[]
            )
          }
          await collection.createIndex({ id: 1 }, { unique: true }).catch(() => {
            // An existing duplicate id should not stop the app from booting.
          })
        })
      )
      globalCache.__studioMongoSeeded = true
    }

    return db
  })().catch((error) => {
    console.error("[studiospace] MongoDB connection failed:", error)
    globalCache.__studioMongo = undefined
    return null
  })

  return globalCache.__studioMongo
}

export async function readAll<K extends CollectionName>(
  name: K
): Promise<DocMap[K][]> {
  const db = await getMongoDb()
  if (db) {
    return (await db
      .collection(name)
      .find({}, { projection: { _id: 0 } })
      .toArray()) as unknown as DocMap[K][]
  }

  const store = await getStore()
  return structuredClone(store[name])
}

export async function insertOne<K extends CollectionName>(
  name: K,
  doc: DocMap[K]
): Promise<DocMap[K]> {
  const db = await getMongoDb()
  if (db) {
    const { _id, ...rest } = doc as unknown as Document
    void _id
    await db.collection(name).insertOne(rest)
    return doc
  }

  const store = await getStore()
  store[name].push(doc)
  await persistStore(store)
  return doc
}

export async function updateOne<K extends CollectionName>(
  name: K,
  id: string,
  patch: Partial<DocMap[K]>
): Promise<DocMap[K] | null> {
  const db = await getMongoDb()
  if (db) {
    const result = await db
      .collection(name)
      .findOneAndUpdate(
        { id },
        { $set: patch as Document },
        { returnDocument: "after", projection: { _id: 0 } }
      )
    return (result as unknown as DocMap[K]) ?? null
  }

  const store = await getStore()
  const index = store[name].findIndex((doc) => doc.id === id)
  if (index === -1) return null
  store[name][index] = { ...store[name][index], ...patch }
  await persistStore(store)
  return structuredClone(store[name][index])
}

export async function deleteOne<K extends CollectionName>(
  name: K,
  id: string
): Promise<boolean> {
  const db = await getMongoDb()
  if (db) {
    const result = await db.collection(name).deleteOne({ id })
    return result.deletedCount === 1
  }

  const store = await getStore()
  const next = store[name].filter((doc) => doc.id !== id)
  if (next.length === store[name].length) return false
  store[name] = next as Store[K]
  await persistStore(store)
  return true
}

export async function isUsingMongo(): Promise<boolean> {
  return (await getMongoDb()) !== null
}
