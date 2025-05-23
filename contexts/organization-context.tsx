"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Organization {
  id: number
  name: string
}

interface OrganizationContextType {
  currentOrganization: Organization | null
  loading: boolean
}

const OrganizationContext = createContext<OrganizationContextType>({
  currentOrganization: null,
  loading: true,
})

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCurrentOrganization() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        console.log('Current user:', user)
        
        if (!user) {
          console.log('No user found')
          setLoading(false)
          return
        }

        // First, get all memberships
        const { data: members, error: membersError } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', user.id)
        
        console.log('All memberships:', { members, membersError })

        if (members && members.length > 0) {
          // Get the first organization (we can enhance this later to handle multiple orgs)
          const { data: org, error: orgError } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', members[0].organization_id)
            .single()
          
          console.log('Organization query result:', { org, orgError })
          setCurrentOrganization(org)
        } else {
          console.log('No organization memberships found for user')
        }
      } catch (error) {
        console.error('Error fetching organization:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentOrganization()
  }, [])

  return (
    <OrganizationContext.Provider value={{ currentOrganization, loading }}>
      {children}
    </OrganizationContext.Provider>
  )
}

export const useOrganization = () => useContext(OrganizationContext) 