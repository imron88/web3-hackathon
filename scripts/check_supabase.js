const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const url = process.env.VITE_SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(2);
}

const supabase = createClient(url, anon);

(async () => {
  try {
    console.log('Testing SELECT from products...');
    const { data, error } = await supabase.from('products').select('*').limit(5);
    if (error) {
      console.error('Error from Supabase:', error);
      process.exit(3);
    }
    console.log('Rows:', data.length);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(4);
  }
})();
