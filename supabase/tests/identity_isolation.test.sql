begin;
create extension if not exists pgtap with schema extensions;
set local search_path=public,extensions;
select plan(8);
insert into auth.users(id,email,email_confirmed_at) values
('a0000000-0000-4000-8000-000000000001','one@example.test',now()),
('a0000000-0000-4000-8000-000000000002','two@example.test',now());
insert into auth.sessions(id,user_id,created_at,updated_at) values
('b0000000-0000-4000-8000-000000000001','a0000000-0000-4000-8000-000000000001',now(),now());
insert into profiles(id,full_name,birth_date) values ('a0000000-0000-4000-8000-000000000002','Outra Pessoa','1990-01-01');
set local role authenticated;
set local request.jwt.claims='{"sub":"a0000000-0000-4000-8000-000000000001","session_id":"b0000000-0000-4000-8000-000000000001","aal":"aal1"}';
select is((select count(*) from profiles),0::bigint,'outro perfil invisível');
select throws_ok($$select complete_identity('Pessoa Teste',current_date,true,true)$$,'23514',null,'menor bloqueado');
select throws_ok($$select complete_identity('Pessoa Teste','1990-01-01',true,false)$$,'42501',null,'aceites separados obrigatórios');
select complete_identity('Pessoa Teste','1990-01-01',true,true);
select is((select count(*) from identity_acceptances where document_version='local-test-v1'),2::bigint,'duas evidências versionadas');
select is((select count(*) from profiles),1::bigint,'somente perfil próprio');
reset role;
update auth.sessions set refreshed_at=now()-interval '24 hours 1 second' where id='b0000000-0000-4000-8000-000000000001';
set local role authenticated;
select is((select count(*) from profiles),0::bigint,'inatividade expirada');
reset role;
update auth.sessions set refreshed_at=now(),created_at=now()-interval '30 days 1 second' where id='b0000000-0000-4000-8000-000000000001';
set local role authenticated;
select is((select count(*) from profiles),0::bigint,'limite absoluto expirado');
reset role;
delete from auth.sessions where id='b0000000-0000-4000-8000-000000000001';
set local role authenticated;
select is((select count(*) from profiles),0::bigint,'sessão revogada sem acesso');
select * from finish();
rollback;
