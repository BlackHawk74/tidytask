-- Enable pgcrypto extension if not already enabled (needed for gen_random_uuid or other random functions)
-- CREATE EXTENSION IF NOT EXISTS pgcrypto; 
-- Supabase usually has this, but uncomment if 'gen_random_bytes' is not found by the improved function below.

-- Add the family_code column to the families table
ALTER TABLE public.families
ADD COLUMN IF NOT EXISTS family_code VARCHAR(10) UNIQUE;

-- Optional: Create an index for faster lookups on family_code
CREATE INDEX IF NOT EXISTS idx_families_family_code ON public.families (family_code);

-- More robust helper function to generate a short, random, alphanumeric code (uppercase only for readability)
-- This version uses gen_random_bytes for better randomness if pgcrypto is available.
CREATE OR REPLACE FUNCTION generate_unique_family_code(length INT DEFAULT 6)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,U,V,W,X,Y,Z}'; -- Removed I,O to avoid confusion
  result TEXT := '';
  i INT;
  max_attempts INT := 10; -- Max attempts to find a unique code
  attempt INT := 0;
  code_exists BOOLEAN;
  char_index INT;
  random_bytes BYTEA;
  byte_val INT;
BEGIN
  IF length <= 0 OR length > 10 THEN
    RAISE EXCEPTION 'Code length must be between 1 and 10.';
  END IF;

  LOOP
    result := '';
    -- Generate random string
    random_bytes := gen_random_bytes(length); -- Requires pgcrypto
    FOR i IN 0..length-1 LOOP
      byte_val := get_byte(random_bytes, i);
      char_index := (byte_val % array_length(chars, 1)) + 1;
      result := result || chars[char_index];
    END LOOP;

    -- Check for uniqueness
    EXECUTE 'SELECT EXISTS (SELECT 1 FROM public.families WHERE family_code = $1)'
    INTO code_exists
    USING result;

    IF NOT code_exists THEN
      RETURN result; -- Found a unique code
    END IF;

    attempt := attempt + 1;
    IF attempt >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate a unique family code after % attempts. Try increasing code length or max_attempts.', max_attempts;
    END IF;
  END LOOP;
END;
$$;

-- IMPORTANT: 
-- The generate_unique_family_code function now includes a loop to attempt to generate a unique code.
-- However, the BEST place to ensure uniqueness and call this function is within a server-side transaction 
-- (e.g., a Supabase Edge Function) when a new family is created. 
-- The function itself tries, but a race condition is still theoretically possible if many families are created simultaneously.
-- For now, this function is a good helper.

-- Example of how to use it from server-side code (e.g., an Edge Function):
-- SELECT generate_unique_family_code(); -- generates a 6-char code
-- SELECT generate_unique_family_code(8); -- generates an 8-char code

-- After creating the function, you might want to test it:
-- SELECT generate_unique_family_code(6); 