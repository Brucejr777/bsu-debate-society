-- =============================================================
-- 022: Role-Based Access Control (RBAC) RLS Policies
-- =============================================================
-- Replaces blanket "authenticated user" policies with strict 
-- role-based access control enforcing the Constitution & Rules.
-- Relies on helper functions from 021_user_profiles_and_roles.sql:
-- is_role(target_role), is_chancellor(), get_user_house()
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. MEMBERSHIP APPLICATIONS (House Autonomy)
-- Constitution Art. 5, Sec. 3: House Councils exclusively 
-- recruit and accept their own members.
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated users can view membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Authenticated users can update membership applications" ON membership_applications;
DROP POLICY IF EXISTS "Authenticated users can delete membership applications" ON membership_applications;

-- House Chancellors can ONLY view applications for their specific House.
-- President and SIA can view all for oversight.
CREATE POLICY "House Chancellors and High Council can view relevant applications"
ON membership_applications FOR SELECT TO authenticated
USING (
    is_role('president') OR is_role('sia') OR
    (is_chancellor() AND house_choice = get_user_house())
);

-- House Chancellors can ONLY approve/reject applications for their specific House.
CREATE POLICY "House Chancellors and High Council can update relevant applications"
ON membership_applications FOR UPDATE TO authenticated
USING (
    is_role('president') OR is_role('sia') OR
    (is_chancellor() AND house_choice = get_user_house())
)
WITH CHECK (
    is_role('president') OR is_role('sia') OR
    (is_chancellor() AND house_choice = get_user_house())
);

-- Only President and SIA can hard-delete applications.
CREATE POLICY "President and SIA can delete applications"
ON membership_applications FOR DELETE TO authenticated
USING (is_role('president') OR is_role('sia'));


-- ─────────────────────────────────────────────────────────────
-- 2. WHISTLEBLOWER REPORTS (Strict Confidentiality)
-- Constitution Art. 3, Sec. 14 & Rules Art. VI, Sec. 4(6):
-- Whistleblower identities and reports are highly confidential.
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated users can view whistleblower reports" ON whistleblower_reports;
DROP POLICY IF EXISTS "Authenticated users can update whistleblower reports" ON whistleblower_reports;
DROP POLICY IF EXISTS "Authenticated users can delete whistleblower reports" ON whistleblower_reports;

-- ONLY OIA Director, Chief Adviser, and President can view reports.
CREATE POLICY "OIA, Chief Adviser, and President can view whistleblower reports"
ON whistleblower_reports FOR SELECT TO authenticated
USING (is_role('oia_director') OR is_role('president') OR is_role('chief_adviser'));

CREATE POLICY "OIA, Chief Adviser, and President can update whistleblower reports"
ON whistleblower_reports FOR UPDATE TO authenticated
USING (is_role('oia_director') OR is_role('president') OR is_role('chief_adviser'))
WITH CHECK (is_role('oia_director') OR is_role('president') OR is_role('chief_adviser'));

CREATE POLICY "President can delete whistleblower reports"
ON whistleblower_reports FOR DELETE TO authenticated
USING (is_role('president'));


-- ─────────────────────────────────────────────────────────────
-- 3. HOUSE POINTS & TRANSACTIONS (Point Keeper Authority)
-- Rules Art. I, Sec. 11: Secretary of Internal Affairs (SIA) 
-- is the Point Keeper. Edit access is strictly restricted.
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated users can insert house points" ON house_points;
DROP POLICY IF EXISTS "Authenticated users can update house points" ON house_points;
DROP POLICY IF EXISTS "Authenticated users can delete house points" ON house_points;

DROP POLICY IF EXISTS "Authenticated users can insert point transactions" ON house_point_transactions;
DROP POLICY IF EXISTS "Authenticated users can update point transactions" ON house_point_transactions;
DROP POLICY IF EXISTS "Authenticated users can delete point transactions" ON house_point_transactions;

