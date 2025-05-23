import { createClient } from '../lib/supabase/client'
import { Database } from '../database.types'

export type Comment = Database['public']['Tables']['comments']['Row']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']
export type CommentUpdate = Database['public']['Tables']['comments']['Update']

export const commentsApi = {
  async getByTaskId(taskId: number) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  async create(comment: CommentInsert) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: number, comment: CommentUpdate) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('comments')
      .update(comment)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: number) {
    const supabase = createClient()
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
} 