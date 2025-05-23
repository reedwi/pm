-- Enable RLS on project_users table
ALTER TABLE project_users ENABLE ROW LEVEL SECURITY;

-- Allow users to view project members for projects they have access to
CREATE POLICY "Users can view project members"
    ON project_users FOR SELECT
    USING (
        project_id IN (
            SELECT id 
            FROM projects 
            WHERE organization_id IN (
                SELECT organization_id 
                FROM organization_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Allow users to manage project members if they are organization members
CREATE POLICY "Organization members can manage project members"
    ON project_users FOR ALL
    USING (
        project_id IN (
            SELECT id 
            FROM projects 
            WHERE organization_id IN (
                SELECT organization_id 
                FROM organization_members 
                WHERE user_id = auth.uid()
            )
        )
    ); 