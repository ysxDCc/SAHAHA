# Nastavenie rezervácií SAHA BAR

1. V Supabase SQL Editore spustite `supabase/schema.sql`.
2. V Supabase Authentication vytvorte používateľa, ktorého e-mail sa zhoduje s `ADMIN_EMAIL`.
3. Hodnoty z `.env.example` nastavte v `.env.local` a vo Verceli.
4. Web prijíma rezervácie cez formulár na domovskej stránke. Správa rezervácií je na `/admin`.

`SUPABASE_SERVICE_ROLE_KEY` a `RESEND_API_KEY` sú tajné serverové kľúče. Nikdy ich nevystavujte cez premennú s prefixom `NEXT_PUBLIC_` ani ich neukladajte do Gitu.
