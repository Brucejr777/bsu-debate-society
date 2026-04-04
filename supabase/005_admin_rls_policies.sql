-- =============================================================
-- 005: Restrict admin table access to authenticated users only
-- =============================================================
-- This migration drops the public (anon) SELECT policies on
-- membership_applications, contact_messages, and house_points,
-- and replaces them with authenticated-only policies so that
-- only logged-in officers can view and manage submissions.
-- =============================================================

-- ── membership_applications ──
DROP POLICY IF EXISTS "Anyone can submit a membership application" ON membership_applications;
DROP POLICY IF EXISTS "Authenticated users can view membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Authenticated users can update membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Authenticated users can delete membership applications" ON membership_applications;

-- Re-create: public can INSERT (apply), authenticated can SELECT/UPDATE/DELETE
CREATE POLICY "Public can submit membership applications"
  ON membership_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view membership applications"
  ON membership_applications
  FOR SELECT
  TO authenticated
  USING (true);

                CREATE POLICY "Authenticated users can update membership applications"
                  ON membership_applications
                    FOR UPDATE
                      TO authenticated
                        USING (true)
                          WITH CHECK (true);

                          CREATE POLICY "Authenticated users can delete membership applications"
                            ON membership_applications
                              FOR DELETE
                                TO authenticated
                                  USING (true);

                                  -- ── contact_messages ──
                                  DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;
                                  DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON contact_messages;
                                  DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;
                                  DROP POLICY IF EXISTS "Authenticated users can delete contact messages" ON contact_messages;

                                  -- Re-create: public can INSERT (submit), authenticated can SELECT/UPDATE/DELETE
                                  CREATE POLICY "Public can submit contact messages"
                                    ON contact_messages
                                      FOR INSERT
                                        TO anon
                                          WITH CHECK (true);

                                          CREATE POLICY "Authenticated users can view contact messages"
                                            ON contact_messages
                                              FOR SELECT
                                                TO authenticated
                                                  USING (true);

                                                  CREATE POLICY "Authenticated users can update contact messages"
                                                    ON contact_messages
                                                      FOR UPDATE
                                                        TO authenticated
                                                          USING (true)
                                                            WITH CHECK (true);

                                                            CREATE POLICY "Authenticated users can delete contact messages"
                                                              ON contact_messages
                                                                FOR DELETE
                                                                  TO authenticated
                                                                    USING (true);

                                                                    -- ── house_points ──
                                                                    DROP POLICY IF EXISTS "Anyone can view house point standings" ON house_points;
                                                                    DROP POLICY IF EXISTS "Authenticated users can insert house points" ON house_points;
                                                                    DROP POLICY IF EXISTS "Authenticated users can update house points" ON house_points;
                                                                    DROP POLICY IF EXISTS "Authenticated users can delete house points" ON house_points;

                                                                    -- Public can SELECT (transparency), authenticated can INSERT/UPDATE/DELETE
                                                                    CREATE POLICY "Anyone can view house point standings"
                                                                      ON house_points
                                                                        FOR SELECT
                                                                          TO anon
                                                                            USING (true);

                                                                            CREATE POLICY "Authenticated users can insert house points"
                                                                              ON house_points
                                                                                FOR INSERT
                                                                                  TO authenticated
                                                                                    WITH CHECK (true);

                                                                                    CREATE POLICY "Authenticated users can update house points"
                                                                                      ON house_points
                                                                                        FOR UPDATE
                                                                                          TO authenticated
                                                                                            USING (true)
                                                                                              WITH CHECK (true);

                                                                                              CREATE POLICY "Authenticated users can delete house points"
                                                                                                ON house_points
                                                                                                  FOR DELETE
                                                                                                    TO authenticated
                                                                                                      USING (true);

                                                                                                      -- ── debate_league_members ──
                                                                                                      DROP POLICY IF EXISTS "Anyone can view debate league members" ON debate_league_members;
                                                                                                      DROP POLICY IF EXISTS "Authenticated users can insert debate league members" ON debate_league_members;
                                                                                                      DROP POLICY IF EXISTS "Authenticated users can update debate league members" ON debate_league_members;
                                                                                                      DROP POLICY IF EXISTS "Authenticated users can delete debate league members" ON debate_league_members;

                                                                                                      -- Public can SELECT (transparency), authenticated can INSERT/UPDATE/DELETE
                                                                                                      CREATE POLICY "Anyone can view debate league members"
                                                                                                        ON debate_league_members
                                                                                                          FOR SELECT
                                                                                                            TO anon
                                                                                                              USING (true);

                                                                                                              CREATE POLICY "Authenticated users can insert debate league members"
                                                                                                                ON debate_league_members
                                                                                                                  FOR INSERT
                                                                                                                    TO authenticated
                                                                                                                      WITH CHECK (true);

                                                                                                                      CREATE POLICY "Authenticated users can update debate league members"
                                                                                                                        ON debate_league_members
                                                                                                                          FOR UPDATE
                                                                                                                            TO authenticated
                                                                                                                              USING (true)
                                                                                                                                WITH CHECK (true);

                                                                                                                                CREATE POLICY "Authenticated users can delete debate league members"
                                                                                                                                  ON debate_league_members
                                                                                                                                    FOR DELETE
                                                                                                                                      TO authenticated
                                                                                                                                        USING (true);

                                                                                                                                        -- ── individual_awards ──
                                                                                                                                        DROP POLICY IF EXISTS "Anyone can view individual awards" ON individual_awards;
                                                                                                                                        DROP POLICY IF EXISTS "Authenticated users can insert individual awards" ON individual_awards;
                                                                                                                                        DROP POLICY IF EXISTS "Authenticated users can update individual awards" ON individual_awards;
                                                                                                                                        DROP POLICY IF EXISTS "Authenticated users can delete individual awards" ON individual_awards;

                                                                                                                                        -- Public can SELECT (transparency), authenticated can INSERT/UPDATE/DELETE
                                                                                                                                        CREATE POLICY "Anyone can view individual awards"
                                                                                                                                          ON individual_awards
                                                                                                                                            FOR SELECT
                                                                                                                                              TO anon
                                                                                                                                                USING (true);

                                                                                                                                                CREATE POLICY "Authenticated users can insert individual awards"
                                                                                                                                                  ON individual_awards
                                                                                                                                                    FOR INSERT
                                                                                                                                                      TO authenticated
                                                                                                                                                        WITH CHECK (true);

                                                                                                                                                        CREATE POLICY "Authenticated users can update individual awards"
                                                                                                                                                          ON individual_awards
                                                                                                                                                            FOR UPDATE
                                                                                                                                                              TO authenticated
                                                                                                                                                                USING (true)
                                                                                                                                                                  WITH CHECK (true);

                                                                                                                                                                  CREATE POLICY "Authenticated users can delete individual awards"
                                                                                                                                                                    ON individual_awards
                                                                                                                                                                      FOR DELETE
                                                                                                                                                                        TO authenticated
                                                                                                                                                                          USING (true);
                                                                                                                                                                          