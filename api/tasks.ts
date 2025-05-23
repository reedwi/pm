import { createClient } from '../lib/supabase/client'
import { Database } from '../database.types'

export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']
export type TaskGroup = Database['public']['Tables']['task_groups']['Row']
export type TaskGroupInsert = Database['public']['Tables']['task_groups']['Insert']
export type TaskGroupUpdate = Database['public']['Tables']['task_groups']['Update']

export const tasksApi = {
  async getAll() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getById(id: number) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(*),
        tags:task_tags(tag:tags(*)),
        users:task_users(*),
        comments:comments(*),
        time_logs:time_logs(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getByProjectId(projectId: number) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        tags:task_tags(tag:tags(*)),
        users:task_users(*),
        comments:comments(count),
        time_logs:time_logs(count)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getByProjectIdWithDetails(projectId: number) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        tags:task_tags(tag:tags(*)),
        users:task_users(*),
        comments:comments(*),
        time_logs:time_logs(*)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getByProjectIdWithFilters(projectId: number, filters: {
    assignedTo?: string;
    tags?: number[];
    search?: string;
  }) {
    const supabase = createClient()
    let query = supabase
      .from('tasks')
      .select(`
        *,
        tags:task_tags(tag:tags(*)),
        users:task_users(*),
        comments:comments(count),
        time_logs:time_logs(count)
      `)
      .eq('project_id', projectId)

    if (filters.assignedTo) {
      query = query.eq('task_users.user_id', filters.assignedTo)
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.in('task_tags.tag_id', filters.tags)
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async create(task: TaskInsert) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: number, task: TaskUpdate) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('tasks')
      .update(task)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: number) {
    const supabase = createClient()
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async assignUser(taskId: number, userId: string, type?: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('task_users')
      .insert({
        task_id: taskId,
        user_id: userId,
        type
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async removeUser(taskId: number, userId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('task_users')
      .delete()
      .eq('task_id', taskId)
      .eq('user_id', userId)
    
    if (error) throw error
  },

  async addTag(taskId: number, tagId: number) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('task_tags')
      .insert({
        task_id: taskId,
        tag_id: tagId
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async removeTag(taskId: number, tagId: number) {
    const supabase = createClient()
    const { error } = await supabase
      .from('task_tags')
      .delete()
      .eq('task_id', taskId)
      .eq('tag_id', tagId)
    
    if (error) throw error
  },

  // Task Group API
  async getTaskGroups(projectId: number) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('task_groups')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  async createTaskGroup(group: TaskGroupInsert) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('task_groups')
      .insert(group)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateTaskGroup(id: number, group: TaskGroupUpdate) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('task_groups')
      .update(group)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteTaskGroup(id: number) {
    const supabase = createClient()
    const { error } = await supabase
      .from('task_groups')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
} 