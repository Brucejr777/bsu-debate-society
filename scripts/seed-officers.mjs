// scripts/seed-officers.mjs
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables in .env.local');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client with Service Role Key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Default password for all seeded accounts
const DEFAULT_PASSWORD = 'SocietyAdmin2024!';

// Constitutional Officer Roster
const officers = [
  // High Council
  { email: 'president@bsu.edu.ph', full_name: 'Juan Dela Cruz', role: 'president', house_affiliation: 'Society-wide' },
  { email: 'vp@bsu.edu.ph', full_name: 'Maria Clara', role: 'vice_president', house_affiliation: 'Society-wide' },
  { email: 'execsec@bsu.edu.ph', full_name: 'Crisostomo Ibarra', role: 'executive_secretary', house_affiliation: 'Society-wide' },
  { email: 'sia@bsu.edu.ph', full_name: 'Elias', role: 'sia', house_affiliation: 'Society-wide' },
  { email: 'oia@bsu.edu.ph', full_name: 'Sisa', role: 'oia_director', house_affiliation: 'Society-wide' },
  { email: 'ofra@bsu.edu.ph', full_name: 'Basilio', role: 'ofra', house_affiliation: 'Society-wide' },
  { email: 'ext@bsu.edu.ph', full_name: 'Placido Penitente', role: 'external_affairs', house_affiliation: 'Society-wide' },
  { email: 'bus@bsu.edu.ph', full_name: 'Pilosopo Tasyo', role: 'business_affairs', house_affiliation: 'Society-wide' },
  { email: 'pub@bsu.edu.ph', full_name: 'Kabesang Tales', role: 'public_affairs', house_affiliation: 'Society-wide' },
  
  // Chief Adviser
  { email: 'adviser@bsu.edu.ph', full_name: 'Padre Florentino', role: 'chief_adviser', house_affiliation: 'Society-wide' },
  
  // House Chancellors
  { email: 'chancellor.bathala@bsu.edu.ph', full_name: 'Tandang Sora', role: 'chancellor_bathala', house_affiliation: 'Bathala' },
  { email: 'chancellor.kabunian@bsu.edu.ph', full_name: 'Melchora Aquino', role: 'chancellor_kabunian', house_affiliation: 'Kabunian' },
  { email: 'chancellor.laon@bsu.edu.ph', full_name: 'Apolinario Mabini', role: 'chancellor_laon', house_affiliation: 'Laon' },
  { email: 'chancellor.manama@bsu.edu.ph', full_name: 'Gabriela Silang', role: 'chancellor_manama', house_affiliation: 'Manama' },
];

async function seedOfficers() {
  console.log('🌱 Starting officer seeding process...\n');

  // Fetch all existing users ONCE to avoid multiple API calls and version compatibility issues
  console.log('🔍 Fetching existing Supabase Auth users...');
  const { data: { users: allAuthUsers }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error(`❌ Failed to fetch existing users: ${listError.message}`);
    process.exit(1);
  }
  
  console.log(`✅ Found ${allAuthUsers.length} existing users in Auth.\n`);

  for (const officer of officers) {
    console.log(`👤 Processing: ${officer.full_name} (${officer.email})`);
    
    let userId;

    // 1. Check if user already exists in the fetched list
    const existingUser = allAuthUsers.find(u => u.email.toLowerCase() === officer.email.toLowerCase());
    
    if (existingUser) {
      userId = existingUser.id;
      console.log(`   ✅ User already exists in Auth (ID: ${userId})`);
    } else {
      // 2. Create user in Supabase Auth
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: officer.email,
        password: DEFAULT_PASSWORD,
        email_confirm: true, // Auto-confirm emails for seeding
        user_metadata: { full_name: officer.full_name },
      });

      if (createError) {
        console.error(`   ❌ Error creating Auth user: ${createError.message}`);
        continue;
      }

      userId = newUser.user.id;
      console.log(`   ✅ Created Auth user (ID: ${userId})`);
    }

    // 3. Upsert into the public.officers table
    const { error: upsertError } = await supabase
      .from('officers')
      .upsert(
        {
          id: userId,
          email: officer.email,
          full_name: officer.full_name,
          role: officer.role,
          house_affiliation: officer.house_affiliation,
        },
        { onConflict: 'id' }
      );

    if (upsertError) {
      console.error(`   ❌ Error upserting officer profile: ${upsertError.message}`);
    } else {
      console.log(`   ✅ Successfully mapped to role: ${officer.role} | House: ${officer.house_affiliation}`);
    }
    
    console.log('');
  }

  console.log('🎉 Seeding complete!');
  console.log(`\n🔑 Default password for all accounts: ${DEFAULT_PASSWORD}`);
  console.log('⚠️  Please instruct officers to change their passwords upon first login.');
}

seedOfficers().catch((err) => {
  console.error('💥 Fatal error during seeding:', err);
  process.exit(1);
});