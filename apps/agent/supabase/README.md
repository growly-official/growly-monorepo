# Supabase setup

Original Reference: https://github.com/elizaos-plugins/adapter-supabase/pull/1

If you don't provide Supabase env, by default the code will launch a SQLite in your local machine

1. Create Supabase project
2. Set up .env file

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Import and execute `scheme.sql` to Supabase using SQL Editor.
4. Import and execute `create_functions.sql` to Supabase using SQL Editor.
5. Import and execute `seed.sql` to Supabase using SQL Editor.
6. Start Eliza.
7. Verify that rooms and memories are correctly created and selected in the Supabase dashboard.

Different from `PostgreSQL` adapter, Supabase adapter use `supabase.rpc()` in some method -> Those JS functions should be created first from Supabase SQL Editor
