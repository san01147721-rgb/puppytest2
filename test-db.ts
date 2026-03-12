import { supabase } from './lib/supabase';

async function testConnection() {
  console.log("Checking schedules table...");
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Error fetching schedules:", error);
    if (error.code === '42P01') {
      console.error("The table 'schedules' does not exist. Did you run the migration?");
    }
  } else {
    console.log("Successfully connected to 'schedules' table. Data count:", data.length);
  }

  console.log("Checking device_commands table (known good table)...");
  const { data: cmdData, error: cmdError } = await supabase
    .from('device_commands')
    .select('*')
    .limit(1);

  if (cmdError) {
    console.error("Error fetching device_commands:", cmdError);
  } else {
    console.log("Successfully connected to 'device_commands' table.");
  }

  console.log("Testing insert into device_commands with metadata...");
  const { error: insertError } = await supabase
    .from('device_commands')
    .insert([{
      action_type: 'fill_water',
      status: 'pending',
      metadata: { triggered_by: 'test' }
    }]);

  if (insertError) {
    console.error("Insert failed:", insertError);
  } else {
    console.log("Insert success!");
  }
}

testConnection();
