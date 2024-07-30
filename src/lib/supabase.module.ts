import { Module, Global } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: () => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;
        return new SupabaseClient(supabaseUrl, supabaseKey);
      },
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}
