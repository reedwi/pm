import { createClient } from '../lib/supabase/client'
import { Database } from '../database.types'

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export const projectsApi = {
  async getAll() {
    const supabase = createClient()
    console.log('Fetching all projects')
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching all projects:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('Successfully fetched projects:', {
        count: data.length,
        projects: data.map(p => ({
          id: p.id,
          name: p.name,
          created_at: p.created_at,
          updated_at: p.updated_at
        }))
      })
      return data
    } catch (error) {
      console.error('Unexpected error in getAll:', error)
      throw error
    }
  },

  async getById(id: number) {
    const supabase = createClient()
    console.log('Fetching project with ID:', id)
    
    try {
      // First, let's verify the project exists with a simple query
      const { data: simpleData, error: simpleError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', id)
        .single()

      if (simpleError) {
        console.error('Error in simple project check:', {
          code: simpleError.code,
          message: simpleError.message,
          details: simpleError.details,
          hint: simpleError.hint
        })
      } else {
        console.log('Simple project check successful:', simpleData)
      }

      // Now try the full query
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *
        `)
        .eq('id', id)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`Project with ID ${id} not found in full query`)
          return null
        }
        console.error('Error fetching project:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        throw error
      }

      console.log('Successfully fetched project:', {
        id: data.id,
        name: data.name,
        teamSize: data.team?.length || 0
      })
      return data
    } catch (error) {
      console.error('Unexpected error in getById:', error)
      throw error
    }
  },

  async create(project: ProjectInsert) {
    const supabase = createClient()
    try {
      console.log('Attempting to create project:', project)
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single()
      
      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(error.message || 'Failed to create project')
      }
      
      if (!data) {
        throw new Error('No data returned from project creation')
      }
      
      return data
    } catch (error) {
      console.error('Project creation error:', error)
      if (error instanceof Error) {
        throw new Error(`Failed to create project: ${error.message}`)
      }
      throw error
    }
  },

  async update(id: number, project: ProjectUpdate) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: number) {
    const supabase = createClient()
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
} 