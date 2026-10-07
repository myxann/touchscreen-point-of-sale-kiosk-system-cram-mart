-- Run this once in the Supabase SQL Editor before using the hosted database.
create extension if not exists pgcrypto;

create table if not exists public.products (
  id bigint primary key, name text not null, description text not null, price numeric not null,
  emoji text not null, active boolean not null default true, sort_order integer not null, created_at timestamptz not null default now()
);
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), transaction_ref text unique not null, total numeric not null,
  payment_method text not null, amount_paid numeric not null, change numeric not null, created_at timestamptz not null default now()
);
create table if not exists public.order_items (
  id bigint generated always as identity primary key, order_id uuid not null references public.orders(id),
  product_id bigint references public.products(id), product_name text not null, quantity integer not null,
  unit_price numeric not null, subtotal numeric not null
);

insert into public.products (id,name,description,price,emoji,active,sort_order) values
(1,'Coffee — Academic Comeback','This semester is still salvageable.',45,'☕',true,1),
(2,'Sandwich — Deadline Fuel','Nutrition for assignments submitted at 11:59 PM.',50,'🥪',true,2),
(3,'Soft Drink — Denial Edition','Hydration, but academically questionable.',35,'🥤',true,3),
(4,'Cookies — Cram Session Pack','For when studying becomes emotional eating.',25,'🍪',true,4),
(5,'Bottled Water — Hydration Before Recitation','Stay hydrated while pretending you reviewed.',20,'💧',true,5),
(6,'Chocolate — Group Project Therapy','When ''seen'' is their only contribution.',25,'🍫',true,6),
(7,'Emergency Yellow Pad','Because someone always says one whole sheet.',20,'📄',true,7),
(8,'1% Battery Survival Cable','Your phone has chosen violence.',79,'🔌',true,8)
on conflict (id) do update set name=excluded.name,description=excluded.description,price=excluded.price,emoji=excluded.emoji,active=excluded.active,sort_order=excluded.sort_order;

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
-- DEMO classroom policies: anonymous kiosk clients can read products and write completed sales only.
create policy "demo anonymous product reads" on public.products for select to anon using (true);
create policy "demo anonymous order inserts" on public.orders for insert to anon with check (true);
create policy "demo anonymous order item inserts" on public.order_items for insert to anon with check (true);