-- Only SIA and President can modify the Master House Point Ledger.
CREATE POLICY "SIA and President can manage house points"
ON house_points FOR ALL TO authenticated
USING (is_role('sia') OR is_role('president'))
WITH CHECK (is_role('sia') OR is_role('president'));

CREATE POLICY "SIA and President can manage point transactions"
ON house_point_transactions FOR ALL TO authenticated
USING (is_role('sia') OR is_role('president'))
WITH CHECK (is_role('sia') OR is_role('president'));


-- ─────────────────────────────────────────────────────────────
-- 4. INDIVIDUAL POINTS & CLAIMS (Point Keeper Authority)
-- Rules Art. III, Sec. 6 & Annex A, Sec. 5: SIA verifies claims.
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated users can insert individual debate point transactions" ON individual_debate_point_transactions;
DROP POLICY IF EXISTS "Authenticated users can update individual debate point transactions" ON individual_debate_point_transactions;
DROP POLICY IF EXISTS "Authenticated users can delete individual debate point transactions" ON individual_debate_point_transactions;

DROP POLICY IF EXISTS "Authenticated users can view point claims" ON point_claims;
DROP POLICY IF EXISTS "Authenticated users can update point claims" ON point_claims;
DROP POLICY IF EXISTS "Authenticated users can delete point claims" ON point_claims;

CREATE POLICY "SIA and President can manage individual point transactions"
ON individual_debate_point_transactions FOR ALL TO authenticated
USING (is_role('sia') OR is_role('president'))
WITH CHECK (is_role('sia') OR is_role('president'));

-- SIA, President, and High Council can review the claims inbox.
CREATE POLICY "High Council can view point claims"
ON point_claims FOR SELECT TO authenticated
USING (is_role('president') OR is_role('sia') OR is_role('vice_president'));

CREATE POLICY "SIA and President can manage point claims"
ON point_claims FOR ALL TO authenticated
USING (is_role('sia') OR is_role('president'))
WITH CHECK (is_role('sia') OR is_role('president'));


-- ─────────────────────────────────────────────────────────────
-- 5. FINANCIAL RECORDS (OFRA Authority)
-- Constitution Art. 8, Sec. 8 & Rules Art. V: OFRA manages 
-- the General Fund and financial reporting.
-- ─────────────────────────────────────────────────────────────
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

-- Public can view published financial records (Transparency).
CREATE POLICY "Anyone can view published financial records"
ON financial_records FOR SELECT TO anon
USING (published = true);

-- Authenticated users can view all (including drafts).
CREATE POLICY "Authenticated users can view all financial records"
ON financial_records FOR SELECT TO authenticated
USING (true);

-- ONLY OFRA and President can create/update/delete financial records.
CREATE POLICY "OFRA and President can manage financial records"
ON financial_records FOR ALL TO authenticated
USING (is_role('ofra') OR is_role('president'))
WITH CHECK (is_role('ofra') OR is_role('president'));


-- ─────────────────────────────────────────────────────────────
-- 6. DISCIPLINARY COMPLAINTS (OIA & House Jurisdiction)
-- Rules Art. VI: OIA handles major violations. House Councils 
-- handle minor violations for their own members.
-- ─────────────────────────────────────────────────────────────
ALTER TABLE disciplinary_complaints ENABLE ROW LEVEL SECURITY;

-- OIA, President, Chief Adviser can see all. 
-- Chancellors can only see complaints involving their own House.
CREATE POLICY "OIA, President, Chief Adviser, and relevant Chancellors can view complaints"
ON disciplinary_complaints FOR SELECT TO authenticated
USING (
    is_role('oia_director') OR is_role('president') OR is_role('chief_adviser') OR
    (is_chancellor() AND (respondent_house = get_user_house() OR complainant_house = get_user_house()))
);

CREATE POLICY "OIA, President, Chief Adviser, and relevant Chancellors can update complaints"
ON disciplinary_complaints FOR UPDATE TO authenticated
USING (
    is_role('oia_director') OR is_role('president') OR is_role('chief_adviser') OR
    (is_chancellor() AND (respondent_house = get_user_house() OR complainant_house = get_user_house()))
)
WITH CHECK (
    is_role('oia_director') OR is_role('president') OR is_role('chief_adviser') OR
    (is_chancellor() AND (respondent_house = get_user_house() OR complainant_house = get_user_house()))
);


