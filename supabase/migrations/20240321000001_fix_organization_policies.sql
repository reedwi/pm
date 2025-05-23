-- Drop existing policies
DROP POLICY IF EXISTS "Users can view organization members" ON organization_members;
DROP POLICY IF EXISTS "Only organization owners can manage members" ON organization_members;
DROP POLICY IF EXISTS "Users can view their organizations" ON organizations;

-- Create new policies
CREATE POLICY "Enable read access for authenticated users"
    ON organization_members FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable read access for authenticated users"
    ON organizations FOR SELECT
    TO authenticated
    USING (true); 