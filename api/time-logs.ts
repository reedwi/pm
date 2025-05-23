import { createClient } from '../lib/supabase/client'
import { Database } from '../database.types'

export type TimeLog = Database['public']['Tables']['time_logs']['Row']
export type TimeLogInsert = Database['public']['Tables']['time_logs']['Insert']
export type TimeLogUpdate = Database['public']['Tables']['time_logs']['Update']

export const timeLogsApi = {
  async getByTaskId(taskId: number) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('time_logs')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getByUserId(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('time_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async create(timeLog: TimeLogInsert) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('time_logs')
      .insert(timeLog)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: number, timeLog: TimeLogUpdate) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('time_logs')
      .update(timeLog)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: number) {
    const supabase = createClient()
    const { error } = await supabase
      .from('time_logs')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
} 