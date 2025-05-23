-- Add foreign key relationship between project_users and users
ALTER TABLE project_users
ADD CONSTRAINT project_users_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Add unique constraint to prevent duplicate user assignments
ALTER TABLE project_users
ADD CONSTRAINT project_users_project_user_unique
UNIQUE (project_id, user_id); 