-- Create a view to expose auth users in the public schema
CREATE OR REPLACE VIEW public.users AS
SELECT 
    id,
    email,
    raw_user_meta_data
FROM auth.users
WHERE 
    id = auth.uid() OR
    id IN (
        SELECT user_id 
        FROM organization_members 
        WHERE organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- Grant access to the view
GRANT SELECT ON public.users TO authenticated;

-- Add RLS policy to the view
ALTER VIEW public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data and organization members"
    ON public.users
    FOR SELECT
    USING (
        id = auth.uid() OR
        id IN (
            SELECT user_id 
            FROM organization_members 
            WHERE organization_id IN (
                SELECT organization_id 
                FROM organization_members 
                WHERE user_id = auth.uid()
            )
        )
    ); 