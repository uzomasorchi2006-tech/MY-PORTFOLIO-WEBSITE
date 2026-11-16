create table if not exists public.projects (
  id bigint primary key,
  title text not null,
  category text not null,
  description text not null,
  image_url text not null,
  constraint projects_title_not_empty check (length(trim(title)) > 0),
  constraint projects_category_not_empty check (length(trim(category)) > 0),
  constraint projects_description_not_empty check (length(trim(description)) > 0)
);

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

alter table public.projects enable row level security;

do $$
begin
  alter publication supabase_realtime add table public.projects;
exception
  when duplicate_object then null;
end
$$;

drop policy if exists "Anyone can read projects" on public.projects;
create policy "Anyone can read projects"
  on public.projects for select
  using (true);

drop policy if exists "Admin can insert projects" on public.projects;
create policy "Admin can insert projects"
  on public.projects for insert
  to authenticated
  with check (auth.uid() = 'ef47d30c-dedc-4672-a2aa-e4fa95eac6bd'::uuid);

drop policy if exists "Admin can update projects" on public.projects;
create policy "Admin can update projects"
  on public.projects for update
  to authenticated
  using (auth.uid() = 'ef47d30c-dedc-4672-a2aa-e4fa95eac6bd'::uuid)
  with check (auth.uid() = 'ef47d30c-dedc-4672-a2aa-e4fa95eac6bd'::uuid);

drop policy if exists "Admin can delete projects" on public.projects;
create policy "Admin can delete projects"
  on public.projects for delete
  to authenticated
  using (auth.uid() = 'ef47d30c-dedc-4672-a2aa-e4fa95eac6bd'::uuid);

insert into public.projects (id, title, category, description, image_url)
values
  (
    1,
    'Worship With Us Banner',
    'Church Flyer Design',
    'A warm, faith-centered event flyer created for a revival campaign with strong typography and meaningful color balance.',
    'ASSETS/SUMAS-BANNER.png'
  ),
  (
    2,
    'Ruth Charles Birthday Tribute',
    'Birthday Flyer',
    'A joyful birthday tribute flyer combining layered portraits, oversized typography, and a warm gold-and-green palette for Ruth Charles.',
    'ASSETS/20260702_005127-01.jpeg'
  ),
  (
    3,
    'Launch Event Branding',
    'Event Branding',
    'A polished event identity designed to unify print materials, signage, and promotional content for a brand launch.',
    'ASSETS/launch-event-branding.jpg'
  )
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-project-images',
  'portfolio-project-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do nothing;

drop policy if exists "Anyone can view portfolio images" on storage.objects;
create policy "Anyone can view portfolio images"
  on storage.objects for select
  using (bucket_id = 'portfolio-project-images');

drop policy if exists "Admin can upload portfolio images" on storage.objects;
create policy "Admin can upload portfolio images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-project-images'
    and auth.uid() = 'ef47d30c-dedc-4672-a2aa-e4fa95eac6bd'::uuid
  );

drop policy if exists "Admin can update portfolio images" on storage.objects;
create policy "Admin can update portfolio images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'portfolio-project-images'
    and auth.uid() = 'ef47d30c-dedc-4672-a2aa-e4fa95eac6bd'::uuid
  )
  with check (
    bucket_id = 'portfolio-project-images'
    and auth.uid() = 'ef47d30c-dedc-4672-a2aa-e4fa95eac6bd'::uuid
  );

drop policy if exists "Admin can delete portfolio images" on storage.objects;
create policy "Admin can delete portfolio images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'portfolio-project-images'
    and auth.uid() = 'ef47d30c-dedc-4672-a2aa-e4fa95eac6bd'::uuid
  );
