create function public.identity_session_valid() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists (
   select 1 from auth.sessions s join auth.users u on u.id=s.user_id
   where s.id=(auth.jwt()->>'session_id')::uuid and s.user_id=auth.uid()
     and u.email_confirmed_at is not null and not coalesce(u.is_anonymous,false)
     and s.created_at > now()-interval '30 days'
     and coalesce(s.refreshed_at,s.created_at) > now()-interval '24 hours'
     and (s.not_after is null or s.not_after>now())
     and (not exists(select 1 from auth.mfa_factors f where f.user_id=u.id and f.status='verified')
          or (auth.jwt()->>'aal'='aal2' and s.aal='aal2'))
 );
$$;

create function public.complete_identity(p_name text,p_birth date,p_terms boolean,p_privacy boolean)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.identity_session_valid() or p_terms is not true or p_privacy is not true then
   raise exception 'Cadastro indisponível' using errcode='42501';
 end if;
 insert into public.profiles(id,full_name,birth_date) values(auth.uid(),trim(p_name),p_birth);
 insert into public.identity_acceptances(user_id,document_kind,document_version)
 values(auth.uid(),'terms','local-test-v1'),(auth.uid(),'privacy','local-test-v1');
end;
$$;
revoke all on function public.identity_session_valid(), public.complete_identity(text,date,boolean,boolean) from public,anon;
grant execute on function public.identity_session_valid(), public.complete_identity(text,date,boolean,boolean) to authenticated;
grant select on public.profiles, public.identity_acceptances to authenticated;
create policy own_profile on public.profiles for select to authenticated
 using (id=(select auth.uid()) and (select public.identity_session_valid()));
create policy own_acceptances on public.identity_acceptances for select to authenticated
 using (user_id=(select auth.uid()) and (select public.identity_session_valid()));
