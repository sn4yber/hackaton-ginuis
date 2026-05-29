ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

INSERT INTO categories (name, icon) VALUES
  ('empleo', 'briefcase'),
  ('educacion', 'graduation-cap'),
  ('cultura', 'palette'),
  ('tecnologia', 'laptop'),
  ('liderazgo', 'users'),
  ('emprendimiento', 'rocket'),
  ('participacion', 'megaphone')
ON CONFLICT (name) DO NOTHING;
