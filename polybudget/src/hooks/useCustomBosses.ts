import { useCallback, useEffect, useState } from 'react'
import { db } from '@/db/database'
import type { CustomBoss } from '@/db/database'

/**
 * Hook de acesso aos chefes personalizados salvos no IndexedDB.
 * Expõe CRUD completo (add, update, remove) e recarrega a lista
 * automaticamente após cada operação.
 */
export function useCustomBosses() {
  const [bosses, setBosses] = useState<CustomBoss[]>([])

  const load = useCallback(async () => {
    const all = await db.customBosses.orderBy('createdAt').toArray()
    setBosses(all)
  }, [])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (boss: Omit<CustomBoss, 'id' | 'createdAt'>) => {
    await db.customBosses.add({ ...boss, createdAt: new Date() })
    await load()
  }, [load])

  const update = useCallback(async (id: number, data: Partial<Omit<CustomBoss, 'id' | 'createdAt'>>) => {
    await db.customBosses.update(id, data)
    await load()
  }, [load])

  const remove = useCallback(async (id: number) => {
    await db.customBosses.delete(id)
    await load()
  }, [load])

  return { bosses, add, update, remove, load }
}