-- ─────────────────────────────────────────────────────────────
-- 7. ELECTORAL PROTESTS & APPEALS (High Tribunal)
-- Rules Art. VII, Sec. 10 & Art. I, Sec. 8: Adjudicated by 
-- the High Tribunal (Chief Adviser, President, Chancellors).
-- ─────────────────────────────────────────────────────────────
ALTER TABLE electoral_protests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can view electoral protests" ON electoral_protests;
DROP POLICY IF EXISTS "Authenticated users can update electoral protests" ON electoral_protests;
DROP POLICY IF EXISTS "Authenticated users can delete electoral protests" ON electoral_protests;

ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can view appeals" ON appeals;
DROP POLICY IF EXISTS "Authenticated users can update appeals" ON appeals;
DROP POLICY IF EXISTS "Authenticated users can delete appeals" ON appeals;

-- Only High Tribunal members and President can manage protests/appeals.
CREATE POLICY "High Tribunal and President can manage electoral protests"
ON electoral_protests FOR ALL TO authenticated
USING (is_role('president') OR is_role('chief_adviser') OR is_chancellor())
WITH CHECK (is_role('president') OR is_role('chief_adviser') OR is_chancellor());

CREATE POLICY "High Council and Chief Adviser can manage appeals"
ON appeals FOR ALL TO authenticated
USING (is_role('president') OR is_role('chief_adviser') OR is_role('vice_president') OR is_chancellor())
WITH CHECK (is_role('president') OR is_role('chief_adviser') OR is_role('vice_president') OR is_chancellor());


-- ─────────────────────────────────────────────────────────────
-- 8. SOSA REPORTS (Presidential Authority)
-- Constitution Art. 8, Sec. 3(i): Mandated for the President.
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated users can insert SOSA reports" ON sosa_reports;
DROP POLICY IF EXISTS "Authenticated users can update SOSA reports" ON sosa_reports;
DROP POLICY IF EXISTS "Authenticated users can delete SOSA reports" ON sosa_reports;

-- Only the President can draft, edit, or delete SOSA reports.
CREATE POLICY "President can manage SOSA reports"
ON sosa_reports FOR ALL TO authenticated
USING (is_role('president'))
WITH CHECK (is_role('president'));


-- ─────────────────────────────────────────────────────────────
-- 9. RECORDS ACCESS REQUESTS (Executive Secretary)
-- Rules Art. VIII, Sec. 4: Processed by Executive Secretary.
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated users can view records access requests" ON records_access_requests;
DROP POLICY IF EXISTS "Authenticated users can update records access requests" ON records_access_requests;
DROP POLICY IF EXISTS "Authenticated users can delete records access requests" ON records_access_requests;

-- Executive Secretary, President, and SIA can process requests.
-- Chancellors can view/process if scope is House-level and matches their house.
CREATE POLICY "OES, President, SIA, and relevant Chancellors can view records requests"
ON records_access_requests FOR SELECT TO authenticated
USING (
    is_role('executive_secretary') OR is_role('president') OR is_role('sia') OR
    (is_chancellor() AND scope = 'House-level' AND requester_house = get_user_house())
);

CREATE POLICY "OES, President, SIA, and relevant Chancellors can update records requests"
ON records_access_requests FOR UPDATE TO authenticated
USING (
    is_role('executive_secretary') OR is_role('president') OR is_role('sia') OR
    (is_chancellor() AND scope = 'House-level' AND requester_house = get_user_house())
)
WITH CHECK (
    is_role('executive_secretary') OR is_role('president') OR is_role('sia') OR
    (is_chancellor() AND scope = 'House-level' AND requester_house = get_user_house())
);

CREATE POLICY "OES and President can delete records requests"
ON records_access_requests FOR DELETE TO authenticated
USING (is_role('executive_secretary') OR is_role('president'));