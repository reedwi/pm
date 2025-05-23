-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view projects in their organizations" ON projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create a more permissive policy for viewing projects
CREATE POLICY "Users can view all projects"
    ON projects
    FOR SELECT
    USING (true);

-- Create a policy for managing projects
CREATE POLICY "Users can manage projects in their organizations"
    ON projects
    FOR ALL
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    ); 